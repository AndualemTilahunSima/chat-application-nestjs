import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from './user.repository.interface';
import { UserMapper } from 'src/mappers/user.mapper';
import { UserEntity } from 'src/entities/user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly repository: Repository<UserEntity>,
    ) { }

    async create(userEntity: UserEntity): Promise<UserEntity> {
        const newUser = await this.repository.save(userEntity);
        return newUser;
    }

    async findById(id: string): Promise<UserEntity | null> {
        const userEntity = await this.repository.findOne({ where: { id } });
        return userEntity ? userEntity : null;
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const userEntity = await this.repository.findOne({ where: { email } });
        return userEntity ? userEntity : null;
    }

    async findAll(page: number, limit: number): Promise<{ users: UserEntity[]; total: number }> {
        const skip = (page - 1) * limit;
        const [entities, total] = await this.repository.findAndCount({
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });

        return {
            users: entities,
            total,
        };
    }

    async update(id: string, user: UserEntity): Promise<UserEntity | null> {
        await this.repository.update(id, user as any);
        const updatedUser = await this.repository.findOne({ where: { id } });
        return updatedUser;
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}