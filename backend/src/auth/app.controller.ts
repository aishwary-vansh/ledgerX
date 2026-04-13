import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private readonly config: ConfigService) {}

  @Get()
  root() {
    return {
      success: true,
      data: {
        name: 'LedgerX API',
        version: '1.0.0',
        status: 'healthy',
        environment: this.config.get('NODE_ENV') || 'development',
        timestamp: new Date().toISOString(),
        endpoints: {
          auth: '/api/v1/auth',
          transactions: '/api/v1/transactions',
          docs: '/api/docs',
        },
      },
    };
  }
}