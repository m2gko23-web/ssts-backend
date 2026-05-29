import { Module } from '@nestjs/common';

// Events module - Real-time WebSocket events (Socket.io)
// MVP-2: Will handle live GPS events, trip updates, alerts broadcasting
@Module({
  providers: [],
  exports: [],
})
export class EventsModule {}