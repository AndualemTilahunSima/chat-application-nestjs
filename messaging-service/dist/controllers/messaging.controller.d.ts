import { MessageService } from '../services/message.service';
import { ThreadService } from '../services/thread.service';
import { UserStatusService } from '../services/user-status.service';
import { CreateMessageDto } from '../dto/create-message.dto';
export declare class MessagingController {
    private readonly messageService;
    private readonly threadService;
    private readonly userStatusService;
    constructor(messageService: MessageService, threadService: ThreadService, userStatusService: UserStatusService);
    getThreads(req: any): Promise<import("../dto/thread-response.dto").ThreadResponseDto[]>;
    getMessages(req: any, threadId: string): Promise<import("../dto/message-response.dto").MessageResponseDto[]>;
    createMessage(req: any, createMessageDto: CreateMessageDto): Promise<import("../dto/message-response.dto").MessageResponseDto>;
    markThreadAsRead(req: any, threadId: string): Promise<{
        success: boolean;
    }>;
    getUserStatus(req: any): Promise<{
        userId: any;
        status: string;
    }>;
}
