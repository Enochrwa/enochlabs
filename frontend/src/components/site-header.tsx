import { Link } from "react-router-dom";

const links = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-rule/60">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-5">
        <Link to="/" className="font-display text-lg font-medium tracking-tight text-paper">
          Enoch<span className="text-seal">Labs</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="font-body text-sm text-ink-100/80 transition hover:text-seal"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link to="/contact" className="btn-primary text-xs sm:text-sm">
          Start a project
        </Link>
      </div>
    </header>
  );
}
