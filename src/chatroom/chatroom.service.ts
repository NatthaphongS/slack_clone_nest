import { Injectable } from '@nestjs/common';
import { userSelect } from 'src/channel/channel.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatroomService {
  constructor(private prisma: PrismaService) {}

  async createRoom(name: string, channelId: string) {
    const newRoom = await this.prisma.chatRoom.create({
      data: { name, channelId },
    });
    return newRoom;
  }

  async getChatRoomDetail(chatRoomId: string) {
    const chatRoomDetail = await this.prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
      include: { messages: { include: { author: { select: userSelect } } } },
    });
    const chatRoomMessage = await this.prisma.message.findMany({
      where: { chatRoomId },
      orderBy: { createdAt: 'asc' },
      include: { author: { select: userSelect } },
    });
    chatRoomDetail.messages = chatRoomMessage;
    console.log(chatRoomDetail);
    return chatRoomDetail;
  }
}
