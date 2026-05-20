import { cn } from "@/lib/utils";

export function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-stroke bg-surface px-1.5 font-mono text-[11px] text-muted shadow-[0_1px_0_#e5e5e0]",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
