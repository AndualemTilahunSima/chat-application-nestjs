import { Model } from 'mongoose';
import { ThreadDocument } from '../entities/thread.entity';
import { MessageDocument } from '../entities/message.entity';
import { ThreadResponseDto } from '../dto/thread-response.dto';
export declare class ThreadService {
    private threadModel;
    private messageModel;
    constructor(threadModel: Model<ThreadDocument>, messageModel: Model<MessageDocument>);
    findOrCreateThread(userId1: string, userId2: string): Promise<ThreadDocument>;
    getThreadById(threadId: string): Promise<ThreadDocument | null>;
    getUserThreads(userId: string): Promise<ThreadResponseDto[]>;
    updateThreadLastMessage(threadId: string, messageId: string): Promise<void>;
}
