// src/transactions/transaction.entity.ts

export type TxType = 'income' | 'expense';

export interface Transaction {
  id: string;
  userId: string;            // owner
  description: string;
  amount: number;
  date: string;              // ISO date string YYYY-MM-DD
  category: string;
  type: TxType;
  createdAt: Date;
  updatedAt: Date;
}

// All valid categories (mirrors frontend mockData)
export const VALID_CATEGORIES = [
  'Food & Dining',
  'Transport',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Health',
  'Travel',
  'Salary',
  'Freelance',
  'Investment',
] as const;

export type Category = typeof VALID_CATEGORIES[number];
