import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileStorageEntity } from './entities/file-storage.entity';
import { StorageController } from './controllers/storage.controller';
import { StorageService } from './services/storage.service';
import { MinioService } from './services/minio.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileStorageEntity])],
  controllers: [StorageController],
  providers: [StorageService, MinioService],
  exports: [StorageService],
})
export class StorageModule {}

