"use client";

import { COLORS, VizFrame } from "./common";

const ROWS = [
  ["34", "45k", "BSc", "1"],
  ["27", "32k", "MSc", "0"],
  ["52", "78k", "PhD", "1"],
  ["41", "51k", "BSc", "0"],
];

const PREP_STEPS = [
  { title: "Missing values", items: ["mean / median imputation", "drop rows with NaN"] },
  { title: "Scaling", items: ["z-score standardisation", "min-max to [0, 1]"] },
  { title: "Categorical", items: ["one-hot encoding", "label encoding"] },
];

const APPS = ["classification", "regression", "clustering"];

export function TabularDataViz() {
  const headers = ["age", "income", "education", "target"];

  return (
    <VizFrame fit="fill" caption="rows = samples · columns = features · target column highlighted">
      <div className="flex h-full flex-col gap-3 p-3 text-[10px] md:flex-row md:gap-4">
        <div className="flex shrink-0 flex-col">
          <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.1em] text-muted">
            representation
          </div>
          <table className="border-collapse font-mono">
            <thead>
              <tr>
                {headers.map((h, j) => (
                  <th
                    key={h}
                    className="border border-stroke px-2 py-1 text-left uppercase"
                    style={{
                      backgroundColor: j === 3 ? `${COLORS.honey}35` : COLORS.bone,
                      fontSize: 9,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="border border-stroke px-2 py-1 tabular-nums"
                      style={{ backgroundColor: j === 3 ? `${COLORS.honey}10` : COLORS.surface }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-1 font-mono text-[9px] text-muted">shape (N, F)</p>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted">preprocessing</div>
          {PREP_STEPS.map((step, i) => (
            <div key={step.title} className="rounded border border-stroke bg-surface px-2 py-1.5">
              <div className="font-mono text-[9px] font-medium text-ink">
                {i + 1}. {step.title}
              </div>
              <ul className="mt-0.5 space-y-0.5 text-[9px] text-muted">
                {step.items.map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
            </div>
          ))}
          <div className="mt-1 flex flex-wrap gap-1">
            {APPS.map((a) => (
              <span
                key={a}
                className="rounded border border-stroke bg-bone px-1.5 py-0.5 font-mono text-[8px] uppercase"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      </div>
    </VizFrame>
  );
}
