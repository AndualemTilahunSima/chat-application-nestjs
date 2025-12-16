"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateFileStorageTable1700000000001 = void 0;
const typeorm_1 = require("typeorm");
class CreateFileStorageTable1700000000001 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'file_storage',
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    length: '36',
                    isPrimary: true,
                },
                {
                    name: 'path',
                    type: 'varchar',
                    length: '250',
                    isUnique: true,
                },
                {
                    name: 'file_type',
                    type: 'varchar',
                    length: '250',
                },
                {
                    name: 'file_name',
                    type: 'varchar',
                    length: '250',
                    isNullable: true,
                },
                {
                    name: 'size',
                    type: 'bigint',
                },
                {
                    name: 'created_at',
                    type: 'datetime',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);
    }
    async down(queryRunner) {
        await queryRunner.dropTable('file_storage');
    }
}
exports.CreateFileStorageTable1700000000001 = CreateFileStorageTable1700000000001;
//# sourceMappingURL=1700000000001-CreateFileStorageTable.js.map