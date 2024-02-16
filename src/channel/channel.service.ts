import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { channel } from 'diagnostics_channel';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

const userSelect = {
  id: true,
  email: true,
  name: true,
  userProfile: true,
};

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  async getMyChannelLists(user: AuthUserDto) {
    const myChannelLists = await this.prisma.channelMember.findMany({
      where: { userId: user.id },
      select: {
        channel: { select: { id: true, name: true, createdAt: true } },
      },
    });
    myChannelLists.sort(
      (a, b) =>
        new Date(b.channel.createdAt).getTime() -
        new Date(a.channel.createdAt).getTime(),
    );
    return myChannelLists;
  }

  async getChannelDetail(id: string, user: AuthUserDto) {
    const channel = await this.prisma.channel.findUnique({
      where: { id },
      include: {
        chatRooms: {
          select: {
            id: true,
            name: true,
            createdAt: true,
          },
        },
        channelMembers: {
          select: {
            user: {
              select: userSelect,
            },
          },
        },
      },
    });
    const isMember = channel.channelMembers.find(
      (member) => member.user.id === user.id,
    );
    if (!isMember) {
      throw new NotFoundException('Not found this room');
    }
    const orderChatRoom = await this.prisma.chatRoom.findMany({
      where: { channelId: id },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });
    channel.chatRooms = orderChatRoom;
    return channel;
  }

  async createChannel(
    channel: Prisma.ChannelCreateManyInput,
    user: AuthUserDto,
  ) {
    try {
      const channelCreated = await this.prisma.channel.create({
        data: {
          name: channel.name,
          channelMembers: {
            create: {
              userId: user.id,
            },
          },
          chatRooms: {
            create: {
              name: 'general',
            },
          },
        },
        include: {
          chatRooms: {
            select: {
              id: true,
              name: true,
            },
          },
          channelMembers: {
            select: {
              user: {
                select: userSelect,
              },
            },
          },
        },
      });
      return channelCreated;
    } catch (error) {
      console.log(error);
    }
  }

  async addMember(userEmail: string, channelId: string) {
    const findUser = await this.prisma.user.findUnique({
      where: { email: userEmail },
    });
    if (!findUser) {
      throw new NotFoundException(`Not found user with email : ${userEmail}`);
    }
    const membersInChannel = await this.prisma.channelMember.findFirst({
      where: { userId: findUser.id, channelId },
    });
    if (membersInChannel) {
      throw new ConflictException(`This user already join in this channel`);
    }
    const newMember = await this.prisma.channelMember.create({
      data: { userId: findUser.id, channelId },
      include: { user: { select: userSelect } },
    });
    console.log(newMember);
    return newMember;
  }
}
