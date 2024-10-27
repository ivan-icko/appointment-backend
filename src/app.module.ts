import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HelloWorldModule } from './modules/hello-world/hello-world.module';
import loggerConfig from './config/logger.config';
import { LoggerModule } from './common/modules/logger/logger.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseModule } from './common/modules/response/response.module';
import { DATABASE_CONFIG } from './common/constants/global';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [loggerConfig, databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get(DATABASE_CONFIG).sqlite,
    }),
    HelloWorldModule,
    AppointmentsModule,
    ResponseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
