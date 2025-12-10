import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemoveIsActiveColumn1234567890124 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // avoid failing if column already removed
    const has = await queryRunner.hasColumn('users', 'is_active');
    if (has) {
      await queryRunner.dropColumn('users', 'is_active');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const has = await queryRunner.hasColumn('users', 'is_active');
    if (!has) {
      await queryRunner.addColumn(
        'users',
        new TableColumn({
          name: 'is_active',
          type: 'boolean',
          isNullable: false,
          default: 'true', // SQL expression form works for Postgres/MySQL
        }),
      );
    }
  }
}