import { Global, Module } from '@nestjs/common';
import { ResponseService } from './response.service';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [ResponseService, ConfigService],
  exports: [ResponseService],
})
export class ResponseModule {}
