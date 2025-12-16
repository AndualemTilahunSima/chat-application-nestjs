export class MessageResponseDto {
  id: string;
  threadId: string;
  senderId: string;
  receiverId: string;
  text: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

