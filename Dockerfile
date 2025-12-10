# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Update Alpine packages and install security patches
RUN apk update && apk upgrade --no-cache && apk add --no-cache libc6-compat && rm -rf /var/cache/apk/*

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Update Alpine packages and install security patches
RUN apk update && apk upgrade --no-cache && apk add --no-cache libc6-compat && rm -rf /var/cache/apk/*

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy environment template (for reference)
COPY env/.template.env ./env/.template.env

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Change ownership of app directory
RUN chown -R nestjs:nodejs /app

# Switch to non-root user
USER nestjs

# Expose port (default 3000, can be overridden via env)
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "dist/main"]

