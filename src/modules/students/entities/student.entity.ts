import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from '@modules/users/entities/user.entity';
import { StudentStatus } from '@common/enums/roles.enum';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'student_id_number', unique: true })
  studentIdNumber: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'grade_level' })
  gradeLevel: string;

  @Column({ name: 'section', nullable: true })
  section: string;

  @Column({ name: 'school_name' })
  schoolName: string;

  @Column({
    type: 'enum',
    enum: StudentStatus,
    default: StudentStatus.ACTIVE,
  })
  status: StudentStatus;

  @Column({ name: 'photo_url', nullable: true })
  photoUrl: string;

  @Column({ name: 'qr_code', nullable: true })
  qrCode: string;

  @Column({ name: 'rfid_tag', nullable: true })
  rfidTag: string;

  @Column({ name: 'home_address', nullable: true })
  homeAddress: string;

  @Column({ name: 'home_latitude', type: 'decimal', precision: 10, scale: 7, nullable: true })
  homeLatitude: number;

  @Column({ name: 'home_longitude', type: 'decimal', precision: 10, scale: 7, nullable: true })
  homeLongitude: number;

  // Parent user FK
  @Column({ name: 'parent_id' })
  parentId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'parent_id' })
  parent: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}