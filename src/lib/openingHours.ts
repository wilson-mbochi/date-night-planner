export function parseOpeningHours(raw: string | undefined): string[] {
  if (!raw) return [];

  const trimmed = raw.trim();
  if (!trimmed) return [];

  if (trimmed.toLowerCase() === "24/7") {
    return ["Open 24 hours"];
  }

  const segments = trimmed.split(";").map((s) => s.trim()).filter(Boolean);
  if (segments.length === 0) return [];

  const dayMap: Record<string, string> = {
    Mo: "Mon",
    Tu: "Tue",
    We: "Wed",
    Th: "Thu",
    Fr: "Fri",
    Sa: "Sat",
    Su: "Sun",
  };

  return segments.map((segment) => {
    let formatted = segment;
    for (const [abbr, full] of Object.entries(dayMap)) {
      formatted = formatted.replaceAll(abbr, full);
    }
    return formatted;
  });
}

export function formatHoursDisplay(hours: string[]): string {
  if (hours.length === 0) return "Hours vary — check venue website";
  return hours.join("; ");
}
