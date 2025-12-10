import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserModule } from './user.module';
import { RedisModule } from './common/redis.module';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'change_this_secret',
            signOptions: { expiresIn: '1h' },
        }),
        UserModule,
        RedisModule
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}