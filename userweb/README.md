# MajiScope Public Web

The public MajiScope web client mirrors the citizen workflow in `user/Majiscope-app`:

- English and Kiswahili preference stored in the browser
- Guided, evidence-first water problem reporting
- Photo/video upload to the public upload endpoint
- Map pin, address search, and current-location capture
- Anonymous report history persisted locally and synced by a public history key
- Tracking-ID lookup, status detail, workflow notes, and utility contacts
- Location-based emergency utility lookup and reporting guidance

## Run locally

```powershell
cd userweb
npm run dev -- --host 127.0.0.1 --port 4177
```

The client uses `VITE_BACKEND_URL` when set and otherwise calls `https://majiscope.onrender.com`.
