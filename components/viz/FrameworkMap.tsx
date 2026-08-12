"use client";

import { useState } from "react";
import { COLORS, FadeIn, VizFrame } from "./common";

const CATEGORIES = [
  {
    name: "Python stack",
    tools: ["NumPy", "Pandas", "SciPy", "scikit-learn"],
    desc: "arrays, tables, classical ML",
  },
  {
    name: "Deep learning",
    tools: ["PyTorch", "TensorFlow", "Keras", "JAX"],
    desc: "neural nets, autograd, GPU",
  },
  {
    name: "Model hubs",
    tools: ["Hugging Face", "Torch Hub", "ONNX"],
    desc: "pretrained weights, export",
  },
  {
    name: "MLOps",
    tools: ["MLflow", "W&B", "DVC"],
    desc: "experiments, versioning",
  },
];

export function FrameworkMap() {
  const [idx, setIdx] = useState(0);
  const cat = CATEGORIES[idx];

  return (
    <VizFrame caption="industry tooling around the training loop">
      <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((c, i) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setIdx(i)}
              className="rounded border px-2 py-1 font-mono text-[9px] uppercase"
              style={{
                borderColor: i === idx ? COLORS.accent : COLORS.stroke,
                color: i === idx ? COLORS.accent : COLORS.muted,
              }}
            >
              {c.name}
            </button>
          ))}
        </div>
        <FadeIn key={cat.name}>
          <p className="text-center text-[12px] text-muted">{cat.desc}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {cat.tools.map((t) => (
              <span
                key={t}
                className="rounded border border-stroke bg-bone px-3 py-1.5 font-mono text-[11px]"
              >
                {t}
              </span>
            ))}
          </div>
        </FadeIn>
      </div>
    </VizFrame>
  );
}
