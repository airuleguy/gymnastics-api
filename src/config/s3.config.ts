import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Config {
  constructor(private configService: ConfigService) {}

  get region(): string {
    return this.configService.get<string>('AWS_REGION', 'us-east-1');
  }

  get bucketName(): string {
    return this.configService.get<string>('AWS_S3_BUCKET', 'gymnastics-uploads');
  }

  get accessKeyId(): string {
    return this.configService.get<string>('AWS_ACCESS_KEY_ID', '');
  }

  get secretAccessKey(): string {
    return this.configService.get<string>('AWS_SECRET_ACCESS_KEY', '');
  }

  get baseUrl(): string {
    return this.configService.get<string>('AWS_S3_URL', '');
  }

  get localModeEnabled(): boolean {
    return this.configService.get<string>('STORAGE_MODE', 'local') === 'local';
  }
} 