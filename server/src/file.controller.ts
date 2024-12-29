import { Controller, Post, Body, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MongoDBService } from './mongodb/mongodb.service';
import { GridFSBucketWriteStream } from 'mongodb';
import { Response } from 'express';

@Controller('files')
export class FileController {
  constructor(private readonly mongoDBService: MongoDBService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body: { username: string }) {
    const bucket = this.mongoDBService.getBucket();

    if (!bucket) {
      console.error('Error: GridFS bucket is not available');
      throw new Error('GridFS bucket is not available');
    }

    // Check if the user already has a file
    const existingMetadata = await this.mongoDBService.getFileMetadataByUsername(body.username);

    if (existingMetadata) {
      try {
        await bucket.delete(existingMetadata.fileId);
        await this.mongoDBService.deleteFileMetadata(body.username);
      } catch (err) {
        console.error('Error deleting old file:', err);
        throw new Error('Failed to delete existing file');
      }
    }

    // Upload the new file
    const uploadStream: GridFSBucketWriteStream = bucket.openUploadStream(file.originalname);

    uploadStream.on('finish', () => {
      // Save the new file's metadata
      this.mongoDBService.saveFileMetadata(body.username, uploadStream.id, file.originalname);
    });

    uploadStream.on('error', (err) => {
      console.error('Error uploading file:', err);
    });

    uploadStream.end(file.buffer);

    return {
      message: 'File uploaded successfully',
      fileId: uploadStream.id.toString(),
      fileName: file.originalname,
    };
  }


  // Route to fetch file metadata for a user (username)
  @Post('metadata')
  async getFileMetadata(@Body() body: { username: string }) {
    const metadata = await this.mongoDBService.getFileMetadataByUsername(body.username);
    return metadata || { message: 'No file metadata found for this user' + body.username };
  }

  // Route to download the file based on username
  @Post('download')
  async downloadFile(@Body() body: { username: string }, @Res() res: Response) {
    const { username } = body;

    if (!username) {
      return res.status(400).send({ message: 'Username is required' });
    }

    const fileMetadata = await this.mongoDBService.getFileMetadataByUsername(username);

    if (!fileMetadata || !fileMetadata.fileId) {
      return res.status(404).send({ message: `No file found for user: ${username}` });
    }

    const fileId = fileMetadata.fileId;

    try {
      const bucket = this.mongoDBService.getBucket();

      const downloadStream = bucket.openDownloadStream(fileId);

      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${fileMetadata.fileName}"`);

      downloadStream.pipe(res);

      downloadStream.on('error', (err) => {
        console.error('Error downloading file:', err);
        res.status(500).send({ message: 'Error downloading file' });
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      res.status(500).send({ message: 'Error downloading file' });
    }
  }
}