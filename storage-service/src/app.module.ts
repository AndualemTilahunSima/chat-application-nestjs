import { Module } from '@nestjs/common';
import { DatabaseModule } from './common/database.module';
import { StorageModule } from './storage.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    StorageModule,
  ],
})
export class AppModule {}

