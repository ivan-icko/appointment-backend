import { Injectable, BadRequestException } from '@nestjs/common';
import { Appointment } from './appointment.entity';

@Injectable()
export class AppointmentValidationService {
  validateDuration(duration: number) {
    if (duration % 30 !== 0) {
      throw new BadRequestException(
        'Duration must be at least 30 minutes and in multiples of 30 minutes',
      );
    }
  }

  validateStartTime(startTime: string) {
    const startMinutes = new Date(`1970-01-01T${startTime}`).getMinutes();
    if (startMinutes !== 0 && startMinutes !== 30) {
      throw new BadRequestException(
        'Start time must be on full or half-hour marks',
      );
    }
  }

  checkOverlap(
    newStartTime: number,
    newEndTime: number,
    appointments: Appointment[],
  ) {
    for (const appointment of appointments) {
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
        throw new BadRequestException(
          'Appointment time overlaps with an existing one',
        );
      }
    }
  }
}
