export type PlacesProvider = "osm" | "google";

export type VenueCategory =
  | "restaurant"
  | "cafe"
  | "bar"
  | "museum"
  | "park"
  | "theater"
  | "attraction"
  | "default";

export interface Venue {
  id: string;
  name: string;
  address: string;
  hours: string[];
  price: string;
  description: string;
  imageUrl: string;
  category: VenueCategory;
  distance?: number;
}

export interface GeocodeResult {
  lat: number;
  lng: number;
  formattedAddress: string;
}

export interface OsmElement {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

export interface OsmSearchResponse {
  elements: OsmElement[];
}

export interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}
