import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from '../services/storage.service';
import { UploadResponseDto } from '../dto/upload-response.dto';
import { PresignedUrlResponseDto } from '../dto/presigned-url-response.dto';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadResponseDto> {
    if (!file) {
      throw new Error('No file provided');
    }

    return await this.storageService.uploadFile(file);
  }

  @Get('presigned-url/:id')
  async getPresignedUrl(
    @Param('id') id: string,
    @Query('expiry', new ParseIntPipe({ optional: true })) expiry?: number,
  ): Promise<PresignedUrlResponseDto> {
    const url = await this.storageService.getPresignedUrl(id, expiry || 3600);
    return {
      url,
      expiresIn: expiry || 3600,
    };
  }
}

