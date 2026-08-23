# Brand Guidelines

## The idea in one line

**A ledger becoming a dashboard.** EnochLabs exists because small businesses run on
handwritten records — a notebook of stock, a WhatsApp thread of orders — and the work is
turning that into something legible, searchable, and reliable. Every design decision
below is in service of that one transformation, not decoration for its own sake.

## Palette

| Token | Hex | Use |
| --- | --- | --- |
| `ink` (900) | `#12151C` | Primary background — the ink of a ledger page at night. |
| `ink-800` | `#1B1F29` | Raised surfaces / cards. |
| `ink-600` | `#343B4C` | Borders, muted dividers. |
| `paper` / `ink-50` | `#F3F0E8` | Primary text on dark; light-mode background if ever added. |
| `seal` | `#E8B34C` | Primary accent — a wax-seal / official-stamp gold. Used for the one interactive/attention element per view: primary CTA, active nav, the signature hero mark. |
| `ledger` | `#2F8F7B` | Secondary accent — a bookkeeping-green, used for "outcome" tags (what a client gets), success states, and to separate itself clearly from the gold CTA color. |
| `rule` | `#3A4256` | Hairline rule color for ledger-row dividers. |

Deliberately **not** the cream-background/terracotta combination common in AI-generated
design — EnochLabs runs dark-ink-and-gold instead, because the subject (records, stamps,
official documents) supports it directly, and it separates the brand from that default.

## Typography

- **Display — Fraunces:** a serif with enough ink-and-stamp character for headlines and
  the hero. Used with restraint: headlines and section eyebrows only, never body copy.
- **Body — Inter:** neutral, highly legible sans-serif for paragraphs and UI copy.
- **Mono/data — IBM Plex Mono:** for anything that reads like a ledger figure — prices,
  the numbered service rows, dates in case studies. This is a functional choice: it
  marks "this is a number/record," not a stylistic flourish.

Type scale lives in Tailwind's default scale, extended only where the hero needs a
larger display size (`text-6xl`/`text-7xl` for the H1).

## Layout & structural devices

- **Ledger rows, not cards.** The services section renders as ruled line-items (a
  reference number, a description, an "outcome" tag) rather than generic icon cards —
  because the business genuinely is about turning line-items into results. Numbering is
  used only where it's true, i.e. this list, and the six real, ordered steps of the
  engagement flow (Identify → Diagnose → Recommend → Build → Deploy & train → Support).
  It is not used as decoration elsewhere.
- **Hairline rules** (`border-rule`) separate sections instead of heavy card shadows —
  echoes ruled paper.
- **Content max-width** `1180px` (`max-w-content`) keeps line lengths readable on a
  ledger-like, text-forward layout.

## Signature element

The hero: a headline set as if it were the first entry in a ledger, with a faint
repeating horizontal rule pattern (`bg-ledger-lines`) behind it that — on scroll or after
a short delay — resolves into a small live "dashboard" preview (a few numbers ticking:
stock counts, an order total) rendered in the `seal`/`ledger` accent colors. This is the
one moment of motion the brand spends its budget on; everything else stays quiet.

## Voice

- Plain and specific, never salesy. Say what a service does, not why it's amazing.
- Address the reader as a business owner solving a real problem, not a "user."
- Prices and outcomes stated directly (see `docs/BUSINESS-OVERVIEW.md`) — no false
  urgency, no invented statistics.
- Buttons say the action, not a generic verb: "Send on WhatsApp," "See pricing," not
  "Submit" / "Learn more."

## Accessibility floor

- All interactive elements have a visible focus ring (`focus-visible` styles use `seal`).
- Color contrast checked against `ink-900` background for both `paper` text and `seal`
  accent at body-text sizes.
- Motion (the hero ledger→dashboard transition) respects `prefers-reduced-motion`.
