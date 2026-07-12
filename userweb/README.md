# User Reporting (Fixi-like)

This is a minimal React + Vite TypeScript scaffold that implements a Fixi-like public reporting page integrated with the existing backend APIs in this repository.

Quick start:

1. Install dependencies:

```bash
cd userweb
npm install
```

2. Run development server:

```bash
npm run dev
```

3. Configure backend URL via environment variable:

Create a `.env` file with:

```
VITE_BACKEND_URL=http://localhost:8000
```

Features:
- Click on map to pick location
- Upload images (posted to `/api/uploads/public`)
- Submit anonymous report to `/api/reports/anonymous`

SPA routes:
- `/` → report form
- `/thanks?trackingId=...` → thank you page shown after successful submission
