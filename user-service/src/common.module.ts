import {  Global, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { Reflector } from '@nestjs/core';
import { BaseExceptionHandler } from './exceptions/base.exception.handler';
import { BadRequestExceptionHandler } from './exceptions/bad.request.exception.handler';


@Module({
  providers: [
    Reflector,
    {
      provide: APP_FILTER,
      useClass: BaseExceptionHandler,
    },
    {
      provide: APP_FILTER,
      useClass: BadRequestExceptionHandler,
    },
  ],
  exports: [],
})
export class CommonModule { }