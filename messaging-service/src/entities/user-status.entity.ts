import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserStatusDocument = UserStatus & Document;

export enum OnlineStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
}

@Schema({ timestamps: true })
export class UserStatus {
  @Prop({ required: true, unique: true, type: String })
  userId: string;

  @Prop({ type: String, enum: OnlineStatus, default: OnlineStatus.OFFLINE })
  status: OnlineStatus;

  @Prop({ type: Date, default: Date.now })
  lastSeen: Date;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const UserStatusSchema = SchemaFactory.createForClass(UserStatus);

