import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/dto/login.dto';
import { UserRepository } from 'src/repositories/user.repository';
import { UserStatus } from 'src/entities/user.entity';
import { UserMapper } from 'src/mappers/user.mapper';
import { RedisService } from 'src/common/redis.service';
import { LogoutDto } from 'src/dto/logout.dto';

@Injectable()
export class AuthService {
  private readonly TOKEN_KEY_PREFIX = 'token:user:';
  private readonly TOKEN_EXPIRATION_TIME = 6000; // seconds

  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async authenticate(dto: LoginDto) {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await user.validatePassword(dto.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('User account is not active');
    }

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    await this.saveTokenToRedis(user.id, token);

    return UserMapper.toLoginResponseDto(user, token);
  }

  async saveTokenToRedis(userId: string, token: string): Promise<void> {
    const key = `${this.TOKEN_KEY_PREFIX}${userId}`;
    await this.redisService.set(key, token, this.TOKEN_EXPIRATION_TIME);
  }

  async logout(dto: LogoutDto): Promise<void> {
    const userId = this.getUserIdFromToken(dto.token);

    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }

    const key = `${this.TOKEN_KEY_PREFIX}${userId}`;
    await this.redisService.del(key);
  }

  getUserIdFromToken(token: string): string | null {
    try {
      const decoded = this.jwtService.decode(token) as { sub: string; email: string } | null;
      return decoded?.sub || null;
    } catch {
      return null;
    }
  }
}