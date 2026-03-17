# Deployment Scenarios - Backend URL Configuration

## Overview
After the migration to `CONFIG.backend.fullUrl`, changing the backend API URL is now simple and flexible.

---

## Scenario 1: Local Development
**Default configuration works out of the box**

```bash
# Terminal
cd Frontend
npm install
npm run dev
```

**Configuration:**
- Backend URL: `http://localhost:8000`
- No environment variable needed (uses default from `lib/config.ts`)
- Frontend runs on: `http://localhost:3000`

---

## Scenario 2: Development with Custom Backend Port
**Use environment variable to override default**

```bash
# Backend on different port
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001 npm run dev
```

Or in `.env.local`:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

Then:
```bash
npm run dev
```

---

## Scenario 3: Testing Against Staging Server
**Point frontend to staging backend**

In `.env.local`:
```env
NEXT_PUBLIC_BACKEND_URL=http://staging-api.example.com:8000
```

Then:
```bash
npm run dev
```

All API calls will go to `http://staging-api.example.com:8000/api/*`

---

## Scenario 4: Production Build
**Create different environment configurations**

1. **Create `.env.production`:**
```env
NEXT_PUBLIC_BACKEND_URL=https://api.production.com
```

2. **Build for production:**
```bash
npm run build
```

3. **Start production server:**
```bash
npm start
```

---

## Scenario 5: Docker Deployment
**Set URL at runtime via Docker environment**

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Build arguments with defaults
ARG NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  backend:
    image: hydranet-backend:latest
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/hydranet

  frontend:
    image: hydranet-frontend:latest
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_BACKEND_URL=http://backend:8000
    depends_on:
      - backend
```

### Running with docker-compose
```bash
# Uses API_URL from environment
docker-compose up

# Or override at runtime
docker-compose up -e NEXT_PUBLIC_BACKEND_URL=http://api.custom.com:8000
```

---

## Scenario 6: Cloud Deployment (Vercel)
**Configure via Vercel environment variables**

### Method 1: Via Vercel Dashboard
1. Go to Project Settings → Environment Variables
2. Add new variable:
   - Name: `NEXT_PUBLIC_BACKEND_URL`
   - Value: `https://api.production.com`
3. Trigger new deployment

### Method 2: Via vercel.json
```json
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_BACKEND_URL": "@backend_api_url"
  }
}
```

### Method 3: Via Command Line
```bash
vercel env add NEXT_PUBLIC_BACKEND_URL
# Enter: https://api.production.com

vercel --prod
```

---

## Scenario 7: Netlify Deployment
**Configure Netlify build settings**

### Method 1: Via netlify.toml
```toml
[build]
  command = "npm run build"
  publish = ".next"

[context.production.environment]
  NEXT_PUBLIC_BACKEND_URL = "https://api.production.com"

[context.staging.environment]
  NEXT_PUBLIC_BACKEND_URL = "https://staging-api.production.com"
```

### Method 2: Via Netlify UI
1. Settings → Build & Deploy → Environment
2. Add environment variable:
   - Key: `NEXT_PUBLIC_BACKEND_URL`
   - Value: `https://api.production.com`

### Method 3: Via Command Line
```bash
netlify env:set NEXT_PUBLIC_BACKEND_URL "https://api.production.com"
netlify deploy --prod
```

---

## Scenario 8: AWS Amplify
**Use Amplify environment variables**

### Via amplify.yml
```yaml
version: 1
frontend:
  phases:
    build:
      commands:
        - npm ci
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - 'node_modules/**/*'
env:
  variables:
    NEXT_PUBLIC_BACKEND_URL: https://api.amplify.production.com
```

### Via AWS Console
1. Go to Amplify → App Settings → Build settings
2. Environment variables section
3. Add: `NEXT_PUBLIC_BACKEND_URL` = `https://api.production.com`

---

## Scenario 9: GitHub Actions CI/CD
**Automate deployment with environment-specific URLs**

### .github/workflows/deploy.yml
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        env:
          NEXT_PUBLIC_BACKEND_URL: ${{ secrets.BACKEND_API_URL }}
        run: npm run build
      
      - name: Deploy
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

### GitHub Secrets
In repository settings, add:
- `BACKEND_API_URL` = `https://api.production.com`

---

## Scenario 10: Multiple Environments
**Different backends for dev/staging/production**

### .env files
**`.env.local`** (development)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

**`.env.staging`** (staging)
```env
NEXT_PUBLIC_BACKEND_URL=https://staging-api.example.com
```

**`.env.production`** (production)
```env
NEXT_PUBLIC_BACKEND_URL=https://api.example.com
```

### Build commands
```bash
# Development
npm run dev

# Build for staging
npm run build  # uses .env.staging if set as active env
NEXT_PUBLIC_BACKEND_URL=https://staging-api.example.com npm run build

# Build for production
NEXT_PUBLIC_BACKEND_URL=https://api.example.com npm run build
```

---

## Verification
After deploying, verify the frontend is using the correct backend:

1. **Open browser DevTools (F12)**
2. **Go to Network tab**
3. **Perform any API action**
4. **Check Request URL** - Should show your configured backend URL

**Example:**
- Request should go to: `https://api.production.com/api/utilities`
- Not to: `http://localhost:8000/api/utilities`

---

## Troubleshooting

### Issue: API calls still go to localhost:8000
**Solution:** 
1. Make sure you set `NEXT_PUBLIC_` prefix on environment variable
2. Rebuild the application (environment variables are embedded at build time)
3. Clear browser cache and hard refresh

### Issue: Getting CORS errors
**Solution:**
1. Verify backend URL is correct (check Network tab)
2. Make sure backend has CORS enabled for your frontend URL
3. Check backend logs for CORS configuration

### Issue: Environment variable not working
**Solution:**
1. Verify variable name is exactly: `NEXT_PUBLIC_BACKEND_URL`
2. Restart dev server: `npm run dev`
3. For production builds, rebuild: `npm run build`
4. Check with: `grep -r "NEXT_PUBLIC_BACKEND_URL" .next` (should show in build output)

---

## Best Practices

✅ **Do:**
- Use `NEXT_PUBLIC_BACKEND_URL` for all environment-specific URLs
- Test API calls after deployment with DevTools Network tab
- Use different values for dev/staging/production
- Document your deployment configuration
- Keep `.env.local` in `.gitignore` (never commit actual URLs)

❌ **Don't:**
- Hardcode URLs in source code
- Use `BACKEND_URL` without `NEXT_PUBLIC_` prefix
- Forget to rebuild when changing environment variables
- Share production URLs in version control
- Mix environment variables and in-code configuration

---

## Quick Reference

| Environment | Backend URL | How to Set |
|-------------|-------------|-----------|
| Local Dev | `http://localhost:8000` | `.env.local` or default |
| Staging | `https://staging-api.com` | Environment variable |
| Production | `https://api.production.com` | Environment variable |
| Docker | Service name | `docker-compose.yml` |
| Vercel | Via Dashboard | Project settings |
| Netlify | Via Dashboard | Build settings |

---

For more information, see:
- [CONFIG_MIGRATION_SUMMARY.md](./CONFIG_MIGRATION_SUMMARY.md) - Overview of changes
- [CONFIG_USAGE_GUIDE.md](./CONFIG_USAGE_GUIDE.md) - How to use CONFIG in code
- [lib/config.ts](./lib/config.ts) - Configuration file
