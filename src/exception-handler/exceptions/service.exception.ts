export class ServiceException extends Error {
  error_code: string;
  data: object;

  constructor(error_code: string, data: object = {}) {
    super();
    this.name = 'ServiceError';
    this.error_code = error_code;
    this.data = data;
  }
}
