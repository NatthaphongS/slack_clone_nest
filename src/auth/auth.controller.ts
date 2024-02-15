import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { AuthUserDto } from './dto/auth-user.dto';
import { GetUser } from './get-user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/me')
  @UseGuards(AuthGuard())
  getMe(@GetUser() user: AuthUserDto): AuthUserDto {
    // console.log('user', user);
    return user;
  }

  @Post('/register')
  register(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.register(authCredentialsDto);
  }
  @Post('/login')
  login(@Body() userSignInInput: { email: string; password: string }): Promise<{
    accessToken: string;
    user: AuthUserDto;
  }> {
    return this.authService.login(userSignInInput);
  }
}
