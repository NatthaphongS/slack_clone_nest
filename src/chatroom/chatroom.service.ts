import { Injectable } from '@nestjs/common';
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
      include: { messages: true },
    });
    const chatRoomMessage = await this.prisma.message.findMany({
      where: { chatRoomId },
      orderBy: { createdAt: 'asc' },
    });
    chatRoomDetail.messages = chatRoomMessage;
    console.log(chatRoomDetail);
    return chatRoomDetail;
  }
}
