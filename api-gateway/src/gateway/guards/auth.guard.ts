import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenValidationService } from '../services/token-validation.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenValidationService: TokenValidationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    
    // Check if this is a public route that shouldn't require auth
    // POST /users (registration) is public
    if (request.path === '/users' && request.method === 'POST') {
      return true;
    }

    // Check for OTP verification route
    if (request.path.match(/\/users\/[^/]+\/verify$/)) {
      return true;
    }

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];

    // Validate token and check Redis
    const user = await this.tokenValidationService.validateToken(token);

    // Attach user info to request for use in controllers
    request['user'] = user;

    return true;
  }
}

