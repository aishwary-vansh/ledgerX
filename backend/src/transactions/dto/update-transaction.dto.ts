// src/transactions/dto/update-transaction.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateTransactionDto } from './create-transaction.dto';

/**
 * All fields from CreateTransactionDto become optional.
 * This is the NestJS idiomatic way to build PATCH DTOs.
 */
export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}
