"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagingModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const database_module_1 = require("./common/database.module");
const messaging_controller_1 = require("./controllers/messaging.controller");
const message_service_1 = require("./services/message.service");
const thread_service_1 = require("./services/thread.service");
const user_status_service_1 = require("./services/user-status.service");
const messaging_gateway_1 = require("./gateways/messaging.gateway");
let MessagingModule = class MessagingModule {
};
exports.MessagingModule = MessagingModule;
exports.MessagingModule = MessagingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            config_1.ConfigModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET') || 'change_this_secret',
                    signOptions: { expiresIn: '1h' },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [messaging_controller_1.MessagingController],
        providers: [message_service_1.MessageService, thread_service_1.ThreadService, user_status_service_1.UserStatusService, messaging_gateway_1.MessagingGateway],
        exports: [message_service_1.MessageService, thread_service_1.ThreadService, user_status_service_1.UserStatusService],
    })
], MessagingModule);
//# sourceMappingURL=messaging.module.js.map