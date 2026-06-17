"use client";

import { useState } from "react";
import { formatHoursDisplay } from "@/lib/openingHours";

interface HoursDisplayProps {
  hours: string[];
}

export function HoursDisplay({ hours }: HoursDisplayProps) {
  const [expanded, setExpanded] = useState(false);
  const hasHours = hours.length > 0;
  const summary = formatHoursDisplay(hours);

  if (!hasHours) {
    return (
      <p className="text-sm text-muted">
        <span className="font-medium text-charcoal">Hours:</span> Hours vary — check
        venue website
      </p>
    );
  }

  return (
    <div className="text-sm text-muted">
      <div className="flex items-start justify-between gap-2">
        <p>
          <span className="font-medium text-charcoal">Hours:</span>{" "}
          <span className="md:hidden">
            {expanded ? summary : `${hours[0]}${hours.length > 1 ? "…" : ""}`}
          </span>
          <span className="hidden md:inline">{summary}</span>
        </p>
        {hours.length > 1 && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="shrink-0 text-rose underline-offset-2 hover:underline md:hidden"
          >
            {expanded ? "Less" : "View hours"}
          </button>
        )}
      </div>
      {expanded && hours.length > 1 && (
        <ul className="mt-2 space-y-0.5 md:hidden">
          {hours.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
