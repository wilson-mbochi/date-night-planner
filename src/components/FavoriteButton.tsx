"use client";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
}

export function FavoriteButton({ isFavorite, onToggle }: FavoriteButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        onToggle();
      }}
      aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}
      className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-all hover:scale-110 ${
        isFavorite ? "text-rose" : "text-muted hover:text-rose"
      }`}
    >
      <span className="text-lg" aria-hidden>
        {isFavorite ? "♥" : "♡"}
      </span>
    </button>
  );
}
