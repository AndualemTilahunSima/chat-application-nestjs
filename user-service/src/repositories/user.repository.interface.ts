import { UserEntity } from "src/entities/user.entity";

export interface IUserRepository {
    create(user: UserEntity): Promise<UserEntity>;
    findById(id: string): Promise<UserEntity | null>;
    findByEmail(email: string): Promise<UserEntity | null>;
    findAll(page: number, limit: number): Promise<{ users: UserEntity[]; total: number }>;
    update(id: string, user: UserEntity): Promise<UserEntity | null>;
    delete(id: string): Promise<void>;
}

export const IUserRepository = 'IUserRepository';
