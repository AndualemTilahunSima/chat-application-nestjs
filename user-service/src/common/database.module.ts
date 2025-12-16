import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user.module';
import { UserEntity } from '../entities/user.entity';
import { CommonModule } from './common.module';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get('DB_HOST'),
                port: Number(configService.get('DB_PORT')) || 3306,
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_DATABASE'),
                entities: [UserEntity],
                migrations: [__dirname + '/../migrations/*{.js,.ts}'],
                migrationsRun: true, // <-- run migrations automatically on app bootstrap
                synchronize: false, // Use migrations in production
                logging: true,
                // cli: { migrationsDir: 'src/migrations' }, // optional
            }),
            inject: [ConfigService],
        }),
        UserModule,
        CommonModule
    ]
})
export class DatabaseModule { }