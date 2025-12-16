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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagingController = void 0;
const common_1 = require("@nestjs/common");
const message_service_1 = require("../services/message.service");
const thread_service_1 = require("../services/thread.service");
const user_status_service_1 = require("../services/user-status.service");
const create_message_dto_1 = require("../dto/create-message.dto");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
let MessagingController = class MessagingController {
    messageService;
    threadService;
    userStatusService;
    constructor(messageService, threadService, userStatusService) {
        this.messageService = messageService;
        this.threadService = threadService;
        this.userStatusService = userStatusService;
    }
    async getThreads(req) {
        const userId = req.user.sub;
        return this.threadService.getUserThreads(userId);
    }
    async getMessages(req, threadId) {
        const userId = req.user.sub;
        return this.messageService.getMessagesByThread(threadId, userId);
    }
    async createMessage(req, createMessageDto) {
        const userId = req.user.sub;
        return this.messageService.createMessage(createMessageDto, userId);
    }
    async markThreadAsRead(req, threadId) {
        const userId = req.user.sub;
        await this.messageService.markThreadAsRead(threadId, userId);
        return { success: true };
    }
    async getUserStatus(req) {
        const userId = req.user.sub;
        const status = await this.userStatusService.getUserStatus(userId);
        return { userId, status: status || 'offline' };
    }
};
exports.MessagingController = MessagingController;
__decorate([
    (0, common_1.Get)('threads'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "getThreads", null);
__decorate([
    (0, common_1.Get)('threads/:threadId/messages'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('threadId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Post)('messages'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_message_dto_1.CreateMessageDto]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "createMessage", null);
__decorate([
    (0, common_1.Post)('threads/:threadId/read'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('threadId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "markThreadAsRead", null);
__decorate([
    (0, common_1.Get)('status'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "getUserStatus", null);
exports.MessagingController = MessagingController = __decorate([
    (0, common_1.Controller)('messaging'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [message_service_1.MessageService,
        thread_service_1.ThreadService,
        user_status_service_1.UserStatusService])
], MessagingController);
//# sourceMappingURL=messaging.controller.js.map