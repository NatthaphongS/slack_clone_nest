require('dotenv').config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  // whenever an emcounters any of those validation decorators, it will know to execute validation pipe save us from a lot of code at the controller level
  const port = 3000;
  await app.listen(port);
}
bootstrap();
