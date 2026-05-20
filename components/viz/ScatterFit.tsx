"use client";

import { useMemo, useState } from "react";
import { COLORS, VizFrame } from "./common";

function genPoints(n: number, slope: number, intercept: number, noise: number) {
  let seed = 42;
  const rng = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  return Array.from({ length: n }, () => {
    const x = rng() * 8 + 1;
    const y = slope * x + intercept + (rng() - 0.5) * noise;
    return { x, y };
  });
}

export function ScatterFit({
  width = 720,
  height = 460,
}: {
  width?: number;
  height?: number;
}) {
  const padX = 60;
  const padY = 40;
  const points = useMemo(() => genPoints(40, 0.6, 1.2, 1.4), []);
  const [w, setW] = useState(0.6);
  const [b, setB] = useState(1.2);

  const xMin = 0;
  const xMax = 10;
  const yMin = 0;
  const yMax = 9;
  const sx = (x: number) =>
    padX + ((x - xMin) / (xMax - xMin)) * (width - padX * 2);
  const sy = (y: number) =>
    height - padY - ((y - yMin) / (yMax - yMin)) * (height - padY * 2);

  const yhat = (x: number) => w * x + b;
  const mse =
    points.reduce((acc, p) => acc + (p.y - yhat(p.x)) ** 2, 0) / points.length;

  return (
    <div className="flex w-full max-w-full flex-col items-center">
      <VizFrame width={width} height={height}>
        <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
          {/* Axes */}
          <line
            x1={padX}
            x2={width - padX}
            y1={height - padY}
            y2={height - padY}
            stroke={COLORS.ink}
            strokeOpacity={0.35}
          />
          <line
            x1={padX}
            x2={padX}
            y1={padY}
            y2={height - padY}
            stroke={COLORS.ink}
            strokeOpacity={0.35}
          />
          <text
            x={width - padX}
            y={height - padY + 24}
            fontSize={11}
            textAnchor="end"
            fill={COLORS.muted}
            fontFamily="JetBrains Mono, monospace"
          >
            x
          </text>
          <text
            x={padX - 10}
            y={padY - 8}
            fontSize={11}
            textAnchor="end"
            fill={COLORS.muted}
            fontFamily="JetBrains Mono, monospace"
          >
            y
          </text>
          {/* Residual rays */}
          {points.map((p, i) => (
            <line
              key={i}
              x1={sx(p.x)}
              x2={sx(p.x)}
              y1={sy(p.y)}
              y2={sy(yhat(p.x))}
              stroke={COLORS.honey}
              strokeOpacity={0.45}
              strokeWidth={1}
            />
          ))}
          {/* Points */}
          {points.map((p, i) => (
            <circle
              key={`p-${i}`}
              cx={sx(p.x)}
              cy={sy(p.y)}
              r={3}
              fill={COLORS.ink}
            />
          ))}
          {/* Line */}
          <line
            x1={sx(xMin)}
            y1={sy(yhat(xMin))}
            x2={sx(xMax)}
            y2={sy(yhat(xMax))}
            stroke={COLORS.accent}
            strokeWidth={1.75}
          />
        </svg>
      </VizFrame>
      <div className="mt-4 grid w-full max-w-[640px] grid-cols-2 gap-4 text-[12px]">
        <label className="font-mono text-muted">
          slope w = {w.toFixed(2)}
          <input
            type="range"
            min={-1}
            max={2}
            step={0.05}
            value={w}
            onChange={(e) => setW(parseFloat(e.target.value))}
            className="mt-1 w-full accent-ink"
          />
        </label>
        <label className="font-mono text-muted">
          intercept b = {b.toFixed(2)}
          <input
            type="range"
            min={-2}
            max={5}
            step={0.05}
            value={b}
            onChange={(e) => setB(parseFloat(e.target.value))}
            className="mt-1 w-full accent-ink"
          />
        </label>
        <div className="col-span-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
          MSE = {mse.toFixed(3)}
        </div>
      </div>
    </div>
  );
}
