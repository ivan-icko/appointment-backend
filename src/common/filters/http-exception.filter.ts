import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseService } from '../modules/response/response.service';
import { ErrorResponseDto } from '../modules/response/dto/error-response.dto';
import { AbstractException } from '../exceptions/abstract.exception';
import { LoggerService } from '../modules/logger/logger.service';
import { GENERAL_ERROR_CODE } from '../constants/global';

@Catch()
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly responseService: ResponseService,
    private readonly loggerService: LoggerService,
  ) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const httpResponse = ctx.getResponse<Response>();
    const response: ErrorResponseDto = this.getResponse(exception);
    this.loggerService.error('Error HTTP RESPONSE: ', response);

    httpResponse.status(response.status).json(response);
  }

  private getResponse(exception: any): ErrorResponseDto {
    if (exception instanceof AbstractException) {
      this.loggerService.error(
        `Exception - message:${exception.error}, raw:${JSON.stringify(
          exception,
        )}, stack:${exception.stack}`,
      );
      return this.responseService.error(
        exception.status,
        exception.error ?? '',
        exception.code,
        exception.userMessage,
        exception.meta,
      );
    }
    this.loggerService.error(
      `Exception - message:${exception.message}, raw:${exception}, stack:${exception.stack}`,
    );
    return this.responseService.error(
      HttpStatus.INTERNAL_SERVER_ERROR,
      exception.message,
      GENERAL_ERROR_CODE,
    );
  }
}
