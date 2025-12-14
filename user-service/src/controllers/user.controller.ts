import { Controller, Get, Post, Put, Delete, Body, Param, Query, ValidationPipe, UsePipes, Patch, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserDto } from 'src/dto/user.dto';
import { UserService } from 'src/services/user.service';
import { AuthGuard } from './auth.guard';


@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async createUser(@Body() userDto: UserDto) {
        return await this.userService.createUser(userDto);
    }

    @UseGuards(AuthGuard)
    @Get()
    async getAllUsers(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        return await this.userService.getAllUsers(Number(page), Number(limit));
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    async getUserById(@Param('id') id: string) {
        return await this.userService.getUserById(id);
    }

    @UseGuards(AuthGuard)
    @Put(':id')
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async updateUser(
        @Param('id') id: string,
        @Body() userDto: UserDto,
    ) {
        return await this.userService.updateUser(id, userDto);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        await this.userService.deleteUser(id);
        return { message: 'User deleted successfully' };
    }

    @Patch(':otp/verify')
    async verifyUser(@Param('otp') otp: string) {
        const result = await this.userService.verifyOtp(otp);
        return result ? { message: 'OTP verified successfully' } : { message: 'Invalid OTP' };
    }

    @UseGuards(AuthGuard)
    @Post(':id/profile-image')
    @UseInterceptors(FileInterceptor('file'))
    async uploadProfileImage(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) {
            throw new Error('No file provided');
        }
        return await this.userService.updateProfileImage(id, file);
    }
}