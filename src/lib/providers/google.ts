import "server-only";

import { getCategoryImage } from "@/data/dateCategories";
import { getGooglePriceLevel } from "@/lib/price";
import type { Venue, VenueCategory } from "@/lib/types";

const GOOGLE_TYPE_TO_CATEGORY: Record<string, VenueCategory> = {
  restaurant: "restaurant",
  cafe: "cafe",
  bar: "bar",
  museum: "museum",
  park: "park",
  movie_theater: "theater",
  tourist_attraction: "attraction",
};

interface GooglePlace {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  regularOpeningHours?: { weekdayDescriptions?: string[] };
  priceLevel?: string;
  editorialSummary?: { text?: string };
  photos?: { name?: string }[];
  primaryType?: string;
  types?: string[];
}

function mapGoogleCategory(place: GooglePlace): VenueCategory {
  const primary = place.primaryType ?? place.types?.[0] ?? "";
  return GOOGLE_TYPE_TO_CATEGORY[primary] ?? "default";
}

function buildPhotoUrl(photoName: string, apiKey: string): string {
  return `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=400&key=${apiKey}`;
}

const SEARCH_QUERIES = [
  "romantic restaurants",
  "cafes and wine bars",
  "museums and art galleries",
  "parks and outdoor activities",
];

export async function getGooglePlaces(
  lat: number,
  lng: number,
  radius = 5000
): Promise<Venue[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    throw new Error("Google Places API key not configured");
  }

  const fieldMask = [
    "places.id",
    "places.displayName",
    "places.formattedAddress",
    "places.regularOpeningHours",
    "places.priceLevel",
    "places.photos",
    "places.editorialSummary",
    "places.primaryType",
    "places.types",
  ].join(",");

  const seen = new Set<string>();
  const venues: Venue[] = [];

  for (const textQuery of SEARCH_QUERIES) {
    const response = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": fieldMask,
        },
        body: JSON.stringify({
          textQuery,
          locationBias: {
            circle: {
              center: { latitude: lat, longitude: lng },
              radius,
            },
          },
          maxResultCount: 8,
        }),
      }
    );

    if (!response.ok) continue;

    const data = (await response.json()) as { places?: GooglePlace[] };
    for (const place of data.places ?? []) {
      const id = place.id;
      if (!id || seen.has(id)) continue;
      seen.add(id);

      const category = mapGoogleCategory(place);
      const photoName = place.photos?.[0]?.name;

      venues.push({
        id: `google-${id}`,
        name: place.displayName?.text ?? "Unnamed place",
        address: place.formattedAddress ?? "Address not listed",
        hours: place.regularOpeningHours?.weekdayDescriptions ?? [],
        price: getGooglePriceLevel(place.priceLevel),
        description:
          place.editorialSummary?.text ??
          "A great spot for your next date night.",
        imageUrl: photoName
          ? buildPhotoUrl(photoName, apiKey)
          : getCategoryImage(category),
        category,
      });

      if (venues.length >= 24) return venues;
    }
  }

  return venues;
}
