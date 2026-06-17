# Deploy to GitHub + Vercel

## Prerequisites

- [GitHub](https://github.com) account
- [Vercel](https://vercel.com) account (sign in with GitHub)

## 1. Push to GitHub

If not logged into GitHub CLI:

```powershell
gh auth login
```

Choose: GitHub.com → HTTPS → Login with browser.

Create the repo and push:

```powershell
cd V:\CursorSites\wordPressHobbyist
gh repo create date-night-planner --public --source=. --remote=origin --push
```

Use a different name if `date-night-planner` is taken.

## 2. Deploy on Vercel

### Option A — Vercel Dashboard (recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. **Import** your `date-night-planner` GitHub repository
3. Framework should auto-detect **Next.js**
4. Add **Environment Variables** (Settings → Environment Variables):

| Name | Value |
|------|-------|
| `GOOGLE_PLACES_API_KEY` | Your Google Places API key (optional) |
| `PLACES_PROVIDER` | `google` if using Google; `osm` for free-only |

5. Click **Deploy**

### Option B — Vercel CLI

```powershell
vercel login
vercel link
vercel env add GOOGLE_PLACES_API_KEY
vercel env add PLACES_PROVIDER
vercel --prod
```

## 3. Google API key on Vercel

If you use Google Places in production:

1. In [Google Cloud Console](https://console.cloud.google.com/apis/credentials), edit your API key
2. Under **Application restrictions**, add your Vercel domain:
   - `https://your-app.vercel.app/*`
   - `https://*.vercel.app/*` (preview deployments)

## 4. Verify

- Visit your Vercel URL
- Search a location (e.g. `78701`)
- Open **Settings** — confirm data source options work

Every `git push` to `main` triggers a new Vercel deployment automatically.
