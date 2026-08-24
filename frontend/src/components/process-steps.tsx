import type { ProcessStep } from "@/content/process";

export function ProcessSteps({ steps }: { steps: ProcessStep[] }) {
  return (
    <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {steps.map((step) => (
        <li key={step.step} className="border-t border-rule/60 pt-4">
          <span className="font-mono text-sm text-seal">{String(step.step).padStart(2, "0")}</span>
          <h3 className="mt-2 font-display text-lg font-medium text-paper">{step.title}</h3>
          <p className="mt-2 font-body text-sm leading-relaxed text-ink-100/70">
            {step.description}
          </p>
        </li>
      ))}
    </ol>
  );
}
