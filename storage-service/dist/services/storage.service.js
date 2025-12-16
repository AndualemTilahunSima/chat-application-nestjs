"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const file_storage_entity_1 = require("../entities/file-storage.entity");
const minio_service_1 = require("./minio.service");
let StorageService = class StorageService {
    fileStorageRepository;
    minioService;
    constructor(fileStorageRepository, minioService) {
        this.fileStorageRepository = fileStorageRepository;
        this.minioService = minioService;
    }
    async uploadFile(file) {
        const objectName = await this.minioService.uploadFile(file.originalname, file.buffer, file.mimetype);
        const fileStorage = this.fileStorageRepository.create({
            path: objectName,
            fileType: file.mimetype,
            fileName: file.originalname,
            size: file.size,
        });
        const savedFile = await this.fileStorageRepository.save(fileStorage);
        return {
            id: savedFile.id,
            path: savedFile.path,
        };
    }
    async getPresignedUrl(fileId, expiry = 3600) {
        const fileStorage = await this.fileStorageRepository.findOne({
            where: { id: fileId },
        });
        if (!fileStorage) {
            throw new Error(`File with ID ${fileId} not found`);
        }
        return await this.minioService.getPresignedUrl(fileStorage.path, expiry);
    }
    async getFileById(fileId) {
        const fileStorage = await this.fileStorageRepository.findOne({
            where: { id: fileId },
        });
        if (!fileStorage) {
            throw new Error(`File with ID ${fileId} not found`);
        }
        return fileStorage;
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(file_storage_entity_1.FileStorageEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        minio_service_1.MinioService])
], StorageService);
//# sourceMappingURL=storage.service.js.map