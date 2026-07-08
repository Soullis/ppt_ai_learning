import type { Chapter } from "@/components/slide/types";
import { MaskOverlay } from "@/components/viz/Scene";
import { SkipBlock } from "@/components/viz/SkipBlock";
import { VideoDemo } from "@/components/viz/VideoDemo";
import { Callout } from "@/components/ui/Callout";
import { M, MBlock } from "@/components/math/Math";

export const ch11: Chapter = {
  id: "ch11",
  number: 11,
  part: 4,
  slug: "segmentation",
  title: "Segmentation",
  subtitle: "Per-pixel and per-instance masks",
  slides: [
    {
      id: "ch11-00",
      title: "Semantic vs instance",
      eyebrow: "Task types",
      layout: "split",
      notes: "8 min. When to use which on missions.",
      content: (
        <div className="space-y-4">
          <p>
            <strong>Semantic</strong> — one label per pixel, all objects of the same class share a
            mask. <strong>Instance</strong> — separate mask per object, enabling counting and
            individual tracking.
          </p>
          <p>
            Black Bee targets (gates, drones) are usually countable — detection or instance
            segmentation fits better than pure semantic segmentation.
          </p>
        </div>
      ),
      viz: <MaskOverlay mode="semantic" />,
    },
    {
      id: "ch11-01",
      title: "Output tensor",
      eyebrow: "Shape",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>Per-pixel logits over <M>C</M> classes:</p>
          <MBlock>
            {"\\hat Y \\in \\mathbb{R}^{H \\times W \\times C}, \\quad \\hat y_{ij} = \\arg\\max_c \\hat Y_{ijc}"}
          </MBlock>
          <p>
            Upsampling (transposed convolution or bilinear resize) restores full resolution after
            encoder downsampling.
          </p>
        </div>
      ),
      viz: <MaskOverlay mode="instance" />,
    },
    {
      id: "ch11-02",
      title: "Segmentation losses",
      eyebrow: "Training",
      layout: "prose",
      notes: "10 min. CE + Dice for imbalance.",
      content: (
        <div className="space-y-4">
          <p>
            <strong>Per-pixel cross-entropy</strong> — same as classification, applied at every
            pixel.
          </p>
          <MBlock>{"\\mathcal{L}_{\\text{CE}} = -\\frac{1}{HW}\\sum_{i,j} \\log \\hat p_{y_{ij}}"}</MBlock>
          <p>
            <strong>Dice loss</strong> — overlap-based, helps with class imbalance and small
            regions:
          </p>
          <MBlock>
            {"\\mathcal{L}_{\\text{Dice}} = 1 - \\frac{2|X \\cap Y| + \\epsilon}{|X| + |Y| + \\epsilon}"}
          </MBlock>
          <p className="text-muted">Common practice: weighted sum of CE and Dice.</p>
        </div>
      ),
    },
    {
      id: "ch11-03",
      title: "FCN to U-Net",
      eyebrow: "Architecture",
      layout: "split",
      notes: "10 min. Encoder-decoder with skips.",
      content: (
        <div className="space-y-4">
          <p>
            Fully convolutional networks (FCN) replaced dense layers with convolutions for dense
            prediction. U-Net adds skip connections from encoder to decoder so fine spatial detail
            is preserved.
          </p>
          <Callout label="References">
            <a className="underline" href="https://arxiv.org/abs/1411.4038" target="_blank" rel="noreferrer">
              Long et al. 2014 (FCN)
            </a>
            {" · "}
            <a className="underline" href="https://arxiv.org/abs/1505.04597" target="_blank" rel="noreferrer">
              Ronneberger et al. 2015 (U-Net)
            </a>
          </Callout>
        </div>
      ),
      viz: <SkipBlock />,
    },
    {
      id: "ch11-04",
      title: "Instance segmentation",
      eyebrow: "Mask head",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>
            <strong>Mask R-CNN</strong> — detect boxes, then a small conv head predicts a mask per
            region of interest. <strong>YOLO-seg</strong> — extends one-stage detection with mask
            coefficients per anchor/cell. <strong>DETR-seg</strong> — adds mask predictions to set
            prediction outputs.
          </p>
          <p className="text-muted">
            Nectar <code className="font-mono text-[12px]">Segmentor</code> supports YOLO, DETR,
            and RF-DETR families — chapter 14.
          </p>
        </div>
      ),
    },
    {
      id: "ch11-05",
      title: "Modern architectures",
      eyebrow: "Reference",
      layout: "prose",
      tier: "reference",
      content: (
        <div className="space-y-4">
          <p>
            <strong>DeepLab</strong> — atrous convolution for multi-scale context.{" "}
            <strong>SegFormer</strong> — transformer encoder, lightweight decoder.{" "}
            <strong>Mask2Former</strong> — mask classification with transformer queries, unifies
            semantic and instance segmentation.
          </p>
        </div>
      ),
    },
    {
      id: "ch11-06",
      title: "Evaluation metrics",
      eyebrow: "Metrics",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>
            <strong>Mean IoU (mIoU)</strong> — average IoU across classes. Standard for semantic
            segmentation.
          </p>
          <MBlock>{"\\mathrm{mIoU} = \\frac{1}{C}\\sum_{c=1}^{C} \\frac{TP_c}{TP_c + FP_c + FN_c}"}</MBlock>
          <p>
            <strong>Mask AP</strong> — COCO-style average precision on instance masks. Boundary F-score
            measures edge quality for thin structures.
          </p>
        </div>
      ),
    },
    {
      id: "ch11-07",
      title: "Team segmentation demo",
      eyebrow: "Mission footage",
      layout: "fullViz",
      content: null,
      viz: (
        <VideoDemo
          caption="Black Bee mission · instance segmentation"
          clips={[
            { src: "/team/seg-2.mp4", label: "clip 1" },
            { src: "/team/seg-1.mp4", label: "clip 2" },
          ]}
        />
      ),
    },
    {
      id: "ch11-08",
      title: "Detection vs segmentation",
      eyebrow: "Decision",
      layout: "prose",
      notes: "5 min wrap for software team.",
      content: (
        <div className="space-y-4">
          <p>
            <strong>Use detection</strong> when boxes are enough for downstream logic (tracking,
            approach, gate alignment).
          </p>
          <p>
            <strong>Use instance segmentation</strong> when pixel boundaries matter (occlusion,
            precise shape, counting overlapping objects).
          </p>
          <Callout>
            Both share the same training pipeline in Nectar: annotate, split, train, export ONNX —
            chapter 14.
          </Callout>
        </div>
      ),
    },
  ],
};
