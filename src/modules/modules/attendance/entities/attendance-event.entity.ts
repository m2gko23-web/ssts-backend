import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { Student } from '@modules/students/entities/student.entity';
import { Trip } from '@modules/transport/entities/trip.entity';
import { User } from '@modules/users/entities/user.entity';
import { AttendanceEventType } from '@common/enums/roles.enum';

@Entity('attendance_events')
export class AttendanceEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // EVT type: boarded_bus, alighted_bus, entered_school, left_school, absent, late
  @Column({
    name: 'event_type',
    type: 'enum',
    enum: AttendanceEventType,
  })
  eventType: AttendanceEventType;

  @Column({ name: 'student_id' })
  studentId: string;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ name: 'trip_id', nullable: true })
  tripId: string;

  @ManyToOne(() => Trip, { nullable: true })
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @Column({ name: 'recorded_by_id', nullable: true })
  recordedById: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'recorded_by_id' })
  recordedBy: User;

  @Column({ name: 'latitude', type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column({ name: 'longitude', type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;

  @Column({ name: 'scan_method', nullable: true })
  scanMethod: string; // 'qr', 'rfid', 'manual', 'face'

  @Column({ name: 'is_verified', default: true })
  isVerified: boolean;

  @Column({ name: 'notes', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'occurred_at' })
  occurredAt: Date;
}