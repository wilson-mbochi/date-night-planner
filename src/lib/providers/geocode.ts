import "server-only";

import { getCached, setCached } from "@/lib/cache";
import { fetchWithUserAgent } from "@/lib/fetch";
import type { GeocodeResult, NominatimResult } from "@/lib/types";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const CACHE_TTL = 5 * 60 * 1000;

export async function geocodeLocation(location: string): Promise<GeocodeResult> {
  const normalized = location.trim().toLowerCase();
  const cacheKey = `geocode:${normalized}`;
  const cached = getCached<GeocodeResult>(cacheKey);
  if (cached) return cached;

  const params = new URLSearchParams({
    q: location.trim(),
    format: "json",
    limit: "1",
    addressdetails: "1",
    countrycodes: "us",
  });

  const response = await fetchWithUserAgent(`${NOMINATIM_URL}?${params}`, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error("Geocoding service unavailable");
  }

  const results = (await response.json()) as NominatimResult[];
  if (!results.length) {
    throw new Error("Location not found. Try a city and state or a US zip code.");
  }

  const result: GeocodeResult = {
    lat: parseFloat(results[0].lat),
    lng: parseFloat(results[0].lon),
    formattedAddress: results[0].display_name,
  };

  setCached(cacheKey, result, CACHE_TTL);
  return result;
}
