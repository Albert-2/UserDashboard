import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { FirebaseService } from './firebase/firebase.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import {ConfigModule} from  '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  })],
  controllers: [AuthController],
  providers: [FirebaseService, JwtAuthGuard],
})
export class AppModule {}
