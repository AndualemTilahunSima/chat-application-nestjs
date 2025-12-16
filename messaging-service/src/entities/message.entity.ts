import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true, type: String })
  threadId: string;

  @Prop({ required: true, type: String })
  senderId: string;

  @Prop({ required: true, type: String })
  receiverId: string;

  @Prop({ required: true, type: String })
  text: string;

  @Prop({ type: Boolean, default: false })
  isRead: boolean;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

