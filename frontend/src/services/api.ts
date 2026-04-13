// src/services/api.ts
// ─────────────────────────────────────────────────────────────────────────────
// Centralised Axios-based API client for LedgerX.
// All components call these functions instead of raw fetch.
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/v1';

// ── Token helpers ─────────────────────────────────────────────────────────────
const TOKEN_KEY = 'ledgerx_token';

export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

// ── Core request helper ───────────────────────────────────────────────────────
type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

async function request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  // Build query string from params object
  const qs = params
    ? '?' +
      Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== '')
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join('&')
    : '';

  const token = tokenStorage.get();

  const res = await fetch(`${BASE_URL}${path}${qs}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  // Every response is wrapped in { data, meta } by TransformInterceptor
  const json = await res.json();

  if (!res.ok) {
    // Server returns { statusCode, message, error }
    const msg = Array.isArray(json.message)
      ? json.message.join(', ')
      : json.message ?? 'Something went wrong';
    throw new ApiError(msg, res.status);
  }

  // Unwrap the { data } envelope
  return json.data ?? json;
}

// ── Typed error ───────────────────────────────────────────────────────────────
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────────────────────
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'viewer';
  createdAt: string;
}

export interface AuthResult {
  accessToken: string;
  user: UserProfile;
}

export const authApi = {
  login: (email: string, password: string) =>
    request<AuthResult>('POST', '/auth/login', { email, password }),

  register: (email: string, password: string, name: string) =>
    request<AuthResult>('POST', '/auth/register', { email, password, name }),

  me: () => request<UserProfile>('GET', '/auth/me'),
};

// ─────────────────────────────────────────────────────────────────────────────
// TRANSACTIONS
// ─────────────────────────────────────────────────────────────────────────────
export interface Transaction {
  id: string;
  userId: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense';
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TransactionListResult {
  data: Transaction[];
  pagination: Pagination;
}

export interface TransactionQuery {
  page?: number;
  limit?: number;
  type?: 'income' | 'expense' | 'all';
  category?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface Summary {
  income: number;
  expenses: number;
  balance: number;
  count: number;
}

export interface MonthlyEntry {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

export interface CategoryEntry {
  category: string;
  total: number;
}

export interface MoMResult {
  currentMonth: string;
  previousMonth: string;
  currentExpenses: number;
  previousExpenses: number;
  changePct: number;
  direction: 'up' | 'down';
}

export interface CreateTransactionPayload {
  description: string;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense';
}

export const transactionsApi = {
  /** List with filter / sort / pagination */
  list: (query: TransactionQuery = {}) =>
    request<TransactionListResult>('GET', '/transactions', undefined, query as any),

  /** Get a single transaction */
  get: (id: string) => request<Transaction>('GET', `/transactions/${id}`),

  /** Create (admin only) */
  create: (payload: CreateTransactionPayload) =>
    request<Transaction>('POST', '/transactions', payload),

  /** Update partial (admin only) */
  update: (id: string, payload: Partial<CreateTransactionPayload>) =>
    request<Transaction>('PATCH', `/transactions/${id}`, payload),

  /** Delete (admin only) */
  remove: (id: string) => request<{ id: string }>('DELETE', `/transactions/${id}`),

  // ── Analytics endpoints ─────────────────────────────────────────────────
  summary: () => request<Summary>('GET', '/transactions/summary'),
  monthly: () => request<MonthlyEntry[]>('GET', '/transactions/monthly'),
  categories: () => request<CategoryEntry[]>('GET', '/transactions/categories'),
  mom: () => request<MoMResult | null>('GET', '/transactions/mom'),
};
