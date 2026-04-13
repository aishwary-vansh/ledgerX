// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './config/app.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AppController } from './auth/app.controller';

@Module({
  imports: [
    // ── Config — globally available via ConfigService ──────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: '.env',
    }),

    // ── Feature modules ───────────────────────────────────────────────
    UsersModule,
    AuthModule,
    TransactionsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
