import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { AttendanceModule } from '@modules/attendance/attendance.module';
import { TransportModule } from '@modules/transport/transport.module';

@Module({
  imports: [AttendanceModule, TransportModule],
  controllers: [AgentController],
  providers: [AgentService],
  exports: [AgentService],
})
export class AgentModule {}