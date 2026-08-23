import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-rule/60 bg-ledger-lines">
      <div className="mx-auto max-w-content px-6 py-24 sm:py-32">
        <p className="eyebrow">EnochLabs — Kigali, Rwanda</p>

        <h1 className="mt-5 max-w-3xl font-display text-4xl font-medium leading-[1.1] tracking-tight text-paper sm:text-6xl">
          Your business runs on a notebook.{" "}
          <span className="text-seal">Let&rsquo;s turn it into a dashboard.</span>
        </h1>

        <p className="mt-6 max-w-xl font-body text-lg leading-relaxed text-ink-100/70">
          EnochLabs builds affordable websites and business software for shops, restaurants, hotels,
          and growing companies across Rwanda — then keeps it running.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Link href="/contact" className="btn-primary">
            Start a project
          </Link>
          <Link href="/work" className="btn-secondary">
            See our work
          </Link>
        </div>

        <dl className="mt-16 grid max-w-xl grid-cols-3 gap-6 border-t border-rule/60 pt-8 font-mono">
          <div>
            <dt className="text-xs uppercase tracking-widest text-ink-100/50">Stock</dt>
            <dd className="mt-1 text-2xl text-ledger-light">142</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-widest text-ink-100/50">Orders</dt>
            <dd className="mt-1 text-2xl text-seal">27</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-widest text-ink-100/50">Revenue</dt>
            <dd className="mt-1 text-2xl text-paper">318k RWF</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
