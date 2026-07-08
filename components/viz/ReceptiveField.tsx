"use client";

import { useState } from "react";
import { COLORS, FadeIn, VizFrame } from "./common";

const LAYERS = [
  { name: "input", rf: 1, stride: 1, k: 0 },
  { name: "conv 3×3", rf: 3, stride: 1, k: 3 },
  { name: "conv 3×3", rf: 5, stride: 1, k: 3 },
  { name: "pool 2×2", rf: 6, stride: 2, k: 2 },
  { name: "conv 3×3", rf: 14, stride: 2, k: 3 },
];

export function ReceptiveField() {
  const [layerIdx, setLayerIdx] = useState(LAYERS.length - 1);
  const layer = LAYERS[layerIdx];
  const grid = 12;
  const cell = 20;
  const center = 5;
  const half = Math.floor(layer.rf / 2);

  return (
    <VizFrame caption="layer stack (left) and input patch seen by one output neuron (right)">
      <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
        <div className="flex w-full max-w-lg items-start justify-center gap-6">
          {/* Layer stack diagram */}
          <div className="flex flex-col items-center gap-1">
            <span className="mb-1 font-mono text-[9px] uppercase tracking-[0.1em] text-muted">
              stack
            </span>
            {LAYERS.map((l, i) => (
              <button
                key={`${l.name}-${i}`}
                type="button"
                onClick={() => setLayerIdx(i)}
                className="w-28 rounded border px-2 py-1.5 text-left font-mono text-[9px] uppercase tracking-[0.08em] transition"
                style={{
                  borderColor: i === layerIdx ? COLORS.accent : COLORS.stroke,
                  background: i === layerIdx ? "rgba(10,102,194,0.08)" : COLORS.surface,
                  color: i === layerIdx ? COLORS.accent : COLORS.muted,
                }}
              >
                {l.name}
                {l.k > 0 && (
                  <span className="block text-[8px] normal-case text-muted">RF {l.rf}px</span>
                )}
              </button>
            ))}
          </div>

          {/* Input grid with RF overlay */}
          <FadeIn key={layerIdx}>
            <div className="flex flex-col items-center">
              <span className="mb-1 font-mono text-[9px] uppercase tracking-[0.1em] text-muted">
                input image
              </span>
              <svg width={grid * cell + 20} height={grid * cell + 20}>
                {Array.from({ length: grid }).map((_, i) =>
                  Array.from({ length: grid }).map((__, j) => {
                    const inRf =
                      Math.abs(i - center) <= half && Math.abs(j - center) <= half;
                    return (
                      <rect
                        key={`${i}-${j}`}
                        x={10 + j * cell}
                        y={10 + i * cell}
                        width={cell - 1}
                        height={cell - 1}
                        fill={inRf ? "rgba(10,102,194,0.35)" : COLORS.bone}
                        stroke={COLORS.stroke}
                        strokeWidth={0.5}
                      />
                    );
                  }),
                )}
                <rect
                  x={10 + (center - half) * cell - 1}
                  y={10 + (center - half) * cell - 1}
                  width={layer.rf * cell + 2}
                  height={layer.rf * cell + 2}
                  fill="none"
                  stroke={COLORS.honey}
                  strokeWidth={2}
                />
                <circle
                  cx={10 + center * cell + cell / 2 - 0.5}
                  cy={10 + center * cell + cell / 2 - 0.5}
                  r={4}
                  fill={COLORS.honey}
                />
              </svg>
            </div>
          </FadeIn>
        </div>

        <p className="text-center font-mono text-[11px] text-muted">
          One neuron at <strong>{layer.name}</strong> sees a {layer.rf}×{layer.rf} patch on the
          input · effective stride {layer.stride}
        </p>
      </div>
    </VizFrame>
  );
}
