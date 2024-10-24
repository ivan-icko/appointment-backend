import { ErrorResponseDto } from './error-response.dto';
import { HttpStatus } from '@nestjs/common';

describe('ErrorResponseDto', () => {
  const message = 'test';
  const errorCode = '001';
  const apiId = '700;';
  const userMessage = 'UserMessage';
  const meta = { testtt: 123 };

  it('constructor full', async () => {
    const errorResponseDto = new ErrorResponseDto(
      HttpStatus.OK,
      message,
      errorCode,
      apiId,
      userMessage,
      meta,
    );
    expect(errorResponseDto).toBeDefined();
    expect(errorResponseDto.status).toEqual(HttpStatus.OK);
    expect(errorResponseDto.message).toEqual(message);
    expect(errorResponseDto.code).toEqual(
      `${HttpStatus.OK}.${apiId}.${errorCode}`,
    );
    expect(errorResponseDto.metadata).toMatchObject(meta);
  });
});
