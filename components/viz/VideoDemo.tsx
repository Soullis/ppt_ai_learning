"use client";

import { useState } from "react";
import { COLORS, VizFrame } from "./common";

export type VideoClip = {
  src: string;
  label: string;
};

export function VideoDemo({
  clips,
  caption,
  width = 880,
  height = 500,
}: {
  clips: VideoClip[];
  caption?: string;
  width?: number;
  height?: number;
}) {
  const [idx, setIdx] = useState(0);
  const clip = clips[idx];

  return (
    <div className="flex w-full max-w-full flex-col items-center">
      <VizFrame width={width} height={height} caption={caption}>
        <div className="flex h-full w-full items-center justify-center bg-bone p-3">
          <video
            key={clip.src}
            src={clip.src}
            autoPlay
            muted
            loop
            playsInline
            controls
            className="max-h-full max-w-full rounded-md border border-stroke bg-black"
          />
        </div>
      </VizFrame>

      {clips.length > 1 ? (
        <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em]">
          {clips.map((c, i) => (
            <button
              key={c.src}
              type="button"
              onClick={() => setIdx(i)}
              data-active={i === idx}
              className="rounded-md border border-stroke bg-surface px-3 py-1.5 text-muted transition hover:border-ink hover:text-ink data-[active=true]:border-ink data-[active=true]:text-ink"
              style={i === idx ? { color: COLORS.ink } : undefined}
            >
              {c.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
