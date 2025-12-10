import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseSuccess } from '../models/response-success';

export const ApiSuccessResponse = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
  isArray = false,
) =>
  applyDecorators(
    ApiExtraModels(ResponseSuccess, dataDto),
    ApiOkResponse({
      description: 'Response Payload - Success',
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseSuccess) },
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
