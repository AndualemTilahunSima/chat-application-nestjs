# API Gateway Service

API Gateway microservice that handles authentication and reverse proxies requests to the user service.

## Features

- JWT token validation against Redis
- Reverse proxy to user service
- Authentication guard for protected routes
- Public routes support (login, registration, OTP verification)

## Environment Variables

```env
PORT=3001
REDIS_URL=redis://localhost:6379
USER_SERVICE_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:5173
```

## Installation

```bash
npm install
```

## Running the app

```bash
# development
npm run start:dev

# production
npm run start:prod
```

## Architecture

- **Gateway Controller**: Handles all incoming requests and routes them appropriately
- **Auth Guard**: Validates JWT tokens by checking Redis
- **Token Validation Service**: Validates tokens and checks Redis for active sessions
- **Proxy Service**: Forwards requests to the user service

## Public Routes

- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /users` - User registration
- `PATCH /users/:otp/verify` - OTP verification

## Protected Routes

All other routes require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

