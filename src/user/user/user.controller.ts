/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ChangePasswordDto } from 'src/change-password-dto';
import { UpdateUserDto } from '../user-dto/update-user-dto';
import { UserDto } from '../user-dto/user-dto';
import { UserEntity } from '../user-entity/user-entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('/create')
    async create(@Body() createUserDto: UserDto): Promise<UserEntity> {
        return await this.userService.save(createUserDto);
    }

    @Get('/find/all')
    async findAll(): Promise<UserEntity[]> {
        return await this.userService.findAll();
    }

    @Get('/find/:id')
    async findOne(@Param('id') id: string): Promise<UserEntity> {
        return await this.userService.findOne(+id);
    }

    @Get('/findByEmail/:email')
    async findByEmail(@Param('email') email: string): Promise<UserEntity> {
        return await this.userService.findByEmail(email);
    }

    @Put('/update/:id')
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<UserEntity> {
        return await this.userService.update(+id, updateUserDto);
    }

    @Delete('/delete/:id')
    async remove(@Param('id') id: string): Promise<void> {
        return await this.userService.remove(+id);
    }

    @Post('/change-password')
    async changePassword(
        @Body() changePasswordDto: ChangePasswordDto,
    ): Promise<UserEntity> {
        return await this.userService.changePassword(changePasswordDto);
    }
}
