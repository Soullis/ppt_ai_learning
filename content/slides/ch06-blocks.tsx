import type { Chapter } from "@/components/slide/types";
import { ConvIntuition } from "@/components/viz/ConvIntuition";
import { ConvKernel } from "@/components/viz/ConvKernel";
import { PoolingDemo } from "@/components/viz/PoolingDemo";
import { AttentionMatrix } from "@/components/viz/AttentionMatrix";
import { SkipBlock } from "@/components/viz/SkipBlock";
import { ArchTimeline } from "@/components/viz/ArchTimeline";
import { RNNUnroll } from "@/components/viz/RNNUnroll";
import { PatchTokens } from "@/components/viz/PatchTokens";
import { TransformerBlock } from "@/components/viz/TransformerBlock";
import { Callout } from "@/components/ui/Callout";
import { M, MBlock } from "@/components/math/Math";

export const ch06: Chapter = {
  id: "ch06",
  number: 6,
  slug: "blocks",
  title: "Architectural blocks",
  subtitle: "Convolution · recurrence · attention · residuals",
  slides: [
    {
      id: "ch06-00",
      title: "Why we need more than dense layers",
      eyebrow: "Inductive bias",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>
            A dense layer connects every input to every output. For an HD image
            that's <M>{"3 \\times 1080 \\times 1920 \\approx 6 \\text{M}"}</M>{" "}
            inputs per output unit — and the layer learns nothing about
            <em> where </em> a pattern occurs in the image.
          </p>
          <p>
            Different domains have different structure. The right block
            encodes that structure into the architecture so the network does
            not have to discover it from scratch:
          </p>
          <ul className="space-y-2 text-[15px]">
            <li>
              · <strong>Images</strong> — local correlations, translation
              invariance → <span className="font-mono text-muted">convolution</span>.
            </li>
            <li>
              · <strong>Sequences (text, audio)</strong> — temporal order,
              long-range dependence →{" "}
              <span className="font-mono text-muted">recurrence</span> or{" "}
              <span className="font-mono text-muted">attention</span>.
            </li>
            <li>
              · <strong>Sets</strong> — order-invariance →{" "}
              <span className="font-mono text-muted">attention</span>, deep sets.
            </li>
            <li>
              · <strong>Graphs</strong> — message passing on edges →{" "}
              <span className="font-mono text-muted">graph neural networks</span>.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "ch06-01",
      title: "Convolution — the essential image block",
      eyebrow: "Locality + weight sharing",
      layout: "fullViz",
      viz: <ConvIntuition />,
    },
    {
      id: "ch06-02",
      title: "What convolution computes",
      eyebrow: "Discrete cross-correlation",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Slide a small filter <M>K</M> over an image <M>X</M> and accumulate
            the elementwise product:
          </p>
          <MBlock>{"Y[i, j] = \\sum_{u, v} X[i+u,\\,j+v]\\cdot K[u, v]"}</MBlock>
          <p>
            Toggle the kernel — the <em>same nine numbers</em> applied
            everywhere produce edge maps, blurs, sharpenings. Early conv
            kernels in CNNs converge to oriented edge detectors, just like the
            first stage of biological visual cortex (Hubel & Wiesel, 1959).
          </p>
          <Callout>
            For an output size of <M>n</M>, kernel <M>k</M>, padding <M>p</M>,
            stride <M>s</M>: <M>{"o = \\lfloor (n + 2p - k)/s \\rfloor + 1"}</M>.
          </Callout>
        </div>
      ),
      viz: <ConvKernel N={10} />,
    },
    {
      id: "ch06-03",
      title: "Pooling",
      eyebrow: "Downsample, retain salience",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Pooling layers shrink spatial resolution by summarising a small
            window. Max-pool keeps the strongest response; average-pool smooths.
          </p>
          <p>
            Two effects: the spatial size halves, the receptive field of
            following layers doubles, and the model becomes mildly invariant
            to small translations.
          </p>
          <p className="text-muted">
            Modern detectors (YOLOv8+, DETR) tend to replace pooling with
            strided convolution or learned downsampling.
          </p>
        </div>
      ),
      viz: <PoolingDemo />,
    },
    {
      id: "ch06-04",
      title: "How CNNs are stacked",
      eyebrow: "LeNet → AlexNet → VGG → ResNet",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>
            The same recipe carries from <strong>LeNet-5</strong> (LeCun,
            1998) through <strong>AlexNet</strong> (Krizhevsky et al., 2012):
          </p>
          <div className="rounded-md border border-stroke bg-surface px-5 py-4 font-mono text-[12px] leading-relaxed text-ink">
            input
            <span className="text-muted"> → </span>
            [ Conv → ReLU → Pool ]<span className="text-muted">^k</span>
            <span className="text-muted"> → </span>
            Flatten
            <span className="text-muted"> → </span>
            Dense<span className="text-muted"> → </span>
            Softmax
          </div>
          <p>
            Convolutional stages extract spatial features (edges → textures →
            parts), pooling reduces resolution, dense layers do the final
            classification. AlexNet won ImageNet 2012 by a wide margin
            (top-5 error 15.3 % vs 26.2 %) — the start of the deep-learning
            era.
          </p>
          <Callout label="Key papers" tone="accent">
            <a className="underline" href="http://yann.lecun.com/exdb/publis/pdf/lecun-01a.pdf" target="_blank" rel="noreferrer">
              LeCun et al. 1998 (LeNet-5)
            </a>
            {" · "}
            <a className="underline" href="https://papers.nips.cc/paper_files/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html" target="_blank" rel="noreferrer">
              Krizhevsky et al. 2012 (AlexNet)
            </a>
            {" · "}
            <a className="underline" href="https://arxiv.org/abs/1409.1556" target="_blank" rel="noreferrer">
              Simonyan & Zisserman 2014 (VGG)
            </a>
          </Callout>
        </div>
      ),
    },
    {
      id: "ch06-05",
      title: "CNN evolution",
      eyebrow: "Two decades of architectures",
      layout: "fullViz",
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
      id: "ch06-06",
      title: "Skip connections",
      eyebrow: "ResNet, 2015",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>Add the input back to the output of a block:</p>
          <MBlock>{"y = F(x) + x"}</MBlock>
          <p>
            The shortcut creates a clean gradient highway. Networks can be
            hundreds of layers deep without vanishing gradients. Almost every
            modern backbone — CNN, transformer, U-Net — uses this idea.
          </p>
          <Callout label="Reference">
            <a className="underline" href="https://arxiv.org/abs/1512.03385" target="_blank" rel="noreferrer">
              He et al. 2015 — Deep Residual Learning for Image Recognition
            </a>
          </Callout>
        </div>
      ),
      viz: <SkipBlock />,
    },
    {
      id: "ch06-07",
      title: "Batch normalisation",
      eyebrow: "Stabilise the activations",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>
            For each mini-batch, normalise the activations of a layer to zero
            mean and unit variance, then re-scale and re-shift with learnable
            parameters:
          </p>
          <MBlock>
            {"\\hat x = \\frac{x - \\mu_B}{\\sqrt{\\sigma_B^2 + \\varepsilon}}, \\qquad y = \\gamma\\,\\hat x + \\beta"}
          </MBlock>
          <p className="text-muted">
            Stabilises training, allows higher learning rates, mild regulariser.
            <strong> LayerNorm</strong> replaces it inside transformers
            (normalises per token rather than per batch).
          </p>
        </div>
      ),
    },
    {
      id: "ch06-08",
      title: "Recurrence",
      eyebrow: "RNN, LSTM, GRU",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            For sequences, a recurrent network shares the same cell over time
            and threads a hidden state through the steps:
          </p>
          <MBlock>{"h_t = \\phi\\!\\big(W_x x_t + W_h h_{t-1} + b\\big)"}</MBlock>
          <p>
            Plain RNNs struggle with long ranges (vanishing gradients).{" "}
            <strong>LSTM</strong> and <strong>GRU</strong> add gates that
            decide what to keep, what to forget, and what to read out.
          </p>
          <p className="text-muted">
            Transformers replaced RNNs in most large-scale applications, but
            gated recurrence is still common in tiny edge models and streaming
            inference.
          </p>
        </div>
      ),
      viz: <RNNUnroll />,
    },
    {
      id: "ch06-09",
      title: "What is a token, really?",
      eyebrow: "Sequences from images",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Attention works on a <strong>sequence of vectors</strong>. The
            domain decides what one vector represents:
          </p>
          <ul className="space-y-2 text-[14px] text-ink/85">
            <li>· <strong>Text</strong> — a sub-word from a tokenizer (BPE).</li>
            <li>· <strong>Image</strong> — a flattened patch (16×16 px in ViT).</li>
            <li>· <strong>Audio</strong> — a spectrogram frame or a learned
              chunk of waveform.</li>
            <li>· <strong>Video</strong> — a space-time tubelet.</li>
            <li>· <strong>Tabular</strong> — one feature, one column, one row.</li>
          </ul>
          <p className="text-muted">
            Vision Transformer (Dosovitskiy et al., 2020) flatten 16×16 patches
            into tokens — the diagram on the right shows how.
          </p>
        </div>
      ),
      viz: <PatchTokens />,
    },
    {
      id: "ch06-10",
      title: "Attention",
      eyebrow: "Query · Key · Value",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Each token computes how relevant every other token is to it, and
            forms a weighted sum of values:
          </p>
          <MBlock>{"\\mathrm{Attn}(Q, K, V) = \\mathrm{softmax}\\!\\Big(\\frac{Q K^\\top}{\\sqrt{d_k}}\\Big) V"}</MBlock>
          <p>
            The matrix is the softmax of <M>{"Q K^\\top"}</M>: rows are
            queries, columns are keys. Bright cells = strong attention. The
            highlighted (drone, gate) pair shows long-range routing across
            the sequence.
          </p>
        </div>
      ),
      viz: <AttentionMatrix />,
    },
    {
      id: "ch06-11",
      title: "The transformer block",
      eyebrow: "Attention + MLP + residual",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            One block stacks: multi-head self-attention → residual + LayerNorm →
            feed-forward MLP → residual + LayerNorm. Encoders use
            self-attention only; decoders add cross-attention to encoder
            outputs.
          </p>
          <p>
            Stacking N blocks gives the encoder. Vision (ViT, DETR), language
            (GPT, BERT), audio (Whisper), and protein folding (AlphaFold) are
            all variations on the same block.
          </p>
          <Callout label="Reference" tone="accent">
            <a className="underline" href="https://arxiv.org/abs/1706.03762" target="_blank" rel="noreferrer">
              Vaswani et al. 2017 — Attention Is All You Need
            </a>
            {" · "}
            <a className="underline" href="https://arxiv.org/abs/2010.11929" target="_blank" rel="noreferrer">
              Dosovitskiy et al. 2020 — Vision Transformer
            </a>
          </Callout>
        </div>
      ),
      viz: <TransformerBlock />,
    },
  ],
};
