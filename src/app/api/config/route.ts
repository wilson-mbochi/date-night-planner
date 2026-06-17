import { NextResponse } from "next/server";
import {
  getActiveProvider,
  isGoogleAvailable,
  type PlacesProvider,
} from "@/lib/providers";

export async function GET() {
  const googleAvailable = isGoogleAvailable();
  const defaultProvider: PlacesProvider = getActiveProvider();

  return NextResponse.json({
    googleAvailable,
    defaultProvider,
  });
}
