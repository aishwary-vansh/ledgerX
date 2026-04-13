// src/transactions/transactions.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { QueryTransactionsDto } from './dto/query-transactions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly txService: TransactionsService) {}

  // ─── GET /transactions ────────────────────────────────────────────────────
  @Get()
  @ApiOperation({ summary: 'List transactions with filter, search, sort & pagination' })
  @ApiOkResponse({ description: 'Paginated transaction list' })
  findAll(@Query() query: QueryTransactionsDto) {
    return this.txService.findAll(query);
  }

  // ─── GET /transactions/summary ────────────────────────────────────────────
  @Get('summary')
  @ApiOperation({ summary: 'Total income / expenses / balance' })
  @ApiOkResponse({ description: 'Financial summary' })
  getSummary() {
    return this.txService.getSummary();
  }

  // ─── GET /transactions/monthly ────────────────────────────────────────────
  @Get('monthly')
  @ApiOperation({ summary: 'Monthly income & expense breakdown (for charts)' })
  @ApiOkResponse({ description: 'Array of { month, income, expenses, balance }' })
  getMonthly() {
    return this.txService.getMonthly();
  }

  // ─── GET /transactions/categories ────────────────────────────────────────
  @Get('categories')
  @ApiOperation({ summary: 'Expense totals grouped by category (for pie chart)' })
  @ApiOkResponse({ description: 'Array of { category, total } sorted desc' })
  getCategories() {
    return this.txService.getCategories();
  }

  // ─── GET /transactions/mom ────────────────────────────────────────────────
  @Get('mom')
  @ApiOperation({ summary: 'Month-over-month expense change' })
  @ApiOkResponse({ description: 'MoM delta with direction and percentage' })
  getMoM() {
    return this.txService.getMoMChange();
  }

  // ─── GET /transactions/:id ────────────────────────────────────────────────
  @Get(':id')
  @ApiOperation({ summary: 'Get a single transaction by ID' })
  @ApiOkResponse({ description: 'Transaction object' })
  @ApiNotFoundResponse({ description: 'Transaction not found' })
  findOne(@Param('id') id: string) {
    return this.txService.findOne(id);
  }

  // ─── POST /transactions ───────────────────────────────────────────────────
  @Post()
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '[Admin] Create a new transaction' })
  @ApiCreatedResponse({ description: 'Created transaction' })
  @ApiForbiddenResponse({ description: 'Admin role required' })
  create(@Body() dto: CreateTransactionDto, @CurrentUser() user: any) {
    return this.txService.create(dto, user.id);
  }

  // ─── PATCH /transactions/:id ──────────────────────────────────────────────
  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: '[Admin] Update a transaction (partial)' })
  @ApiOkResponse({ description: 'Updated transaction' })
  @ApiNotFoundResponse({ description: 'Transaction not found' })
  @ApiForbiddenResponse({ description: 'Admin role required' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTransactionDto,
    @CurrentUser() user: any,
  ) {
    return this.txService.update(id, dto, user.id, user.role);
  }

  // ─── DELETE /transactions/:id ─────────────────────────────────────────────
  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Admin] Delete a transaction' })
  @ApiOkResponse({ description: '{ id } of deleted transaction' })
  @ApiNotFoundResponse({ description: 'Transaction not found' })
  @ApiForbiddenResponse({ description: 'Admin role required' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.txService.remove(id, user.id, user.role);
  }
}
