import { ApiProperty } from '@nestjs/swagger';

export class ResponseError<T> {
  constructor(error_code: string, status_code: number, message: string, data: T, debug?: object) {
    this.success = false;
    this.status = status_code;
    this.error_code = error_code;
    this.message = message;
    this.data = data;
    this.debug = debug;
  }

  @ApiProperty({ default: false, description: 'Success Status' })
  success: boolean;

  @ApiProperty({
    description: 'Application specific error code for tracking and info.',
  })
  error_code: string;

  status: number;

  @ApiProperty({
    description: 'Human readable error message.',
  })
  message: string;

  @ApiProperty()
  data: T;

  debug?: object;
}
