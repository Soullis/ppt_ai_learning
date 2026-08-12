"use client";

import { useEffect, useRef, useState } from "react";
import { COLORS, VizFrame } from "./common";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

type Optim = "sgd" | "momentum" | "adam";

// Asymmetric quadratic with mild rotation, single minimum at (1, -0.5)
function loss(x: number, y: number) {
  const a = x - 1;
  const b = y + 0.5;
  return 1.6 * a * a + 0.45 * b * b + 0.4 * a * b;
}
function grad(x: number, y: number) {
  const a = x - 1;
  const b = y + 0.5;
  return [3.2 * a + 0.4 * b, 0.9 * b + 0.4 * a];
}

function trajectory(start: [number, number], optim: Optim, lr = 0.06, steps = 60) {
  const path: [number, number][] = [start];
  let v = [0, 0];
  let m = [0, 0];
  let s = [0, 0];
  let p = [...start];
  for (let t = 1; t <= steps; t++) {
    const g = grad(p[0], p[1]);
    if (optim === "sgd") {
      p = [p[0] - lr * g[0], p[1] - lr * g[1]];
    } else if (optim === "momentum") {
      v = [0.9 * v[0] + g[0], 0.9 * v[1] + g[1]];
      p = [p[0] - lr * v[0], p[1] - lr * v[1]];
    } else {
      // adam
      const b1 = 0.9;
      const b2 = 0.999;
      const eps = 1e-8;
      m = [b1 * m[0] + (1 - b1) * g[0], b1 * m[1] + (1 - b1) * g[1]];
      s = [b2 * s[0] + (1 - b2) * g[0] ** 2, b2 * s[1] + (1 - b2) * g[1] ** 2];
      const mh = [m[0] / (1 - b1 ** t), m[1] / (1 - b1 ** t)];
      const sh = [s[0] / (1 - b2 ** t), s[1] / (1 - b2 ** t)];
      p = [
        p[0] - 0.18 * (mh[0] / (Math.sqrt(sh[0]) + eps)),
        p[1] - 0.18 * (mh[1] / (Math.sqrt(sh[1]) + eps)),
      ];
    }
    path.push([p[0], p[1]]);
  }
  return path;
}

const COLOR_OF: Record<Optim, string> = {
  sgd: COLORS.accent,
  momentum: COLORS.green,
  adam: COLORS.honey,
};

export function LossSurface({
  width = 720,
  height = 460,
}: {
  width?: number;
  height?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [active, setActive] = useState<Record<Optim, boolean>>({
    sgd: true,
    momentum: true,
    adam: true,
  });
  const [tick, setTick] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      setTick(60);
      return;
    }
    const id = setInterval(() => setTick((t) => (t + 1) % 80), 60);
    return () => clearInterval(id);
  }, [reduce]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    const W = c.width;
    const H = c.height;
    ctx.clearRect(0, 0, W, H);
    // contour fill
    const step = 4;
    let lo = Infinity;
    let hi = -Infinity;
    for (let py = 0; py < H; py += step) {
      for (let px = 0; px < W; px += step) {
        const x = (px / W) * 6 - 2;
        const y = (1 - py / H) * 4 - 2;
        const v = loss(x, y);
        if (v < lo) lo = v;
        if (v > hi) hi = v;
      }
    }
    for (let py = 0; py < H; py += step) {
      for (let px = 0; px < W; px += step) {
        const x = (px / W) * 6 - 2;
        const y = (1 - py / H) * 4 - 2;
        const t = (loss(x, y) - lo) / (hi - lo + 1e-9);
        const g = Math.floor(245 - t * 70);
        ctx.fillStyle = `rgb(${g},${g},${g - 5})`;
        ctx.fillRect(px, py, step, step);
      }
    }
    // contour lines
    ctx.strokeStyle = "rgba(14,14,16,0.18)";
    ctx.lineWidth = 0.6;
    const levels = [0.2, 0.6, 1.4, 2.8, 5];
    for (const L of levels) {
      ctx.beginPath();
      for (let py = 0; py < H; py += 2) {
        for (let px = 0; px < W; px += 2) {
          const x = (px / W) * 6 - 2;
          const y = (1 - py / H) * 4 - 2;
          if (Math.abs(loss(x, y) - L) < 0.05) ctx.fillRect(px, py, 1, 1);
        }
      }
    }

    const sx = (x: number) => ((x + 2) / 6) * W;
    const sy = (y: number) => (1 - (y + 2) / 4) * H;
    const start: [number, number] = [-1.5, 1.4];

    (Object.keys(COLOR_OF) as Optim[]).forEach((optim) => {
      if (!active[optim]) return;
      const path = trajectory(start, optim);
      const last = Math.min(path.length - 1, tick);
      ctx.beginPath();
      ctx.strokeStyle = COLOR_OF[optim];
      ctx.lineWidth = 1.6;
      for (let i = 0; i <= last; i++) {
        const [x, y] = path[i];
        if (i === 0) ctx.moveTo(sx(x), sy(y));
        else ctx.lineTo(sx(x), sy(y));
      }
      ctx.stroke();
      const [hx, hy] = path[last];
      ctx.fillStyle = COLOR_OF[optim];
      ctx.beginPath();
      ctx.arc(sx(hx), sy(hy), 3.5, 0, Math.PI * 2);
      ctx.fill();
    });
    // minimum
    ctx.fillStyle = COLORS.ink;
    ctx.beginPath();
    ctx.arc(sx(1), sy(-0.5), 3, 0, Math.PI * 2);
    ctx.fill();
  }, [tick, active]);

  const toggle = (o: Optim) => setActive((a) => ({ ...a, [o]: !a[o] }));

  return (
    <div className="flex w-full max-w-full flex-col items-center">
      <VizFrame width={width} height={height}>
        <canvas ref={canvasRef} width={width} height={height} className="h-full w-full" />
      </VizFrame>
      <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em]">
        {(["sgd", "momentum", "adam"] as Optim[]).map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => toggle(o)}
            className="inline-flex items-center gap-2 rounded-md border border-stroke bg-surface px-3 py-1.5 text-muted transition hover:border-ink hover:text-ink"
            aria-pressed={active[o]}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: active[o] ? COLOR_OF[o] : COLORS.stroke }}
            />
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
