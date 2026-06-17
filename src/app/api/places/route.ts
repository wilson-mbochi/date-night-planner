import { NextRequest, NextResponse } from "next/server";
import { getPlaces, type PlacesProvider } from "@/lib/providers";

export async function GET(request: NextRequest) {
  const latParam = request.nextUrl.searchParams.get("lat");
  const lngParam = request.nextUrl.searchParams.get("lng");
  const radiusParam = request.nextUrl.searchParams.get("radius");
  const providerParam = request.nextUrl.searchParams.get("provider");

  const lat = latParam ? parseFloat(latParam) : NaN;
  const lng = lngParam ? parseFloat(lngParam) : NaN;
  const radius = radiusParam ? parseInt(radiusParam, 10) : 5000;
  const providerOverride =
    providerParam === "google" || providerParam === "osm"
      ? (providerParam as PlacesProvider)
      : null;

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return NextResponse.json(
      { error: "Valid lat and lng are required" },
      { status: 400 }
    );
  }

  try {
    const { venues, provider } = await getPlaces(
      lat,
      lng,
      radius,
      providerOverride
    );
    return NextResponse.json({ venues, provider });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch places";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
