// src/transactions/dto/query-transactions.dto.ts
import { IsOptional, IsIn, IsString, IsNumberString, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { VALID_CATEGORIES } from '../transaction.entity';

const CATEGORIES = [...VALID_CATEGORIES];
const SORT_FIELDS = ['date', 'amount', 'description', 'category', 'type'] as const;
const SORT_DIRS = ['asc', 'desc'] as const;

export class QueryTransactionsDto {
  // ─── Pagination ────────────────────────────────────────────────────────
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  // ─── Filters ───────────────────────────────────────────────────────────
  @ApiPropertyOptional({ enum: ['income', 'expense', 'all'], default: 'all' })
  @IsOptional()
  @IsIn(['income', 'expense', 'all'])
  type?: 'income' | 'expense' | 'all';

  @ApiPropertyOptional({ enum: CATEGORIES })
  @IsOptional()
  @IsIn([...CATEGORIES, 'all'])
  category?: string;

  @ApiPropertyOptional({ description: 'Full-text search on description and category' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'From date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({ description: 'To date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  // ─── Sorting ───────────────────────────────────────────────────────────
  @ApiPropertyOptional({ enum: SORT_FIELDS, default: 'date' })
  @IsOptional()
  @IsIn(SORT_FIELDS)
  sortBy?: string;

  @ApiPropertyOptional({ enum: SORT_DIRS, default: 'desc' })
  @IsOptional()
  @IsIn(SORT_DIRS)
  sortDir?: 'asc' | 'desc';
}
