// src/transactions/dto/create-transaction.dto.ts
import {
  IsString,
  IsNumber,
  IsPositive,
  IsIn,
  IsDateString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VALID_CATEGORIES } from '../transaction.entity';

const CATEGORIES = [...VALID_CATEGORIES];
const TYPES = ['income', 'expense'] as const;

export class CreateTransactionDto {
  @ApiProperty({ example: 'Zomato Order' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  description: string;

  @ApiProperty({ example: 450 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @ApiProperty({ example: '2025-04-20', description: 'ISO date YYYY-MM-DD' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 'Food & Dining', enum: CATEGORIES })
  @IsIn(CATEGORIES, { message: `category must be one of: ${CATEGORIES.join(', ')}` })
  category: string;

  @ApiProperty({ example: 'expense', enum: TYPES })
  @IsIn(TYPES, { message: 'type must be income or expense' })
  type: 'income' | 'expense';
}
