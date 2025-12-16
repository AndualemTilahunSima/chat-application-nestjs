"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MessagingGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagingGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const message_service_1 = require("../services/message.service");
const user_status_service_1 = require("../services/user-status.service");
const create_message_dto_1 = require("../dto/create-message.dto");
let MessagingGateway = MessagingGateway_1 = class MessagingGateway {
    messageService;
    userStatusService;
    jwtService;
    server;
    logger = new common_1.Logger(MessagingGateway_1.name);
    connectedUsers = new Map();
    constructor(messageService, userStatusService, jwtService) {
        this.messageService = messageService;
        this.userStatusService = userStatusService;
        this.jwtService = jwtService;
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth.token || client.handshake.headers.authorization?.replace('Bearer ', '');
            if (!token) {
                this.logger.warn('Connection rejected: No token provided');
                client.disconnect();
                return;
            }
            const payload = await this.jwtService.verifyAsync(token);
            const userId = payload.sub;
            if (!userId) {
                this.logger.warn('Connection rejected: Invalid token payload');
                client.disconnect();
                return;
            }
            client.userId = userId;
            this.connectedUsers.set(userId, client.id);
            await this.userStatusService.setUserOnline(userId);
            this.server.emit('user-online', { userId });
            this.logger.log(`Client connected: ${client.id} (User: ${userId})`);
        }
        catch (error) {
            this.logger.error(`Connection error: ${error.message}`);
            client.disconnect();
        }
    }
    async handleDisconnect(client) {
        if (client.userId) {
            this.connectedUsers.delete(client.userId);
            await this.userStatusService.setUserOffline(client.userId);
            this.server.emit('user-offline', { userId: client.userId });
            this.logger.log(`Client disconnected: ${client.id} (User: ${client.userId})`);
        }
    }
    async handleMessage(createMessageDto, client) {
        if (!client.userId) {
            return { error: 'Unauthorized' };
        }
        try {
            const message = await this.messageService.createMessage(createMessageDto, client.userId);
            const receiverSocketId = this.connectedUsers.get(createMessageDto.receiverId);
            if (receiverSocketId) {
                this.server.to(receiverSocketId).emit('new-message', message);
            }
            this.server.to(client.id).emit('message-sent', message);
            return { success: true, message };
        }
        catch (error) {
            this.logger.error(`Error sending message: ${error.message}`);
            return { error: error.message };
        }
    }
    async handleMarkRead(data, client) {
        if (!client.userId) {
            return { error: 'Unauthorized' };
        }
        try {
            await this.messageService.markThreadAsRead(data.threadId, client.userId);
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Error marking as read: ${error.message}`);
            return { error: error.message };
        }
    }
    emitToUser(userId, event, data) {
        const socketId = this.connectedUsers.get(userId);
        if (socketId) {
            this.server.to(socketId).emit(event, data);
        }
    }
};
exports.MessagingGateway = MessagingGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MessagingGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('send-message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_message_dto_1.CreateMessageDto, Object]),
    __metadata("design:returntype", Promise)
], MessagingGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('mark-read'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MessagingGateway.prototype, "handleMarkRead", null);
exports.MessagingGateway = MessagingGateway = MessagingGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
            credentials: true,
        },
        namespace: '/messaging',
    }),
    __metadata("design:paramtypes", [message_service_1.MessageService,
        user_status_service_1.UserStatusService,
        jwt_1.JwtService])
], MessagingGateway);
//# sourceMappingURL=messaging.gateway.js.map