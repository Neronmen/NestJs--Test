import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { User } from './users.entity';
import { UpdateUserDto } from 'src/validate/updateUser.dto';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // [GET] http://localhost:3000/users
  @Get()
  getAllUser(): Promise<Partial<User>[]> {
    return this.usersService.findAllUsers();
  }

  // [GET] http://localhost:3000/users/:id
  @Get(':id')
  getUserById(
    @Param('id') id: number,
  ): Promise<{ status: number; message: string; user?: Partial<User> }> {
    return this.usersService.findOneUser(id);
  }

  // [POST] http://localhost:3000/users (kèm data)
  @Post()
  createNewUser(
    @Body() userData: Partial<User>,
  ): Promise<{ status: number; message: string; user?: Partial<User> }> {
    return this.usersService.createUser(userData);
  }

  // [DELETE] http://localhost:3000/users/:id
  @Delete(':id')
  deleteUser(
    @Param('id') id: number,
  ): Promise<{ status: number; message: string }> {
    return this.usersService.remove(id);
  }

  // [PATCH] http://localhost:3000/users/:id (kèm data)
  @Patch(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() userData: UpdateUserDto,
  ): Promise<{
    status: number;
    message: string;
    user?: Partial<User>;
    userWrongName?: { [key: string]: any };
  }> {
    return this.usersService.updateUser(userData, id);
  }
}
