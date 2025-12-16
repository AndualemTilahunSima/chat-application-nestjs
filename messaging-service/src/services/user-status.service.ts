import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserStatus, UserStatusDocument, OnlineStatus } from '../entities/user-status.entity';

@Injectable()
export class UserStatusService {
  constructor(
    @InjectModel(UserStatus.name) private userStatusModel: Model<UserStatusDocument>,
  ) {}

  async setUserOnline(userId: string): Promise<void> {
    await this.userStatusModel.findOneAndUpdate(
      { userId },
      {
        userId,
        status: OnlineStatus.ONLINE,
        lastSeen: new Date(),
      },
      { upsert: true, new: true },
    ).exec();
  }

  async setUserOffline(userId: string): Promise<void> {
    await this.userStatusModel.findOneAndUpdate(
      { userId },
      {
        userId,
        status: OnlineStatus.OFFLINE,
        lastSeen: new Date(),
      },
      { upsert: true, new: true },
    ).exec();
  }

  async getUserStatus(userId: string): Promise<OnlineStatus | null> {
    const status = await this.userStatusModel.findOne({ userId }).exec();
    return status ? status.status : null;
  }

  async getUsersStatus(userIds: string[]): Promise<Record<string, OnlineStatus>> {
    const statuses = await this.userStatusModel.find({
      userId: { $in: userIds },
    }).exec();

    const statusMap: Record<string, OnlineStatus> = {};
    statuses.forEach((status) => {
      statusMap[status.userId] = status.status;
    });

    // Set default offline for users not found
    userIds.forEach((userId) => {
      if (!statusMap[userId]) {
        statusMap[userId] = OnlineStatus.OFFLINE;
      }
    });

    return statusMap;
  }
}

