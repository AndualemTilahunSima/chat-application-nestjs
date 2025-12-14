import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private minioClient: Minio.Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get<string>('MINIO_ENDPOINT') || 'minio',
      port: parseInt(this.configService.get<string>('MINIO_PORT') || '9000'),
      useSSL: this.configService.get<string>('MINIO_USE_SSL') === 'true',
      accessKey: this.configService.get<string>('MINIO_ACCESS_KEY') || 'minioadmin',
      secretKey: this.configService.get<string>('MINIO_SECRET_KEY') || 'minioadmin',
    });

    this.bucketName = this.configService.get<string>('MINIO_BUCKET_NAME') || 'images';

    // Ensure bucket exists
    const bucketExists = await this.minioClient.bucketExists(this.bucketName);
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
      // Set bucket policy to allow public read (optional, adjust as needed)
      try {
        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${this.bucketName}/*`],
            },
          ],
        };
        await this.minioClient.setBucketPolicy(this.bucketName, JSON.stringify(policy));
      } catch (error) {
        // Policy setting might fail in some MinIO configurations, that's okay
        console.warn('Failed to set bucket policy:', error);
      }
    }
  }

  async uploadFile(fileName: string, fileBuffer: Buffer, contentType: string): Promise<string> {
    const objectName = `${Date.now()}-${fileName}`;
    await this.minioClient.putObject(this.bucketName, objectName, fileBuffer, fileBuffer.length, {
      'Content-Type': contentType,
    });
    return objectName;
  }

  async getPresignedUrl(objectName: string, expiry: number = 3600): Promise<string> {
    return await this.minioClient.presignedGetObject(this.bucketName, objectName, expiry);
  }

  async deleteFile(objectName: string): Promise<void> {
    await this.minioClient.removeObject(this.bucketName, objectName);
  }
}

