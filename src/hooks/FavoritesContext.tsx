"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Venue } from "@/lib/types";

const STORAGE_KEY = "datePlanner:favorites";

interface FavoritesContextValue {
  favorites: Venue[];
  hydrated: boolean;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (venue: Venue) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function readFavorites(): Venue[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Venue[];
  } catch {
    return [];
  }
}

function writeFavorites(favorites: Venue[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Venue[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setFavorites(readFavorites());
    setHydrated(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setFavorites(readFavorites());
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.some((v) => v.id === id),
    [favorites]
  );

  const toggleFavorite = useCallback((venue: Venue) => {
    setFavorites((prev) => {
      const exists = prev.some((v) => v.id === venue.id);
      const next = exists
        ? prev.filter((v) => v.id !== venue.id)
        : [...prev, venue];
      writeFavorites(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ favorites, hydrated, isFavorite, toggleFavorite }),
    [favorites, hydrated, isFavorite, toggleFavorite]
  );

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
}
