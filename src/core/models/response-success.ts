import { ApiProperty } from '@nestjs/swagger';

export class ResponseSuccess<T> {
  constructor(status: number, message: string, data: T) {
    this.success = true;
    this.status = status;
    this.message = message;
    this.data = data || ({} as T);
  }

  @ApiProperty({ default: true, description: 'Success status.' })
  success: boolean;

  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({
    example: 'Operation successful.',
    description: 'Additional information for the action.',
  })
  message: string;

  data: T;
}
