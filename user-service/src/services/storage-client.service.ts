import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import * as FormData from 'form-data';

@Injectable()
export class StorageClientService {
  private readonly storageServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.storageServiceUrl =
      this.configService.get<string>('STORAGE_SERVICE_URL') ||
      'http://storage-service:3002';
  }

  async uploadFile(file: Express.Multer.File): Promise<{ id: string; path: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });

      const response = await firstValueFrom(
        this.httpService.post(`${this.storageServiceUrl}/storage/upload`, formData, {
          headers: {
            ...formData.getHeaders(),
          },
        }),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to upload file to storage service: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

