import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HelloWorldModule } from './modules/hello-world/hello-world.module';
import loggerConfig from './config/logger.config';
import { LoggerModule } from './common/modules/logger/logger.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './modules/appointments/appointment.entity';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [loggerConfig],
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'appointments.db',
      entities: [Appointment],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Appointment]),
    HelloWorldModule,
    AppointmentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
