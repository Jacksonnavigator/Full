# Quick Start Guide - Backend Separation

This guide will help you get the completely separated Backend and Frontend running.

## Prerequisites

- Python 3.8+ installed
- Node.js 16+ & npm/pnpm installed
- PostgreSQL 12+ running locally (or update DATABASE_URL in .env)

---

## 1. Backend Setup (FastAPI + Python)

### Step 1: Navigate to Backend

```bash
cd Backend
```

### Step 2: Create Virtual Environment

```bash
# Create environment
python -m venv venv

# Activate environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Configure Environment

The `.env` file is already created with development defaults. Update if needed:

```bash
# Check/edit .env file
nano .env  # or use your editor

# Key settings to verify:
# DATABASE_URL=postgresql://hydranet_user:hydranet_password@localhost:5432/hydranet
# FRONTEND_URL=http://localhost:3000
# SECRET_KEY=dev-secret-key-change-in-production
```

### Step 5: Run Backend Server

```bash
# Option 1: Run via main.py
python main.py

# Option 2: Run via uvicorn directly
uvicorn app.main:app --reload

# Option 3: Run in production mode
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**Backend will start on:** `http://localhost:8000`

**API Documentation:** `http://localhost:8000/docs` (Swagger UI)

---

## 2. Frontend Setup (Next.js + React)

### Step 1: Navigate to Frontend

```bash
cd Frontend
```

### Step 2: Install Dependencies

```bash
npm install
# or
pnpm install
```

### Step 3: Check Environment Configuration

The `.env.local` file is already created with correct settings:

```bash
# Verify content
cat .env.local

# Should contain:
# NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### Step 4: Run Frontend Server

```bash
npm run dev
# or
pnpm dev
```

**Frontend will start on:** `http://localhost:3000`

---

## 3. Testing the Complete Setup

### Verify Backend is Running

```bash
curl http://localhost:8000/health

# Should return:
# {
#   "status": "healthy",
#   "service": "HydraNet Backend",
#   "version": "1.0.0",
#   "environment": "development",
#   "frontend_url": "http://localhost:3000"
# }
```

### Verify Frontend Loads

Open browser and go to: `http://localhost:3000`

### Test API Communication

1. Open browser DevTools (F12)
2. Go to login page
3. Enter any test email/password
4. Check Network tab to see API call going to `http://localhost:8000/api/auth/login`

---

## 4. Key Configuration Files

### Frontend Configuration

**File:** `Frontend/lib/config.ts`
- Contains all API endpoint definitions
- Backend URL comes from environment variable
- Global API client configuration

**File:** `Frontend/.env.local`
```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### Backend Configuration

**File:** `Backend/app/config.py`
- Global settings class
- Loads from `.env` file
- FRONTEND_URL is critical for CORS

**File:** `Backend/.env`
```bash
FRONTEND_URL=http://localhost:3000
```

---

## 5. API Communication Flow

```
User Types Email/Password in Browser
    ↓
React Component (login/page.tsx)
    ↓
Zustand Store (useAuthStore.login())
    ↓
API Client (apiClient.post())
    ↓
Uses CONFIG.backend.fullUrl = http://localhost:8000/api
    ↓
POST http://localhost:8000/api/auth/login
    ↓
Backend FastAPI Route (app/api/auth.py)
    ↓
SQLAlchemy Query to PostgreSQL
    ↓
Returns JWT Token
    ↓
Frontend Stores Token in localStorage
    ↓
Subsequent Requests Include: Authorization: Bearer <token>
```

---

## 6. Common Issues & Troubleshooting

### CORS Error

**Error:** `Access to XMLHttpRequest at 'http://localhost:8000/api/...' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solution:**
1. Verify `FRONTEND_URL` in `Backend/.env` = `http://localhost:3000`
2. Verify `NEXT_PUBLIC_BACKEND_URL` in `Frontend/.env.local` = `http://localhost:8000`
3. Restart backend server

### Port Already in Use

**Error:** `Address already in use :8000` or `:3000`

**Solution:**
```bash
# Kill process on port 8000
lsof -i :8000  # Find process
kill -9 <PID>  # Kill it

# Or change port in .env
PORT=8001  # Use different port
```

### Database Connection Error

**Error:** `FATAL: database "hydranet" does not exist`

**Solution:**
```bash
# Create database
createdb hydranet

# Or update DATABASE_URL in Backend/.env to point to correct database
```

### Module Not Found Error

**Solution:**
```bash
# Make sure virtual environment is activated
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate      # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

---

## 7. Development Workflow

### Making Changes to Frontend

1. Edit React components in `Frontend/`
2. Save file (auto-refresh with `npm run dev`)
3. Changes immediately visible in browser

### Making Changes to Backend

1. Edit Python files in `Backend/app/`
2. Server auto-reloads with `--reload` flag
3. Test with Swagger UI: `http://localhost:8000/docs`

### Adding New API Endpoints

1. Update stores in `Frontend/store/` to use new endpoint
2. Create API route in `Backend/app/api/`
3. Register route in `Backend/app/main.py`
4. Test with Swagger UI or curl

### Updating Stores

```typescript
// Frontend/store/data-store.ts
const response = await apiClient.get('/new-endpoint')
// Automatically uses: http://localhost:8000/api/new-endpoint
```

---

## 8. Deployment

### For Production

Update configuration files:

**Backend (.env)**
```bash
ENVIRONMENT=production
DATABASE_URL=postgresql://prod_user:prod_pass@prod_host/db
FRONTEND_URL=https://app.hydranet.com
SECRET_KEY=<generate-secure-key>
```

**Frontend (.env.local)**
```bash
NEXT_PUBLIC_BACKEND_URL=https://api.hydranet.com
```

### Using Docker (Optional)

```bash
# Build backend image
docker build -t hydranet-backend Backend/

# Run backend
docker run -p 8000:8000 --env-file Backend/.env hydranet-backend

# Build frontend image
docker build -t hydranet-frontend Frontend/

# Run frontend
docker run -p 3000:3000 -e NEXT_PUBLIC_BACKEND_URL=http://localhost:8000 hydranet-frontend
```

---

## 9. Documentation

- **Implementation Plan:** `/IMPLEMENTATION_PLAN.md`
- **Progress Report:** `/PROGRESS_REPORT.md`
- **Backend README:** `Backend/README.md`
- **Frontend Code:** See structure in `Frontend/`

---

## 10. Next Steps

The infrastructure is ready. Next phases:

1. **Create SQLAlchemy Models** from Prisma schema
2. **Create Pydantic Schemas** for request/response validation
3. **Implement Authentication Routes** (login, logout, refresh)
4. **Implement CRUD Routes** for all resources
5. **Test Complete API** with frontend
6. **Deploy** to production

---

## Support

For issues or questions:
1. Check error message carefully
2. Review relevant README files
3. Check logs in terminal (backend and browser DevTools)
4. Verify environment variables are correct

---

**Happy Coding! 🚀**
