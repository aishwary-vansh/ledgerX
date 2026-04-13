import { randomUUID as uuid } from 'crypto';
// src/transactions/transactions.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { QueryTransactionsDto } from './dto/query-transactions.dto';

// ─── Seed data (mirrors frontend mockData.js) ───────────────────────────────
const SEED_USER_ID = '1';

const seedTransactions: Transaction[] = [
  { id: uuid(), userId: SEED_USER_ID, date: '2025-01-03', description: 'Monthly Salary',       category: 'Salary',           type: 'income',  amount: 85000, createdAt: new Date(), updatedAt: new Date() },
  { id: uuid(), userId: SEED_USER_ID, date: '2025-01-05', description: 'Zomato Order',         category: 'Food & Dining',    type: 'expense', amount: 450,   createdAt: new Date(), updatedAt: new Date() },
  { id: uuid(), userId: SEED_USER_ID, date: '2025-01-08', description: 'Electricity Bill',     category: 'Bills & Utilities',type: 'expense', amount: 1800,  createdAt: new Date(), updatedAt: new Date() },
  { id: uuid(), userId: SEED_USER_ID, date: '2025-01-12', description: 'Uber Ride',            category: 'Transport',        type: 'expense', amount: 280,   createdAt: new Date(), updatedAt: new Date() },
  { id: uuid(), userId: SEED_USER_ID, date: '2025-01-15', description: 'Freelance Project',    category: 'Freelance',        type: 'income',  amount: 22000, createdAt: new Date(), updatedAt: new Date() },
  { id: uuid(), userId: SEED_USER_ID, date: '2025-01-18', description: 'Amazon Shopping',      category: 'Shopping',         type: 'expense', amount: 3200,  createdAt: new Date(), updatedAt: new Date() },
  { id: uuid(), userId: SEED_USER_ID, date: '2025-01-22', description: 'Movie Tickets',        category: 'Entertainment',    type: 'expense', amount: 600,   createdAt: new Date(), updatedAt: new Date() },
  { id: uuid(), userId: SEED_USER_ID, date: '2025-01-28', description: 'Gym Membership',       category: 'Health',           type: 'expense', amount: 1500,  createdAt: new Date(), updatedAt: new Date() },
  { id: uuid(), userId: SEED_USER_ID, date: '2025-02-01', description: 'Monthly Salary',       category: 'Salary',           type: 'income',  amount: 85000, createdAt: new Date(), updatedAt: new Date() },
  { id: uuid(), userId: SEED_USER_ID, date: '2025-02-04', description: 'Swiggy Order',         category: 'Food & Dining',    type: 'expense', amount: 380,   createdAt: new Date(), updatedAt: new Date() },
  { id: uuid(), userId: SEED_USER_ID, date: '2025-02-10', description: 'Internet Bill',        category: 'Bills & Utilities',type: 'expense', amount: 999,   createdAt: new Date(), updatedAt: new Date() },
  { id: uuid(), userId: SEED_USER_ID, date: '2025-02-14', description: "Valentine's Dinner",  category: 'Food & Dining',    type: 'expense', amount: 2800,  createdAt: new Date(), updatedAt: new Date() },
  { id: uuid(), userId: SEED_USER_ID, date: '2025-02-18', description: 'Mutual Fund SIP',      category: 'Investment',       type: 'expense', amount: 10000, createdAt: new Date(), updatedAt: new Date() },
  { id: uuid(), userId: SEED_USER_ID, date: '2025-02-22', description: 'Freelance Design',     category: 'Freelance',        type: 'income',  amount: 15000, createdAt: new Date(), updatedAt: new Date() },
  { id: uuid(), userId: SEED_USER_ID, date: '2025-02-26', description: 'Medical Checkup',      category: 'Health',           type: 'expense', amount: 1200,  createdAt: new Date(), updatedAt: new Date() },
  { id: uuid(), userId: SEED_USER_ID, date: '2025-03-01', description: 'Monthly Salary',       category: 'Salary',           type: 'income',  amount: 85000, createdAt: new Date(), updatedAt: new Date() },
  { id: uuid(), userId: SEED_USER_ID, date: '2025-03-05', description: 'Ola Auto',             category: 'Transport',        type: 'expense', amount: 120,   createdAt: new Date(), updatedAt: new Date() },
  { id: uuid(), userId: SEED_USER_ID, date: '2025-03-09', description: 'Myntra Purchase',      category: 'Shopping',         type: 'expense', amount: 4500,  createdAt: new Date(), updatedAt: new Date() },
  { id: uuid(), userId: SEED_USER_ID, date: '2025-03-12', description: 'Spotify Premium',      category: 'Entertainment',    type: 'expense', amount: 119,   createdAt: new Date(), updatedAt: new Date() },
  { id: uuid(), userId: SEED_USER_ID, date: '2025-03-15', description: 'Goa Trip Booking',     category: 'Travel',           type: 'expense', amount: 18000, createdAt: new Date(), updatedAt: new Date() },
  { id: uuid(), userId: SEED_USER_ID, date: '2025-03-20', description: 'Freelance Content',    category: 'Freelance',        type: 'income',  amount: 8000,  createdAt: new Date(), updatedAt: new Date() },
  { id: uuid(), userId: SEED_USER_ID, date: '2025-03-25', description: 'Water Bill',           category: 'Bills & Utilities',type: 'expense', amount: 450,   createdAt: new Date(), updatedAt: new Date() },
  { id: uuid(), userId: SEED_USER_ID, date: '2025-03-28', description: 'Restaurant Dinner',    category: 'Food & Dining',    type: 'expense', amount: 1600,  createdAt: new Date(), updatedAt: new Date() },
  { id: uuid(), userId: SEED_USER_ID, date: '2025-04-01', description: 'Monthly Salary',       category: 'Salary',           type: 'income',  amount: 85000, createdAt: new Date(), updatedAt: new Date() },
  { id: uuid(), userId: SEED_USER_ID, date: '2025-04-03', description: 'Metro Card Recharge',  category: 'Transport',        type: 'expense', amount: 500,   createdAt: new Date(), updatedAt: new Date() },
  { id: uuid(), userId: SEED_USER_ID, date: '2025-04-07', description: 'Pharmacy',             category: 'Health',           type: 'expense', amount: 780,   createdAt: new Date(), updatedAt: new Date() },
  { id: uuid(), userId: SEED_USER_ID, date: '2025-04-11', description: 'Investment Returns',   category: 'Investment',       type: 'income',  amount: 4200,  createdAt: new Date(), updatedAt: new Date() },
  { id: uuid(), userId: SEED_USER_ID, date: '2025-04-15', description: 'Netflix Subscription', category: 'Entertainment',    type: 'expense', amount: 649,   createdAt: new Date(), updatedAt: new Date() },
  { id: uuid(), userId: SEED_USER_ID, date: '2025-04-20', description: 'Grocery Shopping',     category: 'Food & Dining',    type: 'expense', amount: 2100,  createdAt: new Date(), updatedAt: new Date() },
  { id: uuid(), userId: SEED_USER_ID, date: '2025-04-25', description: 'Freelance UI Project', category: 'Freelance',        type: 'income',  amount: 30000, createdAt: new Date(), updatedAt: new Date() },
];

