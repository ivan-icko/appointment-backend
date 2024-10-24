import { Injectable, Inject } from '@nestjs/common';
import { SuccessResponseDto } from './dto/success-response.dto';
import { ErrorResponseDto } from './dto/error-response.dto';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../logger/logger.service';
import {
  GENERAL_CONFIG,
  GENERAL_ERROR_CODE,
} from '../../../common/constants/global';

@Injectable()
export class ResponseService {
  private readonly apiId: string;

  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
    @Inject(LoggerService)
    private readonly logger: LoggerService,
  ) {
    const globalConfig: any = this.configService.get(GENERAL_CONFIG, {});
    this.apiId = globalConfig.apiId;
  }

  public success<T>(
    data: T,
    status?: number,
    message?: string,
    userMessage?: string,
  ): SuccessResponseDto<T> {
    return new SuccessResponseDto<T>(data, status, message, userMessage);
  }

  public error(
    status: number,
    message: string,
    errorCode: string = GENERAL_ERROR_CODE,
    userMessage = '',
    meta: object = {},
    error = '',
  ): ErrorResponseDto {
    return new ErrorResponseDto(
      status,
      message,
      errorCode,
      this.apiId,
      userMessage,
      Object.assign({}, meta, { trace: this.logger.traceId }),
      error,
    );
  }
}
