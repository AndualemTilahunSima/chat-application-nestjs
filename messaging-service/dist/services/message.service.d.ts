import { Model } from 'mongoose';
import { MessageDocument } from '../entities/message.entity';
import { ThreadService } from './thread.service';
import { CreateMessageDto } from '../dto/create-message.dto';
import { MessageResponseDto } from '../dto/message-response.dto';
export declare class MessageService {
    private messageModel;
    private threadService;
    constructor(messageModel: Model<MessageDocument>, threadService: ThreadService);
    createMessage(createMessageDto: CreateMessageDto, senderId: string): Promise<MessageResponseDto>;
    getMessagesByThread(threadId: string, userId: string): Promise<MessageResponseDto[]>;
    markThreadAsRead(threadId: string, userId: string): Promise<void>;
    getUnreadCount(userId: string): Promise<number>;
}
