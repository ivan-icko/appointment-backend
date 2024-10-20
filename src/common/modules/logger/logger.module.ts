import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { loggerProviders } from './logger.providers';
import { ConfigService } from '@nestjs/config';
import { TransportFactory } from './transport.factory';

@Global()
@Module({
  providers: [
    ...loggerProviders,
    LoggerService,
    TransportFactory,
    ConfigService,
  ],
  exports: [LoggerService, ...loggerProviders],
})
export class LoggerModule {}
