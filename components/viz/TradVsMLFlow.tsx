"use client";

import { COLORS, FadeIn, VizFrame } from "./common";

function FlowBox({ label, sub, color }: { label: string; sub?: string; color: string }) {
  return (
    <div
      className="flex min-h-[52px] w-full flex-col items-center justify-center rounded border px-3 py-2 text-center"
      style={{ borderColor: color, backgroundColor: `${color}18` }}
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.1em]" style={{ color }}>
        {label}
      </span>
      {sub ? <span className="mt-0.5 text-[10px] text-muted">{sub}</span> : null}
    </div>
  );
}

function Column({ title, color, steps }: { title: string; color: string; steps: string[] }) {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <div className="mb-1 text-center font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color }}>
        {title}
      </div>
      {steps.map((s, i) => (
        <FadeIn key={s} delay={i * 0.08}>
          <>
            <FlowBox label={s} color={color} />
            {i < steps.length - 1 ? (
              <div className="text-center font-mono text-sm text-muted">↓</div>
            ) : null}
          </>
        </FadeIn>
      ))}
    </div>
  );
}

export function TradVsMLFlow() {
  return (
    <VizFrame caption="traditional programming writes rules; machine learning learns rules from data">
      <div className="flex h-full items-center justify-center gap-6 p-4 md:gap-10">
        <Column
          title="Traditional"
          color={COLORS.muted}
          steps={["Input data", "Human-written rules", "Output"]}
        />
        <div className="font-mono text-2xl text-muted">vs</div>
        <Column
          title="Machine learning"
          color={COLORS.accent}
          steps={["Training data + labels", "Learned model (parameters)", "Output on new data"]}
        />
      </div>
    </VizFrame>
  );
}
