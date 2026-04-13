# API Integration Guide

This document explains how the frontend communicates with the backend API.

## Architecture Overview

```
┌─────────────────┐         HTTP/REST        ┌─────────────────┐
│                 │ ──────────────────────► │                 │
│  React Frontend │                         │  NestJS Backend │
│  (Port 5173)    │ ◄────────────────────── │  (Port 3001)    │
│                 │      JSON Responses      │                 │
└─────────────────┘                          └─────────────────┘
                                                      │
                                                      │
                                                      ▼
                                              ┌───────────────┐
                                              │  PostgreSQL   │
                                              │   Database    │
                                              └───────────────┘
```

## API Service Layer

The frontend uses a centralized API service located at `frontend/src/services/api.ts`.

### Base Configuration

```typescript
// Default API base URL
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/v1';
```

You can override this in `frontend/.env`:
```env
VITE_API_URL=http://localhost:3001/api/v1
```

## Authentication Flow

### 1. Token Storage

```typescript
// Tokens are stored in localStorage
const TOKEN_KEY = 'ledgerx_token';

tokenStorage.set(token);    // Save token
tokenStorage.get();         // Retrieve token
tokenStorage.clear();       // Remove token (logout)
```

### 2. Login Process

```typescript
// User logs in
const { accessToken, user } = await authApi.login(email, password);

// Token is automatically stored
tokenStorage.set(accessToken);

// All subsequent requests include the token
Authorization: Bearer <token>
```

### 3. Protected Routes

All requests automatically include the JWT token:

```typescript
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
}
```

## API Endpoints

### Authentication (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Create new account | No |
| POST | `/auth/login` | Login and get token | No |
| GET | `/auth/me` | Get current user profile | Yes |

**Example - Register:**
```typescript
const result = await authApi.register(
  'user@example.com',
  'password123',
  'John Doe'
);
// Returns: { accessToken: '...', user: { id, email, name, role } }
```

**Example - Login:**
```typescript
const result = await authApi.login('user@example.com', 'password123');
// Returns: { accessToken: '...', user: { id, email, name, role } }
```

### Transactions (`/api/v1/transactions`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/transactions` | List all transactions | Yes | All |
| GET | `/transactions/:id` | Get single transaction | Yes | All |
| POST | `/transactions` | Create transaction | Yes | Admin |
| PATCH | `/transactions/:id` | Update transaction | Yes | Admin |
| DELETE | `/transactions/:id` | Delete transaction | Yes | Admin |
| GET | `/transactions/summary` | Get financial summary | Yes | All |
| GET | `/transactions/monthly` | Get monthly trends | Yes | All |
| GET | `/transactions/categories` | Get category breakdown | Yes | All |
| GET | `/transactions/mom` | Month-over-month comparison | Yes | All |

**Example - List Transactions:**
```typescript
const result = await transactionsApi.list({
  page: 1,
  limit: 10,
  type: 'expense',
  category: 'Food',
  dateFrom: '2024-01-01',
  dateTo: '2024-12-31',
  sortBy: 'date',
  sortDir: 'desc'
});
// Returns: { data: [...], pagination: { page, limit, total, totalPages } }
```

**Example - Create Transaction:**
```typescript
const transaction = await transactionsApi.create({
  description: 'Grocery shopping',
  amount: 150.50,
  date: '2024-04-13',
  category: 'Food',
  type: 'expense'
});
```

**Example - Get Summary:**
```typescript
const summary = await transactionsApi.summary();
// Returns: { income: 5000, expenses: 3000, balance: 2000, count: 42 }
```

## Response Format

All API responses follow this structure:

### Success Response
```json
{
  "data": { ... },
  "meta": {
    "timestamp": "2024-04-13T10:30:00Z"
  }
}
```

For paginated endpoints:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

## Error Handling

The API service includes built-in error handling:

```typescript
try {
  const transactions = await transactionsApi.list();
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error (${error.statusCode}): ${error.message}`);
    
    if (error.statusCode === 401) {
      // Unauthorized - redirect to login
      tokenStorage.clear();
      window.location.href = '/login';
    }
  }
}
```

## Custom Hooks

### useTransactionsApi

A React hook that provides transaction operations with loading and error states:

```typescript
import { useTransactionsApi } from '@/hooks/useTransactionsApi';

function MyComponent() {
  const {
    transactions,
    loading,
    error,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction
  } = useTransactionsApi();

  useEffect(() => {
    fetchTransactions({ page: 1, limit: 20 });
  }, []);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {transactions.map(t => <TransactionCard key={t.id} {...t} />)}
    </div>
  );
}
```

## Context Providers

### AuthContext

Manages authentication state throughout the app:

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!isAuthenticated) return <Login />;

  return <div>Welcome, {user.name}!</div>;
}
```

## Query Parameters

The API supports advanced filtering:

### Transaction Filters

```typescript
interface TransactionQuery {
  page?: number;              // Page number (default: 1)
  limit?: number;             // Items per page (default: 10)
  type?: 'income' | 'expense' | 'all';  // Transaction type
  category?: string;          // Filter by category
  search?: string;            // Search in description
  dateFrom?: string;          // Start date (YYYY-MM-DD)
  dateTo?: string;            // End date (YYYY-MM-DD)
  sortBy?: string;            // Sort field (date, amount, etc.)
  sortDir?: 'asc' | 'desc';   // Sort direction
}
```

### Example Usage

```typescript
// Get all expenses from January 2024
const expenses = await transactionsApi.list({
  type: 'expense',
  dateFrom: '2024-01-01',
  dateTo: '2024-01-31',
  sortBy: 'amount',
  sortDir: 'desc'
});

// Search for specific transactions
const results = await transactionsApi.list({
  search: 'grocery',
  category: 'Food'
});
```

## CORS Configuration

The backend is configured to accept requests from the frontend:

```typescript
// backend/src/main.ts
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
});
```

For production, update the `FRONTEND_URL` environment variable in the backend.

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Authentication endpoints**: 5 requests per minute
- **General endpoints**: 100 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1681376400
```

## Testing the API

### Using Swagger UI

Visit `http://localhost:3001/api` to access the interactive API documentation.

### Using curl

```bash
# Login and get token
TOKEN=$(curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  | jq -r '.data.accessToken')

# Get transactions
curl http://localhost:3001/api/v1/transactions \
  -H "Authorization: Bearer $TOKEN"

# Create transaction
curl -X POST http://localhost:3001/api/v1/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Test expense",
    "amount": 50.00,
    "date": "2024-04-13",
    "category": "Testing",
    "type": "expense"
  }'
```

## Best Practices

1. **Always use the API service layer** - Don't make direct fetch calls
2. **Handle errors gracefully** - Use try-catch and show user-friendly messages
3. **Store sensitive data securely** - Never log tokens or passwords
4. **Implement loading states** - Show spinners during API calls
5. **Use TypeScript types** - Leverage the provided interfaces
6. **Debounce search queries** - Don't hammer the API with every keystroke
7. **Cache when appropriate** - Store non-sensitive data in React state/context

## Debugging

Enable network inspection in browser DevTools:

1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "Fetch/XHR"
4. Inspect request/response headers and bodies

### Common Issues

**401 Unauthorized**: Token expired or invalid - clear localStorage and login again
**403 Forbidden**: User lacks required role/permissions
**404 Not Found**: Check the endpoint URL
**500 Server Error**: Check backend logs and database connection

---

For more information, see:
- [Backend API Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
- [Swagger API Docs](http://localhost:3001/api)
