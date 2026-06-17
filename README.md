# Date Night Planner

A beautiful date-planning web app that helps couples discover nearby restaurants, cafés, museums, parks, and more. Enter a city/state or zip code, browse curated spots, and save favorites — **no API key or Google account required**.

## Features

- Location search by city/state or US zip code
- Curated list of date-worthy venues (restaurants, cafés, bars, museums, parks, theaters)
- Venue cards with image, name, address, hours, price, and description
- Save favorites to your browser (localStorage)
- **Settings page** to view data sources and switch to Google Places when configured
- Responsive layout for mobile, tablet, and desktop
- Warm, gender-neutral theme

## Data sources (free, no billing)

- **Nominatim** (OpenStreetMap) — geocoding
- **Overpass API** (OpenStreetMap) — nearby points of interest
- Category images from Unsplash (loaded at runtime)

No `.env` file is needed for the default setup.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and try a location like `Austin, TX` or `10001`.

## Local development tips

Only **one** dev server should run at a time. If the app acts strangely, the wrong port opens, or you see errors like `Cannot find module './331.js'`, use a clean restart:

```powershell
npm run dev:clean
```

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 3000 |
| `npm run dev:clean` | Stop stale servers, clear `.next`, then start dev |
| `npm run dev:stop` | Free ports 3000–3010 (stops old Next.js processes) |

**Why old processes stick around:** each `npm run dev` starts a Node process that keeps running until stopped. Background terminals in Cursor (or starting dev multiple times) can leave several servers on ports 3000, 3002, 3003, etc. Run `npm run dev:stop` before closing Cursor, or use `dev:clean` when in doubt.

## Deploy to GitHub + Vercel

See **[docs/DEPLOY.md](docs/DEPLOY.md)** for pushing to GitHub and deploying on Vercel.

## Settings & Google Places upgrade

Open **Settings** in the app header (or footer link) to see your current data source and compare options.

**Full setup guide:** [docs/GOOGLE_SETUP.md](docs/GOOGLE_SETUP.md)

### Quick setup (with your Google account)

1. Complete Google Cloud setup (project, billing, Places API New, API key) — see the guide above
2. Run the interactive setup script:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/setup-google.ps1
```

3. Restart the dev server (`npm run dev`)
4. Open **Settings** and select **Google Places**

Or edit `.env.local` manually:

```env
GOOGLE_PLACES_API_KEY=your_key_here
PLACES_PROVIDER=google
```

After the host configures the API key, visitors will see a toggle on the Settings page to switch between OpenStreetMap and Google Places. Search results show which data source was used.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run dev:clean` | Stop stale servers, clear cache, start dev |
| `npm run dev:stop` | Stop processes on ports 3000–3010 |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Tech stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS 4
- OpenStreetMap (Nominatim + Overpass)
- Google Places API (optional upgrade)

## License

MIT
