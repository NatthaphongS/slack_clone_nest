import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { email, password } = authCredentialsDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    authCredentialsDto.password = hashedPassword;
    try {
      await this.prisma.user.create({ data: authCredentialsDto });
    } catch (error) {
      console.log(error);
      if (error.code === 'P2002') {
        throw new ConflictException('Email is already taken');
      }
    }
  }

  async login(userSignInInput: {
    email: string;
    password: string;
  }): Promise<{ accessToken: string }> {
    const { email, password } = userSignInInput;
    const user = await this.prisma.user.findUnique({ where: { email } });
    // console.log(user);
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
