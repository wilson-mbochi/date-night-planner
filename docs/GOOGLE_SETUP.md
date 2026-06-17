# Google Places API — Local Setup

Complete these steps in [Google Cloud Console](https://console.cloud.google.com/), then run the setup script.

## 1. Create a project

1. [Create a new project](https://console.cloud.google.com/projectcreate)
2. Name it e.g. `date-night-planner` and select it

## 2. Enable billing

1. Open [Billing](https://console.cloud.google.com/billing)
2. Link a billing account (Maps Platform includes ~$200/month free credit)

## 3. Enable Places API (New)

1. [Enable Places API (New)](https://console.cloud.google.com/apis/library/places.googleapis.com)
2. Click **Enable**

## 4. Create an API key

1. Open [Credentials](https://console.cloud.google.com/apis/credentials)
2. **Create credentials → API key**
3. Copy the key

## 5. Restrict the key (recommended)

Edit the key:

- **Application restrictions:** None (for local dev)
- **API restrictions:** Restrict key → **Places API (New)** only

## 6. Add the key to this app

Run in the project folder:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/setup-google.ps1
```

Or edit `.env.local` manually:

```env
GOOGLE_PLACES_API_KEY=your_actual_key_here
PLACES_PROVIDER=google
```

Restart the dev server (`npm run dev`), then open **Settings** in the app to switch to Google Places.

**Do not commit `.env.local` or share your API key.**
