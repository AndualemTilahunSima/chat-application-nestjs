import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ThreadDocument = Thread & Document;

@Schema({ timestamps: true })
export class Thread {
  @Prop({ required: true, type: [String] })
  participantIds: string[];

  @Prop({ type: String })
  lastMessageId?: string;

  @Prop({ type: Date, default: Date.now })
  lastMessageAt?: Date;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const ThreadSchema = SchemaFactory.createForClass(Thread);

// Create compound index for efficient querying
ThreadSchema.index({ participantIds: 1 });

