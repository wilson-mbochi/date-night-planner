"use client";

import { useEffect, useState } from "react";
import type { PlacesProvider } from "@/lib/types";
import {
  getProviderPreference,
  setProviderPreference,
} from "@/lib/providerPreference";

interface AppConfig {
  googleAvailable: boolean;
  defaultProvider: PlacesProvider;
}

const COMPARISON = [
  { feature: "Cost", osm: "Free", google: "Requires API billing" },
  { feature: "Photos", osm: "Category images", google: "Real venue photos" },
  { feature: "Hours", osm: "When tagged in OSM", google: "Usually available" },
  { feature: "Price", osm: "Estimates", google: "$ to $$$$ levels" },
  { feature: "Descriptions", osm: "Auto-generated", google: "Editorial summaries" },
];

export function DataSourceSettings() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [preference, setPreference] = useState<PlacesProvider>("osm");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPreference(getProviderPreference());
    setHydrated(true);

    fetch("/api/config")
      .then((res) => res.json())
      .then((data: AppConfig) => setConfig(data))
      .catch(() =>
        setConfig({ googleAvailable: false, defaultProvider: "osm" })
      );
  }, []);

  function selectProvider(provider: PlacesProvider) {
    if (provider === "google" && !config?.googleAvailable) return;
    setPreference(provider);
    setProviderPreference(provider);
  }

  if (!hydrated || !config) {
    return (
      <p className="text-center text-muted">Loading settings…</p>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={() => selectProvider("osm")}
          className={`rounded-2xl border-2 p-6 text-left transition-all ${
            preference === "osm"
              ? "border-rose bg-white shadow-md"
              : "border-transparent bg-white/60 hover:border-rose/30"
          }`}
        >
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-charcoal">
              OpenStreetMap
            </h3>
            {preference === "osm" && (
              <span className="rounded-full bg-sage/20 px-2.5 py-0.5 text-xs font-medium text-sage">
                Active
              </span>
            )}
          </div>
          <p className="text-sm text-muted">
            Free, no API key or billing required. Great for most date planning.
          </p>
        </button>

        <div
          className={`rounded-2xl border-2 p-6 text-left ${
            preference === "google" && config.googleAvailable
              ? "border-rose bg-white shadow-md"
              : "border-transparent bg-white/60"
          } ${!config.googleAvailable ? "opacity-90" : ""}`}
        >
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-charcoal">
              Google Places
            </h3>
            {config.googleAvailable ? (
              preference === "google" ? (
                <span className="rounded-full bg-sage/20 px-2.5 py-0.5 text-xs font-medium text-sage">
                  Active
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => selectProvider("google")}
                  className="rounded-full bg-rose px-3 py-1 text-xs font-medium text-white hover:bg-rose-dark"
                >
                  Use Google
                </button>
              )
            ) : (
              <span className="rounded-full bg-cream-dark px-2.5 py-0.5 text-xs font-medium text-muted">
                Not configured
              </span>
            )}
          </div>
          <p className="text-sm text-muted">
            Richer photos, hours, and descriptions. Requires the app host to add
            a Google API key.
          </p>

          {!config.googleAvailable && (
            <div className="mt-4 rounded-xl bg-cream p-4 text-sm text-charcoal">
              <p className="mb-2 font-medium">Host setup instructions:</p>
              <ol className="list-inside list-decimal space-y-1 text-muted">
                <li>See <code className="text-charcoal">docs/GOOGLE_SETUP.md</code> for full Google Cloud steps</li>
                <li>Run <code className="text-charcoal">scripts/setup-google.ps1</code> and paste your API key</li>
                <li>Or copy <code className="text-charcoal">.env.example</code> to <code className="text-charcoal">.env.local</code> and add your key</li>
                <li>Set <code className="text-charcoal">PLACES_PROVIDER=google</code></li>
                <li>Restart the dev server</li>
              </ol>
              <p className="mt-3 text-xs text-muted">
                This is configured by whoever runs the app, not by visitors.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cream-dark bg-cream/50">
              <th className="px-4 py-3 text-left font-medium text-charcoal">
                Feature
              </th>
              <th className="px-4 py-3 text-left font-medium text-charcoal">
                OpenStreetMap
              </th>
              <th className="px-4 py-3 text-left font-medium text-charcoal">
                Google Places
              </th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON.map((row) => (
              <tr key={row.feature} className="border-b border-cream-dark/50">
                <td className="px-4 py-3 font-medium text-charcoal">
                  {row.feature}
                </td>
                <td className="px-4 py-3 text-muted">{row.osm}</td>
                <td className="px-4 py-3 text-muted">{row.google}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
