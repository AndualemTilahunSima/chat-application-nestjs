import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { UserEntity } from './entities/user.entity';
import { RedisModule } from './common/redis.module';
import { IUserRepository } from './repositories/user.repository.interface';
import { UserRepository } from './repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { StorageClientService } from './services/storage-client.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    RedisModule,
    HttpModule,
  ],
   providers: [
    UserService,
    StorageClientService,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
    JwtService
  ],
  controllers: [UserController],
  exports: [UserService, IUserRepository],
})
export class UserModule {}
