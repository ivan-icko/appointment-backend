import { ApiProperty } from '@nestjs/swagger';
import { ISuccessResponse } from './success-response.interface';
import { IMetadata } from './metadata.interface';
import { ApiPropertyOptional } from '@nestjs/swagger/dist/decorators/api-property.decorator';

export class SuccessResponseDto<T> implements ISuccessResponse<T> {
  @ApiProperty()
  data: T;
  @ApiProperty()
  metadata: IMetadata;
  @ApiPropertyOptional({ type: Number, required: false })
  status?: number;
  @ApiPropertyOptional({ type: String, required: false })
  message?: string;
  @ApiPropertyOptional({ type: String, required: false })
  userMessage?: string;

  constructor(
    data: T,
    status?: number,
    message?: string,
    userMessage?: string,
  ) {
    this.data = data;

    if (status) {
      this.status = status;
    }
    if (message) {
      this.message = message;
    }
    if (userMessage) {
      this.userMessage = userMessage;
    }

    this.metadata = {};
  }
}
