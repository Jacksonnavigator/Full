# Using CONFIG.backend.fullUrl in Frontend

## Quick Reference

### Import the CONFIG
```typescript
import { CONFIG } from "@/lib/config"
```

The CONFIG already provides:
- `CONFIG.backend.baseUrl` - Base URL (e.g., "http://localhost:8000")
- `CONFIG.backend.apiPrefix` - API prefix (e.g., "/api")
- `CONFIG.backend.fullUrl` - Complete URL (e.g., "http://localhost:8000/api")

## Usage Patterns

### 1. Simple GET Request
```typescript
const response = await fetch(`${CONFIG.backend.fullUrl}/utilities`, {
  headers: { "Authorization": `Bearer ${localStorage.getItem('access_token')}` }
})
```

### 2. GET with Parameters
```typescript
const response = await fetch(`${CONFIG.backend.fullUrl}/utilities?status=active`, {
  headers: { "Authorization": `Bearer ${localStorage.getItem('access_token')}` }
})
```

### 3. GET with ID in Path
```typescript
const response = await fetch(`${CONFIG.backend.fullUrl}/utilities/${utilityId}`, {
  headers: { "Authorization": `Bearer ${localStorage.getItem('access_token')}` }
})
```

### 4. POST Request
```typescript
const response = await fetch(`${CONFIG.backend.fullUrl}/utilities`, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ name: "New Utility", ... })
})
```

### 5. PUT/Update Request
```typescript
const response = await fetch(`${CONFIG.backend.fullUrl}/utilities`, {
  method: "PUT",
  headers: {
    "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ id: utilityId, name: "Updated Name", ... })
})
```

### 6. DELETE Request
```typescript
const response = await fetch(`${CONFIG.backend.fullUrl}/utilities/${utilityId}`, {
  method: "DELETE",
  headers: { "Authorization": `Bearer ${localStorage.getItem('access_token')}` }
})
```

## Common Endpoints

All endpoints follow this pattern: `${CONFIG.backend.fullUrl}/<resource>`

**Utilities:**
- GET `/utilities` - List all utilities
- POST `/utilities` - Create utility
- PUT `/utilities` - Update utility
- DELETE `/utilities/{id}` - Delete utility

**DMAs (Distribution Management Areas):**
- GET `/dmas` - List all DMAs
- GET `/dmas/{id}` - Get specific DMA
- POST `/dmas` - Create DMA
- PUT `/dmas` - Update DMA

**Branches:**
- GET `/branches` - List branches
- POST `/branches` - Create branch
- PUT `/branches` - Update branch
- DELETE `/branches?id={id}` - Delete branch

**Engineers:**
- GET `/engineers` - List engineers
- POST `/engineers` - Create engineer
- PUT `/engineers` - Update engineer
- DELETE `/engineers?id={id}` - Delete engineer

**Teams:**
- GET `/teams` - List teams
- GET `/teams/{id}/members` - Get team members
- GET `/teams/{id}/leader` - Get team leader
- POST `/teams/{id}/members` - Add members to team
- PUT `/teams/{id}/leader` - Assign team leader
- DELETE `/teams/{id}/leader` - Remove team leader

**Managers:**
- GET `/utility-managers` - List utility managers
- POST `/utility-managers` - Create utility manager
- PUT `/utility-managers` - Update utility manager
- GET `/dma-managers` - List DMA managers
- POST `/dma-managers` - Create DMA manager
- PUT `/dma-managers` - Update DMA manager

## Configuration Settings

### lib/config.ts - Backend Configuration
```typescript
export const CONFIG = {
  backend: {
    baseUrl: BACKEND_URL,              // "http://localhost:8000"
    apiPrefix: BACKEND_API_PREFIX,     // "/api"
    fullUrl: `${BACKEND_URL}${BACKEND_API_PREFIX}`,  // "http://localhost:8000/api"
  },
  // ... other configs
}
```

### Environment Variables (.env.local)
```env
# Backend URL for API calls
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

## Changing Backend URLs

### For Local Development
```bash
# Using default (localhost:8000)
npm run dev

# Using custom backend
NEXT_PUBLIC_BACKEND_URL=http://api.custom.local:3000 npm run dev
```

### For Production Build
```bash
# Build with production API URL
NEXT_PUBLIC_BACKEND_URL=https://api.production.com npm run build
npx next start
```

### For Docker Deployment
```dockerfile
ARG NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
```

## Best Practices

✅ **Do:**
- Always use `CONFIG.backend.fullUrl` for all API calls
- Keep hardcoded endpoint names (e.g., "/utilities") but not full URLs
- Add `CONFIG` import to files making API calls
- Use template literals: `` `${CONFIG.backend.fullUrl}/endpoint` ``

❌ **Don't:**
- Hardcode "http://localhost:8000/api"
- Hardcode backend URLs anywhere except lib/config.ts
- Store backend URL in multiple files
- Use string concatenation instead of template literals

## Example from Real Code

**Before Migration:**
```typescript
const response = await fetch("http://localhost:8000/api/utilities", {
  headers: { "Authorization": `Bearer ${localStorage.getItem('access_token')}` }
})
```

**After Migration:**
```typescript
import { CONFIG } from "@/lib/config"

const response = await fetch(`${CONFIG.backend.fullUrl}/utilities`, {
  headers: { "Authorization": `Bearer ${localStorage.getItem('access_token')}` }
})
```

That's it! The backend URL is now dynamic and configured centrally.
