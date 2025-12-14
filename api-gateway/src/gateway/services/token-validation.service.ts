import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../../common/redis.service';

@Injectable()
export class TokenValidationService {
  private readonly logger = new Logger(TokenValidationService.name);
  private readonly TOKEN_KEY_PREFIX = 'token:user:';

  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async validateToken(token: string): Promise<{ userId: string; email: string }> {
    try {
      // Decode and verify JWT token
      const decoded = this.jwtService.verify(token) as { sub: string; email: string };

      if (!decoded?.sub) {
        throw new UnauthorizedException('Invalid token payload');
      }

      // Check if token exists in Redis (user service stores it there)
      const userId = decoded.sub;
      const redisKey = `${this.TOKEN_KEY_PREFIX}${userId}`;
      const storedToken = await this.redisService.get(redisKey);

      if (!storedToken || storedToken !== token) {
        throw new UnauthorizedException('Token not found or expired');
      }

      return {
        userId: decoded.sub,
        email: decoded.email,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error('Token validation error', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

