import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import multer from 'multer';
import { ValidationPipe } from '@nestjs/common';
import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipes
  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS
  app.use(
    cors({
      origin: 'http://localhost:3000', // Allow requests from the frontend origin
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    }),
  );

  // Configure Multer middleware for file handling
  app.use(
    multer({
      storage: multer.memoryStorage(), // Store files in memory
      limits: { fileSize: 10 * 1024 * 1024 }, // Set file size limit (10 MB)
    }).single('file'),
  );

  // Start listening on port 5000
  await app.listen(5000);
}

bootstrap();
