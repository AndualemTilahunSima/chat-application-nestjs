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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatusSchema = exports.UserStatus = exports.OnlineStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var OnlineStatus;
(function (OnlineStatus) {
    OnlineStatus["ONLINE"] = "online";
    OnlineStatus["OFFLINE"] = "offline";
})(OnlineStatus || (exports.OnlineStatus = OnlineStatus = {}));
let UserStatus = class UserStatus {
    userId;
    status;
    lastSeen;
    createdAt;
    updatedAt;
};
exports.UserStatus = UserStatus;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, type: String }),
    __metadata("design:type", String)
], UserStatus.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: OnlineStatus, default: OnlineStatus.OFFLINE }),
    __metadata("design:type", String)
], UserStatus.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], UserStatus.prototype, "lastSeen", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], UserStatus.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], UserStatus.prototype, "updatedAt", void 0);
exports.UserStatus = UserStatus = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], UserStatus);
exports.UserStatusSchema = mongoose_1.SchemaFactory.createForClass(UserStatus);
//# sourceMappingURL=user-status.entity.js.map