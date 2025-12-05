import { Inject, Injectable } from '@nestjs/common';
import { UserResponseDto } from 'src/dto/user-response.dto';
import { UserDto } from 'src/dto/user.dto';
import * as bcrypt from 'bcryptjs';
import { UserMapper } from 'src/mappers/user.mapper';
import { UserConflictException, UserNotFoundException } from 'src/exceptions/custom.exceptions';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async createUser(userDto: UserDto): Promise<UserResponseDto> {
    
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

    return UserMapper.toResponseDto(savedUser);
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException(`User with ID ${id} not found`);
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