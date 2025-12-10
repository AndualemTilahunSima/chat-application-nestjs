import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/dto/login.dto';
import { UserRepository } from 'src/repositories/user.repository';
import { UserStatus } from 'src/entities/user.entity';
import { UserMapper } from 'src/mappers/user.mapper';
import { RedisService } from 'src/common/redis.service';
import { LogoutDto } from 'src/dto/logout.dto';

@Injectable()
export class AuthService {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
        private readonly redisService: RedisService,
    ) { }

    async authenticate(dto: LoginDto) {

        const user = await this.userRepository.findByEmail(dto.email);
        if (!user) {
            throw new UnauthorizedException(`Invalid credentials`);
        }

        const passwordMatches = await user.validatePassword(dto.password);

        if (!passwordMatches) throw new UnauthorizedException('Invalid credentials');

        if (user.status != UserStatus.ACTIVE) throw new UnauthorizedException('User not active');

        const payload = { sub: user.id, email: user.email };

        const token = await this.jwtService.signAsync(payload);

        await this.saveTokenToRedis(user.id, token);

        return UserMapper.toLoginResponseDto(user, token);
    }

    async saveTokenToRedis(userId: string, token: string): Promise<void> {
        await this.redisService.set(`token:user:${userId}`, token, 6000);
    }

    async logout(dto: LogoutDto) {
        const userId = this.getUserIdFromToken(dto.token);
        if (!userId) {
            throw new UnauthorizedException('Invalid token or user ID');
        }
        await this.redisService.del(`token:user:${userId}`);
    }

    getUserIdFromToken(token: string): string | null {
    try {
      const decoded = this.jwtService.decode(token) as { sub: string; email: string };
      return decoded?.sub || null; // return user id
    } catch (err) {
      console.error('Invalid token', err);
      return null;
    }
  }
}