# LedgerX — Full-Stack Finance Dashboard

A professional full-stack finance dashboard built with **React + Vite** (frontend) and **NestJS** (backend), connected via a typed REST API with JWT authentication.

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React 19 + Vite 8 | Fast HMR, optimised builds |
| Styling | Tailwind CSS v4 | Utility-first, design tokens |
| Charts | Chart.js + Recharts | Rich financial visualisations |
| Backend | **NestJS 10** | Enterprise Node.js — DI, decorators, modules |
| Auth | Passport.js + JWT | Industry standard — Local + Bearer strategies |
| Validation | class-validator + class-transformer | DTO-level input validation with clear 400s |
| API Docs | Swagger / OpenAPI 3 | Auto-generated from decorators |
| Password Hashing | bcryptjs | Pure-JS bcrypt, no native compilation |
| Testing | Jest + ts-jest | Unit tests for service layer |
| Language | TypeScript (strict) | End-to-end type safety |

---

## Project Structure

```
ledgerx/
├── ledgerx_v2/                 ← React frontend
│   ├── src/
│   │   ├── services/
│   │   │   └── api.ts          ← Typed API client (all endpoints)
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx ← JWT state, login/logout
│   │   │   └── TransactionContext.jsx
│   │   ├── hooks/
│   │   │   └── useTransactionsApi.ts  ← Backend-connected data hook
│   │   ├── pages/
│   │   │   ├── Login.tsx       ← Auth screen (login + register)
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Transactions.jsx
│   │   │   └── Insights.jsx
│   │   └── components/
│   └── .env                    ← VITE_API_URL=http://localhost:3001/api/v1
│
└── ledgerx-backend/            ← NestJS backend
    ├── src/
    │   ├── main.ts             ← Bootstrap: Swagger, CORS, pipes, guards
    │   ├── app.module.ts       ← Root module
    │   ├── config/
    │   │   └── app.config.ts   ← Typed env config factory
    │   ├── auth/
    │   │   ├── auth.module.ts
    │   │   ├── auth.controller.ts   ← POST /auth/login|register, GET /auth/me
    │   │   ├── auth.service.ts
    │   │   ├── dto/             ← LoginDto, RegisterDto
    │   │   ├── guards/          ← JwtAuthGuard, LocalAuthGuard
    │   │   └── strategies/      ← JwtStrategy, LocalStrategy
    │   ├── users/
    │   │   ├── user.entity.ts
    │   │   ├── users.module.ts
    │   │   └── users.service.ts
    │   ├── transactions/
    │   │   ├── transaction.entity.ts
    │   │   ├── transactions.module.ts
    │   │   ├── transactions.controller.ts  ← Full CRUD + 4 analytics routes
    │   │   ├── transactions.service.ts
    │   │   ├── transactions.service.spec.ts ← 18 unit tests
    │   │   └── dto/
    │   │       ├── create-transaction.dto.ts
    │   │       ├── update-transaction.dto.ts
    │   │       └── query-transactions.dto.ts
    │   └── common/
    │       ├── filters/http-exception.filter.ts   ← Global error handler
    │       ├── interceptors/logging.interceptor.ts
    │       ├── interceptors/transform.interceptor.ts ← { data, meta } envelope
    │       ├── guards/roles.guard.ts
    │       └── decorators/
    │           ├── roles.decorator.ts    ← @Roles('admin')
    │           └── current-user.decorator.ts  ← @CurrentUser()
    ├── .env
    └── package.json
```

---

## Quick Start

### 1. Start the Backend

```bash
cd ledgerx-backend

# Install dependencies (no native compilation required)
npm install --ignore-scripts

# Copy environment file
cp .env.example .env

# Start dev server (ts-node — no build step needed)
npm run start:dev
```

Backend starts at **http://localhost:3001**

- API base: `http://localhost:3001/api/v1`
- Swagger docs: `http://localhost:3001/api/docs`

**Seeded users (ready immediately):**
| Email | Password | Role |
|---|---|---|
| admin@ledgerx.com | Admin@1234 | admin |
| viewer@ledgerx.com | Viewer@1234 | viewer |

---

### 2. Start the Frontend

```bash
cd ledgerx_v2

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start dev server
npm run dev
```

Frontend starts at **http://localhost:5173**

---

## API Reference

All endpoints are prefixed with `/api/v1`. All responses are wrapped in:
```json
{ "data": <payload>, "meta": { "timestamp": "...", "statusCode": 200 } }
```

Errors return:
```json
{ "statusCode": 401, "message": "Invalid credentials", "error": "UnauthorizedException", "path": "/api/v1/auth/login", "timestamp": "..." }
```

### Auth Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Create viewer account → returns JWT |
| `POST` | `/auth/login` | Public | Email + password → returns JWT |
| `GET` | `/auth/me` | Bearer | Current user profile |

**Login request:**
```json
POST /api/v1/auth/login
{ "email": "admin@ledgerx.com", "password": "Admin@1234" }
```

**Login response:**
```json
{
  "data": {
    "accessToken": "eyJ...",
    "user": { "id": "1", "email": "admin@ledgerx.com", "role": "admin", "name": "Admin" }
  }
}
```

