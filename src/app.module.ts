import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ChannelModule } from './channel/channel.module';
import { ChatGateway } from './chat.gateway';
import { ChatroomModule } from './chatroom/chatroom.module';

@Module({
  imports: [AuthModule, PrismaModule, ChannelModule, ChatGateway, ChatroomModule],
})
export class AppModule {}
