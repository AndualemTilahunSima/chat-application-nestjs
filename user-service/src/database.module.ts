import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user.module';
import { UserEntity } from './entities/user.entity';
import { CommonModule } from './common.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: false,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get('DB_HOST'),
                port: configService.get('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_DATABASE'),
                entities: [UserEntity],
                synchronize: false, // Use migrations in production
                logging: true,
            }),
            inject: [ConfigService],
        }),
        UserModule,
        CommonModule
    ]
})
export class DatabaseModule { }