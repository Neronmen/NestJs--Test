import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { generateRandomString } from 'src/helpers/generate';
import * as md5 from 'md5';
import { CreateUserDto } from 'src/validate/createUser.dto';

interface AuthRequest extends Request {
  user?: User;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // Cần token Headers

  // [GET] http://localhost:3000/users
  async findAllUsers(page: string, limit: string) {
    //Pagination
    const pagination = {
      currentPage: Number(page) || 1,
      pageSize: Number(limit) || 10,
    };
    const skip = (pagination.currentPage - 1) * pagination.pageSize;
    const [users, totalUsers] = await this.usersRepository.findAndCount({
      skip: skip,
      take: pagination.pageSize,
    });

    const totalPages = Math.ceil(totalUsers / pagination.pageSize);
    //Pagination
    
    return {
      totalUsers,
      totalPages,
      currentPage: pagination.currentPage,
      users: users.map(({ password, ...userNotPassword }) => userNotPassword),
    };
  }

  // [GET] http://localhost:3000/users/:id
  async findOneUser(
    id: number,
  ): Promise<{ status: number; message: string; user?: Partial<User> }> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: `User ID ${id} không tồn tại`,
      });
    }
    const { password, ...userNotPassword } = user;
    return {
      status: HttpStatus.OK,
      message: `Lấy dữ liệu thành công`,
      user: userNotPassword,
    };
  }

  // [POST] http://localhost:3000/users (kèm data)
  async createUser(userData: CreateUserDto) {
    if (!userData) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Vui lòng gửi đầy đủ dữ liệu',
      });
    }
    const emailExist = await this.usersRepository.findOne({
      where: { email: userData.email },
    });
    if (emailExist) {
      throw new BadRequestException('Email đã tồn tại');
    }
    // hash password
    if (userData.password) {
      userData.password = md5(userData.password.trim());
    }
    // End hash password
    const newUser = this.usersRepository.create(userData);
    if (!newUser) {
      throw new NotFoundException('Tạo không thành công');
    }
    this.usersRepository.save(newUser);
    return {
      status: HttpStatus.OK,
      message: 'Tạo tài khoản thành công',
      user: newUser,
    };
  }

  // [DELETE] http://localhost:3000/users/:id
  async remove(id: number): Promise<{ status: number; message: string }> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: `User với ID ${id} không tồn tại`,
      });
    }
    await this.usersRepository.delete(id);
    return {
      status: HttpStatus.OK,
      message: `Xóa thành công User với ID ${id} `,
    };
  }

  // [PATCH] http://localhost:3000/users/:id (kèm data)
  async updateUser(
    userData: Partial<User>,
    id: number,
  ): Promise<{
    status: number;
    message: string;
    user?: Partial<User>;
    userWrongName?: { [key: string]: any };
  }> {
    const { name, email } = userData;
    const emailExist = await this.usersRepository.findOne({
      where: { email: email },
    });
    const nameExist = await this.usersRepository.findOne({
      where: { name: name },
    });

    if (nameExist) {
      const users = await this.usersRepository.find();

      const nameRepeatArray = users
        .filter((item) => item.name === name)
        .map(({ name }) => ({ name }));
      const nameNotSameArray = users
        .filter((item) => item.name !== name)
        .map(({ name }) => ({ name }));
      const arrNameTotal = {
        NameExisted: nameRepeatArray,
        NameNotSame: nameNotSameArray,
      };
      return {
        status: HttpStatus.BAD_REQUEST,
        message: `Tên  này đã tồn tại `,
        userWrongName: arrNameTotal,
      };
    }
    if (emailExist) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Email này đã tồn tại',
      };
    }
    if (userData.password) {
      userData.password = md5(userData.password);
    }

    const updatedUser = await this.usersRepository.save({ id, ...userData });
    const { password, ...updatedUserNotPassword } = updatedUser;
    return {
      status: HttpStatus.OK,
      message: 'Cập nhật  thành công',
      user: updatedUserNotPassword,
    };
  }
}