### Transaction Endpoints

All require `Authorization: Bearer <token>` header.

| Method | Path | Role | Description |
|---|---|---|---|
| `GET` | `/transactions` | Any | List with filter/search/sort/pagination |
| `GET` | `/transactions/summary` | Any | Total income / expenses / balance |
| `GET` | `/transactions/monthly` | Any | Monthly breakdown for charts |
| `GET` | `/transactions/categories` | Any | Expense totals by category |
| `GET` | `/transactions/mom` | Any | Month-over-month expense change |
| `GET` | `/transactions/:id` | Any | Single transaction |
| `POST` | `/transactions` | Admin | Create transaction |
| `PATCH` | `/transactions/:id` | Admin | Update transaction (partial) |
| `DELETE` | `/transactions/:id` | Admin | Delete transaction |

**Query parameters for `GET /transactions`:**

| Param | Type | Example | Description |
|---|---|---|---|
| `search` | string | `Zomato` | Search description + category |
| `type` | `income\|expense\|all` | `expense` | Filter by type |
| `category` | string | `Food & Dining` | Filter by category |
| `dateFrom` | date | `2025-01-01` | From date (YYYY-MM-DD) |
| `dateTo` | date | `2025-04-30` | To date |
| `sortBy` | string | `amount` | Sort field |
| `sortDir` | `asc\|desc` | `desc` | Sort direction |
| `page` | number | `1` | Page number |
| `limit` | number | `20` | Items per page (max 100) |

---

## Frontend ↔ Backend Integration

The frontend ships with three integration files:

### `src/services/api.ts`
Centralised typed API client. All components call this instead of raw `fetch`:
```ts
// List transactions with filters
const result = await transactionsApi.list({ type: 'expense', search: 'Zomato', page: 1 });

// Create (admin only)
await transactionsApi.create({ description: 'Coffee', amount: 150, date: '2025-05-01', category: 'Food & Dining', type: 'expense' });

// Analytics
const summary  = await transactionsApi.summary();   // { income, expenses, balance }
const monthly  = await transactionsApi.monthly();   // [{ month, income, expenses, balance }]
const cats     = await transactionsApi.categories();// [{ category, total }]
```

### `src/contexts/AuthContext.tsx`
JWT lifecycle management:
```tsx
const { user, login, logout, isAuthenticated } = useAuth();
await login('admin@ledgerx.com', 'Admin@1234');
// token auto-stored in localStorage, validated on every page load
```

### `src/hooks/useTransactionsApi.ts`
Drop-in replacement for the mock context, pulling live data:
```tsx
const { transactions, summary, monthly, addTransaction, loading } = useTransactionsApi();
```

### Swapping from mock to real data (3 steps)

1. Start the backend: `cd ledgerx-backend && npm run start:dev`
2. In `src/main.jsx`, wrap with `<AuthProvider>` (already done in `App.jsx`)
3. In any page/component, replace `useTransactions()` with `useTransactionsApi()`

---

## Running Tests

```bash
cd ledgerx-backend

# Run all unit tests
npm test

# With coverage report
npm run test:cov
```

**Test output:**
```
PASS src/auth/auth.service.spec.ts
PASS src/transactions/transactions.service.spec.ts

Test Suites: 2 passed, 2 total
Tests:       24 passed, 24 total
```

---

## Environment Variables

### Backend (`ledgerx-backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | Server port |
| `NODE_ENV` | `development` | Environment |
| `JWT_SECRET` | `change-me` | **Must change in production** |
| `JWT_EXPIRES_IN` | `7d` | Token TTL |
| `CORS_ORIGINS` | `http://localhost:5173` | Comma-separated allowed origins |
| `ADMIN_EMAIL` | `admin@ledgerx.com` | Seed admin email |
| `ADMIN_PASSWORD` | `Admin@1234` | Seed admin password |

### Frontend (`ledgerx_v2/.env`)

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3001/api/v1` | Backend API base URL |

---

## Production Checklist

- [ ] Change `JWT_SECRET` to a long random string (32+ chars)
- [ ] Set `NODE_ENV=production` (disables Swagger)
- [ ] Point `CORS_ORIGINS` to your production frontend domain
- [ ] Replace in-memory store with a real database (PostgreSQL + TypeORM)
- [ ] Add rate limiting (`@nestjs/throttler`)
- [ ] Add helmet for HTTP security headers
- [ ] Run `npm run build` and serve `dist/main.js`

---

## Adding a Real Database (PostgreSQL)

The service layer is fully abstracted — swapping in TypeORM takes ~30 minutes:

```bash
npm install @nestjs/typeorm typeorm pg
```

In `app.module.ts`, add:
```ts
TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (c: ConfigService) => ({
    type: 'postgres',
    url: c.get('DATABASE_URL'),
    entities: [User, Transaction],
    synchronize: true, // false in production — use migrations
  }),
})
```

Then convert `UsersService` and `TransactionsService` to inject `@InjectRepository(Entity)` instead of the in-memory arrays.

---

Built for LedgerX · NestJS + React · 2026
