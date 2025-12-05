import { BaseException } from "./base.exception";

export class UserNotFoundException extends BaseException {
  constructor(message: string, details?: any) {
    super(message, 'NOT_FOUND', 404, details);
  }
}

export class UserBadRequestException extends BaseException {
  constructor(message: string, details?: any) {
    super(message, 'BAD_REQUEST', 400, details);
  }
}

export class UserConflictException extends BaseException {
  constructor(message: string, details?: any) {
    super(message, 'CONFLICT', 409, details);
  }
}

export class UserUnauthorizedException extends BaseException {
  constructor(message: string, details?: any) {
    super(message, 'UNAUTHORIZED', 401, details);
  }
}

export class UserForbiddenException extends BaseException {
  constructor(message: string, details?: any) {
    super(message, 'FORBIDDEN', 403, details);
  }
}

export class UserValidationException extends BaseException {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 422, details);
  }
}

export class UserInternalServerException extends BaseException {
  constructor(message: string, details?: any) {
    super(message, 'INTERNAL_SERVER_ERROR', 500, details);
  }
}