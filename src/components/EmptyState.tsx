import Link from "next/link";

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  title,
  message,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-10 text-center shadow-sm">
      <div className="mb-4 text-4xl" aria-hidden>
        ♡
      </div>
      <h2 className="font-display text-xl font-semibold text-charcoal">{title}</h2>
      <p className="mt-2 text-muted">{message}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-6 inline-block rounded-full bg-rose px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-dark"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
