import { UserStatus } from "src/entities/user.entity";

export class UserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}