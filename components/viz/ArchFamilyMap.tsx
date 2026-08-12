"use client";

import { COLORS, VizFrame } from "./common";

const FAMILIES = [
  { name: "Feedforward (MLP)", use: "tabular, simple patterns", color: COLORS.muted },
  { name: "CNN", use: "images, spatial structure", color: COLORS.accent },
  { name: "RNN / LSTM", use: "sequences, streaming", color: COLORS.green },
  { name: "Transformer", use: "long-range dependencies", color: COLORS.honey },
  { name: "Multimodal", use: "image + text (CLIP, LLaVA)", color: COLORS.red },
];

export function ArchFamilyMap() {
  return (
    <VizFrame caption="architecture choice encodes inductive bias about the data">
      <div className="flex h-full flex-col justify-center gap-2 p-4">
        {FAMILIES.map((f) => (
          <div
            key={f.name}
            className="flex items-center gap-3 rounded border border-stroke bg-surface px-4 py-2.5"
          >
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: f.color }} />
            <div className="font-mono text-[12px] text-ink">{f.name}</div>
            <div className="ml-auto text-[11px] text-muted">{f.use}</div>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
