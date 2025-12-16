import { Document } from 'mongoose';
export type ThreadDocument = Thread & Document;
export declare class Thread {
    participantIds: string[];
    lastMessageId?: string;
    lastMessageAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ThreadSchema: import("mongoose").Schema<Thread, import("mongoose").Model<Thread, any, any, any, Document<unknown, any, Thread, any, {}> & Thread & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Thread, Document<unknown, {}, import("mongoose").FlatRecord<Thread>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Thread> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
