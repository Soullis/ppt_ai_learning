"use client";

import { COLORS, VizFrame } from "./common";

const RAW = "gate width is 12 m";
const TOKENS = ["gate", "width", "is", "12", "m"];
const IDS = [3891, 4421, 16, 1287, 289];
const PAD_LEN = 8;

const EMBED_POINTS = [
  { label: "gate", x: 30, y: 30, group: "object" },
  { label: "door", x: 42, y: 24, group: "object" },
  { label: "wall", x: 22, y: 44, group: "object" },
  { label: "left", x: 78, y: 68, group: "direction" },
  { label: "right", x: 90, y: 62, group: "direction" },
  { label: "12", x: 65, y: 20, group: "number" },
  { label: "40", x: 75, y: 14, group: "number" },
];

export function TextTokenViz() {
  return (
    <VizFrame fit="fill" caption="raw string → tokens → ids → padded sequence → dense embedding space">
      <div className="flex h-full flex-col justify-center gap-2 p-3 text-[10px]">
        {[
          { label: "1 · raw", content: `"${RAW}"` },
          { label: "2 · tokenize (BPE)", content: TOKENS.join(" | ") },
          { label: "3 · token IDs", content: IDS.join("  ") },
        ].map((row) => (
          <div key={row.label} className="rounded border border-stroke bg-surface px-2 py-1.5">
            <div className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted">{row.label}</div>
            <div className="mt-0.5 font-mono text-[10px] text-ink">{row.content}</div>
          </div>
        ))}

        <div className="rounded border border-stroke bg-bone px-2 py-1.5">
          <div className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted">
            4 · pad to length T = {PAD_LEN}
          </div>
          <div className="mt-1 flex flex-wrap gap-1">
            {IDS.map((id, i) => (
              <span
                key={i}
                className="rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 font-mono tabular-nums"
              >
                {id}
              </span>
            ))}
            {Array.from({ length: PAD_LEN - IDS.length }).map((_, i) => (
              <span key={`p${i}`} className="rounded border border-dashed border-stroke px-1.5 py-0.5 font-mono text-muted">
                0
              </span>
            ))}
          </div>
          <div className="mt-1 flex flex-wrap gap-1">
            <span className="font-mono text-[8px] text-muted">mask:</span>
            {[...IDS.map(() => "1"), ...Array(PAD_LEN - IDS.length).fill("0")].map((m, i) => (
              <span
                key={i}
                className="w-5 text-center font-mono tabular-nums"
                style={{ color: m === "1" ? COLORS.ink : COLORS.muted }}
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded border border-stroke bg-surface px-2 py-1.5">
          <div className="mb-1 flex items-baseline justify-between">
            <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted">
              5 · embedding space (illustrative)
            </span>
            <span className="font-mono text-[8px] text-muted">similar meaning → nearby vectors</span>
          </div>
          <svg viewBox="0 0 100 80" className="h-20 w-full">
            <rect x={12} y={10} width={38} height={44} rx={3} fill={`${COLORS.accent}0c`} stroke={COLORS.accent} strokeOpacity={0.25} strokeDasharray="2 2" />
            <rect x={62} y={4} width={34} height={26} rx={3} fill={`${COLORS.honey}12`} stroke={COLORS.honey} strokeOpacity={0.35} strokeDasharray="2 2" />
            <rect x={66} y={50} width={30} height={26} rx={3} fill={`${COLORS.green}10`} stroke={COLORS.green} strokeOpacity={0.3} strokeDasharray="2 2" />
            {EMBED_POINTS.map((p) => (
              <g key={p.label}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={2.4}
                  fill={p.group === "object" ? COLORS.accent : p.group === "direction" ? COLORS.green : COLORS.honey}
                />
                <text x={p.x + 4} y={p.y + 2.5} fontSize={6} fill={COLORS.ink}>
                  {p.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </VizFrame>
  );
}
