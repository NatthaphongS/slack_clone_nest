import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUserDto } from './dto/auth-user.dto';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): AuthUserDto => {
    const req = ctx.switchToHttp().getRequest();
    delete req.user.password;
    return req.user;
  },
);
