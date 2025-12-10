import { Inject, Injectable } from '@nestjs/common';
import { UserResponseDto } from 'src/dto/user-response.dto';
import { UserDto } from 'src/dto/user.dto';
import * as bcrypt from 'bcryptjs';
import { UserMapper } from 'src/mappers/user.mapper';
import { UserConflictException, UserNotFoundException } from 'src/exceptions/custom.exceptions';
import { UserRepository } from 'src/repositories/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity, UserStatus } from '../entities/user.entity';
import { RedisService } from '../common/redis.service';
import { OtpResponseDto } from 'src/dto/otp-response.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: UserRepository,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly redisService: RedisService,
  ) { }

  async createUser(userDto: UserDto): Promise<OtpResponseDto> {

    const existingUser = await this.userRepository.findByEmail(userDto.email);

    if (existingUser) {
      throw new UserConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userDto.password, 10);

    userDto.password = hashedPassword;

    // Create user domain entity
    const userEntity = UserMapper.toEntity(userDto);

    // Save user
    const savedUser = await this.userRepository.create(userEntity);

    const otp = await this.generateOtp(savedUser);

    return UserMapper.toOtpResponseDto(otp);
  }

  async generateOtp(saved: UserEntity) {

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.redisService.set(`otp:user:${otp}`, saved.id, 300);

    return otp;
  }

  async verifyOtp(otp: string) {
    const key = `otp:user:${otp}`;
    console.log('Verifying OTP with key:', key);
    const userId = await this.redisService.get(key);
    if (userId) {
      let user = await this.userRepository.findById(userId);
      if (!user) {
        throw new UserNotFoundException(`User with ID ${userId} not found`);
      }
      user.status = UserStatus.ACTIVE;
      await this.userRepository.update(userId, user);
      await this.redisService.del(key);
      return true;
    }
    return false;
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException(`User with ID ${id} not found`);
    }
    return UserMapper.toResponseDto(user);
  }

  async getUserByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UserNotFoundException(`User with Email ${email} not found`);
    }
    return UserMapper.toResponseDto(user);
  }

  async getAllUsers(page: number = 1, limit: number = 10): Promise<{ users: UserResponseDto[]; total: number; page: number; totalPages: number }> {
    const { users, total } = await this.userRepository.findAll(page, limit);

    return {
      users: users.map(user => UserMapper.toResponseDto(user)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateUser(id: string, userDto: UserDto): Promise<UserResponseDto> {

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new UserNotFoundException(`User with ID ${id} not found`);
    }

    const userEntity = UserMapper.toEntity(userDto);

    const updatedUser = await this.userRepository.update(id, userEntity);

    if (!updatedUser) {
      throw new UserNotFoundException(`User with ID ${id} not found`);
    }

    return UserMapper.toResponseDto(updatedUser);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException(`User with ID ${id} not found`);
    }
    await this.userRepository.delete(id);
  }
}