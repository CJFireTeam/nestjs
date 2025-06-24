import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*', // Allow all origins by default, or specify a specific origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
    app.useGlobalPipes(new ValidationPipe({
    whitelist: true,     // elimina campos que no están en el DTO
    forbidNonWhitelisted: true, // lanza error si hay campos extras
    transform: true       // convierte tipos automáticamente
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
