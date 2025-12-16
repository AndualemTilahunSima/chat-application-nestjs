export class ThreadResponseDto {
  id: string;
  participantIds: string[];
  lastMessage?: {
    text: string;
    senderId: string;
    createdAt: Date;
  };
  lastMessageAt?: Date;
  unreadCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

