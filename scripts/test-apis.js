const fs = require("fs");
const path = require("path");

function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    process.env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
  }
}

loadEnv();

async function testGoogleDirect() {
  const key = process.env.GOOGLE_PLACES_API_KEY?.trim();
  if (!key) return { ok: false, error: "No API key in .env.local" };

  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": "places.id,places.displayName",
    },
    body: JSON.stringify({
      textQuery: "restaurants",
      locationBias: {
        circle: {
          center: { latitude: 30.27, longitude: -97.74 },
          radius: 5000,
        },
      },
      maxResultCount: 3,
    }),
  });

  const body = await res.json();
  if (!res.ok) {
    return { ok: false, status: res.status, error: body.error?.message ?? res.statusText };
  }
  return { ok: true, count: (body.places ?? []).length };
}

async function testApp(base) {
  const geo = await fetch(`${base}/api/geocode?location=78701`);
  const geoData = await geo.json();
  if (!geo.ok) return { geocode: { ok: false, error: geoData.error } };

  const { lat, lng } = geoData;
  const osm = await fetch(`${base}/api/places?lat=${lat}&lng=${lng}&provider=osm`);
  const osmData = await osm.json();

  const google = await fetch(
    `${base}/api/places?lat=${lat}&lng=${lng}&provider=google`
  );
  const googleData = await google.json();

  return {
    geocode: { ok: true, address: geoData.formattedAddress?.split(",").slice(0, 2).join(",") },
    osm: {
      ok: osm.ok,
      provider: osmData.provider,
      count: osmData.venues?.length ?? 0,
      error: osmData.error,
    },
    google: {
      ok: google.ok,
      provider: googleData.provider,
      count: googleData.venues?.length ?? 0,
      error: googleData.error,
    },
  };
}

async function main() {
  const base = process.argv[2] ?? "http://localhost:3000";
  console.log("=== Google API (direct) ===");
  console.log(JSON.stringify(await testGoogleDirect(), null, 2));
  console.log("\n=== App APIs at", base, "===");
  console.log(JSON.stringify(await testApp(base), null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
