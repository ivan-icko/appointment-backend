import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CancelAppointmentDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
