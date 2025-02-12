import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import * as md5 from 'md5';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // [POST] http://localhost:3000/auth (email,password)
  async login(
    email: string,
    password: string,
  ): Promise<{
    status: number;
    message: string;
    user?: Partial<User>;
    token?: string;
  }> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Email không tồn tại',
      });
    }
    if (md5(password.trim()) !== user.password) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Mật khẩu không chính xác ',
      });
    }
    const { password: _, ...userWithoutPassword } = user;
    const payload = { id: user.id, role: user.role };
    const tokenJWT = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return {
      status: HttpStatus.OK,
      message: 'Đăng nhập thành công',
      user: userWithoutPassword,
      token: tokenJWT,
    };
  }
}
