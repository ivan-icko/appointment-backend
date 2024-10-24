import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { LoggerInterceptor } from '../../common/interceptors/logger.interceptor';
import { LoggerService } from '../../common/modules/logger/logger.service';

@UseInterceptors(LoggerInterceptor)
@Controller('hello-world')
export class HelloWorldController {
  constructor(private readonly logger: LoggerService) {}

  @Get()
  getHello() {
    this.logger.info('Hello, World!');
    return { message: 'Hello, World!' };
  }
}
