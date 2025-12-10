# NestJS Boilerplate

A production-ready NestJS boilerplate with JWT authentication, error handling, Swagger documentation, health checks, and best practices.

## 🚀 Features

- **JWT Authentication**: Passport-based JWT authentication
- **Exception Handling**: Global exception filter with standardized error responses
- **Swagger Integration**: Auto-generated API documentation
- **Health Checks**: Built-in health monitoring
- **Configuration**: Environment-based config with validation
- **TypeScript**: Strict type checking enabled
- **Code Quality**: ESLint, Prettier, and Husky hooks configured
- **Testing Setup**: Unit and E2E test configurations
- **Structured Logging**: Pino logger with pretty printing in dev

## 📋 Prerequisites

- Node.js (v18+)
- npm or yarn
- Git

## 🛠️ Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

```bash
cp env/.template.env env/.dev.env
# Edit env/.dev.env with your configuration
```

### 3. Update JWT Secret (IMPORTANT)

```env
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long-change-in-production
```

### 4. Run the Application

```bash
npm run start:dev
```

The application will start at `http://localhost:3000`

### 5. Verify It's Working

1. **Health Check**: `http://localhost:3000/health`
2. **Swagger Docs**: `http://localhost:3000/v1/api-docs`

## 📚 Project Structure

```
src/
├── auth/              # JWT authentication module
│   ├── decorators/    # @Public(), @CurrentUser()
│   ├── guards/        # JWT auth guard
│   └── strategies/    # Passport JWT strategy
├── core/              # Core models, decorators
│   ├── decorators/    # Swagger decorators
│   └── models/        # Response models
├── exception-handler/ # Global exception handling
│   └── exceptions/    # Custom exceptions
├── modules/           # Feature modules
│   ├── example/       # Example module (remove in production)
│   └── health/        # Health check module
├── server-config/     # Configuration module
│   └── models/        # Config models and validation
├── app.module.ts      # Root module
└── main.ts            # Application entry point
```

## 🔐 Authentication

### Route Protection

Routes are **protected by default**. Use decorators to control access:

> **Note:** Routes are protected by default via the global JWT guard. `@Protected()` is optional and mainly for clarity. Use `@Public()` to make routes accessible without authentication.

**Making a Route Public:**

```typescript
import { Public } from '../auth/decorators/public.decorator';

@Get('public')
@Public()
getPublicData() {
  return { message: 'This is public' };
}
```

**Explicitly Marking a Route as Protected (Optional):**

```typescript
import { Protected } from '../auth/decorators/protected.decorator';

@Get('protected')
@Protected()  // Optional: routes are protected by default
getProtectedData() {
  return { message: 'This requires authentication' };
}
```

### Accessing Current User

Use the `@CurrentUser()` decorator:

```typescript
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Get('profile')
getProfile(@CurrentUser() user: JwtPayload) {
  return { user };
}

// Or get specific field
@Get('user-id')
getUserId(@CurrentUser('sub') userId: string) {
  return { userId };
}
```

### Generating JWT Tokens

```typescript
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/strategies/jwt.strategy';

constructor(private jwtService: JwtService) {}

generateToken(userId: string, email: string) {
  const payload: JwtPayload = {
    sub: userId,
    email: email,
  };
  return this.jwtService.sign(payload);
}
```

## 📝 Swagger Documentation

Swagger documentation is automatically generated and available at:

- **Development**: `http://localhost:3000/v1/api-docs`

The documentation is only available in non-production environments for security.

### Using Swagger Decorators

```typescript
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ApiSuccessResponse } from '../core/decorators/api-swagger-success-response.decorator';
import { ApiErrorResponse } from '../core/decorators/api-swagger-error-response-example.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  @Get()
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get all users' })
  @ApiSuccessResponse(UserDto)
  @ApiErrorResponse(getErrorDefinition(globalErrorCodes.UNAUTHORIZED), UserDto)
  findAll() {
    // ...
  }
}
```

## ⚠️ Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "status": 400,
  "error_code": "BAD_REQUEST",
  "message": "Error message",
  "data": {},
  "debug": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "path": "/api/users",
    "method": "GET"
  }
}
```

### Throwing Custom Exceptions

#### HTTP Exceptions

```typescript
import { BaseHttpException } from '../exception-handler/exceptions/base-http.exception';

throw new BaseHttpException(400, 'CUSTOM_ERROR_CODE', { field: 'value' }, 'Custom error message', {
  debugInfo: 'value',
});
```

#### Service Exceptions

```typescript
import { ServiceException } from '../exception-handler/exceptions/service.exception';

