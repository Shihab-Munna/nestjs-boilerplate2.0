import { HttpException } from '@nestjs/common';
import { getErrorDefinition, globalErrorCodes } from '../global-error-definitions';

export class BaseHttpException extends HttpException {
  error_code: string;
  data: object;
  debugData?: object;

  constructor(
    status_code: number,
    error_code: string,
    data: object = {},
    message?: string,
    debugData?: object,
  ) {
    const serverError = getErrorDefinition(globalErrorCodes.INTERNAL_SERVER_ERROR);
    super(data, status_code || serverError.status_code);
    this.error_code = error_code || serverError.error_code;
    this.message = message || serverError.message;
    this.debugData = debugData;
  }
}
