import { ApiProperty } from '@nestjs/swagger';

export class ErrorDefinition {
  @ApiProperty()
  error_code: string;

  @ApiProperty()
  status_code: number;

  @ApiProperty()
  message: string;
}
