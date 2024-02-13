import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credential.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/register')
  register(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.register(authCredentialsDto);
  }
  @Post('/login')
  login(
    @Body() userSignInInput: { email: string; password: string },
  ): Promise<{ accessToken: string }> {
    return this.authService.login(userSignInInput);
  }
}
