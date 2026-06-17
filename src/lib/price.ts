import type { VenueCategory } from "./types";

export function getPriceFromTags(
  tags: Record<string, string>,
  category: VenueCategory
): string {
  const fee = tags.fee?.toLowerCase();

  if (fee === "no" || category === "park") return "Free";
  if (fee === "yes") return "Paid admission";

  if (category === "restaurant" || category === "bar") return "$$";
  if (category === "cafe") return "$";
  if (category === "museum" || category === "theater" || category === "attraction") {
    return "Varies";
  }

  return "Varies";
}

export function getGooglePriceLevel(level: string | number | undefined): string {
  const num = typeof level === "string" ? parseInt(level, 10) : level;
  if (!num || num < 1) return "Varies";
  return "$".repeat(Math.min(num, 4));
}
