import { Module } from '@nestjs/common';
import { ChatroomController } from './chatroom.controller';
import { ChatroomService } from './chatroom.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ChatroomController],
  providers: [ChatroomService],
  imports: [AuthModule],
})
export class ChatroomModule {}
