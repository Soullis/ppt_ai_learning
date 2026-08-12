import { cn } from "@/lib/utils";

export function FigureCaption({
  children,
  index,
  className,
}: {
  children: React.ReactNode;
  index?: string;
  className?: string;
}) {
  return (
    <figcaption
      className={cn(
        "mt-3 flex items-baseline gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted",
        className,
      )}
    >
      {index ? <span className="text-ink/60">{index}</span> : null}
      <span className="font-sans normal-case tracking-normal text-muted">
        {children}
      </span>
    </figcaption>
  );
}
