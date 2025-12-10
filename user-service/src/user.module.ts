import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { UserEntity } from './entities/user.entity';
import { RedisModule } from './common/redis.module';
import { IUserRepository } from './repositories/user.repository.interface';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    RedisModule,
  ],
   providers: [
    UserService,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
  ],
  controllers: [UserController],
  exports: [UserService, IUserRepository],
})
export class UserModule {}
