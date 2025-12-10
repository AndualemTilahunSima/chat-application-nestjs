import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/dto/login.dto';
import { UserRepository } from 'src/repositories/user.repository';
import { UserStatus } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
    ) { }

    async authenticate(dto: LoginDto) {

        const user = await this.userRepository.findByEmail(dto.email);
        console.log('Authenticated User:', user);
        if (!user) {
            throw new UnauthorizedException(`Invalid credentials`);
        }

        const passwordMatches = await user.validatePassword(dto.password);
        
        if (!passwordMatches) throw new UnauthorizedException('Invalid credentials');

        if (user.status != UserStatus.ACTIVE) throw new UnauthorizedException('User not active');

        const payload = { sub: user.id, email: user.email };
        
        const token = await this.jwtService.signAsync(payload);

        return { accessToken: token };
    }
}