"use client";

import { VizFrame } from "./common";

export function FoundationModelStack() {
  return (
    <VizFrame fit="fill" caption="LLM training stacks all three paradigms — pretrain, fine-tune, align">
      <div className="flex h-full items-center justify-center bg-surface p-3">
        <img
          src="/figures/llm-paradigms.jpg"
          alt="Cartoon of a large pretrained model as a many-eyed creature (unsupervised/self-supervised pretraining), refined into a smaller head via supervised fine-tuning, topped with a cherry labelled RLHF"
          className="max-h-full max-w-full rounded-md border border-stroke object-contain"
        />
      </div>
    </VizFrame>
  );
}
