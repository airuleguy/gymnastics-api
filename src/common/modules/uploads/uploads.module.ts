import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { StorageService } from './storage.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { ConfigModule } from '@nestjs/config';
import { S3Config } from '../../../config/s3.config';

const UPLOAD_DIR = './uploads';

// Create uploads directory if it doesn't exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

@Module({
  imports: [
    ConfigModule,
    MulterModule.register({
      storage: diskStorage({
        destination: UPLOAD_DIR,
        filename: (req, file, callback) => {
          // Generate a unique filename using timestamp and original extension
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        // Allow only image files
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
      },
    }),
  ],
  providers: [UploadsService, StorageService, S3Config],
  exports: [UploadsService],
})
export class UploadsModule {} 