throw new ServiceException('CUSTOM_ERROR_CODE', { field: 'value' });
```

### Adding Custom Error Codes

1. Add error code to `global-error-definitions.ts`:

```typescript
export const globalErrorCodes = {
  // ... existing codes
  CUSTOM_ERROR: 'CUSTOM_ERROR',
};

const globalErrorDefinitions = {
  // ... existing definitions
  CUSTOM_ERROR: {
    error_code: globalErrorCodes.CUSTOM_ERROR,
    message: 'Custom error message',
    status_code: 400,
  },
};
```

## 🏥 Health Checks

Health check endpoint is available at `/health`:

```bash
curl http://localhost:3000/health
```

The health check monitors:

- Memory heap usage
- Memory RSS usage
- Disk storage usage

## 🧪 Testing

### Unit Tests

```bash
npm run test              # Unit tests
npm run test:watch        # Watch mode
npm run test:cov          # Coverage
```

### E2E Tests

```bash
npm run test:e2e
```

### Writing Tests

Example unit test:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { ExampleController } from './example.controller';

describe('ExampleController', () => {
  let controller: ExampleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExampleController],
    }).compile();

    controller = module.get<ExampleController>(ExampleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
```

## 🔧 Configuration

### Environment Variables

The application uses environment-specific configuration files in the `env/` directory:

- `.template.env` - Template file (tracked in git)
- `.dev.env` - Development environment (ignored by git)

### Configuration Validation

All environment variables are validated using Joi schemas. The application will fail to start if required variables are missing or invalid.

### Available Configuration Options

| Variable                      | Description                            | Required | Default |
| ----------------------------- | -------------------------------------- | -------- | ------- |
| `NODE_ENV`                    | Node environment                       | Yes      | -       |
| `DEPLOY_ENV`                  | Deployment environment                 | Yes      | -       |
| `PORT`                        | Server port                            | Yes      | -       |
| `CORS_ALLOWED_ORIGINS`        | CORS allowed origins (comma-separated) | No       | `*`     |
| `BODY_PARSER_JSON_SIZE_LIMIT` | JSON body size limit                   | No       | `10mb`  |
| `API_DEFAULT_VERSION`         | API version                            | No       | `1`     |
| `API_LOG_LEVEL`               | Log level                              | No       | `debug` |
| `JWT_SECRET`                  | JWT secret key (min 32 chars)          | Yes      | -       |
| `JWT_EXPIRES_IN`              | JWT expiration time                    | No       | `1d`    |

### Adding Environment Variables

1. Add to `src/server-config/models/configuration.ts`
2. Add validation to `src/server-config/models/config-validation.schema.ts`
3. Add getter to `src/server-config/server-config.service.ts`
4. Update `env/.template.env`

## 🏗️ Creating New Modules

Use NestJS CLI to generate new modules:

```bash
nest generate module modules/users
nest generate controller modules/users
nest generate service modules/users
```

## 📦 Scripts

```bash
npm run start:dev         # Development mode
npm run start:staging     # Staging mode
npm run start:production  # Production mode
npm run build             # Build for production
npm run lint              # Lint code
npm run lint:fix          # Fix linting issues
npm run format            # Format code
npm run test              # Run unit tests
npm run test:watch        # Watch mode for tests
npm run test:cov          # Test coverage
npm run test:e2e          # E2E tests
```

## 🪝 Git Hooks (Husky)

This project uses Husky for Git hooks:

- **Pre-commit**: Runs `npm run lint` before each commit
- **Commit-msg**: Validates commit messages are not empty

To skip hooks temporarily (not recommended):

```bash
git commit --no-verify
```

## 🚀 Deployment

### Building for Production

```bash
npm run build
npm run start:production
```

### Environment Setup

1. Set all required environment variables
2. Ensure `JWT_SECRET` is strong and unique
3. Configure CORS for your domain
4. Set appropriate log levels
5. Use HTTPS in production

### Docker

The project includes a multi-stage Dockerfile for optimized production builds.

**Build the Docker image:**

```bash
docker build -t nestjs-boilerplate .
```

**Run the container:**

```bash
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e DEPLOY_ENV=production \
  -e PORT=3000 \
  -e JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long \
  nestjs-boilerplate
```

**Run with environment file:**

```bash
docker run -p 3000:3000 --env-file env/.production.env nestjs-boilerplate
```

**Using Docker Compose:**

Create a `docker-compose.yml`:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - DEPLOY_ENV=production
      - PORT=3000
      - JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
    # Or use env_file:
    # env_file:
    #   - env/.production.env
```

Then run:

```bash
docker-compose up -d
```

## 📄 License

MIT - Feel free to use and modify as needed.

---

**Happy Coding! 🎉**
