import { Injectable, Logger } from '@nestjs/common';
import { AgentRuleCode } from '@common/enums/roles.enum';
import { AttendanceService } from '@modules/attendance/attendance.service';
import { TransportService } from '@modules/transport/transport.service';

export interface AgentAlert {
  ruleCode: AgentRuleCode;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  studentId?: string;
  tripId?: string;
  busId?: string;
  metadata?: Record<string, any>;
  triggeredAt: Date;
}

@Injectable()
export class AgentService {
  private readonly logger = new Logger(AgentService.name);

  constructor(
    private attendanceService: AttendanceService,
    private transportService: TransportService,
  ) {}

  // RULE-01: Student not boarded bus within 10 min of scheduled departure
  async checkMissingBoarding(tripId: string, studentId: string): Promise<AgentAlert | null> {
    const hasBoarded = await this.attendanceService.hasStudentBoardedToday(studentId, tripId);
    if (!hasBoarded) {
      this.logger.warn(`RULE-01: Student ${studentId} has not boarded trip ${tripId}`);
      return {
        ruleCode: AgentRuleCode.RULE_01_MISSING_BOARDING,
        severity: 'high',
        title: 'Student Not Boarded',
        message: `Student has not boarded the bus for scheduled trip`,
        studentId,
        tripId,
        triggeredAt: new Date(),
      };
    }
    return null;
  }

  // RULE-02: Trip started late (> 15 min after scheduled time)
  async checkLateArrival(tripId: string): Promise<AgentAlert | null> {
    const trip = await this.transportService.findTripById(tripId);
    if (trip.scheduledStartTime && trip.actualStartTime) {
      const scheduledParts = trip.scheduledStartTime.split(':');
      const scheduled = new Date(trip.tripDate);
      scheduled.setHours(+scheduledParts[0], +scheduledParts[1]);
      const diffMinutes = (trip.actualStartTime.getTime() - scheduled.getTime()) / 60000;
      if (diffMinutes > 15) {
        return {
          ruleCode: AgentRuleCode.RULE_02_LATE_ARRIVAL,
          severity: 'medium',
          title: 'Trip Started Late',
          message: `Trip started ${Math.round(diffMinutes)} minutes after scheduled time`,
          tripId,
          triggeredAt: new Date(),
          metadata: { delayMinutes: Math.round(diffMinutes) },
        };
      }
    }
    return null;
  }

  // RULE-03: Bus GPS signal lost (> 5 min no update during active trip)
  async checkGpsLost(busId: string): Promise<AgentAlert | null> {
    const bus = await this.transportService.findBusById(busId);
    if (bus.lastGpsUpdate) {
      const diffMinutes = (Date.now() - bus.lastGpsUpdate.getTime()) / 60000;
      if (diffMinutes > 5) {
        return {
          ruleCode: AgentRuleCode.RULE_05_GPS_LOST,
          severity: 'critical',
          title: 'GPS Signal Lost',
          message: `Bus GPS signal has been lost for ${Math.round(diffMinutes)} minutes`,
          busId,
          triggeredAt: new Date(),
          metadata: { lastUpdateMinutesAgo: Math.round(diffMinutes) },
        };
      }
    }
    return null;
  }

  // RULE-04: Student not picked up at home stop
  async checkStudentNotPickedUp(tripId: string, studentId: string): Promise<AgentAlert | null> {
    const hasBoarded = await this.attendanceService.hasStudentBoardedToday(studentId, tripId);
    if (!hasBoarded) {
      return {
        ruleCode: AgentRuleCode.RULE_06_STUDENT_NOT_PICKED,
        severity: 'high',
        title: 'Student Not Picked Up',
        message: `Student was not picked up at their scheduled stop`,
        studentId,
        tripId,
        triggeredAt: new Date(),
      };
    }
    return null;
  }

  // RULE-08: Trip timeout - trip running > 3 hours
  async checkTripTimeout(tripId: string): Promise<AgentAlert | null> {
    const trip = await this.transportService.findTripById(tripId);
    if (trip.actualStartTime && !trip.actualEndTime) {
      const diffHours = (Date.now() - trip.actualStartTime.getTime()) / 3600000;
      if (diffHours > 3) {
        return {
          ruleCode: AgentRuleCode.RULE_08_TRIP_TIMEOUT,
          severity: 'critical',
          title: 'Trip Timeout',
          message: `Trip has been running for ${diffHours.toFixed(1)} hours without completion`,
          tripId,
          triggeredAt: new Date(),
          metadata: { runningHours: diffHours.toFixed(1) },
        };
      }
    }
    return null;
  }

  // Run all rules for a trip
  async evaluateAllRules(tripId: string): Promise<AgentAlert[]> {
    const alerts: AgentAlert[] = [];
    const trip = await this.transportService.findTripById(tripId);

    const gpsAlert = await this.checkGpsLost(trip.busId);
    if (gpsAlert) alerts.push(gpsAlert);

    const timeoutAlert = await this.checkTripTimeout(tripId);
    if (timeoutAlert) alerts.push(timeoutAlert);

    const lateAlert = await this.checkLateArrival(tripId);
    if (lateAlert) alerts.push(lateAlert);

    this.logger.log(`Agent evaluated ${alerts.length} alerts for trip ${tripId}`);
    return alerts;
  }
}