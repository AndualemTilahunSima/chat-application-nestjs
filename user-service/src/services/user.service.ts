import { Inject, Injectable } from '@nestjs/common';
import { UserResponseDto } from 'src/dto/user-response.dto';
import { UserDto } from 'src/dto/user.dto';
import { UserMapper } from 'src/mappers/user.mapper';
import { UserConflictException, UserNotFoundException } from 'src/exceptions/custom.exceptions';
import { UserRepository } from 'src/repositories/user.repository';
import { UserEntity, UserStatus } from '../entities/user.entity';
import { RedisService } from '../common/redis.service';
import { OtpResponseDto } from 'src/dto/otp-response.dto';
import { StorageClientService } from './storage-client.service';

@Injectable()
export class UserService {
  private readonly OTP_EXPIRATION_TIME = 300; // 5 minutes in seconds
  private readonly OTP_KEY_PREFIX = 'otp:user:';

  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: UserRepository,
    private readonly redisService: RedisService,
    private readonly storageClientService: StorageClientService,
  ) {}

  async createUser(userDto: UserDto): Promise<OtpResponseDto> {
    const existingUser = await this.userRepository.findByEmail(userDto.email);

    if (existingUser) {
      throw new UserConflictException('User with this email already exists');
    }

    // Create user domain entity (password will be hashed by entity hook)
    const userEntity = UserMapper.toEntity(userDto);

    // Save user
    const savedUser = await this.userRepository.create(userEntity);

    // Generate and store OTP
    const otp = await this.generateOtp(savedUser.id);

    return UserMapper.toOtpResponseDto(otp);
  }

  async generateOtp(userId: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const key = `${this.OTP_KEY_PREFIX}${otp}`;

    await this.redisService.set(key, userId, this.OTP_EXPIRATION_TIME);

    return otp;
  }

  async verifyOtp(otp: string): Promise<boolean> {
    const key = `${this.OTP_KEY_PREFIX}${otp}`;
    const userId = await this.redisService.get(key);

    if (!userId) {
      return false;
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundException(`User with ID ${userId} not found`);
    }

    // Update user status to active
    user.status = UserStatus.ACTIVE;
    await this.userRepository.update(userId, user);

    // Delete OTP from Redis
    await this.redisService.del(key);

    return true;
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
      throw new UserNotFoundException(`User with email ${email} not found`);
    }

    return UserMapper.toResponseDto(user);
  }

  async getAllUsers(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    users: UserResponseDto[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { users, total } = await this.userRepository.findAll(page, limit);

    return {
      users: users.map((user) => UserMapper.toResponseDto(user)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateUser(id: string, userDto: UserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findById(id);

    if (!existingUser) {
      throw new UserNotFoundException(`User with ID ${id} not found`);
    }

    // Check if email is being changed and if it's already taken
    if (userDto.email !== existingUser.email) {
      const emailExists = await this.userRepository.findByEmail(userDto.email);
      if (emailExists) {
        throw new UserConflictException('User with this email already exists');
      }
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

  async updateProfileImage(userId: string, file: Express.Multer.File): Promise<any> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundException(`User with ID ${userId} not found`);
    }

    // Upload file to storage service
    const uploadResult = await this.storageClientService.uploadFile(file);

    // Update user with profile image ID
    user.profileImage = uploadResult.id;
    const updatedUser = await this.userRepository.update(userId, user);

    if (!updatedUser) {
      throw new UserNotFoundException(`User with ID ${userId} not found`);
    }

    // Get presigned URL for the uploaded image
    const presignedUrl = await this.storageClientService.getPresignedUrl(uploadResult.id);

    // Return user data with presigned URL
    const userDto = UserMapper.toResponseDto(updatedUser);
    return {
      ...userDto,
      profileImageUrl: presignedUrl,
    };
  }
}