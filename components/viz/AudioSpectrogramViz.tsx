"use client";

import { COLORS, VizFrame } from "./common";

function waveformPath(bars: number, w: number, h: number) {
  const mid = h / 2;
  return Array.from({ length: bars }, (_, i) => {
    const x = 4 + (i / (bars - 1)) * (w - 8);
    const y = mid + Math.sin(i * 0.35) * (h * 0.35) * (0.5 + 0.5 * Math.sin(i * 0.12));
    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
  }).join(" ");
}

function fftPath(bars: number, w: number, h: number) {
  const base = h - 4;
  return Array.from({ length: bars }, (_, i) => {
    const x = 4 + (i / (bars - 1)) * (w - 8);
    const peak1 = Math.exp(-((i - 8) ** 2) / 18) * (h - 12);
    const peak2 = Math.exp(-((i - 22) ** 2) / 30) * (h - 12) * 0.5;
    const peak3 = Math.exp(-((i - 38) ** 2) / 40) * (h - 12) * 0.25;
    const y = base - Math.max(peak1, peak2, peak3, 2);
    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
  }).join(" ");
}

const VIEW_W = 300;
const VIEW_H = 70;

export function AudioSpectrogramViz() {
  const bars = 44;
  const melRows = 10;

  return (
    <VizFrame fit="fill" caption="time domain → frequency (FFT) → log-mel spectrogram (F, T)">
      <div className="flex h-full flex-col gap-2 p-3">
        <div className="flex flex-1 flex-col justify-center rounded border border-stroke bg-surface px-2 py-1.5">
          <div className="mb-1 flex items-baseline justify-between">
            <span className="font-mono text-[9px] uppercase text-muted">waveform (T,)</span>
            <span className="font-mono text-[8px] text-muted">amplitude vs time</span>
          </div>
          <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="none" className="h-10 w-full">
            <line x1={4} y1={VIEW_H / 2} x2={VIEW_W - 4} y2={VIEW_H / 2} stroke={COLORS.stroke} strokeWidth={0.5} />
            <path d={waveformPath(56, VIEW_W, VIEW_H)} fill="none" stroke={COLORS.accent} strokeWidth={1.75} />
            {Array.from({ length: 12 }).map((_, i) => {
              const x = 8 + i * ((VIEW_W - 16) / 11);
              const y = VIEW_H / 2 + Math.sin(i * 0.8) * 20;
              return <circle key={i} cx={x} cy={y} r={2} fill={COLORS.red} />;
            })}
          </svg>
          <p className="mt-1 text-[8px] text-muted">sample rate f_s · amplitude sampled at regular intervals</p>
        </div>

        <div className="flex justify-center font-mono text-[10px] text-muted">↓ FFT</div>

        <div className="flex flex-1 flex-col justify-center rounded border border-stroke bg-surface px-2 py-1.5">
          <div className="mb-1 flex items-baseline justify-between">
            <span className="font-mono text-[9px] uppercase text-muted">FFT magnitude</span>
            <span className="font-mono text-[8px] text-muted">Hz</span>
          </div>
          <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="none" className="h-10 w-full">
            <path d={fftPath(bars, VIEW_W, VIEW_H)} fill="none" stroke={COLORS.green} strokeWidth={1.75} />
          </svg>
          <p className="mt-1 text-[8px] text-muted">fundamental + harmonics + noise floor</p>
        </div>

        <div className="flex justify-center font-mono text-[10px] text-muted">↓ mel filterbank · log</div>

        <div className="flex flex-1 flex-col justify-center rounded border border-stroke bg-surface px-2 py-1.5">
          <div className="mb-1 flex items-baseline justify-between">
            <span className="font-mono text-[9px] uppercase text-muted">log-mel (F, T)</span>
            <span className="font-mono text-[8px] text-muted">input to model</span>
          </div>
          <div className="grid w-full gap-px" style={{ gridTemplateColumns: `repeat(${bars}, 1fr)` }}>
            {Array.from({ length: bars * melRows }).map((_, i) => {
              const row = Math.floor(i / bars);
              const col = i % bars;
              const v = (Math.sin(col * 0.25 + row * 0.5) + 1) / 2;
              return (
                <div key={i} className="h-2.5 w-full" style={{ backgroundColor: `rgba(10,102,194,${0.12 + v * 0.75})` }} />
              );
            })}
          </div>
          <p className="mt-1 text-[8px] text-muted">STFT → mel filterbank → log scale · standard classifier input</p>
        </div>
      </div>
    </VizFrame>
  );
}
