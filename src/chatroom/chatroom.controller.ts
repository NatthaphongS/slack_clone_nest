import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatroomService } from './chatroom.service';

@Controller('chatroom')
@UseGuards(AuthGuard())
export class ChatroomController {
  constructor(private chatRoomService: ChatroomService) {}

  @Post('/create')
  async createChatRoom(@Body() data: { name: string; channelId: string }) {
    return this.chatRoomService.createRoom(data.name, data.channelId);
  }

  @Get('/:chatRoomId')
  async getChatRoomDetail(@Param('chatRoomId') chatRoomId: string) {
    return this.chatRoomService.getChatRoomDetail(chatRoomId);
  }
}
