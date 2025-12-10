import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseError } from '../models/response-error';
import { ErrorDefinition } from '../models/error-definition';

export const ApiErrorResponse = <DataDto extends Type<unknown>>(
  errDef: ErrorDefinition,
  dataDto: DataDto,
  isArray = false,
) =>
  applyDecorators(
    ApiExtraModels(ResponseError, dataDto),
    ApiResponse({
      description: 'Response Payload - Error',
      status: errDef.status_code,
      schema: {
        example: new ResponseError(errDef.error_code, errDef.status_code, errDef.message, {}),
        allOf: [
          { $ref: getSchemaPath(ResponseError) },
          {
            properties: {
              data: isArray
                ? {
                    type: 'array',
                    items: { $ref: getSchemaPath(dataDto) },
                  }
                : { $ref: getSchemaPath(dataDto) },
            },
          },
        ],
      },
    }),
  );
