import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import multer from 'multer';
import { ValidationPipe } from '@nestjs/common';
// import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipes
  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS for all origins and all methods
  app.enableCors({ 
    origin: true, 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // app.use(
  //   multer({
  //     storage: multer.memoryStorage(),
  //     limits: { fileSize: 10 * 1024 * 1024 },
  //   }).single('file'),
  // );

  await app.listen(5000);
}

bootstrap();
