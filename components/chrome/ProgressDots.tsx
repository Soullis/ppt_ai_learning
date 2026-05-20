"use client";

import { cn } from "@/lib/utils";

export function ProgressDots({
  index,
  total,
  onSelect,
}: {
  index: number;
  total: number;
  onSelect?: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Slide ${i + 1}`}
          aria-current={i === index ? "true" : undefined}
          onClick={() => onSelect?.(i)}
          className={cn(
            "h-1.5 rounded-full transition-all",
            i === index
              ? "w-6 bg-ink"
              : "w-1.5 bg-stroke hover:bg-muted",
          )}
        />
      ))}
    </div>
  );
}
