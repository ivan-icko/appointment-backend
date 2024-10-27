import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../common/modules/logger/logger.service';
import { CreateAppointmentRequestDto } from './dto/create-appointment-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { BadRequestException } from '../../common/exceptions/bad-request.exception';
import { AppointmentValidationService } from './appointment-validation.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
    private readonly logger: LoggerService,
    private readonly validationService: AppointmentValidationService,
  ) {}

  async listUpcomingAppointments(): Promise<Appointment[]> {
    return await this.appointmentsRepository.find({
      order: { date: 'DESC', startTime: 'DESC' },
    });
  }

  async getAppointmentsByDate(date: Date): Promise<Appointment[]> {
    const appointments = await this.appointmentsRepository.find({
      where: { date },
    });
    console.log(appointments);
    return appointments;
  }

  async createAppointment(
    createAppointmentDto: CreateAppointmentRequestDto,
  ): Promise<Appointment> {
    const { date, startTime, duration } = createAppointmentDto;

    this.validationService.validateDuration(duration);
    this.validationService.validateStartTime(startTime);

    const appointmentsOnDate = await this.getAppointmentsByDate(date);

    const newStartTime = date.getTime();
    const newEndTime = newStartTime + duration * 60 * 1000;

    this.validationService.checkOverlap(
      newStartTime,
      newEndTime,
      appointmentsOnDate,
    );

    // Ensure appointment ends on the same day
    const newEndTimeDate = new Date(newEndTime);
    if (newEndTimeDate.getDate() !== date.getDate()) {
      throw new BadRequestException('Appointment must end on the same day');
    }

    const newAppointment =
      this.appointmentsRepository.create(createAppointmentDto);
    return this.appointmentsRepository.save(newAppointment);
  }

  async cancelAppointment(id: string): Promise<void> {
    this.logger.info(`Cancelling appointment ${id}`);
    await this.appointmentsRepository.delete(id);
  }
}
