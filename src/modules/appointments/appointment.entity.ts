import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  patientName: string;

  @Column()
  description: string;

  @Column()
  date: Date;

  @Column()
  startTime: string;

  @Column('int')
  duration: number;
}
