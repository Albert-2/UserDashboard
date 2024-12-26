import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import * as serviceAccount from "../config/serviceAccountKey.json"
import { getFirestore, doc, getDoc,updateDoc } from 'firebase/firestore';
import { FirebaseApp, initializeApp } from 'firebase/app';
import * as firebase from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private db: firebase.firestore.Firestore;

  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: serviceAccount.project_id,
          privateKey: serviceAccount.private_key.replace(/\\n/g, '\n'), 
          clientEmail: serviceAccount.client_email,
        }),
        storageBucket: serviceAccount.storageBucket, 
      });
    }
    this.db = firebase.firestore();
  }

  // Authentication: Verify ID Token
  async verifyIdToken(idToken: string) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      console.error('Error verifying ID token:', error);
      throw new Error('Unauthorized');
    }
  }

  // Firebase Storage: Upload File
  async uploadFile(file: Express.Multer.File, userId: string) {
    const bucket = admin.storage().bucket();
    const fileUpload = bucket.file(`${userId}/${file.originalname}`);

    return new Promise((resolve, reject) => {
      const writeStream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      writeStream.on('error', (err) => reject(err));
      writeStream.on('finish', () => {
        fileUpload
          .makePublic()
          .then(() => resolve(fileUpload.publicUrl()))
          .catch(reject);
      });

      writeStream.end(file.buffer);
    });
  }

  // Firestore: Update User Profile
  async updateUserProfile(username: string, updateData: any) {
  try {
    const userRef = admin.firestore().collection('users').doc(username);
    await userRef.update(updateData.updateData);
    console.log(`User profile updated for ${username}`);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Update failed');
  }
}


  // Firestore: Get User Profile
  async getUserProfileByUsername(username: string) {
    const userDocRef = this.db.collection('users').doc(username);
    const docSnapshot = await userDocRef.get();

    if (docSnapshot.exists) {
      return docSnapshot.data();
    } else {
      throw new Error('User not found');
    }
  }
}
