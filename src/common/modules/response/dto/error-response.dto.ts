import { ApiProperty } from '@nestjs/swagger';
import { IErrorResponse } from './error-response.interface';
import { IMetadata } from './metadata.interface';
import { getEnv } from '../../../utils/string.util';

export class ErrorResponseDto implements IErrorResponse {
  @ApiProperty({ type: 'string' })
  code = '';
  @ApiProperty({ type: 'string' })
  message: string;
  @ApiProperty({ type: 'object' })
  metadata: IMetadata;
  @ApiProperty({ type: 'string' })
  status: number;
  @ApiProperty({ type: 'string' })
  error?: string;
  @ApiProperty({ type: 'string' })
  userMessage?: string;
  @ApiProperty({ type: 'string' })
  apiId?: string;

  constructor(
    status: number,
    message: string,
    errorCode: string,
    apiId: string,
    userMessage: string,
    meta: object,
    error?: string,
  ) {
    this.status = status;
    this.message = message;
    if (ErrorResponseDto._showError() && error) {
      this.error = error;
    }
    this.userMessage = userMessage;
    this._setCode(this.status.toString(), apiId, errorCode);

    this.metadata = {
      timestamp: new Date().toISOString(),
      ...meta,
    };
  }

  private _setCode(status: string, serviceCode: string, code: string): void {
    this.code = `${status}.${serviceCode}.${code}`;
  }

  private static _showError(): boolean {
    return getEnv('NODE_ENV', 'production') !== 'production';
  }
}
