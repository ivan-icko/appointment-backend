import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../common/modules/logger/logger.service';
import { CreateAppointmentRequestDto } from './dto/create-appointment-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { BadRequestException } from '../../common/exceptions/bad-request.exception';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
    private readonly logger: LoggerService,
  ) {}

  async listUpcomingAppointments(): Promise<Appointment[]> {
    return await this.appointmentsRepository.find({
      order: { date: 'DESC', startTime: 'DESC' },
    });
  }

  async getAppointmentsByDate(date: Date): Promise<Appointment[]> {
    return await this.appointmentsRepository.find({
      where: { date },
    });
  }

  async createAppointment(
    createAppointmentDto: CreateAppointmentRequestDto,
  ): Promise<Appointment> {
    const { date, startTime, duration } = createAppointmentDto;

    // Validate multiple of 30 minutes
    if (duration % 30 !== 0) {
      throw new BadRequestException(
        'Duration must be a minimum of 30 minutes and in multiples of 30 minutes',
      );
    }

    // Validate that the start time falls on full or half-hours
    const startMinutes = new Date(`${date} ${startTime}`).getMinutes();
    if (startMinutes !== 0 && startMinutes !== 30) {
      throw new BadRequestException(
        'Appointment must start on full or half-hour marks',
      );
    }

    const newAppointment =
      this.appointmentsRepository.create(createAppointmentDto);
    const appointmentsOnDate = await this.getAppointmentsByDate(date);

    const newStartTime = new Date(`${date} ${startTime}`).getTime();
    const newEndTime = newStartTime + duration * 60 * 1000;

    for (const appointment of appointmentsOnDate) {
      const existingStartTime = new Date(
        `${appointment.date} ${appointment.startTime}`,
      ).getTime();
      const existingEndTime =
        existingStartTime + appointment.duration * 60 * 1000;

      if (
        (newStartTime >= existingStartTime && newStartTime < existingEndTime) ||
        (newEndTime > existingStartTime && newEndTime <= existingEndTime) ||
        (newStartTime <= existingStartTime && newEndTime >= existingEndTime)
      ) {
        this.logger.error('Appointment time overlaps with an existing one');
        throw new BadRequestException(
          'Appointment time overlaps with an existing one',
        );
      }
    }

    // Ensure appointment ends on the same day
    const newEndTimeDate = new Date(newEndTime);
    if (newEndTimeDate !== newAppointment.date) {
      throw new BadRequestException('Appointment must end on the same day');
    }

    return this.appointmentsRepository.save(newAppointment);
  }

  async cancelAppointment(id: string): Promise<void> {
    this.logger.info(`Cancelling appointment ${id}`);
    await this.appointmentsRepository.delete(id);
  }
}
