import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  console.log('AI_SERVICE_URL:', process.env.AI_SERVICE_URL);
  console.log('DATABASE_URL existe:', !!process.env.DATABASE_URL);
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
      origin: ['http://localhost:8080', 'https://nutrisnap-sigma.vercel.app'],
  });
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
