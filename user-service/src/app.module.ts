import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { UserModule } from './user.module';
import { CommonModule } from './common.module';

@Module({
  imports: [    
    DatabaseModule,
    UserModule,
    CommonModule,
  ],
})
export class AppModule {}