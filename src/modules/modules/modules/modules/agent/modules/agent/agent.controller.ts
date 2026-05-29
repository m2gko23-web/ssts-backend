import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AgentService } from './agent.service';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { Role } from '@common/enums/roles.enum';

@ApiTags('Agent')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Get('evaluate/trip/:tripId')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiOperation({ summary: 'Evaluate all agent rules for a trip' })
  evaluateTrip(@Param('tripId') tripId: string) {
    return this.agentService.evaluateAllRules(tripId);
  }

  @Get('check/boarding/:tripId/:studentId')
  @Roles(Role.ADMIN, Role.SUPERVISOR, Role.DRIVER)
  @ApiOperation({ summary: 'RULE-01: Check if student has boarded' })
  checkBoarding(
    @Param('tripId') tripId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.agentService.checkMissingBoarding(tripId, studentId);
  }

  @Get('check/gps/:busId')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiOperation({ summary: 'RULE-05: Check bus GPS signal status' })
  checkGps(@Param('busId') busId: string) {
    return this.agentService.checkGpsLost(busId);
  }

  @Get('check/timeout/:tripId')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiOperation({ summary: 'RULE-08: Check trip timeout' })
  checkTimeout(@Param('tripId') tripId: string) {
    return this.agentService.checkTripTimeout(tripId);
  }
}