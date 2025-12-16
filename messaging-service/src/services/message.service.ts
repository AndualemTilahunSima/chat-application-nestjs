import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from '../entities/message.entity';
import { ThreadService } from './thread.service';
import { CreateMessageDto } from '../dto/create-message.dto';
import { MessageResponseDto } from '../dto/message-response.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    private threadService: ThreadService,
  ) {}

  async createMessage(
    createMessageDto: CreateMessageDto,
    senderId: string,
  ): Promise<MessageResponseDto> {
    // Find or create thread
    const thread = await this.threadService.findOrCreateThread(
      senderId,
      createMessageDto.receiverId,
    );

    // Create message
    const message = new this.messageModel({
      threadId: thread._id.toString(),
      senderId,
      receiverId: createMessageDto.receiverId,
      text: createMessageDto.text,
      isRead: false,
    });

    const savedMessage = await message.save();

    // Update thread with last message
    await this.threadService.updateThreadLastMessage(
      thread._id.toString(),
      savedMessage._id.toString(),
    );

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

  async getMessagesByThread(threadId: string, userId: string): Promise<MessageResponseDto[]> {
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

  async markThreadAsRead(threadId: string, userId: string): Promise<void> {
    await this.messageModel.updateMany(
      {
        threadId,
        receiverId: userId,
        isRead: false,
      },
      {
        $set: { isRead: true },
      },
    ).exec();
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.messageModel.countDocuments({
      receiverId: userId,
      isRead: false,
    }).exec();
  }
}

