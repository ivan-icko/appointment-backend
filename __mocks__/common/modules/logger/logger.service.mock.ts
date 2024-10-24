import { LoggerService } from '../../../../src/common/modules/logger/logger.service';

export const log = jest.fn(() => {});
export const debug = jest.fn(() => {});
export const error = jest.fn(() => {});
export const warn = jest.fn(() => {});
export const info = jest.fn(() => {});
export const silly = jest.fn(() => {});
export const crit = jest.fn(() => {});

export const LoggerServiceMock = jest.fn(() => {
  return {
    log,
    error,
    debug,
    warn,
    info,
    silly,
    crit,
    traceId: '',
  };
});

export const MockLoggerService = {
  provide: LoggerService,
  useClass: LoggerServiceMock,
};
