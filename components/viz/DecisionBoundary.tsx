"use client";

import { useEffect, useMemo, useRef } from "react";
import { COLORS, VizFrame } from "./common";

type Mode = "linear" | "tree" | "knn";

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function genTwoMoons(n = 80) {
  const r = rng(13);
  const pts: { x: number; y: number; c: 0 | 1 }[] = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI;
    const x = Math.cos(t) + (r() - 0.5) * 0.3;
    const y = Math.sin(t) * 0.5 + (r() - 0.5) * 0.25;
    pts.push({ x, y, c: 0 });
  }
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI;
    const x = 1 - Math.cos(t) + (r() - 0.5) * 0.3;
    const y = -Math.sin(t) * 0.5 + 0.4 + (r() - 0.5) * 0.25;
    pts.push({ x, y, c: 1 });
  }
  return pts;
}

function classify(pts: { x: number; y: number; c: 0 | 1 }[], mode: Mode, x: number, y: number) {
  if (mode === "linear") {
    const z = -1.6 * x + 0.8 * y + 0.7;
    return z > 0 ? 1 : 0;
  }
  if (mode === "tree") {
    if (x < 0.45) return y > 0.05 ? 0 : 1;
    return y > 0.25 ? 0 : 1;
  }
  // knn
  const k = 5;
  const dists = pts.map((p) => ({
    d: (p.x - x) ** 2 + (p.y - y) ** 2,
    c: p.c,
  }));
  dists.sort((a, b) => a.d - b.d);
  const top = dists.slice(0, k);
  const sum = top.reduce((a, t) => a + t.c, 0);
  return sum > k / 2 ? 1 : 0;
}

export function DecisionBoundary({
  mode = "linear",
  width = 540,
  height = 420,
}: {
  mode?: Mode;
  width?: number;
  height?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const points = useMemo(() => genTwoMoons(70), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    // background grid
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, W, H);
    // boundary
    const step = 6;
    for (let py = 0; py < H; py += step) {
      for (let px = 0; px < W; px += step) {
        const x = (px / W) * 3 - 1;
        const y = (1 - py / H) * 2 - 0.5;
        const c = classify(points, mode, x, y);
        ctx.fillStyle = c === 0 ? "rgba(10,102,194,0.18)" : "rgba(232,181,60,0.22)";
        ctx.fillRect(px, py, step, step);
      }
    }
    // points
    points.forEach((p) => {
      const px = ((p.x + 1) / 3) * W;
      const py = (1 - (p.y + 0.5) / 2) * H;
      ctx.fillStyle = p.c === 0 ? COLORS.accent : COLORS.honey;
      ctx.strokeStyle = COLORS.ink;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  }, [mode, points]);

  return (
    <VizFrame width={width} height={height} caption={`mode = ${mode}`}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="h-full w-full"
      />
    </VizFrame>
  );
}
