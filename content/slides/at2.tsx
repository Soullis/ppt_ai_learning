import type { Chapter } from "@/components/slide/types";
import { ArchFamilyMap } from "@/components/viz/ArchFamilyMap";
import { NeuronNetwork } from "@/components/viz/NeuronNetwork";
import { RNNUnroll } from "@/components/viz/RNNUnroll";
import { AttentionMatrix } from "@/components/viz/AttentionMatrix";
import { TransformerBlock } from "@/components/viz/TransformerBlock";
import { ClipDualEncoder } from "@/components/viz/ClipDualEncoder";
import { PatchTokens } from "@/components/viz/PatchTokens";
import { FoundationModelStack } from "@/components/viz/FoundationModelStack";
import { Callout } from "@/components/ui/Callout";
import { M, MBlock } from "@/components/math/Math";

export const at2: Chapter = {
  id: "ch06",
  number: 6,
  part: 2,
  slug: "network-architectures",
  title: "Neural network architectures",
  subtitle: "From MLP to convolution, recurrence, attention, and multimodal stacks",
  slides: [
    {
      id: "ch06-00",
      title: "From MLP to structured models",
      eyebrow: "Introduction",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Chapter 5 built the training loop on a feedforward MLP: forward pass, loss,
            backpropagation, optimiser step. Every architecture family in this chapter reuses that
            exact loop. What changes is the forward pass: which operation connects one layer to the
            next.
          </p>
          <p>
            An MLP treats every input dimension as independent until a dense weight matrix mixes them.
            Real data often has structure: pixels are local, words arrive in order, images and text
            describe the same scene. Specialised layers encode that structure as an inductive bias.
          </p>
        </div>
      ),
      viz: <ArchFamilyMap />,
    },
    {
      id: "ch06-01",
      title: "Inductive bias",
      eyebrow: "Choice",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>
            Choosing an architecture is choosing what patterns the model can represent efficiently.
            A CNN assumes that useful features are local and translation invariant. An RNN assumes
            order matters and earlier tokens affect later ones. A transformer assumes any position
            may depend on any other, at the cost of more compute.
          </p>
          <div className="overflow-hidden rounded-md border border-stroke text-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-bone font-mono text-[11px] uppercase text-muted">
                  <th className="border-b border-stroke px-4 py-2">Input type</th>
                  <th className="border-b border-stroke px-4 py-2">Typical family</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Tabular features", "MLP"],
                  ["Image grid", "CNN (chapter 7)"],
                  ["Time series, text tokens", "RNN / LSTM / Transformer"],
                  ["Image + text", "Multimodal dual encoder"],
                ].map(([t, f]) => (
                  <tr key={t} className="border-b border-stroke">
                    <td className="px-4 py-2">{t}</td>
                    <td className="px-4 py-2 text-muted">{f}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      id: "ch06-02",
      title: "MLP recap",
      eyebrow: "Baseline",
      layout: "split",
      content: (
        <div className="space-y-4">
          <MBlock>{"h^{(\\ell)} = \\phi\\!\\big(W^{(\\ell)} h^{(\\ell-1)} + b^{(\\ell)}\\big)"}</MBlock>
          <p>
            Each neuron connects to every neuron in the previous layer. There is no weight sharing:
            the network must relearn the same pattern at every spatial location or time step. MLPs
            work well on tabular data and as the final classification head on top of other blocks.
          </p>
        </div>
      ),
      viz: <NeuronNetwork layers={[4, 6, 6, 3]} />,
    },
    {
      id: "ch06-03",
      title: "Recurrent networks",
      eyebrow: "Sequences",
      layout: "split",
      content: (
        <div className="space-y-4">
          <MBlock>{"h_t = \\phi(W_h h_{t-1} + W_x x_t + b)"}</MBlock>
          <p>
            At each time step the network reads one input <M>x_t</M> and updates a hidden state{" "}
            <M>h_t</M>. The same weight matrices <M>W_h</M> and <M>W_x</M> are reused at every step,
            shown in the unrolled diagram. The output at step <M>t</M> can depend on all earlier
            inputs through the chain of hidden states.
          </p>
          <p className="text-muted">
            Plain RNNs struggle on long sequences because backpropagation through time multiplies
            many Jacobian terms, the same vanishing gradient problem from chapter 5.
          </p>
        </div>
      ),
      viz: <RNNUnroll />,
    },
    {
      id: "ch06-04",
      title: "LSTM intuition",
      eyebrow: "Sequences",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>
            Long Short Term Memory (LSTM) adds a cell state <M>c_t</M> with gates that control what
            enters, stays, and leaves:
          </p>
          <ul className="space-y-2 text-[15px]">
            <li><strong>Forget gate</strong> — how much of <M>{"c_{t-1}"}</M> to discard</li>
            <li><strong>Input gate</strong> — how much new information to write into the cell</li>
            <li><strong>Output gate</strong> — how much of the cell to expose as <M>h_t</M></li>
          </ul>
          <p>
            The cell state gives gradients a path that bypasses repeated matrix multiplies, so
            signals can persist across many time steps. LSTMs dominated sequence modelling before
            transformers became standard for language.
          </p>
          <Callout label="Reference">
            <a className="underline" href="https://www.bioinf.jku.at/publications/older/2604.pdf" target="_blank" rel="noreferrer">
              Hochreiter & Schmidhuber 1997
            </a>
          </Callout>
        </div>
      ),
    },
    {
      id: "ch06-05",
      title: "Why attention",
      eyebrow: "Motivation",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>
            A fixed size hidden state compresses the entire past into one vector. For long sequences
            or when a distant token directly determines the output, that compression loses
            information. Attention lets each position read directly from every other position instead
            of routing everything through a single bottleneck.
          </p>
          <p>
            Unlike recurrence, attention steps can run in parallel over all positions once the
            inputs are known, which maps well to GPU matrix multiply. That parallelism is one reason
            transformers replaced LSTMs for large language models.
          </p>
        </div>
      ),
    },
    {
      id: "ch06-06",
      title: "Scaled dot product attention",
      eyebrow: "Attention",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Queries <M>Q</M>, keys <M>K</M>, and values <M>V</M> are linear projections of the
            input. Attention weights compare every query to every key, then mix the values:
          </p>
          <MBlock>
            {"\\mathrm{Attention}(Q,K,V) = \\mathrm{softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right)V"}
          </MBlock>
          <p className="text-muted">
            The scale <M>{"\\sqrt{d_k}"}</M> keeps dot products from growing too large before
            softmax, which would push weights toward a one hot peak and shrink gradients. Multiple
            heads run this in parallel with different projections, then concatenate.
          </p>
        </div>
      ),
      viz: <AttentionMatrix />,
    },
    {
      id: "ch06-07",
      title: "Transformer encoder block",
      eyebrow: "Block",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            One encoder block stacks self attention, a residual add, layer normalisation, a
            position wise MLP (two linear layers with GELU), then another add and norm. Stacking
            many blocks builds hierarchical representations without recurrence.
          </p>
          <p className="text-muted">
            Transformers use layer normalisation per token instead of batch normalisation from
            chapter 5, because sequence length and batch composition vary too much for reliable per
            batch statistics.
          </p>
          <Callout label="Reference">
            <a className="underline" href="https://arxiv.org/abs/1706.03762" target="_blank" rel="noreferrer">
              Vaswani et al. 2017
            </a>
          </Callout>
        </div>
      ),
      viz: <TransformerBlock />,
    },
    {
      id: "ch06-08",
      title: "CNN preview",
      eyebrow: "Spatial",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>
            Convolution replaces the dense matrix multiply with a small kernel that slides across
            the input. The same kernel weights are applied at every spatial position: local
            connectivity plus weight sharing. That is the inductive bias for images.
          </p>
          <MBlock>{"Y[i,j] = \\sum_{u,v} X[i{+}u,\\,j{+}v]\\cdot K[u,v]"}</MBlock>
          <p>
            Chapter 7 derives the math, receptive field, pooling, and the ImageNet lineage from
            LeNet through ResNet. For mission computer vision, CNN backbones remain the default
            feature extractor even when a transformer head sits on top.
          </p>
        </div>
      ),
    },
    {
      id: "ch06-09",
      title: "Multimodal models",
      eyebrow: "Fusion",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Multimodal models process more than one input type. A common pattern is dual encoders:
            one network for images, one for text, each mapping into a shared embedding space. Training
            pulls matched pairs together and pushes unrelated pairs apart, as in CLIP.
          </p>
          <p className="text-muted">
            At inference, text embeddings can rank images or images can rank text without retraining
            the encoders. Larger systems such as LLaVA attach a vision encoder to a language model
            for open ended description.
          </p>
          <Callout label="Reference">
            <a className="underline" href="https://arxiv.org/abs/2103.00020" target="_blank" rel="noreferrer">
              Radford et al. 2021 (CLIP)
            </a>
          </Callout>
        </div>
      ),
      viz: <ClipDualEncoder />,
    },
    {
      id: "ch06-10",
      title: "Combining blocks in practice",
      eyebrow: "Stacks",
      layout: "scrollProse",
      content: (
        <div className="space-y-4">
          <p>Modern models mix blocks rather than using one family alone:</p>
          <div className="overflow-hidden rounded-md border border-stroke text-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-bone font-mono text-[11px] uppercase text-muted">
                  <th className="border-b border-stroke px-4 py-2">Model</th>
                  <th className="border-b border-stroke px-4 py-2">Stack</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["ResNet", "CNN + skip connections (chapter 7)"],
                  ["ViT", "patch embed + transformer encoder (chapter 10)"],
                  ["DETR / RF-DETR", "CNN backbone + transformer decoder (chapter 11)"],
                  ["YOLO", "CNN backbone + detection head (chapter 11)"],
                ].map(([m, s]) => (
                  <tr key={m} className="border-b border-stroke">
                    <td className="px-4 py-2 font-medium">{m}</td>
                    <td className="px-4 py-2 text-muted">{s}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      id: "ch06-11",
      title: "Chapter summary",
      eyebrow: "Summary",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>
            <strong>Same train loop, different forward pass.</strong> MLP for dense mixing, RNN for
            ordered sequences, attention for direct long range links, convolution for local spatial
            structure, dual encoders for cross modal alignment.
          </p>
          <ul className="space-y-2 text-[15px] text-muted">
            <li>
              <a className="underline" href="https://arxiv.org/abs/1706.03762" target="_blank" rel="noreferrer">
                Attention Is All You Need
              </a>
            </li>
            <li>
              <a className="underline" href="https://arxiv.org/abs/1512.03385" target="_blank" rel="noreferrer">
                Deep Residual Learning (ResNet)
              </a>
            </li>
            <li>
              <a className="underline" href="https://arxiv.org/abs/2103.00020" target="_blank" rel="noreferrer">
                CLIP
              </a>
            </li>
          </ul>
          <p>Next: chapter 7 — convolutional networks. Chapter 8 — frameworks and ecosystem.</p>
        </div>
      ),
    },
    {
      id: "ch06-12",
      title: "GRU and encoder decoder seq2seq",
      eyebrow: "Reference",
      layout: "prose",
      tier: "reference",
      content: (
        <div className="space-y-4">
          <p>
            <strong>GRU</strong> merges the LSTM forget and input gates into update and reset gates,
            with fewer parameters and similar behaviour on many sequence tasks.
          </p>
          <p>
            <strong>Encoder decoder</strong> seq2seq: one RNN reads the input sequence into a
            context vector, a second RNN generates the output sequence. Attention was first added
            between encoder states and decoder steps before the full transformer replaced both sides.
          </p>
        </div>
      ),
    },
    {
      id: "ch06-13",
      title: "Vision transformer patches",
      eyebrow: "Reference",
      layout: "split",
      tier: "reference",
      content: (
        <div className="space-y-4">
          <p>
            ViT splits an image into fixed size patches, linearly embeds each patch into a token, and
            runs a standard transformer encoder. Positional embeddings tell the model where each
            patch came from. Optional reading:{" "}
            <a className="underline" href="https://arxiv.org/abs/2010.11929" target="_blank" rel="noreferrer">
              Dosovitskiy et al. 2020
            </a>.
          </p>
        </div>
      ),
      viz: <PatchTokens />,
    },
    {
      id: "ch06-14",
      title: "Foundation model training stack",
      eyebrow: "Reference",
      layout: "split",
      tier: "reference",
      content: (
        <div className="space-y-4">
          <p>
            Large models often combine paradigms from chapter 3: self supervised pretraining on broad
            data, supervised fine tuning on task labels, then alignment with human feedback. The
            architecture is usually transformer based; the training stages reuse the loop from
            chapter 5 at scale.
          </p>
        </div>
      ),
      viz: <FoundationModelStack />,
    },
  ],
};
