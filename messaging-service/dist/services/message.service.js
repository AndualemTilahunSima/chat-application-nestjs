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
exports.MessageService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const message_entity_1 = require("../entities/message.entity");
const thread_service_1 = require("./thread.service");
let MessageService = class MessageService {
    messageModel;
    threadService;
    constructor(messageModel, threadService) {
        this.messageModel = messageModel;
        this.threadService = threadService;
    }
    async createMessage(createMessageDto, senderId) {
        const thread = await this.threadService.findOrCreateThread(senderId, createMessageDto.receiverId);
        const message = new this.messageModel({
            threadId: thread._id.toString(),
            senderId,
            receiverId: createMessageDto.receiverId,
            text: createMessageDto.text,
            isRead: false,
        });
        const savedMessage = await message.save();
        await this.threadService.updateThreadLastMessage(thread._id.toString(), savedMessage._id.toString());
        return {
            id: savedMessage._id.toString(),
            threadId: savedMessage.threadId,
            senderId: savedMessage.senderId,
            receiverId: savedMessage.receiverId,
            text: savedMessage.text,
            isRead: savedMessage.isRead,
            createdAt: savedMessage.createdAt,
            updatedAt: savedMessage.updatedAt,
        };
    }
    async getMessagesByThread(threadId, userId) {
        const thread = await this.threadService.getThreadById(threadId);
        if (!thread || !thread.participantIds.includes(userId)) {
            return [];
        }
        const messages = await this.messageModel
            .find({ threadId })
            .sort({ createdAt: 1 })
            .exec();
        return messages.map((msg) => ({
            id: msg._id.toString(),
            threadId: msg.threadId,
            senderId: msg.senderId,
            receiverId: msg.receiverId,
            text: msg.text,
            isRead: msg.isRead,
            createdAt: msg.createdAt,
            updatedAt: msg.updatedAt,
        }));
    }
    async markThreadAsRead(threadId, userId) {
        await this.messageModel.updateMany({
            threadId,
            receiverId: userId,
            isRead: false,
        }, {
            $set: { isRead: true },
        }).exec();
    }
    async getUnreadCount(userId) {
        return this.messageModel.countDocuments({
            receiverId: userId,
            isRead: false,
        }).exec();
    }
};
exports.MessageService = MessageService;
exports.MessageService = MessageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(message_entity_1.Message.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        thread_service_1.ThreadService])
], MessageService);
//# sourceMappingURL=message.service.js.map