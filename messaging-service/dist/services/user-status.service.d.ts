import { Model } from 'mongoose';
import { UserStatusDocument, OnlineStatus } from '../entities/user-status.entity';
export declare class UserStatusService {
    private userStatusModel;
    constructor(userStatusModel: Model<UserStatusDocument>);
    setUserOnline(userId: string): Promise<void>;
    setUserOffline(userId: string): Promise<void>;
    getUserStatus(userId: string): Promise<OnlineStatus | null>;
    getUsersStatus(userIds: string[]): Promise<Record<string, OnlineStatus>>;
}
