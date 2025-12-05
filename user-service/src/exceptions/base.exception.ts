import { HttpException, HttpStatus } from '@nestjs/common';

export interface IBaseException {
  message: string;
  code: string;
  statusCode: number;
  details?: any;
}

export abstract class BaseException extends HttpException {
  public readonly code: string;
  public readonly details?: any;

  constructor(
    message: string,
    code: string,
    statusCode: number,
    details?: any,
  ) {
    super(message, statusCode);
    this.code = code;
    this.details = details;
  }

  toJSON(): IBaseException {
    return {
      message: this.message,
      code: this.code,
      statusCode: this.getStatus(),
      details: this.details,
    };
  }
}