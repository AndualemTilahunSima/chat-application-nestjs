import { StorageService } from '../services/storage.service';
import { UploadResponseDto } from '../dto/upload-response.dto';
import { PresignedUrlResponseDto } from '../dto/presigned-url-response.dto';
export declare class StorageController {
    private readonly storageService;
    constructor(storageService: StorageService);
    uploadFile(file: Express.Multer.File): Promise<UploadResponseDto>;
    getPresignedUrl(id: string, expiry?: number): Promise<PresignedUrlResponseDto>;
}
