// import { Injectable } from '@nestjs/common';
// import { Prisma, User } from '@prisma/client';
// import { PrismaService } from 'src/prisma/prisma.service';

// @Injectable()
// export class AuthRepository {
//   constructor(private prisma: PrismaService) {}

//   async createUser(data: Prisma.UserCreateInput) {
//     await this.prisma.user.create({ data });
//   }

//   async findUser(email: string): Promise<User> {
//     return await this.prisma.user.findUnique({ where: { email } });
//   }
// }
