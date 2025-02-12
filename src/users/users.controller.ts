import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { User } from './users.entity';
import { UpdateUserDto } from 'src/validate/updateUser.dto';
import { CreateUserDto } from 'src/validate/createUser.dto';

// interface AuthRequest extends Request {
//   user?: User;
// }

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // [GET] http://localhost:3000/users
  @Get()
  getAllUser(
    @Query('limit') limit: string,
    @Query('page') page: string,
  ) {
    return this.usersService.findAllUsers(page,limit);
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
  createNewUser(@Body() userData: CreateUserDto) {
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
