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
exports.UserStatusService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_status_entity_1 = require("../entities/user-status.entity");
let UserStatusService = class UserStatusService {
    userStatusModel;
    constructor(userStatusModel) {
        this.userStatusModel = userStatusModel;
    }
    async setUserOnline(userId) {
        await this.userStatusModel.findOneAndUpdate({ userId }, {
            userId,
            status: user_status_entity_1.OnlineStatus.ONLINE,
            lastSeen: new Date(),
        }, { upsert: true, new: true }).exec();
    }
    async setUserOffline(userId) {
        await this.userStatusModel.findOneAndUpdate({ userId }, {
            userId,
            status: user_status_entity_1.OnlineStatus.OFFLINE,
            lastSeen: new Date(),
        }, { upsert: true, new: true }).exec();
    }
    async getUserStatus(userId) {
        const status = await this.userStatusModel.findOne({ userId }).exec();
        return status ? status.status : null;
    }
    async getUsersStatus(userIds) {
        const statuses = await this.userStatusModel.find({
            userId: { $in: userIds },
        }).exec();
        const statusMap = {};
        statuses.forEach((status) => {
            statusMap[status.userId] = status.status;
        });
        userIds.forEach((userId) => {
            if (!statusMap[userId]) {
                statusMap[userId] = user_status_entity_1.OnlineStatus.OFFLINE;
            }
        });
        return statusMap;
    }
};
exports.UserStatusService = UserStatusService;
exports.UserStatusService = UserStatusService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_status_entity_1.UserStatus.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserStatusService);
//# sourceMappingURL=user-status.service.js.map