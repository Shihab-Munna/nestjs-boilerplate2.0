import * as process from 'process';

type Configuration = {
  env: string;
  deployEnv: string;
  server: {
    port: number;
    corsAllowedOrigins: string[];
    bodyParserJsonSizeLimit: string;
  };
  api: {
    defaultVersion: string;
    logLevel: string;
  };
  baseUrls: {
    dev: string;
    staging: string;
    production: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
};

// Configuration loaded from `.env` files
export const configuration = (): Configuration => ({
  env: process.env.NODE_ENV || 'dev',
  deployEnv: process.env.DEPLOY_ENV || 'dev',
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    corsAllowedOrigins: process.env.CORS_ALLOWED_ORIGINS?.split(',')?.filter((x) => x) || ['*'],
    bodyParserJsonSizeLimit: process.env.BODY_PARSER_JSON_SIZE_LIMIT || '10mb',
  },
  api: {
    defaultVersion: process.env.API_DEFAULT_VERSION || '1',
    logLevel: process.env.API_LOG_LEVEL || 'debug',
  },
  baseUrls: {
    dev: process.env.DEV_BASE_URL || 'http://localhost:3000',
    staging: process.env.STAGING_BASE_URL || 'http://localhost:3000',
    production: process.env.PRODUCTION_BASE_URL || 'http://localhost:3000',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
});
