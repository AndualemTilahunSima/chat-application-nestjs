import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('file_storage')
export class FileStorageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 250, unique: true })
  path: string;

  @Column({ type: 'varchar', length: 250, name: 'file_type' })
  fileType: string;

  @Column({ type: 'varchar', length: 250, nullable: true, name: 'file_name' })
  fileName?: string;

  @Column({ type: 'bigint' })
  size: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

