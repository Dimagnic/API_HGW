# API Dashboard

Full-stack app: React (Vite) frontend + PocketBase backend.

## Project Structure

```
apps/
  web/          # React + Vite frontend
  pocketbase/   # PocketBase hooks
```

## Local Development

```bash
# Install dependencies
cd apps/web && npm install

# Start frontend dev server
npm run dev

# Open http://localhost:5173
```

## Environment Variables

Create `apps/web/.env.local`:

```
VITE_POCKETBASE_URL=http://127.0.0.1:8090
```

## Deploy to GitHub Pages (automatic)

1. Push to `main` branch — GitHub Actions builds and deploys automatically.
2. Go to **Settings → Pages** → Source: **GitHub Actions**.
3. Add secret: `VITE_POCKETBASE_URL` → your production PocketBase URL.

> **Note:** If the repo is at `https://username.github.io/repo-name/`,
> uncomment the `VITE_BASE_PATH` line in `.github/workflows/deploy.yml`.

## Manual Build

```bash
cd apps/web
npm ci
npm run build
# Output: apps/web/dist/
```
