import { transports } from 'winston';
import { format } from 'logform';
import * as Transport from 'winston-transport';
import { TransportConfig } from './config.interface';
import DailyRotateFile from 'winston-daily-rotate-file';
import { AVAILABLE_TRANSPORTS } from '../../../common/constants/logger';
export class TransportFactory {
  public createTransport(config: TransportConfig): Transport {
    let transport: DailyRotateFile | Transport;

    switch (config.name) {
      case AVAILABLE_TRANSPORTS.DAILY_ROTATE:
        transport = new DailyRotateFile({
          filename: config.file,
          level: config.level,
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '180d',
          json: true,
        });
        break;
      case AVAILABLE_TRANSPORTS.CONSOLE:
      default:
        transport = new transports.Console({
          level: config.level,
          format: format.colorize(),
        });
        break;
    }

    return transport;
  }
}
