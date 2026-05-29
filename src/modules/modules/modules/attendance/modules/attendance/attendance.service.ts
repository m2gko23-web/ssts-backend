import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AttendanceEvent } from './entities/attendance-event.entity';
import { AttendanceEventType } from '@common/enums/roles.enum';

export class RecordEventDto {
  studentId: string;
  eventType: AttendanceEventType;
  tripId?: string;
  recordedById?: string;
  latitude?: number;
  longitude?: number;
  scanMethod?: string; // 'qr' | 'rfid' | 'manual' | 'face'
  notes?: string;
}

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendanceEvent)
    private eventRepository: Repository<AttendanceEvent>,
  ) {}

  // EVT-01: Student boards the bus
  async recordBoardedBus(dto: RecordEventDto): Promise<AttendanceEvent> {
    return this.recordEvent({ ...dto, eventType: AttendanceEventType.BOARDED_BUS });
  }

  // EVT-02: Student alights from bus
  async recordAlightedBus(dto: RecordEventDto): Promise<AttendanceEvent> {
    return this.recordEvent({ ...dto, eventType: AttendanceEventType.ALIGHTED_BUS });
  }

  // EVT-03: Student enters school gate
  async recordEnteredSchool(dto: RecordEventDto): Promise<AttendanceEvent> {
    return this.recordEvent({ ...dto, eventType: AttendanceEventType.ENTERED_SCHOOL });
  }

  // EVT-04: Student leaves school
  async recordLeftSchool(dto: RecordEventDto): Promise<AttendanceEvent> {
    return this.recordEvent({ ...dto, eventType: AttendanceEventType.LEFT_SCHOOL });
  }

  // EVT-05: Mark student as absent
  async recordAbsent(dto: RecordEventDto): Promise<AttendanceEvent> {
    return this.recordEvent({ ...dto, eventType: AttendanceEventType.ABSENT });
  }

  // EVT-06: Mark student as late
  async recordLate(dto: RecordEventDto): Promise<AttendanceEvent> {
    return this.recordEvent({ ...dto, eventType: AttendanceEventType.LATE });
  }

  // Generic event recorder
  async recordEvent(dto: RecordEventDto): Promise<AttendanceEvent> {
    const event = this.eventRepository.create(dto);
    return this.eventRepository.save(event);
  }

  // Get today's events for a student
  async getStudentEvents(studentId: string, date?: string): Promise<AttendanceEvent[]> {
    const today = date ? new Date(date) : new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(23, 59, 59, 999));
    return this.eventRepository.find({
      where: {
        studentId,
        occurredAt: Between(start, end),
      },
      order: { occurredAt: 'ASC' },
      relations: ['student'],
    });
  }

  // Get all events for a trip
  async getTripEvents(tripId: string): Promise<AttendanceEvent[]> {
    return this.eventRepository.find({
      where: { tripId },
      order: { occurredAt: 'ASC' },
      relations: ['student'],
    });
  }

  // Get today's attendance summary by trip
  async getTripAttendanceSummary(tripId: string) {
    const events = await this.getTripEvents(tripId);
    const boardedStudentIds = new Set(
      events
        .filter(e => e.eventType === AttendanceEventType.BOARDED_BUS)
        .map(e => e.studentId),
    );
    const alightedStudentIds = new Set(
      events
        .filter(e => e.eventType === AttendanceEventType.ALIGHTED_BUS)
        .map(e => e.studentId),
    );
    return {
      tripId,
      totalBoarded: boardedStudentIds.size,
      totalAlighted: alightedStudentIds.size,
      stillOnBoard: boardedStudentIds.size - alightedStudentIds.size,
      events,
    };
  }

  // Check if student has boarded today
  async hasStudentBoardedToday(studentId: string, tripId: string): Promise<boolean> {
    const event = await this.eventRepository.findOne({
      where: { studentId, tripId, eventType: AttendanceEventType.BOARDED_BUS },
    });
    return !!event;
  }
}