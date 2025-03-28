import { Injectable } from '@nestjs/common';
import { StorageService } from './storage.service';

@Injectable()
export class UploadsService {
  constructor(private storageService: StorageService) {}

  /**
   * Get the full URL for a file
   */
  async uploadFile(file: Express.Multer.File): Promise<string> {
    return this.storageService.uploadFile(file);
  }

  /**
   * Delete a file
   */
  async deleteFile(fileUrl: string): Promise<boolean> {
    return this.storageService.deleteFile(fileUrl);
  }
} 