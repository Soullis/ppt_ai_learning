import type { Chapter } from "@/components/slide/types";
import { NestedVenn } from "@/components/viz/NestedVenn";
import { TradVsMLFlow } from "@/components/viz/TradVsMLFlow";
import { Timeline } from "@/components/viz/Timeline";
import { Radial } from "@/components/viz/Radial";
import { TuringTest } from "@/components/viz/TuringTest";
import { PerceptronDiagram } from "@/components/viz/PerceptronDiagram";
import { XORProblem } from "@/components/viz/XORProblem";
import { BackpropChain } from "@/components/viz/BackpropChain";
import { LeNetArchitecture } from "@/components/viz/LeNetArchitecture";
import { ImageNetLeap } from "@/components/viz/ImageNetLeap";
import { Callout } from "@/components/ui/Callout";
import { M, MBlock } from "@/components/math/Math";

export const ch01: Chapter = {
  id: "ch01",
  number: 1,
  part: 1,
  slug: "what-is-ai",
  title: "What is AI",
  subtitle: "Definitions, programming paradigms, and context",
  slides: [
    {
      id: "ch01-00",
      title: "Three nested ideas",
      eyebrow: "Definitions",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            <strong>Artificial intelligence</strong> — systems that perceive, reason, plan, and act.
            Examples: expert systems, symbolic planners, game-playing programs.
          </p>
          <p>
            <strong>Machine learning</strong> — learns statistical patterns from data instead of
            explicit rules. Improves with more examples.
          </p>
          <p>
            <strong>Deep learning</strong> — multi-layer neural networks that learn their own
            features from raw, unstructured data (images, audio, text).
          </p>
          <MBlock>{"f_\\theta : X \\to Y, \\quad \\theta \\text{ fit from data}"}</MBlock>
        </div>
      ),
      viz: <NestedVenn />,
    },
    {
      id: "ch01-01",
      title: "Traditional programming vs machine learning",
      eyebrow: "Paradigm",
      layout: "fullViz",
      viz: <TradVsMLFlow />,
    },
    {
      id: "ch01-02",
      title: "Learning from data",
      eyebrow: "Formal view",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>
            In traditional code you write <M>y = g(x)</M> explicitly — every branch and threshold.
            In ML you specify a family of functions <M>f_\theta</M> and a loss; optimisation finds{" "}
            <M>\theta</M> from labelled examples.
          </p>
          <MBlock>
            {"\\theta^* = \\arg\\min_\\theta \\frac{1}{N}\\sum_{i=1}^{N} \\ell\\big(f_\\theta(x_i), y_i\\big)"}
          </MBlock>
          <p className="text-muted">
            Chapter 2 covers what <M>x</M> and <M>y</M> look like. Chapter 3 covers learning
            paradigms. Chapter 5 covers how <M>\theta</M> is updated.
          </p>
        </div>
      ),
    },
    {
      id: "ch01-03",
      title: "A short history",
      eyebrow: "Timeline",
      layout: "fullViz",
      viz: (
        <Timeline
          events={[
            { year: 1950, label: "Turing test", detail: "behavioural criterion" },
            { year: 1958, label: "Perceptron", detail: "trainable neuron" },
            { year: 1986, label: "Backprop", detail: "multi-layer training" },
            { year: 1998, label: "LeNet", detail: "CNN for digits" },
            { year: 2012, label: "AlexNet", detail: "ImageNet result", emphasis: true },
            { year: 2015, label: "ResNet", detail: "skip connections" },
            { year: 2017, label: "Transformer", detail: "attention block" },
            { year: 2020, label: "ViT · DETR", detail: "vision transformers" },
            { year: 2024, label: "Foundation models", detail: "pretrain + fine-tune" },
          ]}
        />
      ),
    },
    {
      id: "ch01-04",
      title: "AI is more than learning",
      eyebrow: "Sub-areas",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Autonomous systems combine perception (ML), planning (search), and control
            (optimisation). On a Black Bee mission: detector → planner → PID controller.
          </p>
          <p className="text-muted">
            This course focuses on perception: data, models, training, deployment.
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
      id: "ch01-05",
      title: "Chapter summary",
      eyebrow: "Summary",
      layout: "prose",
      content: (
        <div className="space-y-3 text-[15px]">
          <p>AI ⊃ ML ⊃ DL. ML learns <M>f_\theta</M> from data instead of hand-written rules.</p>
          <p>Next: chapter 2 — what data is, how it is represented, and why quality matters.</p>
          <p className="text-muted">
            Next slides are historical appendix for self-study.
          </p>
        </div>
      ),
    },
    {
      id: "ch01-h01",
      title: "1950 — the imitation game",
      eyebrow: "History appendix",
      tier: "reference",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Turing proposed judging intelligence by behaviour: can a machine&apos;s typed responses
            be distinguished from a human&apos;s?
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
      id: "ch01-h02",
      title: "1958 — the perceptron",
      eyebrow: "History appendix",
      tier: "reference",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>Rosenblatt&apos;s trainable neuron. Full treatment in chapter 5.</p>
          <Callout label="Reference">
            <a className="underline" href="https://psycnet.apa.org/record/1959-09865-001" target="_blank" rel="noreferrer">
              Rosenblatt 1958
            </a>
          </Callout>
        </div>
      ),
      viz: <PerceptronDiagram />,
    },
    {
      id: "ch01-h03",
      title: "1969 — the XOR wall",
      eyebrow: "History appendix",
      tier: "reference",
      layout: "split",
      content: (
        <p>
          Minsky and Papert showed a single unit cannot represent XOR. Motivation for hidden layers —
          chapter 5.
        </p>
      ),
      viz: <XORProblem />,
    },
    {
      id: "ch01-h04",
      title: "1986 — backpropagation",
      eyebrow: "History appendix",
      tier: "reference",
      layout: "split",
      content: (
        <div className="space-y-4">
          <MBlock>
            {"\\frac{\\partial L}{\\partial w} = \\frac{\\partial L}{\\partial \\hat y}\\cdot\\frac{\\partial \\hat y}{\\partial z}\\cdot\\frac{\\partial z}{\\partial w}"}
          </MBlock>
          <Callout label="Reference">
            <a className="underline" href="https://www.nature.com/articles/323533a0" target="_blank" rel="noreferrer">
              Rumelhart, Hinton, Williams 1986
            </a>
          </Callout>
        </div>
      ),
      viz: <BackpropChain />,
    },
    {
      id: "ch01-h05",
      title: "LeNet and AlexNet milestones",
      eyebrow: "History appendix",
      tier: "reference",
      layout: "split",
      content: (
        <p>
          LeNet (1998) introduced conv nets for digits. AlexNet (2012) won ImageNet. Full CNN
          treatment in chapter 7.
        </p>
      ),
      viz: <LeNetArchitecture />,
    },
    {
      id: "ch01-h06",
      title: "ImageNet 2012",
      eyebrow: "History appendix",
      tier: "reference",
      layout: "split",
      content: (
        <p>Top-5 error dropped from 26.2% to 16.4% in one year — deep learning became default.</p>
      ),
      viz: <ImageNetLeap />,
    },
  ],
};
