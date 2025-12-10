import { ErrorDefinition } from '../core/models/error-definition';

export const globalErrorCodes = {
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
};

const globalErrorDefinitions: Record<string, ErrorDefinition> = {
  INTERNAL_SERVER_ERROR: {
    error_code: globalErrorCodes.INTERNAL_SERVER_ERROR,
    message: 'An unexpected error occurred on the server.',
    status_code: 500,
  },
  BAD_REQUEST: {
    error_code: globalErrorCodes.BAD_REQUEST,
    message: 'The request is malformed or contains invalid parameters.',
    status_code: 400,
  },
  NOT_FOUND: {
    error_code: globalErrorCodes.NOT_FOUND,
    message: 'Requested resource is not found.',
    status_code: 404,
  },
  UNAUTHORIZED: {
    error_code: globalErrorCodes.UNAUTHORIZED,
    message: 'Authentication required.',
    status_code: 401,
  },
  FORBIDDEN: {
    error_code: globalErrorCodes.FORBIDDEN,
    message: 'Access denied.',
    status_code: 403,
  },
};

export const getErrorDefinition = (errorCode: string): ErrorDefinition => {
  return (
    globalErrorDefinitions[errorCode] ||
    globalErrorDefinitions[globalErrorCodes.INTERNAL_SERVER_ERROR]
  );
};
