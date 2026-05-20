"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { COLORS, VizFrame } from "./common";

type Mode = "xyxy" | "xywh" | "norm";

export function BboxFormats({
  width = 720,
  height = 420,
}: {
  width?: number;
  height?: number;
}) {
  const W = width;
  const H = height;
  const [mode, setMode] = useState<Mode>("xyxy");

  const box = { x1: 220, y1: 130, x2: 470, y2: 320 };
  const w = box.x2 - box.x1;
  const h = box.y2 - box.y1;
  const cx = box.x1 + w / 2;
  const cy = box.y1 + h / 2;

  const fmt = (v: number) => v.toFixed(0);
  const fmtN = (v: number) => v.toFixed(3);

  return (
    <div className="flex w-full max-w-full flex-col items-center">
      <VizFrame width={W} height={H} caption={`bounding box · ${mode}`}>
        <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full">
          <rect x={0} y={0} width={W} height={H} fill={COLORS.bone} />
          <rect x={box.x1} y={box.y1} width={w} height={h} fill={COLORS.honey} fillOpacity={0.18} stroke={COLORS.honey} strokeWidth={1.75} />

          {mode === "xyxy" ? (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <circle cx={box.x1} cy={box.y1} r={4} fill={COLORS.accent} />
              <circle cx={box.x2} cy={box.y2} r={4} fill={COLORS.accent} />
              <text x={box.x1 - 8} y={box.y1 - 8} fontSize={11} textAnchor="end" fontFamily="JetBrains Mono, monospace" fill={COLORS.muted}>
                (x1={fmt(box.x1)}, y1={fmt(box.y1)})
              </text>
              <text x={box.x2 + 8} y={box.y2 + 14} fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted}>
                (x2={fmt(box.x2)}, y2={fmt(box.y2)})
              </text>
            </motion.g>
          ) : null}

          {mode === "xywh" ? (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <circle cx={cx} cy={cy} r={4} fill={COLORS.accent} />
              <line x1={cx} y1={cy} x2={cx + w / 2} y2={cy} stroke={COLORS.accent} strokeWidth={1.5} markerEnd="url(#arrow)" />
              <line x1={cx} y1={cy} x2={cx} y2={cy + h / 2} stroke={COLORS.accent} strokeWidth={1.5} />
              <text x={cx + w / 4} y={cy - 6} fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted} textAnchor="middle">
                w={fmt(w)}
              </text>
              <text x={cx - 14} y={cy + h / 4} fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted} textAnchor="end">
                h={fmt(h)}
              </text>
              <text x={cx} y={cy - 14} fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted} textAnchor="middle">
                cx,cy = ({fmt(cx)}, {fmt(cy)})
              </text>
            </motion.g>
          ) : null}

          {mode === "norm" ? (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={20} y={H - 20} fontSize={12} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted}>
                cx/W = {fmtN(cx / W)} · cy/H = {fmtN(cy / H)} · w/W = {fmtN(w / W)} · h/H = {fmtN(h / H)}
              </text>
              <text x={20} y={H - 38} fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted}>
                YOLO format · resolution-independent
              </text>
            </motion.g>
          ) : null}
        </svg>
      </VizFrame>
      <div className="mt-3 flex gap-2 font-mono text-[11px] uppercase tracking-[0.12em]">
        {(["xyxy", "xywh", "norm"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            data-active={m === mode}
            className="rounded-md border border-stroke bg-surface px-3 py-1.5 text-muted transition hover:border-ink hover:text-ink data-[active=true]:border-ink data-[active=true]:text-ink"
          >
            {m === "xyxy" ? "xyxy (corners)" : m === "xywh" ? "xywh (centre + size)" : "normalized (yolo)"}
          </button>
        ))}
      </div>
    </div>
  );
}
