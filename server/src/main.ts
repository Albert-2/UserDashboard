import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import multer from 'multer';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.use(
    multer({
      storage: multer.memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }).single('file'),
  );

  await app.listen(5000);
}
bootstrap();
