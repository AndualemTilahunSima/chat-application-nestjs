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
exports.ThreadService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const thread_entity_1 = require("../entities/thread.entity");
const message_entity_1 = require("../entities/message.entity");
let ThreadService = class ThreadService {
    threadModel;
    messageModel;
    constructor(threadModel, messageModel) {
        this.threadModel = threadModel;
        this.messageModel = messageModel;
    }
    async findOrCreateThread(userId1, userId2) {
        const participantIds = [userId1, userId2].sort();
        let thread = await this.threadModel.findOne({
            participantIds: { $eq: participantIds },
        }).exec();
        if (!thread) {
            thread = new this.threadModel({ participantIds });
            await thread.save();
        }
        return thread;
    }
    async getThreadById(threadId) {
        return this.threadModel.findById(threadId).exec();
    }
    async getUserThreads(userId) {
        const threads = await this.threadModel.find({
            participantIds: userId,
        })
            .sort({ lastMessageAt: -1 })
            .exec();
        const threadResponses = await Promise.all(threads.map(async (thread) => {
            const otherUserId = thread.participantIds.find(id => id !== userId);
            const unreadCount = await this.messageModel.countDocuments({
                threadId: thread._id.toString(),
                receiverId: userId,
                isRead: false,
            }).exec();
            let lastMessage = null;
            if (thread.lastMessageId) {
                const message = await this.messageModel.findById(thread.lastMessageId).exec();
                if (message) {
                    lastMessage = {
                        text: message.text,
                        senderId: message.senderId,
                        createdAt: message.createdAt,
                    };
                }
            }
            return {
                id: thread._id.toString(),
                participantIds: thread.participantIds,
                lastMessage,
                lastMessageAt: thread.lastMessageAt,
                unreadCount,
                createdAt: thread.createdAt,
                updatedAt: thread.updatedAt,
            };
        }));
        return threadResponses;
    }
    async updateThreadLastMessage(threadId, messageId) {
        await this.threadModel.findByIdAndUpdate(threadId, {
            lastMessageId: messageId,
            lastMessageAt: new Date(),
        }).exec();
    }
};
exports.ThreadService = ThreadService;
exports.ThreadService = ThreadService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(thread_entity_1.Thread.name)),
    __param(1, (0, mongoose_1.InjectModel)(message_entity_1.Message.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ThreadService);
//# sourceMappingURL=thread.service.js.map