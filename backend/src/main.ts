// src/main.ts
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'warn', 'error', 'debug'],
  });

  const config = app.get(ConfigService);
  const port = config.get<number>('port') ?? 3001;
  const corsOrigins = config.get<string[]>('cors.origins') ?? ['http://localhost:5173'];
  const isDev = config.get<string>('nodeEnv') !== 'production';

  // ── Global prefix ────────────────────────────────────────────────────────
  app.setGlobalPrefix('api/v1');

  // ── CORS ─────────────────────────────────────────────────────────────────
  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // ── Global validation pipe ───────────────────────────────────────────────
  // Strips unknown fields, transforms types, returns clear 400 messages
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // strip extra fields not in DTO
      forbidNonWhitelisted: true,// 400 if extra fields sent
      transform: true,           // auto-cast query params to their DTO types
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ── Global filters & interceptors ────────────────────────────────────────
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor(), new TransformInterceptor());

  // ── Swagger (dev only) ───────────────────────────────────────────────────
  if (isDev) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('LedgerX API')
      .setDescription(
        'REST API for the LedgerX Finance Dashboard.\n\n' +
        '**Auth flow:** `POST /auth/login` → copy `accessToken` → click 🔒 Authorize → paste `Bearer <token>`',
      )
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('Auth', 'Register, login, profile')
      .addTag('Transactions', 'CRUD + analytics endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });

    Logger.log(`📖 Swagger docs → http://localhost:${port}/api/docs`, 'Bootstrap');
  }

  // ── Seed admin user ──────────────────────────────────────────────────────
  const usersService = app.get(UsersService);
  const adminEmail    = config.get<string>('ADMIN_EMAIL')    ?? 'admin@ledgerx.com';
  const adminPassword = config.get<string>('ADMIN_PASSWORD') ?? 'Admin@1234';
  await usersService.seed(adminEmail, adminPassword, 'Admin', 'admin');
  await usersService.seed('viewer@ledgerx.com', 'Viewer@1234', 'Demo Viewer', 'viewer');
  Logger.log(`🌱 Seed users ready  →  ${adminEmail} / ${adminPassword}`, 'Bootstrap');

  // ── Listen ───────────────────────────────────────────────────────────────
  await app.listen(port);
  Logger.log(`🚀 LedgerX API      →  http://localhost:${port}/api/v1`, 'Bootstrap');
}

bootstrap();
