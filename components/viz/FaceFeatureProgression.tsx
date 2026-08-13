"use client";

import { VizFrame } from "./common";

const HONEY = "rgba(232,181,60,1)";

/* ---------------------------------------------------------------------- */
/* One pixel-art face, rendered at N×N blocks. Same 8px cell size at      */
/* every resolution — so the canvas itself grows (64 → 128 → 256px) as N  */
/* grows (8 → 16 → 32), which is the point: more resolution, more cells,  */
/* more of the face becomes resolvable.                                   */
/* ---------------------------------------------------------------------- */
const DISPLAY_SIZE = 160; // fixed on-screen size for every grid, regardless of n

type Row = {
  n: number;
  grayscale: boolean;
  eyebrows: boolean;
  features: string[];
  confidence: number;
  label: string;
};

const ROWS: Row[] = [
  {
    n: 8,
    grayscale: true,
    eyebrows: false,
    features: ["contorno curvo", "duas manchas escuras", "padrão ainda ambíguo"],
    confidence: 22,
    label: "talvez um rosto?",
  },
  {
    n: 16,
    grayscale: false,
    eyebrows: false,
    features: ["dois olhos identificados", "boca curva detectada", "tom de pele reconhecido"],
    confidence: 64,
    label: "provável rosto",
  },
  {
    n: 32,
    grayscale: false,
    eyebrows: true,
    features: [
      "olhos + sobrancelhas",
      "boca + sorriso",
      "proporções faciais completas",
      "textura de pele",
    ],
    confidence: 97,
    label: "rosto confirmado",
  },
];

type Category = "bg" | "fill" | "outline" | "eyeL" | "eyeR" | "mouth" | "browL" | "browR";

function classify(i: number, j: number, n: number, withBrows: boolean): Category {
  const u = (j + 0.5) / n;
  const v = (i + 0.5) / n;
  const dx = u - 0.5;
  const dy = v - 0.5;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const r = 0.42;
  const ring = 0.6 / n; // ~one cell thick, scaled to resolution

  const eyeR = 0.065;
  const eyeY = 0.42;
  const eyeDx = 0.16;
  const dEyeL = Math.hypot(u - (0.5 - eyeDx), v - eyeY);
  const dEyeR = Math.hypot(u - (0.5 + eyeDx), v - eyeY);
  if (dEyeL < eyeR) return "eyeL";
  if (dEyeR < eyeR) return "eyeR";

  if (withBrows) {
    const browY = 0.32;
    const browThick = 0.045;
    if (Math.abs(v - browY) < browThick && Math.abs(u - (0.5 - eyeDx)) < eyeR * 1.3) return "browL";
    if (Math.abs(v - browY) < browThick && Math.abs(u - (0.5 + eyeDx)) < eyeR * 1.3) return "browR";
  }

  if (v > 0.6 && v < 0.68 && Math.abs(u - 0.5) < 0.19) return "mouth";

  if (Math.abs(dist - r) < ring) return "outline";
  if (dist < r) return "fill";
  return "bg";
}

function paletteFor(cat: Category, grayscale: boolean): string {
  if (grayscale) {
    switch (cat) {
      case "fill":
        return "#D9D9D9";
      case "outline":
        return "#F2F2F2";
      case "eyeL":
      case "eyeR":
      case "mouth":
        return "#141414";
      default:
        return "transparent";
    }
  }
  switch (cat) {
    case "fill":
      return "#E8B98A";
    case "outline":
      return "#C9915A";
    case "eyeL":
    case "eyeR":
      return "#2B4C7E";
    case "mouth":
      return "#B4453A";
    case "browL":
    case "browR":
      return "#4A2E1E";
    default:
      return "transparent";
  }
}

function FaceGrid({ n, grayscale, eyebrows }: { n: number; grayscale: boolean; eyebrows: boolean }) {
  const cell = DISPLAY_SIZE / n;
  const cells: { cat: Category; i: number; j: number }[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      cells.push({ i, j, cat: classify(i, j, n, eyebrows) });
    }
  }
  return (
    <div
      className="shrink-0 rounded-md"
      style={{
        width: DISPLAY_SIZE,
        height: DISPLAY_SIZE,
        background: "#0B0B0B",
        display: "grid",
        gridTemplateColumns: `repeat(${n}, ${cell}px)`,
      }}
    >
      {cells.map(({ cat, i, j }) => (
        <div
          key={`${i}-${j}`}
          style={{ width: cell, height: cell, background: paletteFor(cat, grayscale) }}
        />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Column 2 — the features that resolution makes legible.                 */
/* ---------------------------------------------------------------------- */
function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col items-center gap-2">
      {items.map((f) => (
        <li key={f} className="flex items-center gap-2 font-mono text-[18px] text-muted">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: HONEY }} />
          {f}
        </li>
      ))}
    </ul>
  );
}

/* ---------------------------------------------------------------------- */
/* Column 3 — resulting confidence, as a ring gauge.                      */
/* ---------------------------------------------------------------------- */
function ConfidenceRing({ value, label }: { value: number; label: string }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - value / 100);
  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke={HONEY}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform="rotate(-90 32 32)"
        />
        <text x="32" y="37" textAnchor="middle" fontSize="13" fontFamily="monospace" fill="#EDEDED">
          {value}%
        </text>
      </svg>
      <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">{label}</span>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Assembled 3x3 grid.                                                    */
/* ---------------------------------------------------------------------- */
export function FaceFeatureProgression({
  width = 940,
  height = 680,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <div className="flex w-full max-w-full flex-col items-center">
      <VizFrame width={width} height={height} caption="resolução → features → confiança">
        <div className="flex h-full w-full flex-col justify-center gap-8 overflow-y-auto px-6 py-4">
          {ROWS.map((row, idx) => (
            <div key={row.n} className="grid grid-cols-[auto_1fr_auto] items-center gap-8">
              <FaceGrid n={row.n} grayscale={row.grayscale} eyebrows={row.eyebrows} />
              <FeatureList items={row.features} />
              <ConfidenceRing value={row.confidence} label={row.label} />
            </div>
          ))}
        </div>
      </VizFrame>
    </div>
  );
}