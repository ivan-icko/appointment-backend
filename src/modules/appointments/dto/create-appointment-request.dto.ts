import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsNumber,
  Min,
  Max,
  Matches,
} from 'class-validator';

export class CreateAppointmentRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  patientName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^[0-2][0-9]:[0-5][0-9]$/, {
    message: 'Start time must be in HH:mm format',
  })
  startTime: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(30, { message: 'Duration must be at least 30 minutes' })
  @Max(180, { message: 'Duration cannot exceed 3 hours' })
  duration: number;
}
