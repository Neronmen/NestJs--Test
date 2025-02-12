import { User } from 'src/users/users.entity';
import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // [POST] http://localhost:3000/auth (email,password)
  @Post()
  loginController(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<{
    status: number;
    message: string;
    user?: Partial<User>;
    token?: string;
  }> {
    return this.authService.login(email, password);
  }
}
