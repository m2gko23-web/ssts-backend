import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Bus } from './bus.entity';
import { User } from '@modules/users/entities/user.entity';
import { TripStatus } from '@common/enums/roles.enum';

export enum TripType {
  MORNING_PICKUP = 'morning_pickup',
  AFTERNOON_DROPOFF = 'afternoon_dropoff',
  CUSTOM = 'custom',
}

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'trip_date', type: 'date' })
  tripDate: Date;

  @Column({
    name: 'trip_type',
    type: 'enum',
    enum: TripType,
    default: TripType.MORNING_PICKUP,
  })
  tripType: TripType;

  @Column({
    type: 'enum',
    enum: TripStatus,
    default: TripStatus.SCHEDULED,
  })
  status: TripStatus;

  @Column({ name: 'bus_id' })
  busId: string;

  @ManyToOne(() => Bus)
  @JoinColumn({ name: 'bus_id' })
  bus: Bus;

  @Column({ name: 'driver_id' })
  driverId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'driver_id' })
  driver: User;

  @Column({ name: 'supervisor_id', nullable: true })
  supervisorId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'supervisor_id' })
  supervisor: User;

  @Column({ name: 'scheduled_start_time', type: 'time', nullable: true })
  scheduledStartTime: string;

  @Column({ name: 'actual_start_time', type: 'timestamp', nullable: true })
  actualStartTime: Date;

  @Column({ name: 'actual_end_time', type: 'timestamp', nullable: true })
  actualEndTime: Date;

  @Column({ name: 'route_name', nullable: true })
  routeName: string;

  @Column({ name: 'notes', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}