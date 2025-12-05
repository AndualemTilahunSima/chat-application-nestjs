import { Controller, Get, Post, Put, Delete, Body, Param, Query, ValidationPipe, UsePipes } from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';
import { UserService } from 'src/services/user.service';



@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async createUser(@Body() userDto: UserDto) {
        return await this.userService.createUser(userDto);
    }

    @Get()
    async getAllUsers(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        return await this.userService.getAllUsers(Number(page), Number(limit));
    }

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        return await this.userService.getUserById(id);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async updateUser(
        @Param('id') id: string,
        @Body() userDto: UserDto,
    ) {
        return await this.userService.updateUser(id, userDto);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        await this.userService.deleteUser(id);
        return { message: 'User deleted successfully' };
    }
}