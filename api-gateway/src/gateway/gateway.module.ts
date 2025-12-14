import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { AuthGuard } from './guards/auth.guard';
import { ProxyService } from './services/proxy.service';
import { TokenValidationService } from './services/token-validation.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'change_this_secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [GatewayController],
  providers: [
    GatewayService,
    AuthGuard,
    ProxyService,
    TokenValidationService,
  ],
  exports: [AuthGuard],
})
export class GatewayModule {}

