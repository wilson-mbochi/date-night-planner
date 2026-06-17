"use client";

import { EmptyState } from "@/components/EmptyState";
import { VenueGrid } from "@/components/VenueGrid";
import { useFavorites } from "@/hooks/FavoritesContext";

export default function FavoritesPage() {
  const { favorites, hydrated } = useFavorites();

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-muted">
        Loading favorites…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-16">
      <section className="mb-10 text-center">
        <h1 className="font-display text-3xl font-semibold text-charcoal md:text-4xl">
          Saved Favorites
        </h1>
        <p className="mt-2 text-muted">
          {favorites.length > 0
            ? `${favorites.length} spot${favorites.length === 1 ? "" : "s"} saved for your next date`
            : "Spots you love will appear here"}
        </p>
      </section>

      {favorites.length > 0 ? (
        <VenueGrid venues={favorites} />
      ) : (
        <EmptyState
          title="No favorites yet"
          message="Browse date spots and tap the heart to save places you'd love to visit together."
          actionLabel="Discover Date Spots"
          actionHref="/"
        />
      )}
    </div>
  );
}
