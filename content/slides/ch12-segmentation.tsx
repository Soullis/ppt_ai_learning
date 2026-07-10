import type { Chapter } from "@/components/slide/types";
import { SemanticInstanceCompare } from "@/components/viz/SemanticInstanceCompare";
import { MaskOverlay } from "@/components/viz/Scene";
import { SkipBlock } from "@/components/viz/SkipBlock";
import { VideoDemo } from "@/components/viz/VideoDemo";
import { Callout } from "@/components/ui/Callout";
import { M, MBlock } from "@/components/math/Math";

export const ch12: Chapter = {
  id: "ch12",
  number: 12,
  part: 4,
  slug: "segmentation",
  title: "Segmentation",
  subtitle: "Per-pixel and per-instance masks",
  slides: [
    {
      id: "ch12-00",
      title: "Semantic vs instance",
      eyebrow: "Task types",
      layout: "split",
      notes: "8 min. When to use which on missions.",
      content: (
        <div className="space-y-4">
          <p>
            <strong>Semantic</strong> — one label per pixel; all objects of the same class share
            one mask. <strong>Instance</strong> — separate mask per object, enabling counting and
            individual tracking.
          </p>
          <p>
            Black Bee targets (gates, drones) are usually countable — detection or instance
            segmentation fits better than pure semantic segmentation.
          </p>
        </div>
      ),
      viz: <SemanticInstanceCompare />,
    },
    {
      id: "ch12-01",
      title: "Output tensor",
      eyebrow: "Shape",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            <strong>Semantic:</strong> per pixel logits over <M>C</M> classes:
          </p>
          <MBlock>
            {"\\hat Y \\in \\mathbb{R}^{H \\times W \\times C}, \\quad \\hat y_{ij} = \\arg\\max_c \\hat Y_{ijc}"}
          </MBlock>
          <p>
            <strong>Instance:</strong> <M>N</M> binary masks{" "}
            <M>{"M_k \\in \\{0,1\\}^{H \\times W}"}</M> plus
            class label per instance, or mask coefficients multiplied by shared prototype masks
            (YOLO-seg).
          </p>
          <p className="text-muted">
            Upsampling (transposed convolution or bilinear resize) restores full resolution after
            encoder downsampling.
          </p>
        </div>
      ),
      viz: <MaskOverlay mode="instance" />,
    },
    {
      id: "ch12-02",
      title: "Segmentation losses",
      eyebrow: "Training",
      layout: "scrollProse",
      content: (
        <div className="space-y-4">
          <p>
            <strong>Per pixel cross entropy</strong> — same as classification, applied at every pixel:
          </p>
          <MBlock>{"\\mathcal{L}_{\\mathrm{CE}} = -\\frac{1}{HW}\\sum_{i,j} \\log \\hat p_{y_{ij}}"}</MBlock>
          <p>
            <strong>Dice loss</strong> — overlap based; helps with class imbalance and small regions:
          </p>
          <MBlock>
            {"\\mathcal{L}_{\\mathrm{Dice}} = 1 - \\frac{2|X \\cap Y| + \\epsilon}{|X| + |Y| + \\epsilon}"}
          </MBlock>
          <p>
            <strong>Focal loss</strong> (optional) — down weights easy pixels, focuses training on
            hard boundaries and rare classes.
          </p>
          <p className="text-muted">
            Common practice: weighted sum of CE and Dice. Instance segmentation adds a mask branch
            loss on top of detection losses (chapter 11).
          </p>
        </div>
      ),
    },
    {
      id: "ch12-03",
      title: "FCN to U-Net",
      eyebrow: "Architecture",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Fully convolutional networks (FCN) replaced dense layers with convolutions for dense
            prediction. U-Net adds skip connections from encoder to decoder so fine spatial detail
            lost during downsampling is recovered during upsampling.
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
      id: "ch12-04",
      title: "Instance segmentation families",
      eyebrow: "Architectures",
      layout: "scrollProse",
      content: (
        <div className="space-y-4">
          <p>
            <strong>Mask R-CNN</strong> (He et al. 2017) — two stage: detect boxes, then a small conv
            head predicts a mask per region of interest. Accurate, slower.
          </p>
          <p>
            <strong>YOLO-seg</strong> — one stage detection (chapter 11) plus parallel mask branch:
            prototype masks at each scale multiplied by per instance coefficients.
          </p>
          <p>
            <strong>DETR / Mask2Former</strong> — transformer queries predict masks directly; set
            prediction like DETR, no NMS.
          </p>
          <Callout label="References">
            <a className="underline" href="https://arxiv.org/abs/1703.06870" target="_blank" rel="noreferrer">Mask R-CNN</a>
            {" · "}
            <a className="underline" href="https://docs.ultralytics.com/tasks/segment/" target="_blank" rel="noreferrer">Ultralytics segmentation</a>
          </Callout>
        </div>
      ),
    },
    {
      id: "ch12-05",
      title: "YOLO-seg mask branch",
      eyebrow: "YOLO",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>
            YOLO-seg extends the detection head: each detected instance outputs mask coefficients{" "}
            <M>{"\\mathbf{c} \\in \\mathbb{R}^{32}"}</M>. The network also predicts prototype masks{" "}
            <M>{"P \\in \\mathbb{R}^{32 \\times H \\times W}"}</M> at a lower resolution. Final mask:
          </p>
          <MBlock>{"M = \\sigma\\big(\\mathbf{c}^\\top P\\big)"}</MBlock>
          <p className="text-muted">
            Low rank factorisation keeps the mask branch lightweight compared to a full resolution
            conv per object. Nectar <code className="font-mono text-[12px]">Segmentor</code> wraps
            Ultralytics YOLO-seg and RF-DETR segmentation heads.
          </p>
        </div>
      ),
    },
    {
      id: "ch12-06",
      title: "Evaluation metrics",
      eyebrow: "Metrics",
      layout: "scrollProse",
      content: (
        <div className="space-y-4">
          <p>
            <strong>Mean IoU (mIoU)</strong> — standard for semantic segmentation; per class IoU
            averaged (IoU defined in chapter 11):
          </p>
          <MBlock>{"\\mathrm{mIoU} = \\frac{1}{C}\\sum_{c=1}^{C} \\frac{TP_c}{TP_c + FP_c + FN_c}"}</MBlock>
          <p>
            <strong>Mask AP</strong> — COCO style average precision on instance masks: match predicted
            mask to GT at IoU ≥ τ, same AP integral as detection.
          </p>
          <p className="text-muted">
            <strong>Boundary F-score</strong> — measures edge quality for thin structures (poles,
            wires); useful when pixel exact boundaries matter more than region overlap.
          </p>
        </div>
      ),
    },
    {
      id: "ch12-07",
      title: "Detection vs segmentation",
      eyebrow: "Decision",
      layout: "prose",
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
            chapter 15.
          </Callout>
        </div>
      ),
    },
    {
      id: "ch12-08",
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
      id: "ch12-09",
      title: "Modern architectures",
      eyebrow: "Reference",
      layout: "prose",
      tier: "reference",
      content: (
        <div className="space-y-4">
          <p>
            <strong>DeepLab</strong> — atrous convolution for multi scale context without losing
            resolution. <strong>SegFormer</strong> — transformer encoder, lightweight MLP decoder.{" "}
            <strong>Mask2Former</strong> — mask classification with transformer queries; unifies
            semantic, instance, and panoptic segmentation.
          </p>
          <Callout label="References">
            <a className="underline" href="https://arxiv.org/abs/2112.01527" target="_blank" rel="noreferrer">Mask2Former</a>
          </Callout>
        </div>
      ),
    },
  ],
};
