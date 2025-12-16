import {
  Controller,
  All,
  Req,
  Res,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthGuard } from './guards/auth.guard';
import { ProxyService } from './services/proxy.service';

@Controller()
export class GatewayController {
  constructor(private readonly proxyService: ProxyService) {}

  // Public routes - no authentication required
  @All('auth/login')
  async handleLogin(@Req() req: Request, @Res() res: Response) {
    return this.proxyRequest(req, res);
  }

  @All('auth/logout')
  async handleLogout(@Req() req: Request, @Res() res: Response) {
    return this.proxyRequest(req, res);
  }

  @All('users')
  @UseGuards(AuthGuard)
  async handleUsers(@Req() req: Request, @Res() res: Response) {
    // POST /users (registration) is public, GET requires auth
    // Auth check is handled by guard which allows POST but requires auth for GET
    return this.proxyRequest(req, res);
  }

  @All('users/:otp/verify')
  async handleOtpVerify(@Req() req: Request, @Res() res: Response) {
    // OTP verification is public
    return this.proxyRequest(req, res);
  }

  // Protected routes - require authentication
  @All('users/:id')
  @UseGuards(AuthGuard)
  async handleUserById(@Req() req: Request, @Res() res: Response) {
    return this.proxyRequest(req, res);
  }

  @All('users/:id/profile-image')
  @UseGuards(AuthGuard)
  async handleProfileImageUpload(@Req() req: Request, @Res() res: Response) {
    return this.proxyRequest(req, res);
  }

  @All('storage/*')
  @UseGuards(AuthGuard)
  async handleStorage(@Req() req: Request, @Res() res: Response) {
    return this.proxyRequest(req, res);
  }

  @All('*')
  @UseGuards(AuthGuard)
  async handleAllOtherRoutes(@Req() req: Request, @Res() res: Response) {
    return this.proxyRequest(req, res);
  }

  private async proxyRequest(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      // Extract path
      const path = req.path || '/';

      // Prepare headers
      const headers: Record<string, string> = {};
      Object.keys(req.headers).forEach((key) => {
        const lowerKey = key.toLowerCase();
        // Skip headers that shouldn't be forwarded
        if (lowerKey === 'host' || lowerKey === 'connection') {
          return;
        }
        const value = req.headers[key];
        if (value && typeof value === 'string') {
          headers[key] = value;
        } else if (Array.isArray(value) && value.length > 0) {
          headers[key] = value[0];
        }
      });

      // Check if this is a file upload (multipart/form-data)
      const isFileUpload = headers['content-type']?.includes('multipart/form-data');

      // Proxy the request
      const response = await this.proxyService.proxyRequest(
        req.method || 'GET',
        path,
        headers,
        isFileUpload ? req : (Object.keys(req.body || {}).length > 0 ? req.body : undefined),
        Object.keys(req.query || {}).length > 0 ? (req.query as Record<string, any>) : undefined,
      );

      // Send response
      res.status(HttpStatus.OK).json(response);
    } catch (error: any) {
      const status = error.status || error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error.message || 'Internal server error';
      res.status(status).json({
        statusCode: status,
        message,
        error: error.response?.data || error.message,
      });
    }
  }
}

