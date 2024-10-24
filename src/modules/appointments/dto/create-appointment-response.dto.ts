import { Expose } from 'class-transformer';

export class CreateAppointmentResponseDto {
  /* @Expose()
  id: string; */

  @Expose()
  patientName: string;

  @Expose()
  description: string;

  @Expose()
  date: Date;

  @Expose()
  startTime: string;

  @Expose()
  duration: number;
}
