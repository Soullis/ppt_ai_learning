"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

// Shared synthetic "aerial scene" used as a canvas for CV tasks.
// Two stylised gates and one drone silhouette over a gradient ground.
export type SceneObject = {
  id: string;
  cls: "gate" | "drone" | "post";
  x: number; // top-left, normalised 0..1
  y: number;
  w: number;
  h: number;
};

export const SCENE_OBJECTS: SceneObject[] = [
  { id: "gate-1", cls: "gate", x: 0.12, y: 0.32, w: 0.22, h: 0.42 },
  { id: "gate-2", cls: "gate", x: 0.58, y: 0.28, w: 0.26, h: 0.46 },
  { id: "drone-1", cls: "drone", x: 0.42, y: 0.18, w: 0.12, h: 0.08 },
  { id: "post-1", cls: "post", x: 0.06, y: 0.62, w: 0.04, h: 0.22 },
];

export function SceneSVG({
  width = 720,
  height = 420,
  showObjects = true,
}: {
  width?: number;
  height?: number;
  showObjects?: boolean;
}) {
  const W = width;
  const H = height;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full">
      <defs>
        <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#F4F1EA" />
          <stop offset="100%" stopColor="#E5E0D2" />
        </linearGradient>
        <linearGradient id="ground" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#EDE7D8" />
          <stop offset="100%" stopColor="#D6CFBE" />
        </linearGradient>
      </defs>
      <rect width={W} height={H * 0.65} fill="url(#sky)" />
      <rect y={H * 0.65} width={W} height={H * 0.35} fill="url(#ground)" />

      {showObjects ? (
        <g>
          {SCENE_OBJECTS.map((o) => {
            const x = o.x * W;
            const y = o.y * H;
            const w = o.w * W;
            const h = o.h * H;
            if (o.cls === "gate") {
              return (
                <g key={o.id}>
                  <rect x={x} y={y} width={w} height={8} fill={COLORS.honey} />
                  <rect x={x} y={y + h - 8} width={w} height={8} fill={COLORS.honey} />
                  <rect x={x} y={y} width={8} height={h} fill={COLORS.honey} />
                  <rect x={x + w - 8} y={y} width={8} height={h} fill={COLORS.honey} />
                </g>
              );
            }
            if (o.cls === "drone") {
              return (
                <g key={o.id}>
                  <ellipse cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={h / 2} fill={COLORS.ink} />
                  <line x1={x} y1={y + h / 2} x2={x - 8} y2={y + h / 2 - 6} stroke={COLORS.ink} />
                  <line x1={x + w} y1={y + h / 2} x2={x + w + 8} y2={y + h / 2 - 6} stroke={COLORS.ink} />
                </g>
              );
            }
            return (
              <rect
                key={o.id}
                x={x}
                y={y}
                width={w}
                height={h}
                fill={COLORS.muted}
                fillOpacity={0.7}
              />
            );
          })}
        </g>
      ) : null}
    </svg>
  );
}

export function MaskOverlay({
  width = 720,
  height = 420,
  mode = "semantic",
}: {
  width?: number;
  height?: number;
  mode?: "classification" | "detection" | "semantic" | "instance" | "keypoint" | "depth";
}) {
  const W = width;
  const H = height;

  return (
    <VizFrame width={W} height={H} caption={`task = ${mode}`}>
      <div className="relative h-full w-full">
        <SceneSVG width={W} height={H} />
        <svg viewBox={`0 0 ${W} ${H}`} className="pointer-events-none absolute inset-0 h-full w-full">
          {mode === "classification" ? (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <rect
                x={20}
                y={20}
                width={170}
                height={28}
                fill={COLORS.surface}
                stroke={COLORS.ink}
              />
              <text x={32} y={39} fontSize={13} fill={COLORS.ink}>
                gate · 0.94
              </text>
            </motion.g>
          ) : null}
          {mode === "detection"
            ? SCENE_OBJECTS.map((o, i) => {
                const x = o.x * W;
                const y = o.y * H;
                const w = o.w * W;
                const h = o.h * H;
                return (
                  <motion.g
                    key={o.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.15, duration: 0.4 }}
                  >
                    <rect
                      x={x}
                      y={y}
                      width={w}
                      height={h}
                      fill="none"
                      stroke={COLORS.accent}
                      strokeWidth={2}
                    />
                    <rect
                      x={x}
                      y={y - 18}
                      width={Math.max(60, o.cls.length * 9)}
                      height={18}
                      fill={COLORS.accent}
                    />
                    <text x={x + 6} y={y - 5} fontSize={11} fill={COLORS.surface} fontFamily="JetBrains Mono, monospace">
                      {o.cls}
                    </text>
                  </motion.g>
                );
              })
            : null}
          {mode === "semantic"
            ? SCENE_OBJECTS.map((o, i) => {
                const x = o.x * W;
                const y = o.y * H;
                const w = o.w * W;
                const h = o.h * H;
                const color =
                  o.cls === "gate" ? COLORS.honey : o.cls === "drone" ? COLORS.ink : COLORS.green;
                return (
                  <motion.rect
                    key={o.id}
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    fill={color}
                    fillOpacity={0.45}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                  />
                );
              })
            : null}
          {mode === "instance"
            ? SCENE_OBJECTS.map((o, i) => {
                const x = o.x * W;
                const y = o.y * H;
                const w = o.w * W;
                const h = o.h * H;
                const palette = [COLORS.accent, COLORS.honey, COLORS.green, COLORS.red];
                const color = palette[i % palette.length];
                return (
                  <motion.g
                    key={o.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.12, duration: 0.4 }}
                  >
                    <rect x={x} y={y} width={w} height={h} fill={color} fillOpacity={0.4} />
                    <rect
                      x={x}
                      y={y}
                      width={w}
                      height={h}
                      fill="none"
                      stroke={color}
                      strokeWidth={1.5}
                    />
                    <text
                      x={x + 4}
                      y={y + 14}
                      fontSize={10}
                      fontFamily="JetBrains Mono, monospace"
                      fill={COLORS.ink}
                    >
                      {o.cls}#{i + 1}
                    </text>
                  </motion.g>
                );
              })
            : null}
          {mode === "keypoint"
            ? SCENE_OBJECTS.filter((o) => o.cls === "gate").map((o) => {
                const x = o.x * W;
                const y = o.y * H;
                const w = o.w * W;
                const h = o.h * H;
                const corners = [
                  [x, y],
                  [x + w, y],
                  [x + w, y + h],
                  [x, y + h],
                ];
                return (
                  <g key={o.id}>
                    {corners.map(([cx, cy], i) => (
                      <circle key={i} cx={cx} cy={cy} r={5} fill={COLORS.accent} stroke={COLORS.surface} strokeWidth={2} />
                    ))}
                    <polygon
                      points={corners.map(([cx, cy]) => `${cx},${cy}`).join(" ")}
                      fill="none"
                      stroke={COLORS.accent}
                      strokeWidth={1.5}
                      strokeDasharray="3 3"
                    />
                  </g>
                );
              })
            : null}
          {mode === "depth" ? (
            <g>
              {Array.from({ length: 24 }, (_, i) => (
                <rect
                  key={i}
                  x={0}
                  y={(i / 24) * H}
                  width={W}
                  height={H / 24}
                  fill={COLORS.accent}
                  fillOpacity={0.05 + (i / 24) * 0.45}
                />
              ))}
            </g>
          ) : null}
        </svg>
      </div>
    </VizFrame>
  );
}
