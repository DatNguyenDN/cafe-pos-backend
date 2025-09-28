import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const configService = app.get(ConfigService);

  // Đặt prefix cho toàn bộ API
  app.setGlobalPrefix('api');

  // Pipes để validate DTO
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Đọc PORT từ ENV (quan trọng khi deploy)
  const port = configService.get<number>('PORT') || process.env.PORT || 4000;

  await app.listen(port, '0.0.0.0'); // <-- Quan trọng khi deploy (lắng nghe mọi IP, không chỉ localhost)

  console.log(`🚀 Backend running on http://localhost:${port}/api`);
}
bootstrap();
