import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173', // Adjust this to match your client's URL for security
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;
  // create server

  constructor(private prisma: PrismaService) {}

  handleConnection(client: Socket) {
    // console.log(client);
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('join', roomId);
    const room = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
    });
    if (room) {
      // console.log('join process');
      client.join(room.id);
      this.server.to(room.id).emit('joinedRoom', room.id);
      // console.log('join emit success');
    }
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(room);
    client.emit('leftRoom', room);
    this.server.to(room).emit('userLeft', { userId: client.id, roomId: room });
    console.log('leave room', room);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    data: {
      chatRoomId: string;
      message: string;
      userId: string;
    },
  ) {
    const message = await this.prisma.message.create({
      data: {
        content: data.message,
        chatRoomId: data.chatRoomId,
        authorId: data.userId,
      },
    });
    this.server.to(data.chatRoomId).emit('newMessage', message);
  }
}
