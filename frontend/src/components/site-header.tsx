import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const links = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Let keyboard users dismiss the open mobile nav with Escape, same as a
  // native <dialog> or disclosure widget would (docs/SPRINT-PLAN.md Sprint 4
  // keyboard-navigation pass).
  useEffect(() => {
    if (!menuOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  return (
    <header className="relative border-b border-rule/60">
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

        <div className="flex items-center gap-3">
          <Link to="/contact" className="btn-primary text-xs sm:text-sm">
            Start a project
          </Link>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-11 w-11 shrink-0 items-center justify-center border border-ink-600 text-paper transition hover:border-seal hover:text-seal md:hidden"
          >
            <span aria-hidden className="relative block h-3 w-5">
              <span
                className={`absolute left-0 top-0 h-[1.5px] w-5 bg-current transition-transform ${menuOpen ? "translate-y-[6px] rotate-45" : ""}`}
              />
              <span
                className={`absolute left-0 top-[6px] h-[1.5px] w-5 bg-current transition-opacity ${menuOpen ? "opacity-0" : "opacity-100"}`}
              />
              <span
                className={`absolute left-0 top-3 h-[1.5px] w-5 bg-current transition-transform ${menuOpen ? "-translate-y-[6px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          id="mobile-nav"
          className="absolute inset-x-0 top-full z-40 border-b border-rule/60 bg-ink-900 md:hidden"
        >
          <ul className="mx-auto flex max-w-content flex-col px-6 py-2">
            {links.map((link) => (
              <li key={link.href} className="border-t border-rule/40 first:border-t-0">
                <Link
                  to={link.href}
                  className="block py-4 font-body text-base text-ink-100/80 transition hover:text-seal"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
