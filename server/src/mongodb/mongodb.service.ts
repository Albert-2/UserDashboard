import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { MongoClient, Db, GridFSBucket, ObjectId } from 'mongodb';

@Injectable()
export class MongoDBService implements OnModuleInit, OnModuleDestroy {
  private client: MongoClient;
  private db: Db;
  private bucket: GridFSBucket;

  async onModuleInit() {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    // Connect to MongoDB
    this.client = new MongoClient(uri);
    await this.client.connect();
    this.db = this.client.db();
    console.log('Connected to MongoDB');

    this.bucket = new GridFSBucket(this.db, {
      bucketName: 'files',
    });
  }

  getBucket(): GridFSBucket {
    if (!this.bucket) {
      throw new Error('GridFS bucket is not initialized');
    }
    return this.bucket;
  }

  getDatabase(): Db {
    return this.db;
  }

  async onModuleDestroy() {
    await this.client.close();
    console.log('Disconnected from MongoDB');
  }

  // Method to save file metadata (username, fileId, etc.)
  async saveFileMetadata(username: string, fileId: ObjectId, fileName: string) {
    const metadata = {
      username,
      fileId,
      fileName,
      uploadDate: new Date(),
    };

    const collection = this.db.collection('file_metadata');
    await collection.insertOne(metadata);
  }

  // Method to fetch file metadata by username
  async getFileMetadataByUsername(username: string) {
    const collection = this.db.collection('file_metadata');
    const fileMetadata = await collection.findOne({ username });
    return fileMetadata;
  }

  // Method to delete file metadata by username
  async deleteFileMetadata(username: string): Promise<void> {
    const collection = this.db.collection('file_metadata');
    await collection.deleteOne({ 'username': username });
  }
}
