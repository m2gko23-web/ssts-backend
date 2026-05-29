import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { StudentStatus } from '@common/enums/roles.enum';

export class CreateStudentDto {
  studentIdNumber: string;
  fullName: string;
  gradeLevel: string;
  section?: string;
  schoolName: string;
  parentId: string;
  photoUrl?: string;
  homeAddress?: string;
  homeLatitude?: number;
  homeLongitude?: number;
}

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
  ) {}

  async create(dto: CreateStudentDto): Promise<Student> {
    const student = this.studentsRepository.create(dto);
    return this.studentsRepository.save(student);
  }

  async findAll(parentId?: string): Promise<Student[]> {
    const where: any = {};
    if (parentId) where.parentId = parentId;
    return this.studentsRepository.find({
      where,
      relations: ['parent'],
      order: { fullName: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentsRepository.findOne({
      where: { id },
      relations: ['parent'],
    });
    if (!student) throw new NotFoundException(`Student ${id} not found`);
    return student;
  }

  async findByQrCode(qrCode: string): Promise<Student> {
    const student = await this.studentsRepository.findOne({ where: { qrCode } });
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async findByRfid(rfidTag: string): Promise<Student> {
    const student = await this.studentsRepository.findOne({ where: { rfidTag } });
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async update(id: string, dto: Partial<CreateStudentDto>): Promise<Student> {
    const student = await this.findOne(id);
    Object.assign(student, dto);
    return this.studentsRepository.save(student);
  }

  async updateStatus(id: string, status: StudentStatus): Promise<Student> {
    const student = await this.findOne(id);
    student.status = status;
    return this.studentsRepository.save(student);
  }

  async remove(id: string): Promise<void> {
    const student = await this.findOne(id);
    await this.studentsRepository.remove(student);
  }
}