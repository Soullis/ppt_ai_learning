"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const COLORS = {
  ink: "#0E0E10",
  muted: "#5A5A60",
  stroke: "#E5E5E0",
  surface: "#FFFFFF",
  bone: "#FAFAF7",
  accent: "#0A66C2",
  honey: "#E8B53C",
  green: "#2E7D5C",
  red: "#B23A48",
};

export function VizFrame({
  width = 720,
  height = 480,
  children,
  className,
  caption,
  fit = "aspect",
}: {
  width?: number;
  height?: number;
  children: ReactNode;
  className?: string;
  caption?: ReactNode;
  fit?: "aspect" | "fill";
}) {
  return (
    <figure className={cn("flex h-full w-full max-w-full flex-col items-center", className)}>
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-md border border-stroke bg-surface",
          fit === "fill" && "h-full min-h-[240px] max-h-full",
        )}
        style={fit === "aspect" ? { aspectRatio: `${width} / ${height}` } : undefined}
      >
        <div className={cn("absolute inset-0", fit === "fill" && "flex items-stretch")}>{children}</div>
      </div>
      {caption ? (
        <figcaption className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 0.61, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
