import { Link } from "react-router-dom";

export function SiteFooter() {
  return (
    <footer className="border-t border-rule/60">
      <div className="mx-auto flex max-w-content flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-base text-paper">
            Enoch<span className="text-seal">Labs</span>
          </p>
          <p className="mt-1 font-body text-sm text-ink-100/60">Kigali, Rwanda</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 font-body text-sm text-ink-100/70">
          <Link to="/services" className="transition hover:text-seal">
            Services
          </Link>
          <Link to="/work" className="transition hover:text-seal">
            Work
          </Link>
          <Link to="/pricing" className="transition hover:text-seal">
            Pricing
          </Link>
          <Link to="/contact" className="transition hover:text-seal">
            Contact
          </Link>
          <a
            href="https://github.com/Enochrwa"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-seal"
          >
            GitHub
          </a>
        </nav>
      </div>
      <div className="border-t border-rule/40 py-4 text-center font-mono text-xs text-ink-100/40">
        © {new Date().getFullYear()} EnochLabs. All rights reserved.
      </div>
    </footer>
  );
}
