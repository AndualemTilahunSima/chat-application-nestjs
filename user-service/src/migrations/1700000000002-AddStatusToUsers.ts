import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddStatusToUsers1700000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'status',
        type: 'enum',
        enum: ['PENDING', 'ACTIVE', 'INACTIVE'],
        default: "'PENDING'",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'status');
  }
}