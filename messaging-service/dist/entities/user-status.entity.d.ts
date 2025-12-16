import { Document } from 'mongoose';
export type UserStatusDocument = UserStatus & Document;
export declare enum OnlineStatus {
    ONLINE = "online",
    OFFLINE = "offline"
}
export declare class UserStatus {
    userId: string;
    status: OnlineStatus;
    lastSeen: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const UserStatusSchema: import("mongoose").Schema<UserStatus, import("mongoose").Model<UserStatus, any, any, any, Document<unknown, any, UserStatus, any, {}> & UserStatus & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserStatus, Document<unknown, {}, import("mongoose").FlatRecord<UserStatus>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<UserStatus> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
