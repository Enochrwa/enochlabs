import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-content flex-col items-start px-6 py-32">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 font-display text-3xl font-medium text-paper">
        This page isn&rsquo;t on the ledger.
      </h1>
      <p className="mt-3 font-body text-ink-100/70">
        The page you&rsquo;re looking for doesn&rsquo;t exist.
      </p>
      <Link href="/" className="btn-primary mt-8">
        Back to home
      </Link>
    </section>
  );
}
