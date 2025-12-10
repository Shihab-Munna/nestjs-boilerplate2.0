import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  Logger,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { BaseHttpException } from './exceptions/base-http.exception';
import { getErrorDefinition, globalErrorCodes } from './global-error-definitions';
import { ServiceException } from './exceptions/service.exception';
import { ResponseError } from '../core/models/response-error';
import { Request, Response } from 'express';
import { ErrorDefinition } from '../core/models/error-definition';
import { EnvType } from '../server-config/models/env-type.enum';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request: Request = ctx.getRequest();
    const response: Response = ctx.getResponse();

    let data = {};
    let debugData: undefined | object = undefined;
    let statusCode: number;
    let message: string;
    let errorCode: string;

    // Service exceptions are not HTTP related. Translation from service -> HTTP is done here.
    if (exception instanceof ServiceException) {
      const errorDefinition = getErrorDefinition(exception.error_code);
      data = exception.data;
      statusCode = errorDefinition.status_code;
      message = errorDefinition.message;
      errorCode = errorDefinition.error_code;
    } else if (exception instanceof BaseHttpException) {
      data = exception.data;
      statusCode = exception.getStatus();
      message = exception.message;
      errorCode = exception.error_code;
      debugData = exception.debugData;
    } else if (exception instanceof NotFoundException) {
      const errorDefinition: ErrorDefinition = getErrorDefinition(globalErrorCodes.NOT_FOUND);
      statusCode = errorDefinition.status_code;
      message = exception.message || errorDefinition.message;
      errorCode = errorDefinition.error_code;
    } else if (exception instanceof BadRequestException) {
      const errorDefinition: ErrorDefinition = getErrorDefinition(globalErrorCodes.BAD_REQUEST);
      statusCode = errorDefinition.status_code;
      message = exception.message || errorDefinition.message;
      errorCode = errorDefinition.error_code;
    } else if (exception instanceof UnauthorizedException) {
      const errorDefinition: ErrorDefinition = getErrorDefinition(globalErrorCodes.UNAUTHORIZED);
      statusCode = errorDefinition.status_code;
      message = exception.message || errorDefinition.message;
      errorCode = errorDefinition.error_code;
    } else if (exception instanceof ForbiddenException) {
      const errorDefinition: ErrorDefinition = getErrorDefinition(globalErrorCodes.FORBIDDEN);
      statusCode = errorDefinition.status_code;
      message = exception.message || errorDefinition.message;
      errorCode = errorDefinition.error_code;
    } else {
      // This is possibly an uncaught exception. Any errors thrown here should be reviewed,
      // and if needed, handle accordingly at the service layer.
      this.logger.error(exception);

      // Fallback to internal server error
      const errorDefinition = getErrorDefinition(globalErrorCodes.INTERNAL_SERVER_ERROR);

      statusCode = errorDefinition.status_code;
      message = errorDefinition.message;
      errorCode = errorDefinition.error_code;
    }

    let responseError: ResponseError<object>;

    if (process.env.NODE_ENV === EnvType.production.toString()) {
      responseError = new ResponseError(errorCode, statusCode, message, data);
    } else {
      responseError = new ResponseError(errorCode, statusCode, message, data, {
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        error_name: exception?.name,
        ...(debugData && { debugData }),
      });
    }

    this.logger.error(JSON.stringify({ ...responseError, stack: exception?.stack }));

    response.status(statusCode).json(responseError);
  }
}
