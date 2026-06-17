import { VenueCard } from "@/components/VenueCard";
import type { Venue } from "@/lib/types";

interface VenueGridProps {
  venues: Venue[];
}

export function VenueGrid({ venues }: VenueGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {venues.map((venue) => (
        <VenueCard key={venue.id} venue={venue} />
      ))}
    </div>
  );
}
