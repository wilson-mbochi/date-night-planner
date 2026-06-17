"use client";

import { FormEvent, useState } from "react";
import type { GeocodeResult, PlacesProvider, Venue } from "@/lib/types";
import { EmptyState } from "@/components/EmptyState";
import { VenueGrid } from "@/components/VenueGrid";
import {
  getProviderLabel,
  getProviderPreference,
} from "@/lib/providerPreference";

export function LocationForm() {
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [geocoded, setGeocoded] = useState<GeocodeResult | null>(null);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [searched, setSearched] = useState(false);
  const [activeProvider, setActiveProvider] = useState<PlacesProvider>("osm");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setSearched(false);

    const provider = getProviderPreference();

    try {
      const geoRes = await fetch(
        `/api/geocode?location=${encodeURIComponent(location.trim())}`
      );
      const geoData = await geoRes.json();

      if (!geoRes.ok) {
        throw new Error(geoData.error ?? "Could not find that location");
      }

      const geo = geoData as GeocodeResult;
      setGeocoded(geo);

      const placesRes = await fetch(
        `/api/places?lat=${geo.lat}&lng=${geo.lng}&provider=${provider}`
      );
      const placesData = await placesRes.json();

      if (!placesRes.ok) {
        throw new Error(placesData.error ?? "Could not fetch date spots");
      }

      setVenues(placesData.venues ?? []);
      setActiveProvider(placesData.provider ?? provider);
      setSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setVenues([]);
      setGeocoded(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="mx-auto max-w-xl">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, State or zip code (e.g. Austin, TX or 78701)"
            required
            className="flex-1 rounded-full border border-rose/20 bg-white px-5 py-3.5 text-charcoal shadow-sm outline-none transition-shadow placeholder:text-muted/60 focus:border-rose focus:ring-2 focus:ring-rose/20"
          />
          <button
            type="submit"
            disabled={loading || !location.trim()}
            className="rounded-full bg-rose px-8 py-3.5 font-medium text-white shadow-sm transition-all hover:bg-rose-dark hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Searching…" : "Find Date Spots"}
          </button>
        </div>
        {error && (
          <p className="mt-3 text-center text-sm text-rose-dark" role="alert">
            {error}
          </p>
        )}
      </form>

      {geocoded && searched && venues.length > 0 && (
        <div className="mt-12">
          <div className="mb-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-muted shadow-sm">
              Data from {getProviderLabel(activeProvider)}
            </span>
            <p className="text-center text-muted">
              Showing date spots near{" "}
              <span className="font-medium text-charcoal">
                {geocoded.formattedAddress.split(",").slice(0, 2).join(",")}
              </span>
            </p>
          </div>
          <VenueGrid venues={venues} />
        </div>
      )}

      {searched && venues.length === 0 && !error && (
        <div className="mt-12">
          <EmptyState
            title="No spots found nearby"
            message="Not many places are mapped in this area yet. Try a nearby city or a different zip code."
          />
        </div>
      )}
    </div>
  );
}
