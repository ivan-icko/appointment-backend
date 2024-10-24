import { HttpStatus } from '@nestjs/common';
import { SuccessResponseDto } from './success-response.dto';

describe('ErrorResponseDto', () => {
  const data = 'data';
  const message = 'test';
  const userMessage = 'userMessage';

  it('constructor', async () => {
    const successResponseDto = new SuccessResponseDto(
      data,
      HttpStatus.OK,
      message,
      userMessage,
    );
    expect(successResponseDto).toBeDefined();
    expect(successResponseDto.data).toEqual(data);
    expect(successResponseDto.status).toEqual(HttpStatus.OK);
    expect(successResponseDto.message).toEqual(message);
    expect(successResponseDto.userMessage).toEqual(userMessage);
  });
});
