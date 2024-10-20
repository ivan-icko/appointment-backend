import { registerAs } from '@nestjs/config';
import { LOGGER_CONFIG } from '../common/constants/global';
import { getEnv } from '../common/utils/string.util';

const DAILY_ROTATE_FILE = 'logs/application-%DATE%.log';

export enum AVAILABLE_TRANSPORTS {
  CONSOLE = 'console',
  DAILY_ROTATE = 'daily_rotate',
  EMAIL = 'email',
}

export enum LOGGER_LEVEL {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  DEBUG = 'debug',
  SILLY = 'silly',
  CRITICAL = 'crit',
}

export enum LOGGER_FORMAT {
  JSON = 'json',
}

const configFactory = (loggerTransportsString: string): object[] => {
  const transports: string[] = loggerTransportsString.split(',');
  return [getConsoleTransport(transports), getDailyRotateTransport(transports)];
};

const getConsoleTransport = (transports: string | string[]) => ({
  active: transports.includes(AVAILABLE_TRANSPORTS.CONSOLE),
  name: AVAILABLE_TRANSPORTS.CONSOLE,
  format: getEnv('LOGGER_CONSOLE_FORMAT', LOGGER_FORMAT.JSON),
  level: getEnv('LOGGER_CONSOLE_LEVEL', LOGGER_LEVEL.INFO),
});

const getDailyRotateTransport = (transports: string | string[]) => ({
  active: transports.includes(AVAILABLE_TRANSPORTS.DAILY_ROTATE),
  name: AVAILABLE_TRANSPORTS.DAILY_ROTATE,
  format: getEnv('LOGGER_DAILY_ROTATE_FORMAT', LOGGER_FORMAT.JSON),
  level: getEnv('LOGGER_DAILY_ROTATE_LEVEL', LOGGER_LEVEL.ERROR),
  file: getEnv('LOGGER_DAILY_ROTATE_FILE', DAILY_ROTATE_FILE),
});

export default registerAs(LOGGER_CONFIG, () => ({
  loggerConfig: configFactory(getEnv('LOGGER_TRANSPORTS', 'console')),
}));
