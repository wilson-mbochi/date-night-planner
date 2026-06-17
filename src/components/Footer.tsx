import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-rose/10 bg-cream/60 py-6 text-center text-sm text-muted">
      <p>
        <Link
          href="/settings"
          className="underline decoration-rose/40 underline-offset-2 hover:text-rose-dark"
        >
          Settings · Data sources
        </Link>
        {" · "}
        Map data ©{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-rose/40 underline-offset-2 hover:text-rose-dark"
        >
          OpenStreetMap
        </a>{" "}
        contributors
      </p>
    </footer>
  );
}
