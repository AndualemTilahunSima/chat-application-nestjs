import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { UserEntity } from './entities/user.entity';
import { RedisModule } from './common/redis.module';
import { IUserRepository } from './repositories/user.repository.interface';
import { UserRepository } from './repositories/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { StorageClientService } from './services/storage-client.service';
import { AuthGuard } from './controllers/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    RedisModule,
    HttpModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'change_this_secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
   providers: [
    UserService,
    StorageClientService,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
    AuthGuard,
  ],
  controllers: [UserController],
  exports: [UserService, IUserRepository, StorageClientService],
})
export class UserModule {}
