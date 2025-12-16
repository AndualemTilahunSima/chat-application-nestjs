import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Message, MessageSchema } from '../entities/message.entity';
import { Thread, ThreadSchema } from '../entities/thread.entity';
import { UserStatus, UserStatusSchema } from '../entities/user-status.entity';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://mongodb:27017/messaging_db',
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Thread.name, schema: ThreadSchema },
      { name: UserStatus.name, schema: UserStatusSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}

