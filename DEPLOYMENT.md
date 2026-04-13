# 🚀 Deployment Guide - LedgerX

Complete guide for deploying LedgerX to production.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Database Deployment](#database-deployment)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Environment Variables](#environment-variables)
6. [Post-Deployment](#post-deployment)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:
- [ ] GitHub account (for version control)
- [ ] Production database ready (PostgreSQL)
- [ ] Backend hosting account (Railway, Render, Heroku, or AWS)
- [ ] Frontend hosting account (Vercel, Netlify, or Cloudflare Pages)
- [ ] Domain name (optional but recommended)

---

## Database Deployment

### Option 1: Railway PostgreSQL (Recommended for beginners)

1. **Create Railway Account**: https://railway.app
2. **Create New Project** → Select "PostgreSQL"
3. **Get Connection String**:
   ```
   Click on PostgreSQL → Connect → Copy DATABASE_URL
   ```
4. **Save the connection string** - you'll need it for backend deployment

### Option 2: Supabase PostgreSQL (Free tier available)

1. **Create Supabase Account**: https://supabase.com
2. **Create New Project**
3. **Get Connection String**:
   ```
   Settings → Database → Connection string (URI)
   ```

### Option 3: Neon PostgreSQL (Serverless, free tier)

1. **Create Neon Account**: https://neon.tech
2. **Create New Project**
3. **Copy Connection String**

---

## Backend Deployment

### Option 1: Railway (Easiest)

#### Step 1: Prepare Repository
```bash
# Push your code to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/aishwary-vansh/ledgerx-fullstack.git
git push -u origin main
```

#### Step 2: Deploy on Railway
1. Go to **https://railway.app**
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository: `ledgerx-fullstack`
4. Railway will auto-detect the backend

#### Step 3: Configure Build Settings
- **Root Directory**: `backend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start:prod`

#### Step 4: Set Environment Variables
In Railway dashboard → Variables:
```env
DATABASE_URL=<your-railway-postgres-url>
JWT_SECRET=<generate-a-strong-secret>
JWT_EXPIRATION=7d
NODE_ENV=production
PORT=3001
CORS_ORIGIN=<your-frontend-url>
```

#### Step 5: Generate Strong JWT Secret
```bash
# Use this command to generate a secure secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Step 6: Run Migrations
After deployment, open Railway shell and run:
```bash
npx prisma migrate deploy
npx prisma db seed  # Optional: seed sample data
```

#### Step 7: Get Backend URL
- Railway provides a public URL like: `https://your-app.up.railway.app`
- Save this URL for frontend configuration

### Option 2: Render

1. **Create Render Account**: https://render.com
2. **New Web Service** → Connect GitHub repo
3. **Configure**:
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`
4. **Add Environment Variables** (same as Railway)
5. **Create PostgreSQL Database** in Render
6. **Run migrations** via Render shell

### Option 3: Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create ledgerx-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set JWT_SECRET=<your-secret>
heroku config:set NODE_ENV=production

# Deploy
git subtree push --prefix backend heroku main

# Run migrations
heroku run npx prisma migrate deploy
```

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Configure for Deployment
Create `vercel.json` in `/frontend` directory:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### Step 3: Deploy
```bash
cd frontend
vercel

# Follow prompts:
# - Login to Vercel
# - Link to project
# - Configure settings
```

#### Step 4: Set Environment Variable
In Vercel Dashboard:
```env
VITE_API_URL=https://your-backend.up.railway.app/api/v1
```

#### Step 5: Deploy to Production
```bash
vercel --prod
```

### Option 2: Netlify

#### Step 1: Create `netlify.toml` in `/frontend`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Step 2: Deploy via Netlify CLI
```bash
npm install -g netlify-cli
cd frontend
netlify deploy --prod
```

#### Step 3: Set Environment Variables
In Netlify Dashboard → Site settings → Environment variables:
```env
VITE_API_URL=https://your-backend.up.railway.app/api/v1
```

### Option 3: Cloudflare Pages

1. **Connect GitHub repository**
2. **Configure build settings**:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `frontend`
3. **Add environment variables**
4. **Deploy**

---

## Environment Variables

### Backend Production Variables

```env
# Database (Required)
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"

# JWT (Required)
JWT_SECRET="<generate-strong-64-char-secret>"
JWT_EXPIRATION="7d"

# Server (Required)
NODE_ENV="production"
PORT=3001

# CORS (Required for frontend access)
CORS_ORIGIN="https://your-frontend-domain.com"

# Optional
API_PREFIX="/api/v1"
SWAGGER_ENABLED="false"  # Disable in production for security
```

### Frontend Production Variables

```env
# Backend API URL (Required)
VITE_API_URL="https://your-backend-domain.com/api/v1"
```

---

## Post-Deployment

### 1. Verify Backend Health

```bash
# Test API endpoint
curl https://your-backend-url.com/api/v1/health

# Should return: { "status": "ok" }
```

### 2. Test Authentication

```bash
# Register a test user
curl -X POST https://your-backend-url.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "name": "Test User"
  }'
```

### 3. Test Frontend

1. Visit your frontend URL
2. Try registering a new user
3. Log in
4. Create a test transaction
5. Check dashboard and analytics

### 4. Setup Custom Domain (Optional)

#### For Backend (Railway):
1. Railway Dashboard → Settings → Domains
2. Add custom domain: `api.yourdomain.com`
3. Update DNS records with provided CNAME

#### For Frontend (Vercel):
1. Vercel Dashboard → Settings → Domains
2. Add domain: `yourdomain.com`
3. Update DNS records

### 5. Enable HTTPS

- Both Railway and Vercel provide **automatic HTTPS**
- Ensure `CORS_ORIGIN` uses `https://`

### 6. Database Backups

#### Railway:
- Automatic backups included
- Manual backup: Railway dashboard → PostgreSQL → Backups

#### Render:
- Paid plans include automatic backups
- Manual backup via pg_dump

---

## Monitoring & Maintenance

### 1. Setup Error Monitoring (Optional)

**Sentry Integration**:
```bash
npm install @sentry/node @sentry/react
```

### 2. Setup Logging

Backend (`main.ts`):
```typescript
import { Logger } from '@nestjs/common';

const logger = new Logger('Bootstrap');
logger.log(`Server running on port ${port}`);
```

### 3. Performance Monitoring

- Monitor Railway/Render metrics
- Check Vercel Analytics
- Use Lighthouse for frontend performance

### 4. Regular Updates

```bash
# Update dependencies monthly
npm outdated
npm update

# Security updates
npm audit fix
```

---

## Troubleshooting

### Backend Issues

**Problem**: Database connection failed
```bash
# Solution: Check DATABASE_URL format
# Should include ?sslmode=require for production

DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

**Problem**: JWT authentication not working
```bash
# Solution: Verify JWT_SECRET is set
# Ensure it's the same secret everywhere
```

**Problem**: CORS errors
```bash
# Solution: Update CORS_ORIGIN in backend .env
CORS_ORIGIN="https://your-exact-frontend-url.com"
```

### Frontend Issues

**Problem**: API calls failing
```bash
# Solution 1: Check VITE_API_URL in Vercel/Netlify env vars
# Solution 2: Ensure backend is running and accessible
# Solution 3: Check browser console for CORS errors
```

**Problem**: Build failing
```bash
# Solution: Check Node.js version matches
# Vercel/Netlify should use Node 18+
```

### Database Issues

**Problem**: Migrations not applied
```bash
# Run migrations manually
# Railway shell or Render shell:
npx prisma migrate deploy
```

**Problem**: Connection pool exhausted
```bash
# Solution: Update DATABASE_URL with connection limit
DATABASE_URL="...?connection_limit=5"
```

---

## Rollback Strategy

If deployment fails:

### Backend Rollback (Railway)
1. Railway Dashboard → Deployments
2. Click on previous working deployment
3. Click "Redeploy"

### Frontend Rollback (Vercel)
1. Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "Promote to Production"

### Database Rollback
```bash
# If migration failed, rollback
npx prisma migrate resolve --rolled-back <migration-name>
```

---

## Checklist for Production Launch

- [ ] Backend deployed and accessible
- [ ] Database created and migrations applied
- [ ] Environment variables configured correctly
- [ ] Frontend deployed and connected to backend
- [ ] HTTPS enabled on both frontend and backend
- [ ] CORS configured properly
- [ ] Test user registration and login
- [ ] Test all CRUD operations
- [ ] Test analytics endpoints
- [ ] Error monitoring setup (optional)
- [ ] Domain configured (optional)
- [ ] Backups enabled
- [ ] Documentation updated

---

## Cost Estimation

### Free Tier Setup
- **Database**: Neon (Free tier - 500MB)
- **Backend**: Railway (Free trial, then $5/month)
- **Frontend**: Vercel (Free tier - hobby)
- **Total**: $0-5/month

### Production Setup
- **Database**: Railway PostgreSQL ($5-20/month)
- **Backend**: Railway ($5-20/month)
- **Frontend**: Vercel Pro ($20/month)
- **Total**: $30-60/month

---

## Security Checklist

- [ ] Strong JWT_SECRET (64+ characters)
- [ ] Environment variables not committed to Git
- [ ] HTTPS enabled everywhere
- [ ] CORS properly configured
- [ ] SQL injection protection (Prisma handles this)
- [ ] Rate limiting enabled (optional)
- [ ] Input validation on all endpoints
- [ ] Password hashing (bcrypt)
- [ ] Disable Swagger docs in production

---

## Support & Resources

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **NestJS Docs**: https://docs.nestjs.com
- **Prisma Docs**: https://www.prisma.io/docs

---

**Deployment Complete!** 🎉

Your LedgerX application is now live and accessible to users worldwide.
