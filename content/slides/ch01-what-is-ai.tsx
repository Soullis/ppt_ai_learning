import type { Chapter } from "@/components/slide/types";
import { NestedVenn } from "@/components/viz/NestedVenn";
import { Timeline } from "@/components/viz/Timeline";
import { Radial } from "@/components/viz/Radial";
import { Pipeline } from "@/components/viz/Pipeline";
import { TuringTest } from "@/components/viz/TuringTest";
import { PerceptronDiagram } from "@/components/viz/PerceptronDiagram";
import { XORProblem } from "@/components/viz/XORProblem";
import { BackpropChain } from "@/components/viz/BackpropChain";
import { LeNetArchitecture } from "@/components/viz/LeNetArchitecture";
import { ImageNetLeap } from "@/components/viz/ImageNetLeap";
import { ResNetDepth } from "@/components/viz/ResNetDepth";
import { TransformerBlock } from "@/components/viz/TransformerBlock";
import { PatchTokens } from "@/components/viz/PatchTokens";
import { FoundationModels } from "@/components/viz/FoundationModels";
import { Callout } from "@/components/ui/Callout";
import { M, MBlock } from "@/components/math/Math";

export const ch01: Chapter = {
  id: "ch01",
  number: 1,
  slug: "what-is-ai",
  title: "What is AI",
  subtitle: "Definitions and a short history",
  slides: [
    {
      id: "ch01-00",
      title: "Three nested ideas",
      eyebrow: "Definitions",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            <strong className="font-medium">Artificial intelligence</strong> is the field that
            studies how to make machines do things that — when humans do them — we call
            intelligent: perceive, reason, plan, decide, act.
          </p>
          <p>
            <strong className="font-medium">Machine learning</strong> is the subset that learns the
            rules from data instead of being told them explicitly.
          </p>
          <p>
            <strong className="font-medium">Deep learning</strong> is the subset of ML that uses
            many-layered neural networks to learn its own features.
          </p>
          <Callout label="Working definition" tone="accent">
            ML programs are functions <M>f_\theta : X \to Y</M> whose parameters{" "}
            <M>\theta</M> are fit so that predictions match observed data.
          </Callout>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
            Read more —{" "}
            <a className="underline" href="https://www.deeplearningbook.org/" target="_blank" rel="noreferrer">
              Goodfellow, Bengio &amp; Courville · Deep Learning
            </a>
          </p>
        </div>
      ),
      viz: <NestedVenn />,
    },

    // ─── A SHORT HISTORY ──────────────────────────────────────────────
    {
      id: "ch01-01",
      title: "A short history",
      eyebrow: "How we got here",
      layout: "fullViz",
      viz: (
        <Timeline
          events={[
            { year: 1950, label: "Turing test", detail: "imitation game" },
            { year: 1958, label: "Perceptron", detail: "Rosenblatt", emphasis: true },
            { year: 1969, label: "XOR wall", detail: "Minsky & Papert" },
            { year: 1986, label: "Backprop", detail: "Rumelhart et al." },
            { year: 1998, label: "LeNet-5", detail: "CNN on digits" },
            { year: 2012, label: "AlexNet", detail: "ImageNet leap", emphasis: true },
            { year: 2015, label: "ResNet", detail: "skip connections" },
            { year: 2017, label: "Transformer", detail: "attention", emphasis: true },
            { year: 2020, label: "ViT · DETR", detail: "transformers in vision" },
            { year: 2024, label: "Foundation models", detail: "vision + language" },
          ]}
        />
      ),
    },
    {
      id: "ch01-02",
      title: "1950 — the imitation game",
      eyebrow: "Alan Turing",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Before there was any &quot;machine learning&quot;, Turing asked the
            question that defined the field: <em>can a machine reproduce
            intelligent behaviour convincingly enough to fool a human?</em>
          </p>
          <p>
            He proposed the <strong>imitation game</strong>. An interrogator
            exchanges typed messages with two hidden players — one human, one
            machine — and tries to tell which is which. If the interrogator
            cannot do better than chance, the machine has &quot;passed.&quot;
          </p>
          <p className="text-muted">
            The point was not the test itself but the framing: judge intelligence
            by behaviour, not by how it is built. Seventy-five years later that
            framing is still the one we use to measure language models.
          </p>
          <Callout label="Reference">
            <a className="underline" href="https://academic.oup.com/mind/article/LIX/236/433/986238" target="_blank" rel="noreferrer">
              Turing 1950 — Computing Machinery and Intelligence
            </a>
          </Callout>
        </div>
      ),
      viz: <TuringTest />,
    },
    {
      id: "ch01-03",
      title: "1958 — the first perceptron",
      eyebrow: "Frank Rosenblatt",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Rosenblatt built the first <em>trainable</em> neural model: a single
            artificial neuron that adjusts its weights from examples.
          </p>
          <MBlock>{"y = \\sigma\\!\\Big(\\sum_i w_i x_i + b\\Big)"}</MBlock>
          <p>
            It is mathematically the same machine as logistic regression. The
            neuron carves a single hyperplane through the input space. For
            problems that <em>are</em> linearly separable, it works — and that
            was enough for the New York Times to call it the embryo of an
            electronic computer that would &quot;walk, talk, see, write&quot;.
          </p>
          <Callout label="Reference">
            <a className="underline" href="https://psycnet.apa.org/record/1959-09865-001" target="_blank" rel="noreferrer">
              Rosenblatt 1958 — The Perceptron
            </a>
          </Callout>
        </div>
      ),
      viz: <PerceptronDiagram />,
    },
    {
      id: "ch01-04",
      title: "1969 — the XOR wall",
      eyebrow: "Minsky & Papert",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Minsky and Papert wrote a careful book called <em>Perceptrons</em>{" "}
            and pointed out something embarrassing. The XOR function — true if{" "}
            <em>exactly one</em> input is true — has just four points, and{" "}
            <strong>no straight line</strong> separates the two classes.
          </p>
          <p>
            A single perceptron cannot solve it. The community concluded the
            whole approach was a dead end, funding dried up, and the field
            entered the first &quot;AI winter&quot;.
          </p>
          <p>
            What was missed at the time: stack one extra layer between input
            and output, and the problem becomes trivial — each hidden unit
            carves a half-plane, and the output combines them. The right panel
            shows the fix.
          </p>
          <Callout label="The lesson" tone="warm">
            One neuron is a line; many neurons in layers are arbitrary shapes.
            Depth turns a single hyperplane into a function approximator.
          </Callout>
        </div>
      ),
      viz: <XORProblem />,
    },
    {
      id: "ch01-05",
      title: "1986 — backpropagation",
      eyebrow: "Rumelhart, Hinton & Williams",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Multi-layer networks <em>could</em> solve XOR — but how do you train
            them? Each layer's weights influence the loss only indirectly,
            through every later layer. Hand-deriving gradients was hopeless.
          </p>
          <p>
            Rumelhart, Hinton, and Williams formalised the answer:{" "}
            <strong>apply the chain rule from output to input</strong>. The
            local derivative at every node is composed into the gradient with
            respect to every parameter, in one backward pass.
          </p>
          <MBlock>
            {"\\frac{\\partial L}{\\partial w} = \\frac{\\partial L}{\\partial \\hat y}\\cdot\\frac{\\partial \\hat y}{\\partial z}\\cdot\\frac{\\partial z}{\\partial w}"}
          </MBlock>
          <p className="text-muted">
            Backprop didn't unlock deep learning instantly — computers were too
            slow and datasets were too small — but every modern framework
            (PyTorch, JAX, TensorFlow) is built around this idea.
          </p>
          <Callout label="Reference">
            <a className="underline" href="https://www.nature.com/articles/323533a0" target="_blank" rel="noreferrer">
              Rumelhart, Hinton, Williams 1986 — Learning representations by back-propagating errors
            </a>
          </Callout>
        </div>
      ),
      viz: <BackpropChain />,
    },
    {
      id: "ch01-06",
      title: "1998 — LeNet-5",
      eyebrow: "Yann LeCun",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            LeCun designed a deep network specifically for images. Instead of
            treating every pixel as an independent input, he stacked{" "}
            <strong>convolutional layers</strong> that share the same kernel
            across the whole image, plus pooling layers that summarise local
            regions.
          </p>
          <p>
            The result was tiny by today&apos;s standards — 60 K parameters —
            but it ran in production at AT&amp;T, reading roughly 10% of all
            U.S. handwritten cheques in the late 1990s.
          </p>
          <p>
            The recipe — <span className="font-mono text-[12px]">conv → ReLU → pool</span>,
            repeated, then dense layers at the end — survived almost unchanged
            into AlexNet 14 years later.
          </p>
          <Callout label="Reference">
            <a className="underline" href="http://yann.lecun.com/exdb/publis/pdf/lecun-01a.pdf" target="_blank" rel="noreferrer">
              LeCun et al. 1998 — Gradient-Based Learning Applied to Document Recognition
            </a>
          </Callout>
        </div>
      ),
      viz: <LeNetArchitecture />,
    },
    {
      id: "ch01-07",
      title: "2012 — AlexNet",
      eyebrow: "The ImageNet leap",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            For two decades, deep networks had been promising but unspectacular.
            In 2012, Alex Krizhevsky, Ilya Sutskever, and Geoffrey Hinton
            entered the ImageNet competition with a CNN trained on two GPUs.
            Their model — &quot;AlexNet&quot; — cut the top-5 error from{" "}
            <strong>26.2 % to 16.4 %</strong> in a single year.
          </p>
          <p>Three things came together:</p>
          <ul className="space-y-2 text-[14px] text-ink/85">
            <li>· <strong>Data</strong> — ImageNet provided 1.2 M labelled images.</li>
            <li>· <strong>Compute</strong> — consumer GPUs made deep training tractable.</li>
            <li>· <strong>Tricks</strong> — ReLU, dropout, and data augmentation kept it from overfitting.</li>
          </ul>
          <p className="text-muted">
            This is the moment deep learning leaves the academic margin and
            becomes the default approach in industry.
          </p>
          <Callout label="Reference">
            <a className="underline" href="https://papers.nips.cc/paper_files/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html" target="_blank" rel="noreferrer">
              Krizhevsky, Sutskever, Hinton 2012 — ImageNet Classification with Deep CNNs
            </a>
          </Callout>
        </div>
      ),
      viz: <ImageNetLeap />,
    },
    {
      id: "ch01-08",
      title: "2015 — ResNet",
      eyebrow: "Going deeper",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            After AlexNet, everyone made networks deeper — and quickly hit a
            wall. Past about 30 layers, the gradient signal got so weak that
            adding more layers <em>hurt</em> performance.
          </p>
          <p>
            Kaiming He&apos;s answer was disarmingly simple: add the input back
            to the output of each block.
          </p>
          <MBlock>{"y = F(x) + x"}</MBlock>
          <p>
            The shortcut creates a clean gradient highway. Networks of 100,
            152, even 1000 layers train normally. ResNet won ImageNet 2015 with
            <strong> 3.6 % top-5 error</strong> — the first time a model
            crossed the human baseline of about 5 %.
          </p>
          <p className="text-muted">
            Almost every architecture since — including transformers — uses
            this trick.
          </p>
          <Callout label="Reference">
            <a className="underline" href="https://arxiv.org/abs/1512.03385" target="_blank" rel="noreferrer">
              He et al. 2015 — Deep Residual Learning for Image Recognition
            </a>
          </Callout>
        </div>
      ),
      viz: <ResNetDepth />,
    },
    {
      id: "ch01-09",
      title: "2017 — Transformer",
      eyebrow: "Attention Is All You Need",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Up to 2017, the default tool for sequences was a recurrent network
            (RNN, LSTM). They processed one token at a time, which made them
            slow and bad at long-range dependencies.
          </p>
          <p>
            Vaswani and colleagues at Google replaced recurrence with{" "}
            <strong>attention</strong>: every token decides — softly,
            differentiably — which other tokens to read. The whole sequence is
            processed in parallel.
          </p>
          <MBlock>{"\\mathrm{Attn}(Q, K, V) = \\mathrm{softmax}\\!\\Big(\\frac{Q K^\\top}{\\sqrt{d_k}}\\Big) V"}</MBlock>
          <p className="text-muted">
            Originally proposed for machine translation, this block now powers
            GPT, BERT, ViT, AlphaFold, Whisper — and the DETR family that we
            use in the SDK.
          </p>
          <Callout label="Reference">
            <a className="underline" href="https://arxiv.org/abs/1706.03762" target="_blank" rel="noreferrer">
              Vaswani et al. 2017 — Attention Is All You Need
            </a>
          </Callout>
        </div>
      ),
      viz: <TransformerBlock />,
    },
    {
      id: "ch01-10",
      title: "2020 — ViT and DETR",
      eyebrow: "Transformers see",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Two papers in 2020 brought the transformer fully into computer
            vision:
          </p>
          <ul className="space-y-3 text-[14px] text-ink/85">
            <li>
              <strong>ViT</strong> (Dosovitskiy et al.) showed you can take an
              image, cut it into 16×16 patches, treat each patch as a token,
              and feed it to a vanilla transformer. With enough data, it
              matches or beats CNNs.
            </li>
            <li>
              <strong>DETR</strong> (Carion et al.) reformulated object
              detection as <em>set prediction</em>: emit N boxes in one shot,
              match them to ground truth with the Hungarian algorithm, no
              anchors, no NMS.
            </li>
          </ul>
          <p className="text-muted">
            The RF-DETR and RT-DETR detectors that ship in Nectar are direct
            descendants of these two papers.
          </p>
          <Callout label="Reference">
            <a className="underline" href="https://arxiv.org/abs/2010.11929" target="_blank" rel="noreferrer">
              Dosovitskiy et al. 2020 — ViT
            </a>
            {" · "}
            <a className="underline" href="https://arxiv.org/abs/2005.12872" target="_blank" rel="noreferrer">
              Carion et al. 2020 — DETR
            </a>
          </Callout>
        </div>
      ),
      viz: <PatchTokens />,
    },
    {
      id: "ch01-11",
      title: "2024 — foundation models",
      eyebrow: "Pretrain once, fine-tune for everything",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            The current era runs on huge models pretrained on huge unlabelled
            datasets — CLIP, DINO, MAE, SAM, GPT-4, Gemini, LLaMA. They learn a{" "}
            <strong>shared representation</strong> from raw data; specific
            tasks are obtained by fine-tuning a small head on top.
          </p>
          <p>
            For us this changes the economics: ten years ago a strong drone
            detector needed tens of thousands of labelled images. Today we can
            start from a pretrained ViT or DINOv2 backbone and reach the same
            quality with a few hundred labelled examples.
          </p>
          <p>
            RF-DETR uses exactly this — DINOv2 backbone + transformer
            detection head — which is why it converges fast on the small
            datasets we collect at competitions.
          </p>
        </div>
      ),
      viz: <FoundationModels />,
    },

    // ─── BACK TO THE BIG PICTURE ──────────────────────────────────────
    {
      id: "ch01-12",
      title: "AI is more than learning",
      eyebrow: "Sub-areas",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            ML and DL get the headlines, but the broader field has many
            techniques that we still mix into autonomous systems: search and
            planning for path-finding, knowledge representation for symbolic
            reasoning, optimisation for control.
          </p>
          <p className="text-muted">
            In a Black Bee mission, perception (ML / DL) feeds into a planner
            (search) feeding into a controller (optimisation). Each branch
            contributes.
          </p>
        </div>
      ),
      viz: (
        <Radial
          center="AI"
          nodes={[
            { label: "Search", sub: "A* · RRT" },
            { label: "Planning", sub: "task · motion" },
            { label: "Knowledge", sub: "logic · KB" },
            { label: "Perception", sub: "vision · audio" },
            { label: "ML", sub: "from data" },
            { label: "NLP", sub: "language" },
            { label: "Robotics", sub: "embodied" },
            { label: "Control", sub: "optim · RL" },
          ]}
        />
      ),
    },
    {
      id: "ch01-13",
      title: "Where AI lives in our drone",
      eyebrow: "Black Bee context",
      layout: "fullViz",
      viz: (
        <Pipeline
          steps={[
            { label: "Sensors", detail: "camera · IMU · GPS" },
            { label: "Perception", detail: "detect · segment" },
            { label: "Decision", detail: "plan · target" },
            { label: "Control", detail: "PID · setpoint" },
            { label: "Actuators", detail: "motors · servos" },
          ]}
        />
      ),
    },
    {
      id: "ch01-14",
      title: "What this presentation covers",
      eyebrow: "Roadmap",
      layout: "prose",
      content: (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              Theory
            </div>
            <ul className="space-y-2 text-[15px]">
              <li>· Data, paradigms, classical ML</li>
              <li>· Deep learning foundations</li>
              <li>· Architectural blocks: conv, attention</li>
            </ul>
          </div>
          <div>
            <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              Practice
            </div>
            <ul className="space-y-2 text-[15px]">
              <li>· Computer vision tasks · object detection</li>
              <li>· Training, evaluation, deployment to the edge</li>
              <li>· The Nectar AI module, end-to-end</li>
            </ul>
          </div>
        </div>
      ),
    },
  ],
};
