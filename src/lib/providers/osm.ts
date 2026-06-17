import "server-only";

import {
  DATE_POI_FILTERS,
  getCategoryFromTags,
  getCategoryImage,
} from "@/data/dateCategories";
import { generateDescription } from "@/lib/descriptions";
import { fetchWithUserAgent } from "@/lib/fetch";
import { parseOpeningHours } from "@/lib/openingHours";
import { getPriceFromTags } from "@/lib/price";
import type { OsmElement, OsmSearchResponse, Venue } from "@/lib/types";

const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

function getElementCoords(
  element: OsmElement
): { lat: number; lng: number } | null {
  if (element.lat != null && element.lon != null) {
    return { lat: element.lat, lng: element.lon };
  }
  if (element.center) {
    return { lat: element.center.lat, lng: element.center.lon };
  }
  return null;
}

function buildAddress(tags: Record<string, string>): string {
  const parts = [
    tags["addr:housenumber"],
    tags["addr:street"],
    tags["addr:city"],
    tags["addr:state"],
    tags["addr:postcode"],
  ].filter(Boolean);

  if (parts.length > 0) return parts.join(", ");
  if (tags.address) return tags.address;
  return "Address not listed";
}

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function buildOverpassQuery(lat: number, lng: number, radius: number): string {
  const filters = DATE_POI_FILTERS.map((f) =>
    f.replaceAll("{radius}", String(radius))
      .replaceAll("{lat}", String(lat))
      .replaceAll("{lng}", String(lng))
  ).join("\n  ");

  return `[out:json][timeout:25];
(
  ${filters}
);
out center 30;`;
}

async function queryOverpass(query: string): Promise<OsmElement[]> {
  let lastError: Error | null = null;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const response = await fetchWithUserAgent(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `data=${encodeURIComponent(query)}`,
      });

      if (!response.ok) {
        lastError = new Error(`Overpass returned ${response.status}`);
        continue;
      }

      const data = (await response.json()) as OsmSearchResponse;
      return data.elements ?? [];
    } catch (err) {
      lastError = err instanceof Error ? err : new Error("Overpass request failed");
    }
  }

  throw lastError ?? new Error("Overpass service unavailable");
}

function elementToVenue(
  element: OsmElement,
  originLat: number,
  originLng: number
): Venue | null {
  const tags = element.tags ?? {};
  const name = tags.name?.trim();
  if (!name) return null;

  const coords = getElementCoords(element);
  if (!coords) return null;

  const category = getCategoryFromTags(tags);
  const distance = haversineDistance(originLat, originLng, coords.lat, coords.lng);

  return {
    id: `osm-${element.type}-${element.id}`,
    name,
    address: buildAddress(tags),
    hours: parseOpeningHours(tags.opening_hours),
    price: getPriceFromTags(tags, category),
    description: generateDescription(tags, category),
    imageUrl: getCategoryImage(category),
    category,
    distance,
  };
}

export async function getOsmPlaces(
  lat: number,
  lng: number,
  radius = 5000
): Promise<Venue[]> {
  const query = buildOverpassQuery(lat, lng, radius);
  const elements = await queryOverpass(query);

  const venues = elements
    .map((el) => elementToVenue(el, lat, lng))
    .filter((v): v is Venue => v !== null);

  const seen = new Set<string>();
  const unique: Venue[] = [];

  for (const venue of venues.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0))) {
    const key = venue.name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(venue);
    if (unique.length >= 24) break;
  }

  return unique;
}
