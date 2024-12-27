import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FirebaseService {
  private db: admin.firestore.Firestore;

  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.PROJECT_ID,
          privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.CLIENT_EMAIL,
        }),
        storageBucket: process.env.STORAGE_BUCKET,
      });
    }
    this.db = admin.firestore();
  }

  // Authentication: Verify ID Token
  async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      console.error('Error verifying ID token:', error);
      throw new Error('Unauthorized');
    }
  }

  // Firebase Storage: Upload File
  async uploadFile(file: Express.Multer.File, userId: string): Promise<string> {
    const bucket = admin.storage().bucket();
    const fileUpload = bucket.file(`${userId}/${file.originalname}`);

    return new Promise((resolve, reject) => {
      const writeStream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      writeStream.on('error', (err) => reject(err));
      writeStream.on('finish', async () => {
        try {
          await fileUpload.makePublic();
          resolve(fileUpload.publicUrl());
        } catch (err) {
          reject(err);
        }
      });

      writeStream.end(file.buffer);
    });
  }

  // Firestore: Update User Profile
  async updateUserProfileByEmail(email: string, details: any) {
    try {
      const querySnapshot = await this.db
        .collection('users')
        .where('email', '==', email)
        .get();

      if (!querySnapshot.empty) {
        const userRef = querySnapshot.docs[0].ref;
        await userRef.update({ firstname: details.updateData.firstname, lastname: details.updateData.lastname, about: details.updateData.about, updatedAt: new Date().toISOString() });
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error updating user profile by email:', error);
      throw new Error('Unable to update user profile');
    }
  }

  // FirebaseService: Get User Profile by Email
  async getUserProfileByEmail(email: string) {
    try {
      const userSnapshot = await this.db
        .collection('users')
        .where('email', '==', email)
        .limit(1)
        .get();

      if (userSnapshot.empty) {
        throw new Error('User not found');
      }

      // Assuming there's only one user with the given email, return the first document
      const userDoc = userSnapshot.docs[0];

      // Return all user data
      return userDoc.data();
    } catch (error) {
      console.error('Error fetching user profile by email:', error);
      throw new Error('Unable to fetch user profile');
    }
  }
}
