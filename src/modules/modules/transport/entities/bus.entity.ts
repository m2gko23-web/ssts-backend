import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToMany,
} from 'typeorm';

@Entity('buses')
export class Bus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'plate_number', unique: true })
  plateNumber: string;

  @Column({ name: 'bus_number' })
  busNumber: string;

  @Column({ name: 'capacity' })
  capacity: number;

  @Column({ name: 'make', nullable: true })
  make: string;

  @Column({ name: 'model', nullable: true })
  model: string;

  @Column({ name: 'year', nullable: true })
  year: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'gps_device_id', nullable: true })
  gpsDeviceId: string;

  @Column({ name: 'current_latitude', type: 'decimal', precision: 10, scale: 7, nullable: true })
  currentLatitude: number;

  @Column({ name: 'current_longitude', type: 'decimal', precision: 10, scale: 7, nullable: true })
  currentLongitude: number;

  @Column({ name: 'last_gps_update', type: 'timestamp', nullable: true })
  lastGpsUpdate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}