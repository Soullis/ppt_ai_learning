"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { COLORS, VizFrame } from "./common";

const STAGES = [
  {
    label: "Collect",
    bullets: ["flight MP4 / telemetry logs", "sensor streams, annotations", "version raw captures"],
  },
  {
    label: "Clean",
    bullets: ["drop blurry / dark frames", "remove duplicates", "fix mislabels"],
  },
  {
    label: "Transform",
    bullets: ["letterbox to 640×640", "normalise channels", "tokenize / resample audio"],
  },
  {
    label: "Split",
    bullets: ["train / val / test", "stratify by class", "keep flight sessions together"],
  },
  {
    label: "Validate",
    bullets: ["schema & shape checks", "leakage audit", "class balance review"],
  },
];

export function DataPipeline() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setActive((a) => (a + 1) % STAGES.length), 2800);
    return () => clearInterval(t);
  }, [reduced]);

  return (
    <VizFrame fit="fill" caption="five stages — most project time is spent here before training">
      <div className="flex h-full flex-col justify-center gap-2 p-3">
        <div className="flex items-stretch gap-1.5">
          {STAGES.map((s, i) => {
            const isActive = i === active;
            return (
              <div key={s.label} className="flex flex-1 items-center">
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  className="flex w-full flex-col gap-0.5 rounded border px-2 py-2 text-left transition"
                  style={{
                    borderColor: isActive ? COLORS.accent : COLORS.stroke,
                    borderWidth: isActive ? 2 : 1,
                    backgroundColor: isActive ? `${COLORS.accent}12` : COLORS.surface,
                  }}
                >
                  <span
                    className="font-mono text-[8px] tabular-nums"
                    style={{ color: isActive ? COLORS.accent : COLORS.muted }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="font-mono text-[10px] uppercase tracking-[0.06em]"
                    style={{ color: isActive ? COLORS.accent : COLORS.ink }}
                  >
                    {s.label}
                  </span>
                </button>
                {i < STAGES.length - 1 ? (
                  <span className="px-0.5 font-mono text-muted" style={{ opacity: i < active ? 0.7 : 0.25 }}>
                    →
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {STAGES.map((s, i) => (
            <div
              key={s.label}
              className="rounded border px-1.5 py-1.5 transition"
              style={{
                borderColor: i === active ? COLORS.accent : COLORS.stroke,
                backgroundColor: i === active ? `${COLORS.accent}08` : COLORS.bone,
                opacity: i === active ? 1 : 0.65,
              }}
            >
              <ul className="space-y-1 text-[8px] leading-tight text-muted">
                {s.bullets.map((b) => (
                  <li key={b}>· {b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-2 flex items-center justify-center gap-1">
          {STAGES.map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-full transition-all"
              style={{
                width: i === active ? 20 : 6,
                backgroundColor: i === active ? COLORS.accent : COLORS.stroke,
              }}
            />
          ))}
        </div>
      </div>
    </VizFrame>
  );
}
