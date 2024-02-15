import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChannelService } from './channel.service';
import { GetUser } from 'src/auth/get-user.decorator';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';
import { Prisma } from '@prisma/client';

@Controller('channel')
@UseGuards(AuthGuard())
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Post('/create')
  async createChannel(
    @Body() channel: Prisma.ChannelCreateManyInput,
    @GetUser() user: AuthUserDto,
  ) {
    return this.channelService.createChannel(channel, user);
  }

  @Get('/mychannels')
  async getMyChannelLists(@GetUser() user: AuthUserDto) {
    return this.channelService.getMyChannelLists(user);
  }

  @Get('/:id')
  async getChannelDetail(
    @Param('id') id: string,
    @GetUser() user: AuthUserDto,
  ) {
    return this.channelService.getChannelDetail(id, user);
  }

  @Post('adduser')
  async addUser(@Body() data: { email: string; channelId: string }) {
    const { email, channelId } = data;
    return this.channelService.addMember(email, channelId);
  }
}
