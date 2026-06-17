import { DataSourceSettings } from "@/components/DataSourceSettings";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-16">
      <section className="mb-10 text-center">
        <h1 className="font-display text-3xl font-semibold text-charcoal md:text-4xl">
          Settings
        </h1>
        <p className="mt-2 text-muted">
          Choose your data source for venue photos, hours, and descriptions.
        </p>
      </section>

      <DataSourceSettings />
    </div>
  );
}