// ─── In-memory store ────────────────────────────────────────────────────────
let store: Transaction[] = [...seedTransactions];

@Injectable()
export class TransactionsService {

  // ─── CRUD ──────────────────────────────────────────────────────────────────

  create(dto: CreateTransactionDto, userId: string): Transaction {
    const tx: Transaction = {
      id: uuid(),
      userId,
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.unshift(tx);
    return tx;
  }

  findAll(query: QueryTransactionsDto) {
    let results = [...store];

    // ── Text search ──────────────────────────────────────────────────────
    if (query.search?.trim()) {
      const q = query.search.toLowerCase();
      results = results.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q),
      );
    }

    // ── Filters ──────────────────────────────────────────────────────────
    if (query.type && query.type !== 'all') {
      results = results.filter((t) => t.type === query.type);
    }
    if (query.category && query.category !== 'all') {
      results = results.filter((t) => t.category === query.category);
    }
    if (query.dateFrom) {
      results = results.filter((t) => t.date >= query.dateFrom);
    }
    if (query.dateTo) {
      results = results.filter((t) => t.date <= query.dateTo);
    }

    // ── Sort ─────────────────────────────────────────────────────────────
    const sortBy = query.sortBy ?? 'date';
    const sortDir = query.sortDir ?? 'desc';

