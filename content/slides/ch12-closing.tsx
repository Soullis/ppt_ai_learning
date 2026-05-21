import type { Chapter } from "@/components/slide/types";

export const ch12: Chapter = {
  id: "ch12",
  number: 12,
  slug: "closing",
  title: "Closing",
  slides: [
    {
      id: "ch12-00",
      title: "Where to dig next",
      eyebrow: "Reading and courses",
      layout: "prose",
      content: (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              Foundations
            </div>
            <ul className="space-y-2 text-[15px]">
              <li>· Goodfellow et al. — <em>Deep Learning</em></li>
              <li>· Bishop — <em>Pattern Recognition and Machine Learning</em></li>
              <li>· Stanford CS231n — convolutional networks for visual recognition</li>
              <li>· FastAI part 1 — practical deep learning</li>
            </ul>
          </div>
          <div>
            <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              Detection-specific
            </div>
            <ul className="space-y-2 text-[15px]">
              <li>· Carion et al. (2020) — DETR</li>
              <li>· Zhao et al. (2024) — RT-DETR</li>
              <li>· Roboflow blog — RF-DETR series</li>
              <li>· Ultralytics docs — YOLO families</li>
              <li>· COCO mAP definition (cocodataset.org)</li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              Worked examples and side projects
            </div>
            <ul className="space-y-2 text-[15px]">
              <li>
                ·{" "}
                <a className="underline" href="https://huggingface.co/blog/samuellimabraz/signature-detection-model" target="_blank" rel="noreferrer">
                  Signature detection blog
                </a>{" "}
                — full detection pipeline, YOLO vs DETR vs RF-DETR, with
                published model and dataset.
              </li>
              <li>
                ·{" "}
                <a className="underline" href="https://huggingface.co/blog/samuellimabraz/peft-methods" target="_blank" rel="noreferrer">
                  PEFT methods
                </a>{" "}
                — LoRA, adapters, prefix-tuning: fine-tuning foundation models
                cheaply.
              </li>
              <li>
                ·{" "}
                <a className="underline" href="https://github.com/samuellimabraz/cafedl" target="_blank" rel="noreferrer">
                  cafedl
                </a>{" "}
                — Java deep-learning library written from scratch; an autograd
                engine you can read end-to-end.
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "ch12-01",
      title: "Questions",
      eyebrow: "Discussion",
      layout: "title",
      content: null,
    },
  ],
};
