import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Thread, ThreadDocument } from '../entities/thread.entity';
import { Message, MessageDocument } from '../entities/message.entity';
import { ThreadResponseDto } from '../dto/thread-response.dto';

@Injectable()
export class ThreadService {
  constructor(
    @InjectModel(Thread.name) private threadModel: Model<ThreadDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async findOrCreateThread(userId1: string, userId2: string): Promise<ThreadDocument> {
    // Sort IDs to ensure consistent thread lookup
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

  async getThreadById(threadId: string): Promise<ThreadDocument | null> {
    return this.threadModel.findById(threadId).exec();
  }

  async getUserThreads(userId: string): Promise<ThreadResponseDto[]> {
    const threads = await this.threadModel.find({
      participantIds: userId,
    })
    .sort({ lastMessageAt: -1 })
    .exec();

    const threadResponses = await Promise.all(
      threads.map(async (thread) => {
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
      }),
    );

    return threadResponses;
  }

  async updateThreadLastMessage(threadId: string, messageId: string): Promise<void> {
    await this.threadModel.findByIdAndUpdate(threadId, {
      lastMessageId: messageId,
      lastMessageAt: new Date(),
    }).exec();
  }
}

