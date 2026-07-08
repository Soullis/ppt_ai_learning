"use client";

import { COLORS, VizFrame } from "./common";

const STEPS = [
  { label: "Flight video", detail: "MP4 log" },
  { label: "Extract", detail: "frames @ fps" },
  { label: "Select", detail: "sharp · lit" },
  { label: "Roboflow", detail: "bbox / mask" },
  { label: "Resize", detail: "letterbox" },
  { label: "Augment", detail: "flip · hue" },
  { label: "Export", detail: "YOLO · COCO" },
  { label: "Split", detail: "by session" },
];

function StepCard({ index, label, detail }: { index: number; label: string; detail: string }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1 rounded-md border border-stroke bg-surface px-2 py-3 text-center">
      <span
        className="flex h-5 w-5 items-center justify-center rounded-full font-mono text-[9px] text-surface"
        style={{ backgroundColor: COLORS.honey }}
      >
        {index + 1}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.05em] text-ink">{label}</span>
      <span className="font-mono text-[9px] text-muted">{detail}</span>
    </div>
  );
}

export function DatasetWorkflow() {
  const rowA = STEPS.slice(0, 4);
  const rowB = STEPS.slice(4);

  return (
    <VizFrame fit="fill" caption="Black Bee path from raw flight to a trainable dataset">
      <div className="flex h-full flex-col justify-center gap-2 p-4">
        <div className="flex items-center">
          {rowA.map((s, i) => (
            <div key={s.label} className="flex flex-1 items-center">
              <StepCard index={i} label={s.label} detail={s.detail} />
              {i < rowA.length - 1 ? <span className="px-1.5 font-mono text-sm text-muted">→</span> : null}
            </div>
          ))}
        </div>

        <div className="flex justify-end pr-[calc(12.5%-10px)]">
          <span className="font-mono text-sm text-muted">↓</span>
        </div>

        <div className="flex items-center">
          {rowB.map((s, i) => (
            <div key={s.label} className="flex flex-1 items-center">
              <StepCard index={i + 4} label={s.label} detail={s.detail} />
              {i < rowB.length - 1 ? <span className="px-1.5 font-mono text-sm text-muted">→</span> : null}
            </div>
          ))}
        </div>
      </div>
    </VizFrame>
  );
}
