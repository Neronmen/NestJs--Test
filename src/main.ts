import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Kiểu nó giống middleware để xác thực validate rồi mới chạy vào controller
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  // Global Route Prefix
  app.setGlobalPrefix('api/v1', { exclude: [''] });
  // End Global Route Prefix

  // PORT ENV
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  await app.listen(port);
  // End PORT ENV
}
bootstrap();
