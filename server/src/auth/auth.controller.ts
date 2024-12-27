import {
  Controller,
  Put,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private readonly firebaseService: FirebaseService) { }

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
      const user = await this.firebaseService.verifyIdToken(idToken);
      const profile = await this.firebaseService.getUserProfileByEmail(user.email);
      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Unable to retrieve user profile');
    }
  }

  // Route to update user profile
  @Put('update-profile')
  async updateUserProfile(
    @Body('idToken') idToken: string,
    @Body() updateData: any
  ) {
    try {
      const user = await this.firebaseService.verifyIdToken(idToken);

      await this.firebaseService.updateUserProfileByEmail(user.email, updateData);

      const updatedProfile = await this.firebaseService.getUserProfileByEmail(
        user.email
      );

      return {
        message: 'Profile updated successfully',
        profile: updatedProfile,
      };
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Unable to update user profile');
    }
  }

}
