import { cn } from "@/lib/utils";

export function CodeBlock({
  children,
  language,
  className,
  filename,
}: {
  children: string;
  language?: string;
  className?: string;
  filename?: string;
}) {
  return (
    <div className={cn("rounded-md border border-stroke bg-surface", className)}>
      {(filename || language) && (
        <div className="flex items-center justify-between border-b border-stroke px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
          <span>{filename ?? language}</span>
          {filename && language ? <span>{language}</span> : null}
        </div>
      )}
      <pre className="overflow-x-auto px-4 py-3 text-[13px] leading-relaxed">
        <code className="font-mono text-ink">{children}</code>
      </pre>
    </div>
  );
}
