import { Controller, Post, Body } from '@nestjs/common';
import { LoginDto } from 'src/dto/login.dto';
import { LogoutDto } from 'src/dto/logout.dto';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        return this.authService.authenticate(dto);
    }
    
    @Post('logout')
    async logout(@Body() dto: LogoutDto) {
        return this.authService.logout(dto);
    }

}