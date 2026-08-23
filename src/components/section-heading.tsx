export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-paper sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 font-body text-base leading-relaxed text-ink-100/70">{description}</p>
      ) : null}
    </div>
  );
}
