import { HttpStatus } from '@nestjs/common';
import { GENERAL_ERROR_CODE } from '../constants/global';

export abstract class AbstractException extends Error {
  protected constructor(
    readonly error: string,
    public code = GENERAL_ERROR_CODE,
    public userMessage = '',
    public message = '',
    readonly status = HttpStatus.INTERNAL_SERVER_ERROR,
    readonly meta?: object,
  ) {
    super();
  }

  toString() {
    return `Error: ${this.error}; InternalCode: ${this.code}; UserMessage: ${this.message}`;
  }
}
