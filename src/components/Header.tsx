"use client";

import Link from "next/link";
import { useFavorites } from "@/hooks/FavoritesContext";

export function Header() {
  const { favorites, hydrated } = useFavorites();
  const count = hydrated ? favorites.length : 0;

  return (
    <header className="border-b border-rose/10 bg-cream/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="group flex items-center gap-2">
          <span className="text-2xl" aria-hidden>
            ♥
          </span>
          <span className="font-display text-xl font-semibold text-charcoal transition-colors group-hover:text-rose-dark">
            Date Night
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/settings"
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-charcoal shadow-sm transition-all hover:shadow-md hover:text-rose-dark"
          >
            <span aria-hidden>⚙</span>
            <span className="hidden sm:inline">Settings</span>
          </Link>
          <Link
            href="/favorites"
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-charcoal shadow-sm transition-all hover:shadow-md hover:text-rose-dark"
          >
            <span aria-hidden>♥</span>
            <span>Favorites</span>
            {count > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose px-1.5 text-xs text-white">
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
