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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileStorageEntity = void 0;
const typeorm_1 = require("typeorm");
let FileStorageEntity = class FileStorageEntity {
    id;
    path;
    fileType;
    fileName;
    size;
    createdAt;
};
exports.FileStorageEntity = FileStorageEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FileStorageEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 250, unique: true }),
    __metadata("design:type", String)
], FileStorageEntity.prototype, "path", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 250, name: 'file_type' }),
    __metadata("design:type", String)
], FileStorageEntity.prototype, "fileType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 250, nullable: true, name: 'file_name' }),
    __metadata("design:type", String)
], FileStorageEntity.prototype, "fileName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], FileStorageEntity.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], FileStorageEntity.prototype, "createdAt", void 0);
exports.FileStorageEntity = FileStorageEntity = __decorate([
    (0, typeorm_1.Entity)('file_storage')
], FileStorageEntity);
//# sourceMappingURL=file-storage.entity.js.map