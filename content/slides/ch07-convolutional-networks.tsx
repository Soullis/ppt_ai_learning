import type { Chapter } from "@/components/slide/types";
import { ConvIntuition } from "@/components/viz/ConvIntuition";
import { ConvKernel } from "@/components/viz/ConvKernel";
import { PoolingDemo } from "@/components/viz/PoolingDemo";
import { SkipBlock } from "@/components/viz/SkipBlock";
import { ArchTimeline } from "@/components/viz/ArchTimeline";
import { LeNetArchitecture } from "@/components/viz/LeNetArchitecture";
import { ImageNetLeap } from "@/components/viz/ImageNetLeap";
import { ResNetDepth } from "@/components/viz/ResNetDepth";
import { ReceptiveField } from "@/components/viz/ReceptiveField";
import { Callout } from "@/components/ui/Callout";
import { M, MBlock } from "@/components/math/Math";

export const ch07: Chapter = {
  id: "ch07",
  number: 7,
  part: 2,
  slug: "convolutional-networks",
  title: "Convolutional networks",
  subtitle: "Blocks for image feature extraction",
  slides: [
    {
      id: "ch07-00",
      title: "Why convolution for images",
      eyebrow: "Inductive bias",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>
            A dense layer on an HD image has millions of inputs per output and learns nothing
            about translation. Convolution encodes locality and weight sharing: the same kernel
            slides across the whole image.
          </p>
          <ul className="space-y-2 text-[15px]">
            <li><strong>Locality</strong> — each output depends on a small neighbourhood</li>
            <li><strong>Weight sharing</strong> — one kernel, all positions</li>
            <li><strong>Hierarchy</strong> — edges → textures → parts → objects</li>
          </ul>
        </div>
      ),
    },
    {
      id: "ch07-01",
      title: "Convolution intuition",
      eyebrow: "Convolution",
      layout: "wideViz",
      content: (
        <div className="space-y-4 text-[14px]">
          <ol className="list-decimal space-y-2 pl-5">
            <li>Place a small kernel on an input patch</li>
            <li>Multiply element-wise and sum → one output value</li>
            <li>Slide the kernel across all positions</li>
            <li>Reuse the same kernel weights everywhere</li>
          </ol>
          <div className="space-y-2 border-t border-stroke pt-4">
            <p>
              <strong>Dense layer</strong> on a 6×6 greyscale patch: each of the 36 pixels connects
              to the output with its own weight → 36 parameters per output neuron. On a 1920×1080
              RGB frame that is roughly 6 million weights for a single output.
            </p>
            <p>
              <strong>Convolution</strong> with a 3×3 kernel uses 9 weights total, applied at every
              location. The network learns one edge detector once, not a separate copy per pixel
              position.
            </p>
          </div>
        </div>
      ),
      viz: <ConvIntuition />,
    },
    {
      id: "ch07-02",
      title: "What convolution computes",
      eyebrow: "Math",
      layout: "split",
      content: (
        <div className="space-y-4">
          <MBlock>{"Y[i, j] = \\sum_{u, v} X[i+u,\\,j+v]\\cdot K[u, v]"}</MBlock>
          <p>Output size with padding <M>p</M> and stride <M>s</M>:</p>
          <MBlock>{"o = \\lfloor (n + 2p - k)/s \\rfloor + 1"}</MBlock>
        </div>
      ),
      viz: <ConvKernel N={10} />,
    },
    {
      id: "ch07-03",
      title: "Connection to OpenCV",
      eyebrow: "Bridge",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>
            In the CV class you applied fixed kernels manually: Sobel for edges, Gaussian for blur,
            Canny for contours. A CNN learns kernels from data instead of hand-designing them.
          </p>
          <div className="overflow-hidden rounded-md border border-stroke text-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-bone font-mono text-[11px] uppercase text-muted">
                  <th className="border-b border-stroke px-4 py-2">OpenCV</th>
                  <th className="border-b border-stroke px-4 py-2">CNN</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Sobel edge filter", "learned edge detectors"],
                  ["Gaussian blur", "learned smoothing"],
                  ["Fixed 3×3 kernel", "many kernels per layer"],
                ].map(([a, b]) => (
                  <tr key={a} className="border-b border-stroke">
                    <td className="px-4 py-2">{a}</td>
                    <td className="px-4 py-2 text-muted">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      id: "ch07-04",
      title: "Pooling",
      eyebrow: "Downsampling",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            <strong>Max-pool</strong> keeps the strongest response in each window — translation
            tolerance, preserves salient features. <strong>Average-pool</strong> smooths.
          </p>
          <MBlock>{"o_{\\mathrm{pool}} = \\lfloor (n - k)/s \\rfloor + 1"}</MBlock>
          <p className="text-muted">
            Modern detectors often use strided convolution instead of explicit pooling.
          </p>
        </div>
      ),
      viz: <PoolingDemo />,
    },
    {
      id: "ch07-05",
      title: "Receptive field",
      eyebrow: "Coverage",
      layout: "scrollSplit",
      content: (
        <div className="space-y-4 text-[14px]">
          <p>
            The <strong>receptive field</strong> of a neuron is the region of the original input
            that can affect its output. A conv layer with a 3×3 kernel only reads a 3×3 patch, but
            deeper neurons read patches that combine earlier neurons, so the effective region grows
            with depth.
          </p>
          <p>
            Click each layer in the diagram. The yellow box on the input image is the receptive
            field: every pixel inside it can change that neuron&apos;s value. After pooling with
            stride 2, each step in the feature map spans two input pixels, so the field grows
            faster.
          </p>
          <p>Recurrence when stacking layers (kernel size <M>k</M>, stride <M>s</M>):</p>
          <MBlock>{"r_\\ell = r_{\\ell-1} + (k_\\ell - 1)\\prod_{i=1}^{\\ell-1} s_i"}</MBlock>
          <p className="text-muted">
            Read it as: start from the previous field size, then add how far the new kernel reaches
            on the input, scaled by all strides below. Deep stacks are what let a final layer relate
            distant parts of an object, such as a wing tip and fuselage.
          </p>
        </div>
      ),
      viz: <ReceptiveField />,
    },
    {
      id: "ch07-06",
      title: "LeNet-5",
      eyebrow: "1998",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            LeCun stacked conv, ReLU, and pool layers, then dense classifiers. ~60 K parameters,
            deployed for cheque digit recognition.
          </p>
          <div className="rounded-md border border-stroke bg-surface px-4 py-3 font-mono text-[12px]">
            input → [Conv → ReLU → Pool]×k → Flatten → Dense → Softmax
          </div>
          <Callout label="Reference">
            <a className="underline" href="http://yann.lecun.com/exdb/publis/pdf/lecun-01a.pdf" target="_blank" rel="noreferrer">
              LeCun et al. 1998
            </a>
          </Callout>
        </div>
      ),
      viz: <LeNetArchitecture />,
    },
    {
      id: "ch07-07",
      title: "AlexNet and ImageNet 2012",
      eyebrow: "2012",
      layout: "scrollSplit",
      content: (
        <div className="space-y-4">
          <p>
            <strong>ImageNet</strong> is a large image dataset built by Fei-Fei Li and colleagues at
            Stanford (2009 onward). It contains about 14 million labelled images grouped into roughly
            22 000 categories. The subset used in competition, ILSVRC, has 1.2 million training images
            across <strong>1000 object classes</strong> (dog breeds, vehicles, tools, etc.).
          </p>
          <p>
            The task is <strong>image classification</strong>: given one image, predict its class.
            Each year, teams submitted models to the ImageNet Large Scale Visual Recognition Challenge
            (ILSVRC) and were ranked by top-5 error (correct if the true class appears among the five
            highest scored labels). For a decade this was the standard benchmark for vision models,
            and pretrained ImageNet weights are still the usual starting point for fine tuning on
            smaller mission datasets.
          </p>
          <p>
            <strong>AlexNet</strong> (Krizhevsky, Sutskever, Hinton) cut ILSVRC top-5 error from
            26.2% to 16.4% in 2012, the first clear GPU trained CNN win. ReLU, dropout, and data
            augmentation mattered as much as the eight layer architecture.
          </p>
          <Callout label="Reference">
            <a
              className="underline"
              href="https://papers.nips.cc/paper_files/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html"
              target="_blank"
              rel="noreferrer"
            >
              Krizhevsky, Sutskever, Hinton 2012
            </a>
            {" · "}
            <a className="underline" href="https://image-net.org/" target="_blank" rel="noreferrer">
              image-net.org
            </a>
          </Callout>
        </div>
      ),
      viz: <ImageNetLeap />,
    },
    {
      id: "ch07-08",
      title: "CNN evolution",
      eyebrow: "Architectures",
      layout: "fullViz",
      content: null,
      viz: (
        <ArchTimeline
          entries={[
            { year: 1998, name: "LeNet-5", detail: "5 layers · digits", params: "60 K" },
            { year: 2012, name: "AlexNet", detail: "ReLU · dropout · GPU", params: "60 M" },
            { year: 2014, name: "VGG-16", detail: "uniform 3×3 stack", params: "138 M" },
            { year: 2014, name: "GoogLeNet", detail: "inception modules", params: "6 M" },
            { year: 2015, name: "ResNet-152", detail: "residual blocks", params: "60 M" },
            { year: 2017, name: "DenseNet", detail: "feature reuse" },
            { year: 2019, name: "EfficientNet", detail: "compound scaling" },
            { year: 2020, name: "ViT", detail: "transformer for vision", params: "86 M" },
          ]}
        />
      ),
    },
    {
      id: "ch07-09",
      title: "Skip connections",
      eyebrow: "ResNet",
      layout: "split",
      content: (
        <div className="space-y-4">
          <MBlock>{"y = F(x) + x"}</MBlock>
          <p>
            Residual shortcuts keep gradients flowing in deep networks — directly addressing the
            vanishing gradient problem from chapter 5. ResNet-152 won ImageNet 2015 with 3.6%
            top-5 error.
          </p>
          <Callout label="Reference">
            <a className="underline" href="https://arxiv.org/abs/1512.03385" target="_blank" rel="noreferrer">
              He et al. 2015
            </a>
          </Callout>
        </div>
      ),
      viz: <SkipBlock />,
    },
    {
      id: "ch07-10",
      title: "ResNet depth",
      eyebrow: "Visualization",
      layout: "split",
      content: (
        <p>
          Adding layers without shortcuts hurt accuracy past ~30 layers. With shortcuts, 100+
          layer networks train normally.
        </p>
      ),
      viz: <ResNetDepth />,
    },
    {
      id: "ch07-11",
      title: "Chapter summary",
      eyebrow: "Summary",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p><strong>Pipeline:</strong> conv → activation → pool → stack → residual skip → classifier head.</p>
          <p>Next: chapter 9 — computer vision tasks (classification, detection, segmentation).</p>
        </div>
      ),
    },
  ],
};
