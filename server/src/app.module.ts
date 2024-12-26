import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { FirebaseService } from './firebase/firebase.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import {ConfigModule} from  '@nestjs/config';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  })],
  controllers: [AppController,AuthController],
  providers: [AppService, FirebaseService, JwtAuthGuard],
})
export class AppModule {}
