import type { Chapter } from "@/components/slide/types";
import { PerceptronDiagram } from "@/components/viz/PerceptronDiagram";
import { NeuronNetwork } from "@/components/viz/NeuronNetwork";
import { ActivationsPlot } from "@/components/viz/ActivationsPlot";
import { LossSurface } from "@/components/viz/LossSurface";
import { GradDescentExplainer } from "@/components/viz/GradDescentExplainer";
import { BackpropChain } from "@/components/viz/BackpropChain";
import { RegularizationViz } from "@/components/viz/RegularizationViz";
import { Callout } from "@/components/ui/Callout";
import { M, MBlock } from "@/components/math/Math";

const PLAYGROUNDS = [
  {
    name: "Neural Network Playground",
    url: "https://playground.tensorflow.org/",
    note: "TensorFlow · the original interactive playground",
  },
  {
    name: "Samuel's NN Playground",
    url: "https://samuellimabraz.github.io/#nn-playground",
    note: "custom build · same idea, our notation",
  },
];

export const ch05: Chapter = {
  id: "ch05",
  number: 5,
  slug: "deep-learning",
  title: "Deep learning foundations",
  subtitle: "From a single neuron to a trained network",
  slides: [
    {
      id: "ch05-00",
      title: "The perceptron",
      eyebrow: "1958 · Rosenblatt",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Inputs <M>x_i</M> are multiplied by weights <M>w_i</M>, summed
            with a bias <M>b</M>, and passed through an activation:
          </p>
          <MBlock>{"y = \\sigma\\!\\Big(\\sum_{i=1}^{n} w_i x_i + b\\Big)"}</MBlock>
          <ul className="space-y-2 text-[14px] text-ink/85">
            <li>· <strong>Inputs</strong> <M>x_i</M> — the features.</li>
            <li>· <strong>Weights</strong> <M>w_i</M> — what the neuron learns.</li>
            <li>· <strong>Bias</strong> <M>b</M> — shifts the boundary.</li>
            <li>· <strong>Activation</strong> <M>{"\\sigma"}</M> — non-linear squash.</li>
          </ul>
          <Callout label="Reference">
            Rosenblatt (1958){" "}
            <a className="underline" href="https://psycnet.apa.org/record/1959-09865-001" target="_blank" rel="noreferrer">
              The Perceptron — a probabilistic model
            </a>
          </Callout>
        </div>
      ),
      viz: <PerceptronDiagram />,
    },
    {
      id: "ch05-01",
      title: "A perceptron is logistic regression",
      eyebrow: "Same machine, two names",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>
            Pick <M>{"\\sigma"}</M> = sigmoid; the perceptron computes:
          </p>
          <MBlock>{"y = \\sigma(w^\\top x + b) = \\frac{1}{1 + e^{-(w^\\top x + b)}}"}</MBlock>
          <p>
            That is exactly logistic regression. One neuron can only separate
            data with a hyperplane — fine for linearly separable problems,
            useless for the moons we saw in chapter 4.
          </p>
          <Callout label="The unlock">
            Stack neurons in <em>layers</em> with non-linear activations between
            them. Each layer can learn features built from the previous layer's
            outputs.
          </Callout>
        </div>
      ),
    },
    {
      id: "ch05-02",
      title: "Activations",
      eyebrow: "Why non-linearities matter",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Without a non-linearity, stacked linear layers collapse into one
            linear layer:
            <M>{"\\,W_2(W_1 x + b_1) + b_2 = (W_2 W_1) x + (W_2 b_1 + b_2)"}</M>.
          </p>
          <ul className="space-y-2 text-[14px] text-ink/85">
            <li><strong>Sigmoid</strong> · bounded, saturates → vanishing gradient.</li>
            <li><strong>Tanh</strong> · zero-centred, still saturates.</li>
            <li><strong>ReLU</strong> · sparse, cheap, dominant since AlexNet.</li>
            <li><strong>GELU / SiLU</strong> · smooth ReLU, default in transformers.</li>
          </ul>
        </div>
      ),
      viz: <ActivationsPlot />,
    },
    {
      id: "ch05-03",
      title: "Stacking neurons and layers",
      eyebrow: "Width × depth",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            More neurons in a layer (<strong>width</strong>) → more directions
            the layer can span. More layers (<strong>depth</strong>) → features
            of features of features.
          </p>
          <MBlock>{"h^{(\\ell)} = \\phi\\!\\big(W^{(\\ell)} h^{(\\ell-1)} + b^{(\\ell)}\\big)"}</MBlock>
          <p>
            Two layers can already approximate any continuous function on a
            bounded domain (universal approximation), but in practice depth is
            far more parameter-efficient than width.
          </p>
          <Callout>
            The hidden layer pulses on the right show how activations propagate
            forward layer-by-layer.
          </Callout>
        </div>
      ),
      viz: <NeuronNetwork layers={[3, 5, 4, 2]} />,
    },
    {
      id: "ch05-04",
      title: "Try it yourself",
      eyebrow: "Playground",
      layout: "prose",
      content: (
        <div className="space-y-5">
          <p>
            The fastest way to feel how layers, activations, and learning rate
            interact is to build a tiny network in a browser and watch it
            train.
          </p>
          <div className="flex flex-col gap-3">
            {PLAYGROUNDS.map((p) => (
              <a
                key={p.url}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 rounded-md border border-ink/40 bg-surface px-5 py-3 transition hover:border-ink hover:bg-bone"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                  Open
                </span>
                <span className="font-serif text-lg text-ink">{p.name}</span>
                <span className="ml-auto font-mono text-[11px] text-muted">
                  {p.note}
                </span>
                <span className="font-mono text-[11px] text-muted">↗</span>
              </a>
            ))}
          </div>
          <p className="text-muted">
            Things to look for: how the spiral dataset needs ≥ 2 hidden layers;
            how ReLU vs sigmoid affects convergence; how a too-large learning
            rate explodes; how regularisation smooths the boundary.
          </p>
        </div>
      ),
    },
    {
      id: "ch05-05",
      title: "Loss functions",
      eyebrow: "What we minimise",
      layout: "prose",
      content: (
        <div className="space-y-5">
          <div>
            <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              Regression — MSE
            </div>
            <MBlock>{"\\mathcal{L} = \\frac{1}{N}\\sum_i (y_i - \\hat y_i)^2"}</MBlock>
          </div>
          <div>
            <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              Binary classification — BCE
            </div>
            <MBlock>
              {"\\mathcal{L} = -\\frac{1}{N}\\sum_i y_i \\log \\hat p_i + (1-y_i) \\log(1-\\hat p_i)"}
            </MBlock>
          </div>
          <div>
            <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              Multi-class — categorical cross-entropy
            </div>
            <MBlock>{"\\mathcal{L} = -\\frac{1}{N}\\sum_i \\sum_k y_{ik} \\log \\hat p_{ik}"}</MBlock>
          </div>
          <Callout label="Object detection adds three">
            Detection loss = classification + box regression (GIoU) + objectness.
            We meet them in chapter 8.
          </Callout>
        </div>
      ),
    },
    {
      id: "ch05-06",
      title: "Gradient descent",
      eyebrow: "How learning happens",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            The loss <M>L(\theta)</M> is a function of the parameters. Compute
            its gradient at the current point, take a small step against it:
          </p>
          <MBlock>{"\\theta_{t+1} = \\theta_t - \\eta\\,\\nabla_\\theta L(\\theta_t)"}</MBlock>
          <p>
            <strong>η</strong> — the learning rate. Too small: slow. Too large:
            overshoots, may diverge. The yellow tangent on the right is the
            local linear approximation; the black arrow is one update.
          </p>
          <p className="text-muted">
            For neural networks we approximate the full gradient by averaging
            over a mini-batch — that is the &quot;stochastic&quot; in SGD.
          </p>
        </div>
      ),
      viz: <GradDescentExplainer />,
    },
    {
      id: "ch05-07",
      title: "Backpropagation",
      eyebrow: "Chain rule, applied",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            The gradient of the loss w.r.t. each parameter is a product of
            local derivatives along the forward path:
          </p>
          <MBlock>
            {"\\frac{\\partial L}{\\partial w_1} = \\frac{\\partial L}{\\partial \\hat y}\\cdot\\frac{\\partial \\hat y}{\\partial z_2}\\cdot\\frac{\\partial z_2}{\\partial h}\\cdot\\frac{\\partial h}{\\partial z_1}\\cdot\\frac{\\partial z_1}{\\partial w_1}"}
          </MBlock>
          <p>
            Modern frameworks (PyTorch, JAX) build the forward graph and
            differentiate it automatically — autograd. We only have to write
            the forward pass.
          </p>
        </div>
      ),
      viz: <BackpropChain />,
    },
    {
      id: "ch05-08",
      title: "Optimisers",
      eyebrow: "Beyond plain SGD",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Same loss surface, three optimisers. Momentum damps oscillation;
            Adam adapts the per-parameter step size with running estimates of
            the gradient and its square.
          </p>
          <MBlock>{"\\theta_{t+1} = \\theta_t - \\eta\\,\\frac{\\hat m_t}{\\sqrt{\\hat v_t} + \\varepsilon}"}</MBlock>
          <p className="text-muted">
            Adam is the default in the Nectar trainers (YOLO, DETR, RF-DETR).
            SGD with momentum often wins on image classification at scale.
          </p>
        </div>
      ),
      viz: <LossSurface />,
    },
    {
      id: "ch05-09",
      title: "Why depth helps",
      eyebrow: "Width vs depth",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>
            One wide hidden layer can in principle approximate any continuous
            function (Cybenko, 1989). In practice, depth lets each layer build
            features on top of the previous one — edges → textures → parts →
            objects.
          </p>
          <p>
            Empirically, doubling the depth of a residual network costs less
            than doubling the width and learns better features. ResNet-152 is
            not deep for fashion; it is deep because deep works.
          </p>
          <Callout label="Lesson" tone="accent">
            Architecture is half the battle: matching the inductive bias of the
            model to the data — convolutions for images, attention for
            sequences. Chapter 6 unpacks the building blocks.
          </Callout>
        </div>
      ),
    },
    {
      id: "ch05-10",
      title: "Regularisation",
      eyebrow: "Keep the model honest",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            A net with millions of parameters can memorise the training set.
            We push it back toward generalising:
          </p>
          <ul className="space-y-2 text-[14px] text-ink/85">
            <li>
              <strong>Dropout</strong> · zero a random fraction of activations
              each forward pass; forces redundancy.
            </li>
            <li>
              <strong>Weight decay</strong> · add{" "}
              <M>{"\\lambda\\|W\\|^2"}</M> to the loss; punishes large weights.
            </li>
            <li>
              <strong>Early stopping</strong> · halt training when the
              validation loss starts climbing.
            </li>
            <li>
              <strong>Data augmentation</strong> · synthesise variations the
              model must handle (chapter 9).
            </li>
          </ul>
        </div>
      ),
      viz: <RegularizationViz />,
    },
  ],
};
