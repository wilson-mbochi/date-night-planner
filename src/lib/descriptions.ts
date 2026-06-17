import type { VenueCategory } from "./types";

const CUISINE_LABELS: Record<string, string> = {
  italian: "Italian",
  french: "French",
  japanese: "Japanese",
  mexican: "Mexican",
  chinese: "Chinese",
  indian: "Indian",
  thai: "Thai",
  american: "American",
  pizza: "Pizza",
  sushi: "Sushi",
  seafood: "Seafood",
  steak_house: "Steakhouse",
  mediterranean: "Mediterranean",
};

export function generateDescription(
  tags: Record<string, string>,
  category: VenueCategory
): string {
  const cuisine = tags.cuisine?.split(";")[0]?.trim();
  const cuisineLabel = cuisine ? CUISINE_LABELS[cuisine] ?? capitalize(cuisine) : null;

  switch (category) {
    case "restaurant":
      return cuisineLabel
        ? `${cuisineLabel} restaurant — a classic dinner date spot.`
        : "Restaurant — enjoy a memorable meal together.";
    case "cafe":
      return "Café — cozy spot for coffee, conversation, and connection.";
    case "bar":
      return "Bar — unwind with drinks in a relaxed atmosphere.";
    case "museum":
      return "Museum — explore art and culture on your date.";
    case "park":
      return "Park — perfect for a relaxed stroll or picnic together.";
    case "theater":
      return "Theater — catch a show and make it a special evening.";
    case "attraction":
      return "Local attraction — discover something new together.";
    default:
      return "A great spot for your next date night.";
  }
}

function capitalize(value: string): string {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
