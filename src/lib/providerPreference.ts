import type { PlacesProvider } from "@/lib/types";

const STORAGE_KEY = "datePlanner:provider";

export function getProviderPreference(): PlacesProvider {
  if (typeof window === "undefined") return "osm";
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === "google" || value === "osm") return value;
  } catch {
    // ignore
  }
  return "osm";
}

export function setProviderPreference(provider: PlacesProvider): void {
  localStorage.setItem(STORAGE_KEY, provider);
}

export function getProviderLabel(provider: PlacesProvider): string {
  return provider === "google" ? "Google Places" : "OpenStreetMap";
}
