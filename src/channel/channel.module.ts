import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ChannelController],
  providers: [ChannelService],
  imports: [AuthModule],
})
export class ChannelModule {}
