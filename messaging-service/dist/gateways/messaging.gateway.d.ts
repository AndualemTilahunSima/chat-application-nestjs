import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessageService } from '../services/message.service';
import { UserStatusService } from '../services/user-status.service';
import { CreateMessageDto } from '../dto/create-message.dto';
interface AuthenticatedSocket extends Socket {
    userId?: string;
}
export declare class MessagingGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly messageService;
    private readonly userStatusService;
    private readonly jwtService;
    server: Server;
    private readonly logger;
    private connectedUsers;
    constructor(messageService: MessageService, userStatusService: UserStatusService, jwtService: JwtService);
    handleConnection(client: AuthenticatedSocket): Promise<void>;
    handleDisconnect(client: AuthenticatedSocket): Promise<void>;
    handleMessage(createMessageDto: CreateMessageDto, client: AuthenticatedSocket): Promise<{
        success: boolean;
        message: import("../dto/message-response.dto").MessageResponseDto;
        error?: undefined;
    } | {
        error: any;
        success?: undefined;
        message?: undefined;
    }>;
    handleMarkRead(data: {
        threadId: string;
    }, client: AuthenticatedSocket): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        error: any;
        success?: undefined;
    }>;
    emitToUser(userId: string, event: string, data: any): void;
}
export {};
