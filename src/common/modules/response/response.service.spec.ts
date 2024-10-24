import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ResponseService } from './response.service';
import { ConfigService } from '@nestjs/config';
import { SuccessResponseDto } from './dto/success-response.dto';
import { ErrorResponseDto } from './dto/error-response.dto';
import { LoggerService } from '../logger/logger.service';
import { LoggerServiceMock } from '../../../../__mocks__/common/modules/logger/logger.service.mock';

const apiId = '700';

const ConfigServiceMock = jest.fn().mockImplementation(() => {
  return {
    get: jest.fn().mockImplementation(() => {
      return {
        apiId,
      };
    }),
  };
});

describe('ResponseService', () => {
  const data = 'data';
  const message = 'test';
  const error = 'error';
  const errorCode = '001';
  const userMessage = 'userMessage';
  const meta = {};
  let responseService: ResponseService;

  const MockConfigService = {
    provide: ConfigService,
    useClass: ConfigServiceMock,
  };

  const LoggerMock = {
    provide: LoggerService,
    useClass: LoggerServiceMock,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MockConfigService, ResponseService, LoggerMock],
    }).compile();

    responseService = module.get<ResponseService>(ResponseService);
  });

  it('constructor', async () => {
    expect(responseService).toBeDefined();
  });

  it('success', async () => {
    const response = responseService.success(data);
    expect(response).toBeInstanceOf(SuccessResponseDto);
    expect(response.data).toBe(data);
  });

  it('success with all parameters', async () => {
    const response = responseService.success(
      data,
      HttpStatus.OK,
      message,
      userMessage,
    );
    expect(response).toBeInstanceOf(SuccessResponseDto);
    expect(response.data).toBe(data);
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.message).toBe(message);
    expect(response.userMessage).toBe(userMessage);
  });

  it('error', async () => {
    const response = responseService.error(HttpStatus.OK, message, errorCode);
    expect(response).toBeInstanceOf(ErrorResponseDto);
  });

  it('error with userMessage', async () => {
    const response = responseService.error(
      HttpStatus.OK,
      message,
      errorCode,
      userMessage,
      meta,
      error,
    );
    expect(response).toBeInstanceOf(ErrorResponseDto);
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.message).toBe(message);
    expect(response.error).toBe(error);
    expect(response.userMessage).toBe(userMessage);
    expect(response.metadata).toBeDefined();
  });
});
