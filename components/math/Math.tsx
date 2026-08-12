"use client";

import { InlineMath as KInline, BlockMath as KBlock } from "react-katex";
import { cn } from "@/lib/utils";

export function M({ children, className }: { children: string; className?: string }) {
  return (
    <span className={cn("font-mono", className)}>
      <KInline math={children} />
    </span>
  );
}

export function MBlock({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <div className={cn("my-4 text-[1.05rem]", className)}>
      <KBlock math={children} />
    </div>
  );
}
