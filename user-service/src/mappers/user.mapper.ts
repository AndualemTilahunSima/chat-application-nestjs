import { UserDto } from '../dto/user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserEntity } from '../entities/user.entity';

export class UserMapper {

  static toEntity(user: UserDto): UserEntity {
    const entity = new UserEntity();
    entity.email = user.email;
    entity.firstName = user.firstName;
    entity.lastName = user.lastName;
    entity.password = user.password;
    return entity;
  }

  static toResponseDto(userEntity: UserEntity): UserResponseDto {

    const dto = new UserResponseDto();
    dto.id = userEntity.id;
    dto.email = userEntity.email;
    dto.firstName = userEntity.firstName;
    dto.lastName = userEntity.lastName;
    dto.isActive = userEntity.isActive;
    dto.createdAt = userEntity.createdAt;
    dto.updatedAt = userEntity.updatedAt;
    return dto;
  }
}