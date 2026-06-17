import type { VenueCategory } from "@/lib/types";

export const CATEGORY_IMAGES: Record<VenueCategory, string> = {
  restaurant:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
  cafe: "https://images.unsplash.com/photo-1495474472283-4d71bcdd2085?w=800&q=80",
  bar: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80",
  museum:
    "https://images.unsplash.com/photo-1566127444979-b3d2b654fef3?w=800&q=80",
  park: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
  theater:
    "https://images.unsplash.com/photo-1503099646909-9f5a785ebb43?w=800&q=80",
  attraction:
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
  default:
    "https://images.unsplash.com/photo-1516589178581-6ec783f8e413?w=800&q=80",
};

export const DATE_POI_FILTERS = [
  'nwr["amenity"~"^(restaurant|cafe|bar|ice_cream|theatre)$"](around:{radius},{lat},{lng});',
  'nwr["tourism"~"^(museum|gallery|attraction|viewpoint)$"](around:{radius},{lat},{lng});',
  'nwr["leisure"~"^(park|garden|miniature_golf|bowling_alley)$"](around:{radius},{lat},{lng});',
];

export function getCategoryFromTags(
  tags: Record<string, string>
): VenueCategory {
  const amenity = tags.amenity ?? "";
  const tourism = tags.tourism ?? "";
  const leisure = tags.leisure ?? "";

  if (amenity === "restaurant" || amenity === "ice_cream") return "restaurant";
  if (amenity === "cafe") return "cafe";
  if (amenity === "bar") return "bar";
  if (amenity === "theatre") return "theater";
  if (tourism === "museum" || tourism === "gallery") return "museum";
  if (leisure === "park" || leisure === "garden") return "park";
  if (tourism === "attraction" || tourism === "viewpoint") return "attraction";

  return "default";
}

export function getCategoryImage(category: VenueCategory): string {
  return CATEGORY_IMAGES[category];
}
