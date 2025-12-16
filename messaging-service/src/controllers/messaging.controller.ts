import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { ThreadService } from '../services/thread.service';
import { UserStatusService } from '../services/user-status.service';
import { CreateMessageDto } from '../dto/create-message.dto';
import { MarkReadDto } from '../dto/mark-read.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('messaging')
@UseGuards(JwtAuthGuard)
export class MessagingController {
  constructor(
    private readonly messageService: MessageService,
    private readonly threadService: ThreadService,
    private readonly userStatusService: UserStatusService,
  ) {}

  @Get('threads')
  async getThreads(@Request() req) {
    const userId = req.user.sub;
    return this.threadService.getUserThreads(userId);
  }

  @Get('threads/:threadId/messages')
  async getMessages(@Request() req, @Param('threadId') threadId: string) {
    const userId = req.user.sub;
    return this.messageService.getMessagesByThread(threadId, userId);
  }

  @Post('messages')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createMessage(@Request() req, @Body() createMessageDto: CreateMessageDto) {
    const userId = req.user.sub;
    return this.messageService.createMessage(createMessageDto, userId);
  }

  @Post('threads/:threadId/read')
  async markThreadAsRead(@Request() req, @Param('threadId') threadId: string) {
    const userId = req.user.sub;
    await this.messageService.markThreadAsRead(threadId, userId);
    return { success: true };
  }

  @Get('status')
  async getUserStatus(@Request() req) {
    const userId = req.user.sub;
    const status = await this.userStatusService.getUserStatus(userId);
    return { userId, status: status || 'offline' };
  }
}

