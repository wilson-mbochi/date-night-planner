import { LocationForm } from "@/components/LocationForm";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-16">
      <section className="mb-12 text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-rose">
          Plan together
        </p>
        <h1 className="font-display text-4xl font-semibold text-charcoal md:text-5xl lg:text-6xl">
          Your perfect date night,
          <br />
          <span className="text-rose-dark">curated for two</span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-lg text-muted">
          Enter your location and discover restaurants, cafés, museums, parks, and
          more — all in one beautiful list you can save and share.
        </p>
      </section>

      <LocationForm />
    </div>
  );
}
