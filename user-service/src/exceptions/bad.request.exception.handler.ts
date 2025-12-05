import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(BadRequestException)
export class BadRequestExceptionHandler implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = exception.getStatus();
    const message = (exception.getResponse() as any).message;
    response.status(status).json({
      success: false,
      timestamp: new Date().toISOString(),
      error: {
        status,
        message,
        statusCode: status,
      },
    });
  }
}