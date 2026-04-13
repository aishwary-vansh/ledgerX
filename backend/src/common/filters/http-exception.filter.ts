// src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Catches all HTTP exceptions and returns a consistent JSON error envelope:
 * { statusCode, message, error, path, timestamp }
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception.getResponse();
    const message =
      typeof exceptionResponse === 'object' && 'message' in (exceptionResponse as object)
        ? (exceptionResponse as any).message
        : exception.message;

    const body = {
      statusCode: status,
      message,
      error: exception.name,
      path: req.url,
      timestamp: new Date().toISOString(),
    };

    this.logger.error(`${req.method} ${req.url} → ${status}`, JSON.stringify(message));

    res.status(status).json(body);
  }
}
