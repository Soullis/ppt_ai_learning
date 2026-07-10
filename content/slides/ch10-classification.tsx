import type { Chapter } from "@/components/slide/types";
import { ClassificationDemo } from "@/components/viz/ClassificationDemo";
import { Callout } from "@/components/ui/Callout";
import { M, MBlock } from "@/components/math/Math";

export const ch10: Chapter = {
  id: "ch10",
  number: 10,
  part: 3,
  slug: "classification",
  title: "Image classification",
  subtitle: "From logits to labels",
  slides: [
    {
      id: "ch10-00",
      title: "Classification output",
      eyebrow: "Task",
      layout: "split",
      notes: "8 min. Softmax turns logits into probabilities.",
      content: (
        <div className="space-y-4">
          <p>
            One label per image. The network outputs logits <M>z_k</M>; softmax converts them to a
            probability distribution:
          </p>
          <MBlock>{"\\hat p_k = \\frac{e^{z_k}}{\\sum_j e^{z_j}}"}</MBlock>
          <p>
            Prediction: <M>{"\\arg\\max_k \\hat p_k"}</M>. Loss: categorical cross-entropy. Metrics:
            top-1 and top-5 accuracy.
          </p>
          <p className="text-muted">
            ImageNet (1000 classes) was the standard benchmark for a decade.
          </p>
        </div>
      ),
      viz: <ClassificationDemo />,
    },
    {
      id: "ch10-01",
      title: "Training loop",
      eyebrow: "Procedure",
      layout: "prose",
      notes: "5 min. Link back to chapter 5.",
      content: (
        <div className="space-y-4">
          <ol className="space-y-2 text-[15px]">
            <li>1. Forward pass — image through CNN, get logits</li>
            <li>2. Compute loss — cross-entropy against one-hot label</li>
            <li>3. Backward pass — gradients via autograd</li>
            <li>4. Optimiser step — update weights (Adam or SGD)</li>
            <li>5. Repeat on mini-batches; evaluate on validation set</li>
          </ol>
          <p className="text-muted">
            Detection and segmentation extend this loop with structured outputs and different loss
            terms (chapters 11 and 12).
          </p>
        </div>
      ),
    },
    {
      id: "ch10-02",
      title: "Transfer learning",
      eyebrow: "Practice",
      layout: "prose",
      notes: "7 min. How we start from pretrained backbones.",
      content: (
        <div className="space-y-4">
          <p>
            Train a large model on ImageNet (or use a public checkpoint), freeze early layers,
            replace the classification head, fine-tune on your smaller dataset.
          </p>
          <ul className="space-y-2 text-[14px] text-ink/85">
            <li>· Fewer labelled images needed</li>
            <li>· Faster convergence</li>
            <li>· Backbone features already encode edges, textures, parts</li>
          </ul>
          <Callout>
            ViT and other transformer backbones (chapter 6) appear in RF-DETR (chapter 11) via
            DINOv2 pretraining rather than training a classifier from scratch.
          </Callout>
        </div>
      ),
    },
    {
      id: "ch10-03",
      title: "Failure modes",
      eyebrow: "Generalisation",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>
            <strong>Domain shift</strong> — train on sunny flights, test at dusk: accuracy drops.
            Mitigate with diverse data and augmentation (chapter 13).
          </p>
          <p>
            <strong>Class imbalance</strong> — rare classes dominate metrics unless stratified
            splits and weighted sampling are used.
          </p>
          <p>
            <strong>Overconfidence</strong> — softmax can be sharp even when wrong. Calibration
            and held-out validation matter.
          </p>
        </div>
      ),
    },
  ],
};
