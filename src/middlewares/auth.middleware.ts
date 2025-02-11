import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from 'src/users/users.entity';
import { DataSource } from 'typeorm';

interface AuthRequest extends Request {
  user?: User;
}
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private userRepository: any;
  constructor(private readonly dataSource: DataSource) {
    this.userRepository = this.dataSource.getRepository(User);
  }

  async use(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Không có token');
    }

    const token = authHeader.split(' ')[1];

    try {
      if (!token) throw new UnauthorizedException('Không có token');
      const user = await this.userRepository.findOne({
        where: { token: token },
      });
      if (!user) throw new UnauthorizedException('Token không hợp lệ');
      req.user = user;
      next();
    } catch (error) {
      throw new UnauthorizedException('Token không hợp lệ');
    }
  }
}
