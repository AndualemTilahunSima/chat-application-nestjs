import { Repository } from 'typeorm';
import { FileStorageEntity } from '../entities/file-storage.entity';
import { MinioService } from './minio.service';
export declare class StorageService {
    private readonly fileStorageRepository;
    private readonly minioService;
    constructor(fileStorageRepository: Repository<FileStorageEntity>, minioService: MinioService);
    uploadFile(file: Express.Multer.File): Promise<{
        id: string;
        path: string;
    }>;
    getPresignedUrl(fileId: string, expiry?: number): Promise<string>;
    getFileById(fileId: string): Promise<FileStorageEntity>;
}
