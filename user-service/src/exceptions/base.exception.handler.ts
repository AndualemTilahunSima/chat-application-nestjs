import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseException } from './base.exception';

@Catch(BaseException)
export class BaseExceptionHandler implements ExceptionFilter {
  catch(exception: BaseException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = exception.getStatus();
    const message = (exception.getResponse() as string);
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