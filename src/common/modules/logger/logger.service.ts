import { Injectable, Inject, Scope } from '@nestjs/common';
import { Logger } from 'winston';
import { getEnv } from '../../utils/string.util';
import {
  LOGGER_LEVEL,
  LOGGER_WINSTON_PROVIDER,
} from '../../../common/constants/logger';

@Injectable({
  scope: Scope.REQUEST,
})
export class LoggerService {
  public traceId = '';
  constructor(
    @Inject(LOGGER_WINSTON_PROVIDER) private readonly logger: Logger,
  ) {}

  public log(level: LOGGER_LEVEL, msg: string, meta?: object): void {
    this.logger.log(level, msg, this._enhanceMetaAndLineLength(meta));
  }

  public debug(msg: string, meta?: object): void {
    this.logger.debug(msg, this._enhanceMetaAndLineLength(meta));
  }

  public error(msg: string, meta?: any): void {
    this.logger.error(msg, this._enhanceMetaAndLineLength(meta));
  }

  public warn(msg: string, meta?: object): void {
    this.logger.log(
      LOGGER_LEVEL.WARNING,
      msg,
      this._enhanceMetaAndLineLength(meta),
    );
  }

  public info(msg: string, meta?: object): void {
    this.logger.info(msg, this._enhanceMetaAndLineLength(meta));
  }

  public silly(msg: string, meta?: object): void {
    this.logger.silly(msg, this._enhanceMetaAndLineLength(meta));
  }

  public crit(msg: string, meta?: object): void {
    this.logger.crit(msg, this._enhanceMetaAndLineLength(meta));
  }

  private _enhanceMetaAndLineLength(meta: any): object {
    const enhancedMeta: any = meta
      ? Object.assign({}, { loggerMeta: meta })
      : {};
    const json = JSON.stringify(enhancedMeta);
    const lineLength = +getEnv('LOGGER_LINE_LENGTH', '50000');
    const logLine =
      json.length > lineLength
        ? { cutData: `${json.substring(0, lineLength)}...` }
        : enhancedMeta;
    logLine.traceId = this.traceId;
    return logLine;
  }
}
