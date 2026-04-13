# LedgerX - Personal Finance Management System

A full-stack personal finance application with expense tracking, analytics, and budgeting features.

## 🏗️ Architecture

This is a monorepo containing both frontend and backend:

```
ledgerx-fullstack/
├── frontend/          # React + Vite + TailwindCSS
├── backend/           # NestJS + PostgreSQL + Prisma
└── README.md          # You are here
```

## 🚀 Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: TailwindCSS
- **State Management**: React Context API
- **HTTP Client**: Fetch API
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator
- **API Documentation**: Swagger/OpenAPI

## 📋 Prerequisites

- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm or yarn

## 🔧 Setup Instructions

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd ledgerx-fullstack

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Database Setup

```bash
# Start PostgreSQL (if not already running)
# Create a new database
createdb ledgerx

# Or using psql
psql -U postgres
CREATE DATABASE ledgerx;
\q
```

### 3. Backend Configuration

```bash
cd backend

# Copy environment example
cp .env.example .env

# Edit .env with your database credentials
# Example:
# DATABASE_URL="postgresql://username:password@localhost:5432/ledgerx"
# JWT_SECRET="your-secret-key-here"
# PORT=3001
```

### 4. Run Database Migrations

```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Optional: Seed the database with sample data
npx prisma db seed
```

### 5. Frontend Configuration

```bash
cd frontend

# Create .env file
echo "VITE_API_URL=http://localhost:3001/api/v1" > .env
```

### 6. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```
Backend will run on `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

## 📚 API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:3001/api`
- API Base URL: `http://localhost:3001/api/v1`

## 🎯 Features

### User Management
- ✅ User registration and login
- ✅ JWT-based authentication
- ✅ Role-based access control (Admin/Viewer)

### Transaction Management
- ✅ Create, read, update, delete transactions
- ✅ Income and expense tracking
- ✅ Category-based organization
- ✅ Advanced filtering and search
- ✅ Pagination support

### Analytics & Insights
- ✅ Financial summary (income, expenses, balance)
- ✅ Monthly trends
- ✅ Category-wise breakdown
- ✅ Month-over-month comparison
- ✅ Interactive charts and visualizations

### Dashboard
- ✅ Real-time financial overview
- ✅ Recent transactions
- ✅ Quick stats and metrics
- ✅ Visual analytics

## 🛠️ Development

### Backend Commands

```bash
cd backend

# Development mode with hot reload
npm run start:dev

# Production build
npm run build
npm run start:prod

# Run tests
npm run test
npm run test:e2e

# Prisma commands
npx prisma studio              # Open Prisma Studio
npx prisma migrate dev         # Create and apply migration
npx prisma generate            # Generate Prisma Client
npx prisma db push             # Push schema without migration
```

### Frontend Commands

```bash
cd frontend

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📁 Project Structure

### Frontend Structure
```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page components
│   ├── contexts/        # React contexts (Auth, etc.)
│   ├── hooks/           # Custom hooks
│   ├── services/        # API service layer
│   ├── utils/           # Utility functions
│   ├── assets/          # Images, fonts, etc.
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── index.html
├── package.json
└── vite.config.js
```

### Backend Structure
```
backend/
├── src/
│   ├── auth/            # Authentication module
│   ├── transactions/    # Transactions module
│   ├── users/           # Users module
│   ├── common/          # Shared utilities
│   ├── config/          # Configuration
│   ├── app.module.ts    # Root module
│   └── main.ts          # Entry point
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── migrations/      # Migration files
├── package.json
└── tsconfig.json
```

## 🔐 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ledgerx"
JWT_SECRET="your-secret-key"
JWT_EXPIRATION="7d"
PORT=3001
NODE_ENV="development"
```

### Frontend (.env)
```env
VITE_API_URL="http://localhost:3001/api/v1"
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test           # Unit tests
npm run test:e2e       # End-to-end tests
npm run test:cov       # Test coverage
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 📦 Deployment

### Backend Deployment
1. Build the application: `npm run build`
2. Set environment variables on your server
3. Run migrations: `npx prisma migrate deploy`
4. Start the server: `npm run start:prod`

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service (Vercel, Netlify, etc.)
3. Set the `VITE_API_URL` environment variable to your production backend URL

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

Aishwary Vansh
- GitHub: [@aishwary-vansh](https://github.com/aishwary-vansh)

## 🙏 Acknowledgments

- NestJS for the excellent backend framework
- React team for the amazing frontend library
- Prisma for the excellent ORM
- TailwindCSS for beautiful styling utilities
