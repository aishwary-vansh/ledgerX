# 🚀 Quick Start Guide - LedgerX

Get your LedgerX application up and running in 5 minutes!

## Prerequisites Check ✓

Before starting, ensure you have:
- [ ] Node.js 18+ installed (`node --version`)
- [ ] PostgreSQL 14+ installed and running
- [ ] npm or yarn package manager

## Step 1: Install Dependencies (2 mins)

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

## Step 2: Database Setup (1 min)

```bash
# Create database (choose one method)

# Method A: Using createdb command
createdb ledgerx

# Method B: Using psql
psql -U postgres
CREATE DATABASE ledgerx;
\q
```

## Step 3: Configure Environment (30 seconds)

### Backend Configuration
```bash
cd backend
cp .env.example .env

# Edit .env with your database credentials
# Minimum required:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/ledgerx"
# JWT_SECRET="your-super-secret-key-change-this"
```

### Frontend Configuration
```bash
cd frontend
cp .env.example .env

# Default should work:
# VITE_API_URL=http://localhost:3001/api/v1
```

## Step 4: Initialize Database (1 min)

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev

# Optional: Add sample data
npx prisma db seed
```

## Step 5: Start the Application (30 seconds)

Open **TWO** terminal windows:

### Terminal 1 - Backend
```bash
cd backend
npm run start:dev
```
✅ Backend running on http://localhost:3001

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
✅ Frontend running on http://localhost:5173

## Step 6: Access the Application

Open your browser and go to: **http://localhost:5173**

### Default Test Account (if seeded)
- Email: `admin@ledgerx.com`
- Password: `admin123`

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port 3001 (backend)
lsof -ti:3001 | xargs kill -9

# Find and kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### Database Connection Error
1. Check PostgreSQL is running: `pg_isready`
2. Verify DATABASE_URL in `backend/.env`
3. Test connection: `psql -U postgres -d ledgerx`

### Prisma Errors
```bash
cd backend
rm -rf node_modules
npm install
npx prisma generate
npx prisma migrate reset
```

### Module Not Found
```bash
# Clear and reinstall
cd frontend  # or backend
rm -rf node_modules package-lock.json
npm install
```

## API Documentation

Once running, access Swagger docs at:
**http://localhost:3001/api**

## Next Steps

1. 📖 Read the full [README.md](./README.md) for detailed documentation
2. 🔧 Check [SETUP.md](./SETUP.md) for advanced configuration
3. 🔌 Read [API_INTEGRATION.md](./API_INTEGRATION.md) for API usage examples
4. 🎨 Explore the codebase and customize!

## Quick Commands Reference

```bash
# Frontend
cd frontend
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview build

# Backend
cd backend
npm run start:dev    # Start with hot reload
npm run build        # Build for production
npm run start:prod   # Run production build
npx prisma studio    # Open database GUI
```

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the full documentation in README.md
3. Check the GitHub issues

Happy coding! 🎉
