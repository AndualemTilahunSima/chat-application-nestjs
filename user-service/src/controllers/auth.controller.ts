import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginDto } from 'src/dto/login.dto';
import { LogoutDto } from 'src/dto/logout.dto';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async login(@Body() dto: LoginDto) {
    return this.authService.authenticate(dto);
  }

  @Post('logout')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async logout(@Body() dto: LogoutDto) {
    return this.authService.logout(dto);
  }
}