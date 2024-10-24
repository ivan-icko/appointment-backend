import { createLogger, config, format } from 'winston';
import { ConfigService } from '@nestjs/config';
import * as Transport from 'winston-transport';
import { TransportFactory } from './transport.factory';
import { TransportConfig } from './config.interface';
import { LOGGER_WINSTON_PROVIDER } from '../../../common/constants/logger';
import { LOGGER_CONFIG } from '../../../common/constants/global';

export const useFactory = (
  configService: ConfigService,
  transportFactory: TransportFactory,
) => {
  const loggerConfig: TransportConfig[] =
    configService.get(LOGGER_CONFIG).loggerConfig;
  const transports: Transport[] = [];

  loggerConfig.forEach((item) => {
    if (item.active) {
      transports.push(transportFactory.createTransport(item));
    }
  });

  return createLogger({
    transports,
    levels: config.syslog.levels,
    format: format.combine(format.timestamp(), format.json()),
  });
};

export const loggerProviders: any[] = [
  {
    provide: LOGGER_WINSTON_PROVIDER,
    useFactory,
    inject: [ConfigService, TransportFactory],
  },
];
