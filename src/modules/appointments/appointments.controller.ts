import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  UseFilters,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './appointment.entity';
import { CreateAppointmentRequestDto } from './dto/create-appointment-request.dto';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import { LoggerInterceptor } from '../../common/interceptors/logger.interceptor';
import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';
import { ResponseService } from '../../common/modules/response/response.service';
import { plainToInstance } from 'class-transformer';
import { CreateAppointmentResponseDto } from './dto/create-appointment-response.dto';

@ApiTags('appointments')
@Controller('appointments')
@UseInterceptors(LoggerInterceptor)
@UseFilters(HttpExceptionFilter)
export class AppointmentsController {
  constructor(
    private readonly appointmentsService: AppointmentsService,
    private readonly response: ResponseService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all upcoming appointments' })
  @ApiResponse({
    status: 200,
    description: 'List of upcoming appointments',
    type: [Appointment],
  })
  listUpcomingAppointments(): Promise<Appointment[]> {
    return this.appointmentsService.listUpcomingAppointments();
  }

  @Get(':date')
  @ApiOperation({ summary: 'Get appointments by specific date' })
  @ApiParam({
    name: 'date',
    description: 'The date for which to retrieve appointments (YYYY-MM-DD)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of appointments for a specific date',
    type: [Appointment],
  })
  getAppointmentsByDate(@Param('date') date: string): Promise<Appointment[]> {
    return this.appointmentsService.getAppointmentsByDate(new Date(date));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiResponse({
    status: 201,
    description: 'The newly created appointment',
    type: Appointment,
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createAppointment(
    @Body() createAppointmentDto: CreateAppointmentRequestDto,
  ) {
    const newAppointment: Appointment =
      await this.appointmentsService.createAppointment(createAppointmentDto);

    return this.response.success(
      plainToInstance(CreateAppointmentResponseDto, newAppointment, {
        excludeExtraneousValues: true,
      }),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel an appointment by ID' })
  @ApiParam({
    name: 'id',
    description: 'The unique ID of the appointment to cancel',
  })
  @ApiResponse({
    status: 200,
    description: 'The appointment was successfully canceled',
  })
  cancelAppointment(@Param() params: CancelAppointmentDto) {
    this.appointmentsService.cancelAppointment(params.id);
    return this.response.success({});
  }
}
