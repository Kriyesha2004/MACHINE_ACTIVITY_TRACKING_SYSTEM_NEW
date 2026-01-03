import { Controller, Get, Post, Body, Put, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async findAll() {
        return this.usersService.findAll();
    }

    @Post()
    async create(@Body() createUserDto: any) {
        // If password is not provided, set a default one
        const password = createUserDto.password || 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        return this.usersService.create({
            ...createUserDto,
            password: hashedPassword
        });
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: any) {
        return this.usersService.update(id, updateUserDto);
    }
}
