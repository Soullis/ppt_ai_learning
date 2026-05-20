"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { COLORS, VizFrame } from "./common";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * 1D gradient descent on a clean convex parabola, with the tangent line drawn
 * at the current point and the update Δθ = -η ∇L visualised as a horizontal
 * arrow. Auto-iterates and stops near the minimum.
 */
export function GradDescentExplainer({
  width = 760,
  height = 420,
}: {
  width?: number;
  height?: number;
}) {
  const padX = 60;
  const padY = 50;
  const xMin = -4;
  const xMax = 4;
  const yMin = 0;
  const yMax = 10;

  const sx = (x: number) => padX + ((x - xMin) / (xMax - xMin)) * (width - padX * 2);
  const sy = (y: number) => height - padY - ((y - yMin) / (yMax - yMin)) * (height - padY * 2);

  // L(θ) = (θ - 1)² + 1
  const L = (t: number) => (t - 1) ** 2 + 1;
  const dL = (t: number) => 2 * (t - 1);

  const [theta, setTheta] = useState(-3);
  const [lr, setLr] = useState(0.18);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (paused || reduce) return;
    const id = setInterval(() => {
      setTheta((t) => {
        if (Math.abs(t - 1) < 0.05) return -3; // restart
        return t - lr * dL(t);
      });
    }, 220);
    return () => clearInterval(id);
  }, [lr, paused, reduce]);

  const xs = Array.from({ length: 200 }, (_, i) => xMin + (i / 199) * (xMax - xMin));
  const path = `M ${xs.map((x) => `${sx(x)},${sy(L(x))}`).join(" L ")}`;

  // Tangent
  const slope = dL(theta);
  const tangentX1 = theta - 1.0;
  const tangentX2 = theta + 1.0;
  const tangentY1 = L(theta) + slope * (tangentX1 - theta);
  const tangentY2 = L(theta) + slope * (tangentX2 - theta);

  return (
    <div className="flex w-full max-w-full flex-col items-center">
      <VizFrame width={width} height={height} caption="θ ← θ − η · ∇L(θ)">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
          {/* Axes */}
          <line x1={padX} x2={width - padX} y1={sy(0)} y2={sy(0)} stroke={COLORS.ink} strokeOpacity={0.3} />
          <line x1={sx(0)} x2={sx(0)} y1={padY} y2={height - padY} stroke={COLORS.ink} strokeOpacity={0.18} />
          <text x={width - padX} y={sy(0) + 18} textAnchor="end" fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted}>
            θ
          </text>
          <text x={padX - 10} y={padY - 8} textAnchor="end" fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted}>
            L(θ)
          </text>

          {/* Loss curve */}
          <path d={path} fill="none" stroke={COLORS.accent} strokeWidth={1.6} />

          {/* Tangent line at θ */}
          <line
            x1={sx(tangentX1)}
            y1={sy(tangentY1)}
            x2={sx(tangentX2)}
            y2={sy(tangentY2)}
            stroke={COLORS.honey}
            strokeWidth={1.4}
          />
          {/* Slope label */}
          <text
            x={sx(theta) + 14}
            y={sy(L(theta)) - 14}
            fontSize={11}
            fontFamily="JetBrains Mono, monospace"
            fill={COLORS.honey}
          >
            ∇L = {slope.toFixed(2)}
          </text>

          {/* Δθ horizontal arrow */}
          <motion.line
            x1={sx(theta)}
            y1={sy(L(theta))}
            x2={sx(theta - lr * slope)}
            y2={sy(L(theta))}
            stroke={COLORS.ink}
            strokeWidth={2}
            animate={{ x1: sx(theta), y1: sy(L(theta)), x2: sx(theta - lr * slope), y2: sy(L(theta)) }}
            transition={{ duration: 0.2 }}
          />

          {/* Marker */}
          <motion.circle
            cx={sx(theta)}
            cy={sy(L(theta))}
            r={6}
            fill={COLORS.ink}
            stroke={COLORS.surface}
            strokeWidth={2}
            animate={{ cx: sx(theta), cy: sy(L(theta)) }}
            transition={{ duration: 0.2 }}
          />

          {/* Minimum */}
          <line
            x1={sx(1)}
            x2={sx(1)}
            y1={padY}
            y2={height - padY}
            stroke={COLORS.muted}
            strokeOpacity={0.4}
            strokeDasharray="3 3"
          />
          <text
            x={sx(1)}
            y={padY - 6}
            textAnchor="middle"
            fontSize={11}
            fontFamily="JetBrains Mono, monospace"
            fill={COLORS.muted}
          >
            θ*
          </text>
        </svg>
      </VizFrame>
      <div className="mt-3 grid w-full max-w-[640px] grid-cols-2 gap-4 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
        <label className="flex flex-col">
          η = {lr.toFixed(2)}
          <input
            type="range"
            min={0.02}
            max={0.6}
            step={0.01}
            value={lr}
            onChange={(e) => setLr(parseFloat(e.target.value))}
            className="mt-1 w-full accent-ink"
          />
        </label>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="self-end rounded-md border border-stroke bg-surface px-3 py-1.5 transition hover:border-ink hover:text-ink"
        >
          {paused ? "play" : "pause"}
        </button>
      </div>
    </div>
  );
}
