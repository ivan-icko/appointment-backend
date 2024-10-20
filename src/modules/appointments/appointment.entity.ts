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
  date: string;

  @Column()
  startTime: string;

  @Column('int')
  duration: number;
}
