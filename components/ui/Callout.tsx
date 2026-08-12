import { cn } from "@/lib/utils";

export function Callout({
  children,
  label,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  label?: string;
  tone?: "neutral" | "accent" | "warm";
  className?: string;
}) {
  const toneClass =
    tone === "accent"
      ? "border-accent/30 bg-accent/[0.04] text-ink"
      : tone === "warm"
        ? "border-honey/40 bg-honey/[0.06] text-ink"
        : "border-stroke bg-surface text-ink";
  return (
    <aside
      className={cn(
        "rounded-md border px-4 py-3 text-sm leading-relaxed",
        toneClass,
        className,
      )}
    >
      {label ? (
        <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
          {label}
        </div>
      ) : null}
      <div>{children}</div>
    </aside>
  );
}
