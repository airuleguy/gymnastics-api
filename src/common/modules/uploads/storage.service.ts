import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Config } from '../../../config/s3.config';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StorageService {
  private readonly s3Client: S3Client;
  private readonly uploadsDir = './uploads';
  private readonly baseUrl: string;
  private readonly s3BaseUrl: string;
  private readonly isLocalMode: boolean;

  constructor(
    private configService: ConfigService,
    private s3Config: S3Config,
  ) {
    // Create local uploads directory if it doesn't exist
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }

    this.isLocalMode = this.s3Config.localModeEnabled;
    this.baseUrl = this.configService.get<string>('API_BASE_URL', 'http://localhost:3001');
    this.s3BaseUrl = this.s3Config.baseUrl || `https://${this.s3Config.bucketName}.s3.${this.s3Config.region}.amazonaws.com`;

    console.log(`Storage mode: ${this.isLocalMode ? 'Local' : 'S3'}`);
    
    // Initialize S3 client only if not in local mode
    if (!this.isLocalMode) {
      this.s3Client = new S3Client({
        region: this.s3Config.region,
        credentials: {
          accessKeyId: this.s3Config.accessKeyId,
          secretAccessKey: this.s3Config.secretAccessKey,
        },
      });
    }
  }

  /**
   * Upload a file to either local storage or S3 bucket
   */
  async uploadFile(file: Express.Multer.File): Promise<string> {
    const filename = path.basename(file.path);
    
    if (this.isLocalMode) {
      // In local mode, file is already saved to disk by multer
      return this.getLocalFileUrl(filename);
    } else {
      // In S3 mode, we need to upload the file to S3
      const uploadParams = {
        Bucket: this.s3Config.bucketName,
        Key: filename,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read' as const, // Type assertion to the correct ACL type
      };

      try {
        console.log(`Uploading to S3 bucket: ${this.s3Config.bucketName}, key: ${filename}`);
        const upload = new Upload({
          client: this.s3Client,
          params: uploadParams,
        });

        await upload.done();
        const fileUrl = this.getS3FileUrl(filename);
        console.log('Successfully uploaded to S3, URL:', fileUrl);
        return fileUrl;
      } catch (error) {
        console.error('Error uploading to S3:', error);
        console.error('Error details:', {
          bucket: this.s3Config.bucketName,
          region: this.s3Config.region, 
          accessKeyIdPrefix: this.s3Config.accessKeyId ? this.s3Config.accessKeyId.substring(0, 4) + '...' : 'not set',
          secretKeySet: this.s3Config.secretAccessKey ? 'yes' : 'no'
        });
        throw error;
      }
    }
  }

  /**
   * Delete a file from either local storage or S3 bucket
   */
  async deleteFile(fileUrl: string): Promise<boolean> {
    if (!fileUrl) return false;
    
    try {
      const filename = this.getFilenameFromUrl(fileUrl);
      
      if (!filename) {
        console.error('Invalid file URL, unable to extract filename:', fileUrl);
        return false;
      }
      
      // Check if this URL is from S3 or local storage
      const isS3Url = this.isS3Url(fileUrl);
      
      // Use appropriate deletion method
      if (isS3Url && !this.isLocalMode) {
        // S3 URL and we're in S3 mode
        return this.deleteS3File(filename);
      } else {
        // Local URL or we're in local mode
        return this.deleteLocalFile(filename);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  /**
   * Get the filename from a file URL
   */
  private getFilenameFromUrl(fileUrl: string): string {
    return fileUrl.split('/').pop();
  }

  /**
   * Get the URL for a file stored locally
   */
  private getLocalFileUrl(filename: string): string {
    return `${this.baseUrl}/uploads/${filename}`;
  }

  /**
   * Get the URL for a file stored in S3
   */
  private getS3FileUrl(filename: string): string {
    return `${this.s3BaseUrl}/${filename}`;
  }

  /**
   * Delete a file from local storage
   */
  private deleteLocalFile(filename: string): boolean {
    try {
      const filepath = path.join(this.uploadsDir, filename);
      
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting local file:', error);
      return false;
    }
  }

  /**
   * Delete a file from S3
   */
  private async deleteS3File(filename: string): Promise<boolean> {
    try {
      const deleteParams = {
        Bucket: this.s3Config.bucketName,
        Key: filename,
      };

      await this.s3Client.send(new DeleteObjectCommand(deleteParams));
      return true;
    } catch (error) {
      console.error('Error deleting S3 file:', error);
      return false;
    }
  }

  /**
   * Determine if a URL is from S3
   */
  private isS3Url(url: string): boolean {
    // Return true if URL contains S3 bucket or custom S3 domain
    return url.includes('s3.') || 
           (this.s3Config.baseUrl && url.includes(this.s3Config.baseUrl));
  }
} 