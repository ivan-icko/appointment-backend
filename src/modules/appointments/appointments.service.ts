import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../common/modules/logger/logger.service';
import { BadRequestException } from '../../common/exceptions/bad-request.exception';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';

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

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    return await this.appointmentsRepository.find({ where: { date } });
  }

  async createAppointment(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const newAppointment =
      this.appointmentsRepository.create(createAppointmentDto);
    const appointmentsOnDate = await this.getAppointmentsByDate(
      createAppointmentDto.date,
    );

    const newStartTime = new Date(
      `${createAppointmentDto.date} ${createAppointmentDto.startTime}`,
    ).getTime();
    const newEndTime = newStartTime + createAppointmentDto.duration * 60 * 1000;

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

    const newEndTimeDate = new Date(newEndTime);
    if (newEndTimeDate.toISOString().split('T')[0] !== newAppointment.date) {
      throw new BadRequestException('Appointment must end on the same day');
    }

    return this.appointmentsRepository.save(newAppointment);
  }

  async cancelAppointment(id: string): Promise<void> {
    this.logger.info(`Cancelling appointment ${id}`);
    await this.appointmentsRepository.delete(id);
  }
}
