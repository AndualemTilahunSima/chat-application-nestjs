import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class MinioService implements OnModuleInit {
    private configService;
    private minioClient;
    private bucketName;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    uploadFile(fileName: string, fileBuffer: Buffer, contentType: string): Promise<string>;
    getPresignedUrl(objectName: string, expiry?: number): Promise<string>;
    deleteFile(objectName: string): Promise<void>;
}
