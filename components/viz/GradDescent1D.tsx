"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { COLORS, VizFrame } from "./common";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

export function GradDescent1D({
  width = 720,
  height = 360,
}: {
  width?: number;
  height?: number;
}) {
  const padX = 50;
  const padY = 30;
  const sx = (x: number) => padX + ((x + 4) / 8) * (width - padX * 2);
  const sy = (y: number) => height - padY - (y / 18) * (height - padY * 2);

  const f = (x: number) => 1 + (x - 1) ** 2 + 0.6 * Math.sin(x * 1.5);
  const grad = (x: number) => 2 * (x - 1) + 0.9 * Math.cos(x * 1.5);

  const pts = Array.from({ length: 120 }, (_, i) => -4 + (i / 119) * 8);
  const path = `M ${pts.map((x) => `${sx(x)},${sy(f(x))}`).join(" L ")}`;

  const [lr, setLr] = useState(0.15);
  const [pos, setPos] = useState(-3);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      setPos(1);
      return;
    }
    const id = setInterval(() => {
      setPos((p) => {
        const next = p - lr * grad(p);
        return Math.abs(next - 1) < 0.02 ? -3 : next;
      });
    }, 80);
    return () => clearInterval(id);
  }, [lr, reduce]);

  return (
    <div className="flex w-full max-w-full flex-col items-center">
      <VizFrame width={width} height={height}>
        <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
          <line
            x1={padX}
            x2={width - padX}
            y1={height - padY}
            y2={height - padY}
            stroke={COLORS.ink}
            strokeOpacity={0.3}
          />
          <path d={path} fill="none" stroke={COLORS.accent} strokeWidth={1.5} />
          <motion.circle
            cx={sx(pos)}
            cy={sy(f(pos))}
            r={6}
            fill={COLORS.honey}
            stroke={COLORS.ink}
            strokeWidth={1}
          />
          <line
            x1={sx(1)}
            x2={sx(1)}
            y1={padY}
            y2={height - padY}
            stroke={COLORS.ink}
            strokeOpacity={0.18}
            strokeDasharray="3 3"
          />
        </svg>
      </VizFrame>
      <div className="mt-3 w-full max-w-[420px] font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
        learning rate η = {lr.toFixed(2)}
        <input
          type="range"
          min={0.02}
          max={0.6}
          step={0.01}
          value={lr}
          onChange={(e) => setLr(parseFloat(e.target.value))}
          className="mt-1 w-full accent-ink"
        />
      </div>
    </div>
  );
}
