import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddProfileImageToUsers1700000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'profile_image',
        type: 'varchar',
        length: '36',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'profile_image');
  }
}

