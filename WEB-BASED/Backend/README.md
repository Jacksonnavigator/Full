# HydraNet Backend API

## Overview

HydraNet Backend is a FastAPI-based REST API server providing backend services for the HydraNet water leakage management system. It handles authentication, user management, resource management (utilities, DMAs, branches, teams, engineers), report management, and activity logging.

## Architecture

```
Backend (FastAPI)
├── app/config.py              # Global configuration with frontend URL
├── app/main.py                # FastAPI application entry point
├── app/models/                # SQLAlchemy ORM models
├── app/schemas/               # Pydantic request/response schemas
├── app/api/                   # API route handlers
├── app/services/              # Business logic
├── app/security/              # Authentication & authorization
├── app/database/              # Database connection & session
├── app/middleware/            # Custom middleware
├── app/constants/             # Enumerations & constants
├── app/utils/                 # Utility functions
└── requirements.txt           # Python dependencies
```

## Configuration

### Environment Variables

Create a `.env` file in the Backend directory:

```bash
# Environment
ENVIRONMENT=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/hydranet

# Security
SECRET_KEY=your-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=7

# Frontend Configuration (IMPORTANT)
FRONTEND_URL=http://localhost:3000

# API
API_PREFIX=/api

# Server
HOST=0.0.0.0
PORT=8000
```

### Key Configuration Files

- **`app/config.py`** - Global settings loaded from environment variables
  - `FRONTEND_URL` - Used for CORS and generating frontend URLs
  - `SECRET_KEY` - For JWT token signing
  - Database connection string
  - All server settings

## Installation & Setup

### 1. Create Python Virtual Environment

```bash
cd Backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Create `.env` File

Copy `.env.example` to `.env` and update configuration:

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Run Backend Server

```bash
python main.py
# OR
uvicorn app.main:app --reload

# Server runs on: http://localhost:8000
# API Docs: http://localhost:8000/docs (Swagger)
# OpenAPI Schema: http://localhost:8000/openapi.json
```

## Frontend Integration

The backend is configured to work with the frontend at the URL specified in `FRONTEND_URL` environment variable.

### CORS Configuration

CORS (Cross-Origin Resource Sharing) is automatically configured with:
- Frontend URL from `FRONTEND_URL` env variable
- Credentials allowed
- All standard HTTP methods
- All headers allowed

### API Communication

The frontend uses `lib/api-client.ts` to communicate with the backend:

```typescript
import { apiClient } from '@/lib/api-client'
import CONFIG from '@/lib/config'

// All requests automatically include:
// - BASE URL: from NEXT_PUBLIC_BACKEND_URL (.env.local)
// - AUTH: JWT token from localStorage
// - RETRIES: Automatic retry with exponential backoff
// - TIMEOUT: 30 second timeout

const response = await apiClient.get('/users')
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login, returns JWT token
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/verify` - Verify current token

### Users Management
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `GET /api/users/{id}` - Get user details
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Utilities
- `GET /api/utilities` - List utilities
- `POST /api/utilities` - Create utility
- `GET /api/utilities/{id}` - Get utility
- `PUT /api/utilities/{id}` - Update utility
- `DELETE /api/utilities/{id}` - Delete utility

### DMAs (District Meter Areas)
- `GET /api/dmas` - List DMAs
- `POST /api/dmas` - Create DMA
- `GET /api/dmas/{id}` - Get DMA
- `PUT /api/dmas/{id}` - Update DMA
- `DELETE /api/dmas/{id}` - Delete DMA

### Reports
- `GET /api/reports` - List reports (with filters)
- `POST /api/reports` - Create report
- `GET /api/reports/{id}` - Get report
- `PUT /api/reports/{id}` - Update report
- `DELETE /api/reports/{id}` - Delete report

### Other Endpoints
- `/api/branches` - Branches management
- `/api/teams` - Teams management
- `/api/engineers` - Engineers management
- `/api/dma-managers` - DMA Managers management
- `/api/utility-managers` - Utility Managers management
- `/api/notifications` - Notifications
- `/api/logs` - Activity logs

### Health & Status
- `GET /health` - Health check endpoint
- `GET /` - Root endpoint with API info
- `GET /api` - API endpoints list

## Database Models

The backend uses SQLAlchemy ORM with PostgreSQL. Models are defined in `app/models/`:

- **User Models**
  - Admin
  - UtilityManager
  - DMAManager
  - Engineer

- **Resource Models**
  - Utility
  - DMA (District Meter Area)
  - Branch
  - Team
  - Engineer (also used as resource)

- **Business Models**
  - Report
  - ActivityLog
  - Notification

## Development

### Running Tests

```bash
pytest
```

### Code Structure

- **Models** (`app/models/`) - SQLAlchemy ORM models
- **Schemas** (`app/schemas/`) - Pydantic validation models
- **API Routes** (`app/api/`) - FastAPI route handlers
- **Services** (`app/services/`) - Business logic
- **Security** (`app/security/`) - Auth & permissions
- **Utils** (`app/utils/`) - Helper functions

### Adding New Endpoints

1. Create model in `app/models/`
2. Create schema in `app/schemas/`
3. Create service in `app/services/` (optional)
4. Create API routes in `app/api/`
5. Register router in `app/main.py`

## Deployment

### Production Configuration

1. Update `.env` for production:

```bash
ENVIRONMENT=production
DATABASE_URL=postgresql://prod_user:prod_password@prod_host:5432/hydranet
SECRET_KEY=<generate-secure-key>
FRONTEND_URL=https://app.hydranet.com
```

2. Disable debug mode and reload
3. Use production ASGI server (gunicorn)

### Docker Deployment

```bash
docker build -t hydranet-backend .
docker run -p 8000:8000 --env-file .env hydranet-backend
```

## Documentation

- **API Documentation** (Swagger): `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **OpenAPI Schema**: `http://localhost:8000/openapi.json`

## Troubleshooting

### CORS Errors

If you see CORS errors:
1. Check `FRONTEND_URL` in `.env` matches your frontend URL
2. Ensure frontend is using correct `NEXT_PUBLIC_BACKEND_URL`
3. Check request headers include `Authorization: Bearer <token>`

### Database Connection Errors

1. Verify PostgreSQL is running
2. Check `DATABASE_URL` in `.env` is correct
3. Verify database exists and user has permissions

### Port Already in Use

Change `PORT` in `.env` or stop other services using port 8000.

## License

Proprietary - HydraNet Project
