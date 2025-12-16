import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './common/database.module';
import { MessagingController } from './controllers/messaging.controller';
import { MessageService } from './services/message.service';
import { ThreadService } from './services/thread.service';
import { UserStatusService } from './services/user-status.service';
import { MessagingGateway } from './gateways/messaging.gateway';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'change_this_secret',
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MessagingController],
  providers: [MessageService, ThreadService, UserStatusService, MessagingGateway],
  exports: [MessageService, ThreadService, UserStatusService],
})
export class MessagingModule {}

