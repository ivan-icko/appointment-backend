import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './appointment.entity';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { CancelAppointmentDto } from '../dto/cancel-appointment.dto';

@ApiTags('appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

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
    return this.appointmentsService.getAppointmentsByDate(date);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiResponse({
    status: 201,
    description: 'The newly created appointment',
    type: Appointment,
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  createAppointment(
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentsService.createAppointment(createAppointmentDto);
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
  cancelAppointment(@Param() params: CancelAppointmentDto): Promise<void> {
    return this.appointmentsService.cancelAppointment(params.id);
  }
}
