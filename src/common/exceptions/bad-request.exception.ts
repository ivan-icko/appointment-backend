import { HttpStatus } from '@nestjs/common';
import { BAD_REQUEST_EXCEPTION } from '../constants/global';
import { AbstractException } from './abstract.exception';

export class BadRequestException extends AbstractException {
  constructor(
    error = 'Bad Request',
    code = BAD_REQUEST_EXCEPTION,
    userMessage = 'Invalid request parameters',
    message = 'Bad request error',
    meta?: object,
  ) {
    super(error, code, userMessage, message, HttpStatus.BAD_REQUEST, meta);
  }
}
