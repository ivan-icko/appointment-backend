export const LOGGER_WINSTON_PROVIDER = 'LOGGER_WINSTON_PROVIDER';

export enum LOGGER_LEVEL {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  DEBUG = 'debug',
  SILLY = 'silly',
  CRIT = 'crit',
}

export enum AVAILABLE_TRANSPORTS {
  CONSOLE = 'console',
  DAILY_ROTATE = 'daily_rotate',
  EMAIL = 'email',
}

export enum LOGGER_FORMAT {
  JSON = 'json',
}
