export enum Role {
  ADMIN = 'admin',
  SUPERVISOR = 'supervisor',
  DRIVER = 'driver',
  PARENT = 'parent',
  GATE_AGENT = 'gate_agent',
}

export enum StudentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export enum TripStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum AttendanceEventType {
  BOARDED_BUS = 'boarded_bus',
  ALIGHTED_BUS = 'alighted_bus',
  ENTERED_SCHOOL = 'entered_school',
  LEFT_SCHOOL = 'left_school',
  ABSENT = 'absent',
  LATE = 'late',
}

export enum NotificationChannel {
  PUSH = 'push',
  EMAIL = 'email',
  SMS = 'sms',
}

export enum AgentRuleCode {
  RULE_01_MISSING_BOARDING = 'RULE_01',
  RULE_02_LATE_ARRIVAL = 'RULE_02',
  RULE_03_UNSCHEDULED_STOP = 'RULE_03',
  RULE_04_ABSENT_NO_NOTICE = 'RULE_04',
  RULE_05_GPS_LOST = 'RULE_05',
  RULE_06_STUDENT_NOT_PICKED = 'RULE_06',
  RULE_07_OVERCAPACITY = 'RULE_07',
  RULE_08_TRIP_TIMEOUT = 'RULE_08',
}