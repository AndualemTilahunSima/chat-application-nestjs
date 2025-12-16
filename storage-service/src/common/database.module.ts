import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileStorageEntity } from '../entities/file-storage.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: false,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST') || '127.0.0.1',
        port: Number(configService.get('DB_PORT')) || 3307,
        username: configService.get('DB_USERNAME') || 'admin',
        password: configService.get('DB_PASSWORD') || 'admin',
        database: configService.get('DB_DATABASE') || 'storage_db',
        entities: [FileStorageEntity],
        migrations: [__dirname + '/../migrations/*{.js,.ts}'],
        migrationsRun: true,
        synchronize: false,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([FileStorageEntity]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}