    results.sort((a, b) => {
      const valA = a[sortBy as keyof Transaction];
      const valB = b[sortBy as keyof Transaction];
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    // ── Pagination ────────────────────────────────────────────────────────
    const page = Math.max(1, parseInt(query.page ?? '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit ?? '20', 10)));
    const total = results.length;
    const totalPages = Math.ceil(total / limit);
    const data = results.slice((page - 1) * limit, page * limit);

    return {
      data,
      pagination: { page, limit, total, totalPages },
    };
  }

  findOne(id: string): Transaction {
    const tx = store.find((t) => t.id === id);
    if (!tx) throw new NotFoundException(`Transaction ${id} not found`);
    return tx;
  }

  update(id: string, dto: UpdateTransactionDto, userId: string, role: string): Transaction {
    const tx = this.findOne(id);
    // Admin can edit any; viewer can only edit their own
    if (role !== 'admin' && tx.userId !== userId) {
      throw new ForbiddenException('Not authorised to update this transaction');
    }
    const updated = { ...tx, ...dto, updatedAt: new Date() };
    store = store.map((t) => (t.id === id ? updated : t));
    return updated;
  }

  remove(id: string, userId: string, role: string): { id: string } {
    const tx = this.findOne(id);
    if (role !== 'admin' && tx.userId !== userId) {
      throw new ForbiddenException('Not authorised to delete this transaction');
    }
    store = store.filter((t) => t.id !== id);
    return { id };
  }

  // ─── Analytics ────────────────────────────────────────────────────────────

  /** Total income / expenses / balance */
  getSummary() {
    const income = store
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0);
    const expenses = store
      .filter((t) => t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0);
    return {
      income,
      expenses,
      balance: income - expenses,
      count: store.length,
    };
  }

  /** Monthly breakdown — used for line/bar charts */
  getMonthly() {
    const map: Record<string, { month: string; income: number; expenses: number }> = {};
    store.forEach((t) => {
      const month = t.date.slice(0, 7); // YYYY-MM
      if (!map[month]) map[month] = { month, income: 0, expenses: 0 };
      if (t.type === 'income') map[month].income += t.amount;
      else map[month].expenses += t.amount;
    });
    return Object.values(map)
      .sort((a, b) => a.month.localeCompare(b.month))
      .map((d) => ({ ...d, balance: d.income - d.expenses }));
  }

  /** Expense breakdown by category — used for pie/donut charts */
  getCategories() {
    const map: Record<string, number> = {};
    store
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        map[t.category] = (map[t.category] ?? 0) + t.amount;
      });
    return Object.entries(map)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);
  }

  /** Month-over-month expense delta */
  getMoMChange() {
    const monthly = this.getMonthly();
    if (monthly.length < 2) return null;
    const current = monthly[monthly.length - 1];
    const previous = monthly[monthly.length - 2];
    if (previous.expenses === 0) return null;
    const changePct = ((current.expenses - previous.expenses) / previous.expenses) * 100;
    return {
      currentMonth: current.month,
      previousMonth: previous.month,
      currentExpenses: current.expenses,
      previousExpenses: previous.expenses,
      changePct: parseFloat(changePct.toFixed(2)),
      direction: changePct > 0 ? 'up' : 'down',
    };
  }
}
