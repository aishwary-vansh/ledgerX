# 📁 Project Structure

Complete overview of the LedgerX monorepo structure.

## Repository Root

```
ledgerx-fullstack/
│
├── frontend/                   # React + Vite frontend application
├── backend/                    # NestJS backend API
│
├── README.md                   # Main project documentation
├── QUICKSTART.md              # 5-minute setup guide
├── SETUP.md                   # Detailed setup instructions
├── API_INTEGRATION.md         # API usage examples
├── PROJECT_STRUCTURE.md       # This file
├── .gitignore                 # Git ignore rules
└── package.json               # Root package.json with monorepo scripts
```

## Frontend Structure (`/frontend`)

```
frontend/
│
├── public/                    # Static assets served as-is
│   ├── vite.svg              # Vite logo
│   └── ...                   # Other static files
│
├── src/                       # Source code
│   │
│   ├── components/            # Reusable UI components
│   │   ├── Dashboard/        # Dashboard-specific components
│   │   ├── Transactions/     # Transaction management components
│   │   ├── Analytics/        # Charts and analytics components
│   │   ├── UI/               # Generic UI components (buttons, inputs, etc.)
│   │   └── Layout/           # Layout components (header, sidebar, etc.)
│   │
│   ├── pages/                 # Page-level components (routes)
│   │   ├── Dashboard.jsx     # Main dashboard page
│   │   ├── Transactions.jsx  # Transactions list/management page
│   │   ├── Analytics.jsx     # Analytics and insights page
│   │   ├── Login.tsx         # Login page with backend integration
│   │   └── ...              # Other pages
│   │
│   ├── contexts/              # React Context providers
│   │   ├── AuthContext.tsx   # Authentication state management
│   │   └── ThemeContext.jsx  # Theme/dark mode management (if any)
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── useTransactionsApi.ts  # Hook for transaction operations
│   │   └── ...               # Other custom hooks
│   │
│   ├── services/              # **API Integration Layer**
│   │   └── api.ts            # Centralized API client with all endpoints
│   │
│   ├── utils/                 # Utility functions
│   │   ├── formatters.js     # Date, currency formatters
│   │   ├── validators.js     # Form validation helpers
│   │   └── ...              # Other utilities
│   │
│   ├── assets/                # Images, fonts, icons
│   │   └── ...
│   │
│   ├── App.jsx                # Main App component with routing
│   ├── App.css                # Global app styles
│   ├── main.jsx               # Application entry point
│   └── index.css              # Global CSS and Tailwind imports
│
├── .env.example               # Environment variables template
├── index.html                 # HTML entry point
├── package.json               # Frontend dependencies and scripts
├── package-lock.json          # Locked dependencies
├── vite.config.js             # Vite configuration
├── eslint.config.js           # ESLint configuration
└── README.md                  # Frontend-specific documentation
```

### Key Frontend Files

#### `/src/services/api.ts` ⭐
- **Centralized API client** - All backend communication goes through here
- Handles authentication tokens
- Provides typed interfaces for all API responses
- Includes error handling and request/response transformation
- **Endpoints**:
  - Auth: `authApi.login()`, `authApi.register()`, `authApi.me()`
  - Transactions: `transactionsApi.list()`, `create()`, `update()`, `remove()`
  - Analytics: `transactionsApi.summary()`, `monthly()`, `categories()`, `mom()`

#### `/src/contexts/AuthContext.tsx` ⭐
- Manages user authentication state
- Provides login/logout functions
- Persists tokens in localStorage
- Wraps app with authentication provider

#### `/src/hooks/useTransactionsApi.ts` ⭐
- Custom hook for transaction management
- Handles loading states, errors, and data fetching
- Provides CRUD operations with React state integration

## Backend Structure (`/backend`)

```
backend/
│
├── src/                       # Source code
│   │
│   ├── auth/                  # Authentication module
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── guards/           # Auth guards (JWT strategy)
│   │   ├── strategies/       # Passport strategies
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   │
│   ├── users/                 # Users module
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   │
│   ├── transactions/          # Transactions module
│   │   ├── dto/
│   │   │   ├── create-transaction.dto.ts
│   │   │   ├── update-transaction.dto.ts
│   │   │   └── query-transaction.dto.ts
│   │   ├── entities/
│   │   │   └── transaction.entity.ts
│   │   ├── transactions.controller.ts
│   │   ├── transactions.service.ts
│   │   └── transactions.module.ts
│   │
│   ├── common/                # Shared utilities
│   │   ├── decorators/       # Custom decorators
│   │   ├── filters/          # Exception filters
│   │   ├── guards/           # Custom guards
│   │   ├── interceptors/     # Request/response interceptors
│   │   ├── pipes/            # Validation pipes
│   │   └── dto/              # Common DTOs
│   │
│   ├── config/                # Configuration
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── app.config.ts
│   │
│   ├── app.module.ts          # Root module
│   └── main.ts                # Application entry point
│
├── prisma/ (if using Prisma)  # Database ORM
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Migration files
│   └── seed.ts                # Database seeding script
│
├── .env.example               # Environment variables template
├── package.json               # Backend dependencies and scripts
├── package-lock.json          # Locked dependencies
├── tsconfig.json              # TypeScript configuration
└── README.md                  # Backend-specific documentation
```

