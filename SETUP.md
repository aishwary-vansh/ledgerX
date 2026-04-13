# Quick Setup Guide - LedgerX

Follow these steps to get LedgerX running on your machine in under 5 minutes.

## Prerequisites Check

Before you begin, ensure you have:
- ✅ Node.js (v18 or higher) - Run `node --version`
- ✅ PostgreSQL (v14 or higher) - Run `psql --version`
- ✅ npm or yarn - Run `npm --version`

## Step-by-Step Setup

### 1️⃣ Install Dependencies (2 minutes)

```bash
# Install both frontend and backend dependencies
npm run install:all

# Or install separately:
cd frontend && npm install
cd ../backend && npm install
```

### 2️⃣ Database Setup (1 minute)

```bash
# Create a PostgreSQL database
createdb ledgerx

# Or using psql:
psql -U postgres
CREATE DATABASE ledgerx;
\q
```

### 3️⃣ Configure Environment (1 minute)

**Backend Configuration:**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and update:
```env
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/ledgerx"
JWT_SECRET="your-super-secret-jwt-key-change-this"
PORT=3001
```

**Frontend Configuration:**
```bash
cd frontend
cp .env.example .env
```

The default settings in `.env` should work:
```env
VITE_API_URL=http://localhost:3001/api/v1
```

### 4️⃣ Setup Database Schema (1 minute)

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev --name init

# Optional: View your database
npx prisma studio
```

### 5️⃣ Start the Application (30 seconds)

**Option A: Using two terminals (Recommended for development)**

Terminal 1 - Backend:
```bash
cd backend
npm run start:dev
```
✅ Backend running at `http://localhost:3001`

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```
✅ Frontend running at `http://localhost:5173`

**Option B: Using root scripts**
```bash
# From root directory
npm run dev:backend    # Terminal 1
npm run dev:frontend   # Terminal 2
```

### 6️⃣ Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **Swagger Docs**: http://localhost:3001/api
- **Prisma Studio**: Run `npx prisma studio` in backend folder

## 🎉 You're Done!

You should now see the LedgerX login page. Create an account to get started!

## 🐛 Troubleshooting

### Database Connection Error
```
Error: Can't reach database server
```
**Solution:** Make sure PostgreSQL is running:
```bash
# Check if PostgreSQL is running
sudo service postgresql status

# Start PostgreSQL (Ubuntu/Debian)
sudo service postgresql start

# Or on macOS with Homebrew
brew services start postgresql
```

### Port Already in Use
```
Error: Port 3001 is already in use
```
**Solution:** Either kill the process using that port or change the port in `backend/.env`:
```bash
# Find what's using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>
```

### Frontend Can't Connect to Backend
```
Network Error / CORS Error
```
**Solution:** 
1. Verify backend is running on port 3001
2. Check `frontend/.env` has correct `VITE_API_URL`
3. Check backend CORS settings in `backend/src/main.ts`

### Prisma Migration Fails
```
Error: Migration failed
```
**Solution:**
```bash
# Reset database (⚠️ This deletes all data)
npx prisma migrate reset

# Or manually drop and recreate
psql -U postgres
DROP DATABASE ledgerx;
CREATE DATABASE ledgerx;
\q

# Then run migrations again
npx prisma migrate dev
```

## 📚 Next Steps

1. **Create your first user account** via the registration page
2. **Add some transactions** to see the dashboard in action
3. **Explore the API** at http://localhost:3001/api
4. **Read the main README.md** for detailed documentation

## 🆘 Need Help?

- 📖 Read the full [README.md](./README.md)
- 🐛 Check [Issues](https://github.com/aishwary-vansh/ledgerx-fullstack/issues)
- 💬 Ask questions in Discussions

Happy tracking! 🚀
