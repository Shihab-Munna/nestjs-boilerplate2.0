import * as Joi from 'joi';
import { EnvType } from './env-type.enum';

// Validation applies to `{ENV}.env`
export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid(EnvType.dev.toString(), EnvType.staging.toString(), EnvType.production.toString())
    .required(),
  PORT: Joi.number().positive().required(),
  DEPLOY_ENV: Joi.string()
    .valid(EnvType.dev.toString(), EnvType.staging.toString(), EnvType.production.toString())
    .required(),
  CORS_ALLOWED_ORIGINS: Joi.string().optional(),
  BODY_PARSER_JSON_SIZE_LIMIT: Joi.string().optional(),
  API_DEFAULT_VERSION: Joi.string().optional(),
  API_LOG_LEVEL: Joi.string().optional(),
  DEV_BASE_URL: Joi.string().uri().optional(),
  STAGING_BASE_URL: Joi.string().uri().optional(),
  PRODUCTION_BASE_URL: Joi.string().uri().optional(),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().optional(),
});
