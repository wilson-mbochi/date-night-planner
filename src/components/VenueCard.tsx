"use client";

import Image from "next/image";
import { FavoriteButton } from "@/components/FavoriteButton";
import { HoursDisplay } from "@/components/HoursDisplay";
import { useFavorites } from "@/hooks/FavoritesContext";
import type { Venue } from "@/lib/types";

interface VenueCardProps {
  venue: Venue;
}

export function VenueCard({ venue }: VenueCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(venue.id);

  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={venue.imageUrl}
          alt={venue.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute right-3 top-3">
          <FavoriteButton
            isFavorite={favorited}
            onToggle={() => toggleFavorite(venue)}
          />
        </div>
        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium capitalize text-charcoal backdrop-blur-sm">
          {venue.category}
        </span>
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold leading-tight text-charcoal">
            {venue.name}
          </h3>
          <span className="shrink-0 rounded-full bg-cream-dark px-2.5 py-1 text-xs font-medium text-charcoal">
            {venue.price}
          </span>
        </div>

        <p className="text-sm leading-relaxed text-muted">{venue.description}</p>

        <p className="text-sm text-muted">
          <span className="font-medium text-charcoal">Address:</span> {venue.address}
        </p>

        <HoursDisplay hours={venue.hours} />
      </div>
    </article>
  );
}
