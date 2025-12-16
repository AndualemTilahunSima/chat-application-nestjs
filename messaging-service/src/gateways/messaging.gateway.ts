import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MessageService } from '../services/message.service';
import { UserStatusService } from '../services/user-status.service';
import { CreateMessageDto } from '../dto/create-message.dto';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },
  namespace: '/messaging',
})
export class MessagingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(MessagingGateway.name);
  private connectedUsers = new Map<string, string>(); // userId -> socketId

  constructor(
    private readonly messageService: MessageService,
    private readonly userStatusService: UserStatusService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        this.logger.warn('Connection rejected: No token provided');
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token);
      const userId = payload.sub;

      if (!userId) {
        this.logger.warn('Connection rejected: Invalid token payload');
        client.disconnect();
        return;
      }

      client.userId = userId;
      this.connectedUsers.set(userId, client.id);

      // Set user status to online
      await this.userStatusService.setUserOnline(userId);

      // Notify other users about this user coming online
      this.server.emit('user-online', { userId });

      this.logger.log(`Client connected: ${client.id} (User: ${userId})`);
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.disconnect();
    }
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      this.connectedUsers.delete(client.userId);
      
      // Set user status to offline
      await this.userStatusService.setUserOffline(client.userId);

      // Notify other users about this user going offline
      this.server.emit('user-offline', { userId: client.userId });

      this.logger.log(`Client disconnected: ${client.id} (User: ${client.userId})`);
    }
  }

  @SubscribeMessage('send-message')
  async handleMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.userId) {
      return { error: 'Unauthorized' };
    }

    try {
      // Create message in database
      const message = await this.messageService.createMessage(
        createMessageDto,
        client.userId,
      );

      // Get receiver socket ID
      const receiverSocketId = this.connectedUsers.get(createMessageDto.receiverId);

      // Emit to receiver if online
      if (receiverSocketId) {
        this.server.to(receiverSocketId).emit('new-message', message);
      }

      // Also emit to sender for confirmation
      this.server.to(client.id).emit('message-sent', message);

      return { success: true, message };
    } catch (error) {
      this.logger.error(`Error sending message: ${error.message}`);
      return { error: error.message };
    }
  }

  @SubscribeMessage('mark-read')
  async handleMarkRead(
    @MessageBody() data: { threadId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.userId) {
      return { error: 'Unauthorized' };
    }

    try {
      await this.messageService.markThreadAsRead(data.threadId, client.userId);
      return { success: true };
    } catch (error) {
      this.logger.error(`Error marking as read: ${error.message}`);
      return { error: error.message };
    }
  }

  // Helper method to emit message to specific user
  emitToUser(userId: string, event: string, data: any) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.server.to(socketId).emit(event, data);
    }
  }
}

