import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  Param,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// ORM
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { AuthMiddleware } from './middlewares/auth.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'nestjs__demo',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    CoursesModule,
  ],
})

// Em làm demo nên hong có chia private public rõ ràng anh chị thông cảm nhé em để private hết trừ login
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: 'courses', method: RequestMethod.ALL },
      {
        path: 'users',
        method: RequestMethod.GET,
      },
      { path: 'users/:id', method: RequestMethod.GET },
      {
        path: 'users',
        method: RequestMethod.PATCH,
      },
      {
        path: 'users',
        method: RequestMethod.DELETE,
      },
    );
  }
}
