import { Controller, Put,Post, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly firebaseService: FirebaseService) {}

  // Route for file upload
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('idToken') idToken: string
  ) {
    const user = await this.firebaseService.verifyIdToken(idToken);
    const fileUrl = await this.firebaseService.uploadFile(file, user.uid);
    return { url: fileUrl };
  }

  // Route to get user profile
  @Post('profile')
  async getUserProfile(@Body('idToken') idToken: string) {
    try {
      // Verify the ID Token
      const user = await this.firebaseService.verifyIdToken(idToken);
      // Get user profile
      const profile = await this.firebaseService.getUserProfileByUsername(user.email.split('@')[0]);
      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);  // Log any errors that occur
      throw new Error('Unable to retrieve user profile');
    }
  }

  // Route to update user profile
  @Put('update-profile')
  async updateUserProfile(
    @Body('idToken') idToken: string,
    @Body() updateData: any
  ) {
    const user = await this.firebaseService.verifyIdToken(idToken);
    console.log(user);
    await this.firebaseService.updateUserProfile(user.email.split("@")[0] , updateData);
    return { message: 'Profile updated successfully' };
  }
}
