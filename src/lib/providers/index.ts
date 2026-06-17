import "server-only";

import type { PlacesProvider } from "@/lib/types";
import { getGooglePlaces } from "./google";
import { getOsmPlaces } from "./osm";

export type { PlacesProvider } from "@/lib/types";

export function isGoogleAvailable(): boolean {
  const key = process.env.GOOGLE_PLACES_API_KEY?.trim();
  if (!key) return false;
  if (
    key === "your_key_here" ||
    key.startsWith("REPLACE_") ||
    key.includes("your_actual_key")
  ) {
    return false;
  }
  return true;
}

export function getActiveProvider(): PlacesProvider {
  const configured = process.env.PLACES_PROVIDER as PlacesProvider | undefined;
  if (configured === "google" && isGoogleAvailable()) {
    return "google";
  }
  return "osm";
}

export function resolveProvider(
  override?: PlacesProvider | null
): PlacesProvider {
  if (override === "google") {
    return isGoogleAvailable() ? "google" : "osm";
  }
  if (override === "osm") {
    return "osm";
  }
  return getActiveProvider();
}

export async function getPlaces(
  lat: number,
  lng: number,
  radius?: number,
  providerOverride?: PlacesProvider | null
): Promise<{
  venues: Awaited<ReturnType<typeof getOsmPlaces>>;
  provider: PlacesProvider;
}> {
  const provider = resolveProvider(providerOverride);

  if (provider === "google") {
    const venues = await getGooglePlaces(lat, lng, radius);
    return { venues, provider: "google" };
  }

  const venues = await getOsmPlaces(lat, lng, radius);
  return { venues, provider: "osm" };
}
