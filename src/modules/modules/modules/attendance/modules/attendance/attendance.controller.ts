import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AttendanceService, RecordEventDto } from './attendance.service';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { CurrentUser } from '@common/decorators/roles.decorator';
import { Role } from '@common/enums/roles.enum';

@ApiTags('Attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // EVT-01: Board bus
  @Post('board')
  @Roles(Role.DRIVER, Role.SUPERVISOR)
  @ApiOperation({ summary: 'EVT-01: Record student boarded bus' })
  boardBus(@Body() dto: RecordEventDto, @CurrentUser('sub') userId: string) {
    return this.attendanceService.recordBoardedBus({ ...dto, recordedById: userId });
  }

  // EVT-02: Alight bus
  @Post('alight')
  @Roles(Role.DRIVER, Role.SUPERVISOR)
  @ApiOperation({ summary: 'EVT-02: Record student alighted bus' })
  alightBus(@Body() dto: RecordEventDto, @CurrentUser('sub') userId: string) {
    return this.attendanceService.recordAlightedBus({ ...dto, recordedById: userId });
  }

  // EVT-03: Enter school
  @Post('enter-school')
  @Roles(Role.GATE_AGENT, Role.SUPERVISOR)
  @ApiOperation({ summary: 'EVT-03: Record student entered school gate' })
  enterSchool(@Body() dto: RecordEventDto, @CurrentUser('sub') userId: string) {
    return this.attendanceService.recordEnteredSchool({ ...dto, recordedById: userId });
  }

  // EVT-04: Leave school
  @Post('leave-school')
  @Roles(Role.GATE_AGENT, Role.SUPERVISOR)
  @ApiOperation({ summary: 'EVT-04: Record student left school' })
  leaveSchool(@Body() dto: RecordEventDto, @CurrentUser('sub') userId: string) {
    return this.attendanceService.recordLeftSchool({ ...dto, recordedById: userId });
  }

  // EVT-05: Absent
  @Post('absent')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiOperation({ summary: 'EVT-05: Mark student as absent' })
  markAbsent(@Body() dto: RecordEventDto, @CurrentUser('sub') userId: string) {
    return this.attendanceService.recordAbsent({ ...dto, recordedById: userId });
  }

  // EVT-06: Late
  @Post('late')
  @Roles(Role.ADMIN, Role.SUPERVISOR, Role.GATE_AGENT)
  @ApiOperation({ summary: 'EVT-06: Mark student as late' })
  markLate(@Body() dto: RecordEventDto, @CurrentUser('sub') userId: string) {
    return this.attendanceService.recordLate({ ...dto, recordedById: userId });
  }

  // Get student events
  @Get('student/:id')
  @Roles(Role.ADMIN, Role.SUPERVISOR, Role.PARENT, Role.DRIVER)
  @ApiOperation({ summary: 'Get attendance events for a student' })
  @ApiQuery({ name: 'date', required: false })
  getStudentEvents(@Param('id') id: string, @Query('date') date?: string) {
    return this.attendanceService.getStudentEvents(id, date);
  }

  // Get trip events
  @Get('trip/:tripId')
  @Roles(Role.ADMIN, Role.SUPERVISOR, Role.DRIVER)
  @ApiOperation({ summary: 'Get all attendance events for a trip' })
  getTripEvents(@Param('tripId') tripId: string) {
    return this.attendanceService.getTripEvents(tripId);
  }

  // Trip attendance summary
  @Get('trip/:tripId/summary')
  @Roles(Role.ADMIN, Role.SUPERVISOR, Role.DRIVER)
  @ApiOperation({ summary: 'Get attendance summary for a trip (boarded/alighted/on-board)' })
  getTripSummary(@Param('tripId') tripId: string) {
    return this.attendanceService.getTripAttendanceSummary(tripId);
  }
}