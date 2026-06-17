import { NextRequest, NextResponse } from "next/server";
import { geocodeLocation } from "@/lib/providers/geocode";

export async function GET(request: NextRequest) {
  const location = request.nextUrl.searchParams.get("location");

  if (!location?.trim()) {
    return NextResponse.json(
      { error: "Location is required" },
      { status: 400 }
    );
  }

  try {
    const result = await geocodeLocation(location);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Geocoding failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
