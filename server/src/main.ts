import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as multer from 'multer';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipes
  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS for specific origins (loaded from environment variable)
  const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS?.split(',') || [];
  app.enableCors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true, // Default to true if no specific origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Custom middleware for handling OPTIONS requests if needed
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.header('Access-Control-Allow-Credentials', 'true');
      return res.sendStatus(200); // Allow preflight request to pass
    }
    next();
  });

  // Setup file upload middleware with Multer (limits file size to 10MB)
  app.use(
    multer({
      storage: multer.memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }).single('file'),
  );

  // Log incoming requests (can be expanded for more logging)
  app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.originalUrl}`);
    next();
  });

  await app.listen(5000);
  console.log('Server running on http://localhost:5000');
}

bootstrap();
