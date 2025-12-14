import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateFileStorageTable1700000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
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
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('file_storage');
  }
}

