import type { Chapter } from "@/components/slide/types";
import { PerceptronDiagram } from "@/components/viz/PerceptronDiagram";
import { XORProblem } from "@/components/viz/XORProblem";
import { NeuronNetwork } from "@/components/viz/NeuronNetwork";
import { ActivationsPlot } from "@/components/viz/ActivationsPlot";
import { GradientFlowDemo } from "@/components/viz/GradientFlowDemo";
import { BatchSizeDemo } from "@/components/viz/BatchSizeDemo";
import { GradDescentExplainer } from "@/components/viz/GradDescentExplainer";
import { BackpropChain } from "@/components/viz/BackpropChain";
import { LossSurface } from "@/components/viz/LossSurface";
import { RegularizationViz } from "@/components/viz/RegularizationViz";
import { Callout } from "@/components/ui/Callout";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { M, MBlock } from "@/components/math/Math";

const PLAYGROUNDS = [
  { name: "TensorFlow Playground", url: "https://playground.tensorflow.org/", note: "original" },
  { name: "Samuel's NN Playground", url: "https://samuellimabraz.github.io/#nn-playground", note: "custom TS build" },
];

export const at1: Chapter = {
  id: "ch05",
  number: 5,
  part: 2,
  slug: "ativ-1",
  title: "Gato ou Cachorro???",
  subtitle: "Treinando modelos de classificação com Google Teachable Machine",
  slides: [
    
  ],
};