### Key Backend Features

#### API Endpoints

**Authentication** (`/api/v1/auth`)
- `POST /login` - User login
- `POST /register` - User registration
- `GET /me` - Get current user profile

**Transactions** (`/api/v1/transactions`)
- `GET /` - List transactions (with filtering, sorting, pagination)
- `GET /:id` - Get single transaction
- `POST /` - Create transaction (admin only)
- `PATCH /:id` - Update transaction (admin only)
- `DELETE /:id` - Delete transaction (admin only)

**Analytics** (`/api/v1/transactions`)
- `GET /summary` - Financial summary (income, expenses, balance)
- `GET /monthly` - Monthly trends
- `GET /categories` - Category breakdown
- `GET /mom` - Month-over-month comparison

## Environment Variables

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:3001/api/v1
```

### Backend (`.env`)
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ledgerx"

# JWT Configuration
JWT_SECRET="your-super-secret-key-change-this-in-production"
JWT_EXPIRATION="7d"

# Server
PORT=3001
NODE_ENV="development"

# CORS (optional)
CORS_ORIGIN="http://localhost:5173"
```

## Data Flow

```
User Action (Frontend)
        ↓
React Component
        ↓
Context/Hook (useTransactionsApi)
        ↓
API Service (/src/services/api.ts)
        ↓
HTTP Request with JWT token
        ↓
Backend Controller (NestJS)
        ↓
Service Layer (Business Logic)
        ↓
Database (PostgreSQL via Prisma/TypeORM)
        ↓
Response (JSON)
        ↓
Frontend State Update
        ↓
UI Re-render
```

## Development Workflow

1. **Start Backend** → Terminal 1: `cd backend && npm run start:dev`
2. **Start Frontend** → Terminal 2: `cd frontend && npm run dev`
3. **Make Changes** → Hot reload on both frontend and backend
4. **Test API** → Use Swagger UI at `http://localhost:3001/api`
5. **Test UI** → Browser at `http://localhost:5173`

## Git Workflow

```bash
# Feature development
git checkout -b feature/your-feature
# Make changes
git add .
git commit -m "feat: add your feature"
git push origin feature/your-feature

# Code review and merge to main
```

## Deployment Structure

```
Production Environment
│
├── Frontend (Vercel/Netlify)
│   ├── Build: npm run build
│   ├── Deploy: dist/ folder
│   └── Environment: VITE_API_URL=<production-backend-url>
│
└── Backend (Railway/Heroku/AWS)
    ├── Build: npm run build
    ├── Deploy: dist/ folder
    ├── Database: Managed PostgreSQL
    └── Environment: All .env variables
```

## File Naming Conventions

- **Components**: PascalCase (e.g., `Dashboard.jsx`, `TransactionList.jsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useTransactionsApi.ts`)
- **Services**: camelCase (e.g., `api.ts`, `authService.ts`)
- **Utilities**: camelCase (e.g., `formatters.js`, `validators.js`)
- **Types/Interfaces**: PascalCase (e.g., `Transaction`, `UserProfile`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`, `TOKEN_KEY`)

## Important Notes

⚠️ **Security**
- Never commit `.env` files
- Keep JWT_SECRET secure and complex
- Use environment variables for sensitive data

📝 **Documentation**
- Update README when adding major features
- Document API changes in API_INTEGRATION.md
- Add JSDoc comments for complex functions

🧪 **Testing**
- Write tests for new features
- Run tests before committing
- Maintain test coverage

## Quick Reference

| Task | Command |
|------|---------|
| Install all dependencies | `npm run install:all` (from root) |
| Start both dev servers | Terminal 1: `npm run dev:backend`<br>Terminal 2: `npm run dev:frontend` |
| Build for production | `npm run build:all` (from root) |
| Run database migrations | `cd backend && npx prisma migrate dev` |
| Open Prisma Studio | `cd backend && npx prisma studio` |
| View API docs | http://localhost:3001/api |
