import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { LoggerService } from '../modules/logger/logger.service';
import { Observable } from 'rxjs';
import { ServerResponse } from 'http';
import { tap } from 'rxjs/operators';
import * as crypto from 'crypto';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(
    @Inject(LoggerService)
    private readonly logger: LoggerService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const now = Date.now();
    const randomId = crypto.randomBytes(20).toString('hex');
    this.logger.traceId = randomId;
    this.logger.info('REQUEST', { request: this.getRequestLogData(context) });
    return next.handle().pipe(
      tap((responseData) => {
        if (!(responseData instanceof ServerResponse)) {
          responseData.metadata = {
            trace: randomId,
            duration: `${Date.now() - now}ms`,
          };
          this.logger.info('RESPONSE', { response: responseData });
        }
      }),
    );
  }

  private getRequestLogData(context: ExecutionContext): any {
    const request = context.switchToHttp().getRequest();
    return {
      url: request.url,
      method: request.method,
      body: request.body,
      params: request.params,
      query: request.query,
      client: request.user?.username,
    };
  }
}
