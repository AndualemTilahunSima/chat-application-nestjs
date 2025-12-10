import { Module } from '@nestjs/common';
import { DatabaseModule } from './common/database.module';
import { UserModule } from './user.module';
import { RedisModule } from './common/redis.module';
import { AuthModule } from './auth.module';

@Module({
  imports: [    
    DatabaseModule,
    RedisModule,
    UserModule,
    AuthModule
  ],
})
export class AppModule {}