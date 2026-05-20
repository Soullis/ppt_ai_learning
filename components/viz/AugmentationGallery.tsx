"use client";

import { useEffect, useRef, useState } from "react";
import { COLORS, VizFrame } from "./common";
import { SCENE_OBJECTS } from "./Scene";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

type Aug = "original" | "hflip" | "rotate" | "hsv" | "mosaic" | "mixup";

const AUGS: { key: Aug; label: string }[] = [
  { key: "original", label: "original" },
  { key: "hflip", label: "h-flip" },
  { key: "rotate", label: "rotate" },
  { key: "hsv", label: "hsv jitter" },
  { key: "mosaic", label: "mosaic" },
  { key: "mixup", label: "mixup" },
];

function paintScene(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  hueShift = 0,
  satShift = 0,
  valShift = 0,
) {
  // Sky
  const sky = ctx.createLinearGradient(0, 0, 0, H * 0.65);
  sky.addColorStop(0, "#F4F1EA");
  sky.addColorStop(1, "#E5E0D2");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H * 0.65);
  // Ground
  const g = ctx.createLinearGradient(0, H * 0.65, 0, H);
  g.addColorStop(0, "#EDE7D8");
  g.addColorStop(1, "#D6CFBE");
  ctx.fillStyle = g;
  ctx.fillRect(0, H * 0.65, W, H * 0.35);

  // Gates
  const baseHue = (45 + hueShift) % 360; // honey-ish
  const sat = Math.max(0.2, Math.min(1, 0.6 + satShift));
  const val = Math.max(0.3, Math.min(1, 0.85 + valShift));
  const honey = `hsl(${baseHue}, ${Math.round(sat * 70)}%, ${Math.round(val * 50)}%)`;

  SCENE_OBJECTS.forEach((o) => {
    const x = o.x * W;
    const y = o.y * H;
    const w = o.w * W;
    const h = o.h * H;
    if (o.cls === "gate") {
      ctx.fillStyle = honey;
      ctx.fillRect(x, y, w, 8);
      ctx.fillRect(x, y + h - 8, w, 8);
      ctx.fillRect(x, y, 8, h);
      ctx.fillRect(x + w - 8, y, 8, h);
    } else if (o.cls === "drone") {
      ctx.fillStyle = "#0E0E10";
      ctx.beginPath();
      ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = "rgba(90,90,96,0.7)";
      ctx.fillRect(x, y, w, h);
    }
  });
}

function drawAug(canvas: HTMLCanvasElement, aug: Aug, t: number) {
  const ctx = canvas.getContext("2d")!;
  const W = canvas.width;
  const H = canvas.height;
  ctx.save();
  ctx.clearRect(0, 0, W, H);

  if (aug === "original") {
    paintScene(ctx, W, H);
  } else if (aug === "hflip") {
    ctx.translate(W, 0);
    ctx.scale(-1, 1);
    paintScene(ctx, W, H);
  } else if (aug === "rotate") {
    const a = (Math.sin(t / 600) * 12 * Math.PI) / 180;
    ctx.translate(W / 2, H / 2);
    ctx.rotate(a);
    ctx.translate(-W / 2, -H / 2);
    paintScene(ctx, W, H);
  } else if (aug === "hsv") {
    const hs = Math.sin(t / 800) * 60;
    paintScene(ctx, W, H, hs, Math.sin(t / 700) * 0.2, Math.cos(t / 900) * 0.1);
  } else if (aug === "mosaic") {
    // 2x2 grid of mini-scenes
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 2; c++) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(c * W / 2, r * H / 2, W / 2, H / 2);
        ctx.clip();
        ctx.translate(c * W / 2, r * H / 2);
        ctx.scale(0.5, 0.5);
        // Vary slightly per cell
        if ((r + c) % 2 === 0) {
          ctx.translate((Math.sin(t / 600) * 0.1) * W, 0);
        }
        paintScene(
          ctx,
          W,
          H,
          ((r * 2 + c) * 30 + Math.sin(t / 700) * 10) % 360,
          0,
          0,
        );
        ctx.restore();
      }
    }
    // Cell borders
    ctx.strokeStyle = "rgba(14,14,16,0.3)";
    ctx.beginPath();
    ctx.moveTo(W / 2, 0);
    ctx.lineTo(W / 2, H);
    ctx.moveTo(0, H / 2);
    ctx.lineTo(W, H / 2);
    ctx.stroke();
  } else if (aug === "mixup") {
    paintScene(ctx, W, H);
    const off = document.createElement("canvas");
    off.width = W;
    off.height = H;
    const octx = off.getContext("2d")!;
    paintScene(octx, W, H, 180);
    ctx.globalAlpha = 0.4 + Math.sin(t / 700) * 0.2;
    ctx.drawImage(off, 0, 0);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

export function AugmentationGallery({
  width = 880,
  height = 460,
}: {
  width?: number;
  height?: number;
}) {
  const refs = useRef<(HTMLCanvasElement | null)[]>(Array(AUGS.length).fill(null));
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    let raf = 0;
    if (reduce) {
      // Draw a single static frame.
      refs.current.forEach((c, i) => {
        if (!c) return;
        drawAug(c, AUGS[i].key, 0);
      });
      return;
    }
    const loop = (t: number) => {
      refs.current.forEach((c, i) => {
        if (!c) return;
        drawAug(c, AUGS[i].key, t);
      });
      if (!paused) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [paused, reduce]);

  const cellW = 260;
  const cellH = 160;

  return (
    <div className="flex w-full max-w-full flex-col items-center">
      <VizFrame width={width} height={height} caption="albumentations-style augmentations · Black Bee aerial preset">
        <div className="grid h-full w-full grid-cols-3 gap-3 p-4">
          {AUGS.map((a, i) => (
            <div key={a.key} className="flex flex-col">
              <div className="mb-1 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                <span>{String(i + 1).padStart(2, "0")} · {a.label}</span>
              </div>
              <div className="relative w-full overflow-hidden rounded-md border border-stroke" style={{ aspectRatio: `${cellW} / ${cellH}` }}>
                <canvas
                  ref={(c) => {
                    refs.current[i] = c;
                  }}
                  width={cellW}
                  height={cellH}
                  className="h-full w-full"
                />
              </div>
            </div>
          ))}
        </div>
      </VizFrame>
      <div className="mt-3 flex gap-2 font-mono text-[11px] uppercase tracking-[0.12em]">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="rounded-md border border-stroke bg-surface px-3 py-1.5 text-muted transition hover:border-ink hover:text-ink"
        >
          {paused ? "play" : "pause"}
        </button>
      </div>
    </div>
  );
}
