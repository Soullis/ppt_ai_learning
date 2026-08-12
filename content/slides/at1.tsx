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
  slug: "deep-learning",
  title: "Deep learning foundations",
  subtitle: "Neurons, capacity, training, and the optimisation that makes it work",
  slides: [
    {
      id: "ch05-00",
      title: "What is deep learning",
      eyebrow: "Introduction",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>
            Chapter 4 covered algorithms that fit a fixed, hand chosen shape to the data: a line, a
            tree, a kernel boundary. Deep learning is the branch of machine learning that instead
            builds the function itself out of many small, identical pieces stacked on top of each
            other, called layers, and lets training decide what each piece should compute. The word
            deep simply refers to having several of these layers between the input and the output.
          </p>
          <p>
            The basic piece is the artificial neuron, a simplified model of a biological neuron
            proposed by McCulloch and Pitts in 1943 and turned into a trainable unit by Rosenblatt&apos;s
            perceptron in 1958. A single neuron computes the same thing as the logistic regression
            from chapter 4. What deep learning adds is depth, stacking many neurons in many layers so
            the network can build complex functions out of these simple parts, each layer
            transforming the representation produced by the one before it.
          </p>
          <p>
            The field went through a difficult period after Minsky and Papert showed in 1969 that a
            single neuron cannot represent even the simple XOR function, which slowed the research
            area down for over a decade. It came back once backpropagation, popularised by Rumelhart,
            Hinton, and Williams in 1986, gave a practical way to train many layers at once, and it
            became the default approach once enough labelled data and enough compute were available,
            GPU training on ImageNet in 2012 is the year usually cited for that shift. Chapter 1 has
            the full timeline. This chapter builds the training machinery in order: the neuron, why
            depth requires non-linearity, how a network is trained end to end. Chapter 6 covers the
            architecture families that reuse this same loop.
          </p>
        </div>
      ),
    },
    {
      id: "ch05-01",
      title: "The perceptron",
      eyebrow: "Unit",
      layout: "split",
      content: (
        <div className="space-y-4">
          <MBlock>{"y = \\sigma\\!\\Big(\\sum_i w_i x_i + b\\Big) = \\sigma(w^\\top x + b)"}</MBlock>
          <p>
            A perceptron takes a weighted sum of its inputs, adds a bias, and passes the result
            through an activation <M>\sigma</M>. This is exactly logistic regression from chapter 4,
            one weight per input, one bias, one non-linearity at the output. Rosenblatt built it as a
            physical machine, the Mark I Perceptron, that adjusted its own weights whenever it
            misclassified an example, the same idea of learning from mistakes that gradient based
            training generalises later in this chapter.
          </p>
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
      id: "ch05-02",
      title: "Linear limitation and the XOR problem",
      eyebrow: "Capacity",
      layout: "wideViz",
      content: (
        <div className="space-y-4">
          <p>
            A single neuron can only separate the input space with one straight line, formally one
            hyperplane. It can only solve problems where the two classes can be split by such a
            boundary, linearly separable problems.
          </p>
          <p>
            The XOR function is the classic example where this fails. It has four points,{" "}
            <M>{"(0,0),(0,1),(1,0),(1,1)"}</M>, with labels <M>{"\\{0,1,1,0\\}"}</M>. Try drawing a
            single straight line that puts the two points labelled 1 on one side and the two labelled
            0 on the other, it cannot be done, no matter where the line is placed. Minsky and Papert
            used exactly this example in 1969 to show the limit of a single neuron.
          </p>
          <p>
            The left panel below cycles through candidate lines a single perceptron could learn, none
            of them separates the classes. The right panel shows the fix: two hidden units, each
            contributing its own line, combined by an output neuron into the two diagonal regions XOR
            needs. The next two slides explain in detail why this combination works.
          </p>
        </div>
      ),
      viz: <XORProblem />,
    },
    {
      id: "ch05-02b",
      title: "XOR by hand: one training step",
      eyebrow: "Worked example",
      layout: "scrollProse",
      tier: "deep",
      notes:
        "Board script. PT: estamos achando como cada peso afeta a perda final; com a regra da cadeia obtemos as derivadas locais; o gradiente nos dá direção e magnitude em que a perda sobe mais rápido; atualizamos o peso no sentido oposto.",
      content: (
        <div className="space-y-4 text-[14px]">
          <p>
            Network: 2 inputs → 2 hidden (sigmoid) → 1 output (sigmoid). Example{" "}
            <M>{"x=(1,0)"}</M>, target <M>{"y=1"}</M>. Initial weights (illustrative):
          </p>
          <MBlock>
            {"W^{(1)}=\\begin{bmatrix}0.5&-0.5\\\\0.5&0.5\\end{bmatrix},\\ b^{(1)}=0,\\quad W^{(2)}=[1\\ {-1}],\\ b^{(2)}=0"}
          </MBlock>
          <p>
            <strong>Forward.</strong> Hidden pre activations{" "}
            <M>{"z^{(1)}=W^{(1)}x=[0.5,0.5]^\\top"}</M>, hidden activations{" "}
            <M>{"h=\\sigma(z^{(1)}\\!)\\approx[0.62,0.62]^\\top"}</M>. Output{" "}
            <M>{"\\hat p=\\sigma(W^{(2)}h)\\approx\\sigma(0)\\approx0.5"}</M>.
          </p>
          <p>
            <strong>Loss.</strong> Binary cross entropy for this one example:{" "}
            <M>{"\\mathcal{L}=-\\log\\hat p\\approx0.69"}</M>.
          </p>
          <p>
            <strong>Backward (one edge).</strong> Output delta{" "}
            <M>{"\\delta^{(2)}=\\hat p-y=-0.5"}</M>. Gradient for weight{" "}
            <M>{"W^{(2)}_1"}</M> (first hidden → output):{" "}
            <M>{"\\partial\\mathcal{L}/\\partial W^{(2)}_1=\\delta^{(2)}\\,h_1\\approx-0.31"}</M>.
            The negative sign means increasing this weight would <em>reduce</em> the loss.
          </p>
          <p>
            <strong>Update.</strong> With learning rate <M>{"\\eta=0.5"}</M>:{" "}
            <M>{"W^{(2)}_1\\leftarrow W^{(2)}_1-\\eta\\,(\\partial\\mathcal{L}/\\partial W^{(2)}_1)\\approx1.16"}</M>.
            Repeat forward and backward for the other weights and for all four XOR points each epoch.
          </p>
        </div>
      ),
    },
    {
      id: "ch05-03",
      title: "Hidden layers: stacking neurons",
      eyebrow: "Depth",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Each neuron in a layer defines its own hyperplane, exactly like the single perceptron
            above. A layer with several neurons does not draw one line, it draws several at once, one
            per neuron, cutting the input space into many regions.
          </p>
          <p>
            The next layer takes those regions as its input and recombines them, turning on for
            whatever pattern of half-planes the weights encode. This is why stacking neurons adds
            capacity: more neurons per layer means more boundaries to combine, and more layers means
            those combinations can be combined again into increasingly complex shapes.
          </p>
          <MBlock>{"h^{(\\ell)} = \\phi\\!\\big(W^{(\\ell)} h^{(\\ell-1)} + b^{(\\ell)}\\big)"}</MBlock>
          <p>
            Layer <M>\ell</M> applies a weight matrix and a bias to the previous layer&apos;s output,
            then the non-linear function <M>\phi</M> from the next slide. A network with a single
            hidden layer of enough neurons can already approximate any continuous function on a
            bounded input, the universal approximation theorem (Cybenko, 1989). In practice going
            deeper rather than only wider tends to reach the same accuracy with far fewer parameters,
            since each new layer reuses the features the previous layer already built.
          </p>
        </div>
      ),
      viz: <NeuronNetwork layers={[2, 4, 4, 1]} />,
    },
    {
      id: "ch05-04",
      title: "Why non-linearity is required",
      eyebrow: "Activations",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>
            Stacking layers only helps if something non-linear happens between them. Without it, two
            linear layers collapse into a single linear layer:
          </p>
          <MBlock>{"W_2(W_1 x + b_1) + b_2 = (W_2 W_1)x + (W_2 b_1 + b_2)"}</MBlock>
          <p>
            No matter how many layers are stacked, the composition of linear functions is still
            linear, so it still draws only one hyperplane and still cannot solve XOR. The activation
            function <M>\phi</M> applied after each layer is what lets each hidden neuron contribute
            its own bent boundary instead of being absorbed into one overall line.
          </p>
          <p>
            Adding a hidden layer and adding a non-linear activation are therefore not two separate
            fixes, they are one fix: layer plus non-linearity together are what give a network extra
            representational power. This is exactly what the right panel of the previous slide showed,
            two hidden units, each with its own boundary, combined non-linearly at the output to
            produce a shape a single line never could.
          </p>
        </div>
      ),
    },
    {
      id: "ch05-05",
      title: "Width versus depth",
      eyebrow: "Capacity",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>
            Width means adding more neurons to the same layer, which adds more independent boundaries
            at that stage. Depth means adding more layers, letting the network build features out of
            the previous layer&apos;s features, edges combine into textures, textures into parts, parts
            into objects, the pattern chapter 7 walks through for images.
          </p>
          <p>
            For a fixed number of parameters, depth is usually more efficient than width, but very
            deep networks are harder to train: longer chains of layers make backpropagation multiply
            more terms together on the way back, which is one of the reasons a network like ResNet-152
            (chapter 7) needs skip connections that let gradients bypass layers directly.
          </p>
        </div>
      ),
    },
    {
      id: "ch05-06",
      title: "Activation functions",
      eyebrow: "Activations",
      layout: "wideViz",
      content: (
        <div className="space-y-3 text-[13.5px] leading-relaxed">
          <p>
            <strong>Sigmoid</strong> <M>{"\\sigma(z){=}\\tfrac{1}{1+e^{-z}}"}</M>, derivative{" "}
            <M>{"\\sigma'(z){=}\\sigma(z)(1{-}\\sigma(z))"}</M>. Squashes to <M>{"(0,1)"}</M>, the
            first choice historically because it reads as a probability, but it saturates for large{" "}
            <M>|z|</M>: the derivative shrinks toward zero and gradients vanish through many layers.
          </p>
          <p>
            <strong>Tanh</strong> <M>{"\\tanh(z){=}\\tfrac{e^z-e^{-z}}{e^z+e^{-z}}"}</M>, derivative{" "}
            <M>{"1{-}\\tanh^2(z)"}</M>. Bounded in <M>{"(-1,1)"}</M> and zero centred, which usually
            trains a little better than sigmoid, but it still saturates at the extremes the same way.
          </p>
          <p>
            <strong>ReLU</strong> <M>{"\\mathrm{ReLU}(z){=}\\max(0,z)"}</M>, derivative{" "}
            <M>{"\\mathbb{1}_{z>0}"}</M>. Zero for negative input, identity for positive input, cheap
            to compute, never saturates for <M>z&gt;0</M>, the default in convolutional networks since
            AlexNet (2012).
          </p>
          <p>
            <strong>GELU</strong> <M>{"\\mathrm{GELU}(z){=}z\\cdot\\Phi(z)"}</M>. A smooth version of
            ReLU that lets a small negative signal through instead of a hard zero, the standard choice
            in transformers.
          </p>
          <p className="pt-1 text-muted">
            The plot compares all four on the same axes: sigmoid and tanh flatten at the extremes
            while ReLU and GELU keep growing for large positive input, the saturation difference that
            matters most once we look at how gradients travel through many layers.
          </p>
        </div>
      ),
      viz: <ActivationsPlot />,
    },
    {
      id: "ch05-07",
      title: "Entropy",
      eyebrow: "Information",
      layout: "scrollProse",
      content: (
        <div className="space-y-4">
          <p>
            Entropy measures how uncertain a probability distribution is. For discrete classes with
            probabilities <M>p_k</M>:
          </p>
          <MBlock>{"H(p) = -\\sum_k p_k \\log p_k"}</MBlock>
          <p>
            High entropy when the distribution is flat (many outcomes equally likely). Low entropy
            when one class dominates. The log is usually base 2 (bits) or natural log (nats); the
            choice only scales the number, not the ordering.
          </p>
          <p className="text-muted">
            Example: fair coin <M>{"p=(0.5,0.5)"}</M> has entropy 1 bit. Certain outcome{" "}
            <M>{"p=(1,0)"}</M> has entropy 0.
          </p>
        </div>
      ),
    },
    {
      id: "ch05-08",
      title: "Cross entropy and KL divergence",
      eyebrow: "Objective",
      layout: "scrollProse",
      content: (
        <div className="space-y-4">
          <p>
            Cross entropy compares a true distribution <M>p</M> to a predicted distribution{" "}
            <M>{"\\hat p"}</M>:
          </p>
          <MBlock>{"H(p, \\hat p) = -\\sum_k p_k \\log \\hat p_k"}</MBlock>
          <p>
            When the target is a one hot label, only one term survives. For two classes this is
            binary cross entropy (BCE). For <M>K</M> classes with softmax output:
          </p>
          <MBlock>
            {"\\mathcal{L}_{\\mathrm{CE}} = -\\frac{1}{N}\\sum_i \\sum_k y_{ik} \\log \\hat p_{ik}"}
          </MBlock>
          <p>
            KL divergence measures how much extra uncertainty <M>{"\\hat p"}</M> adds beyond the
            true distribution:
          </p>
          <MBlock>{"D_{\\mathrm{KL}}(p \\| \\hat p) = \\sum_k p_k \\log\\frac{p_k}{\\hat p_k}"}</MBlock>
          <p className="text-muted">
            When <M>p</M> is fixed, cross entropy decomposes as{" "}
            <M>{"H(p,\\hat p)=H(p)+D_{\\mathrm{KL}}(p\\|\\hat p)"}</M>. Minimising cross entropy
            therefore pushes <M>{"\\hat p"}</M> toward <M>p</M>. Knowledge distillation uses a
            teacher&apos;s soft probabilities as <M>p</M> instead of hard labels.
          </p>
        </div>
      ),
    },
    {
      id: "ch05-09",
      title: "Loss functions",
      eyebrow: "Objective",
      layout: "scrollProse",
      content: (
        <div className="space-y-4">
          <p>
            A loss function is a single number, written <M>{"\\mathcal{L}(\\theta)"}</M>, that measures
            how wrong the network&apos;s predictions are for the current parameters <M>\theta</M>.
            Training searches for the <M>\theta</M> that makes this number as small as possible on the
            training set, while a validation set is used to check the network is generalising rather
            than memorising.
          </p>
          <p>Regression problems, where the target is a number, use mean squared error:</p>
          <MBlock>{"\\mathcal{L}_{\\mathrm{MSE}} = \\frac{1}{N}\\sum_{i=1}^{N}(y_i - \\hat y_i)^2"}</MBlock>
          <p className="text-muted">
            The average squared distance between prediction and target. Squaring means large errors
            are penalised much more heavily than small ones, and the function is smooth everywhere,
            which optimisation needs.
          </p>
          <p>Classification problems use cross entropy from the previous slide. For two classes:</p>
          <MBlock>
            {"\\mathcal{L}_{\\mathrm{BCE}} = -\\frac{1}{N}\\sum_i \\big[y_i \\log \\hat p_i + (1-y_i)\\log(1-\\hat p_i)\\big]"}
          </MBlock>
          <p className="text-muted">
            It compares the predicted probability <M>{"\\hat p_i"}</M> to the true label 0 or 1, and
            grows without bound as a confident prediction gets it wrong, pushing training hard exactly
            when the model is confidently mistaken.
          </p>
          <div className="overflow-hidden rounded-md border border-stroke text-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-bone font-mono text-[11px] uppercase text-muted">
                  <th className="border-b border-stroke px-4 py-2">Task</th>
                  <th className="border-b border-stroke px-4 py-2">Typical loss</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Regression", "MSE, MAE"],
                  ["Classification", "cross-entropy"],
                  ["Detection", "cls + box (GIoU/CIoU) + objectness — ch. 11"],
                  ["Segmentation", "per-pixel CE + Dice — ch. 12"],
                ].map(([t, l]) => (
                  <tr key={t} className="border-b border-stroke">
                    <td className="px-4 py-2">{t}</td>
                    <td className="px-4 py-2 text-muted">{l}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      id: "ch05-10",
      title: "Backpropagation",
      eyebrow: "Gradients",
      layout: "scrollSplit",
      notes:
        "PT: estamos achando como cada peso afeta a perda final; com a regra da cadeia obtemos as derivadas locais; o gradiente nos dá direção e magnitude em que a perda sobe mais rápido; atualizamos o peso no sentido oposto.",
      content: (
        <div className="space-y-4">
          <p>
            Once the loss is defined, we need to know how to change every weight to make it smaller.
            For each weight, the gradient is a single number: how much the final loss would increase
            if that weight increased slightly. Backpropagation computes this by the chain rule: local
            derivatives along the path from the loss back to that weight multiply into the direction
            and magnitude of steepest increase. Gradient descent moves the weight in the opposite
            direction.
          </p>
          <p>
            The network is a composition of functions, one per layer, followed by the loss. To get the
            derivative with respect to an early weight, the chain rule multiplies together the local
            derivative of every step on the path from the loss back to that weight:
          </p>
          <MBlock>
            {"\\frac{\\partial \\mathcal{L}}{\\partial w_1} = \\frac{\\partial \\mathcal{L}}{\\partial \\hat y}\\cdot\\frac{\\partial \\hat y}{\\partial z_2}\\cdot\\frac{\\partial z_2}{\\partial h}\\cdot\\frac{\\partial h}{\\partial z_1}\\cdot\\frac{\\partial z_1}{\\partial w_1}"}
          </MBlock>
          <p>
            Read left to right: <M>{"\\partial \\mathcal{L}/\\partial \\hat y"}</M> is how sensitive the
            loss is to the final prediction, computed directly from the loss formula. Each following
            term is the local derivative of one layer with respect to its own input, how much a small
            change there changes the next quantity. Multiplying them all gives the total effect of{" "}
            <M>w_1</M> on the loss, propagated backward through every layer it passed through on the
            forward pass, which is where the name comes from.
          </p>
          <p>
            In practice the algorithm runs in two passes, shown in the diagram. The forward pass
            computes and stores every intermediate value, <M>{"z_1, h, z_2, \\hat y"}</M>, exactly as
            drawn on top. The backward pass then walks the same graph in reverse, reusing those stored
            values to compute each local derivative and multiplying as it goes, shown on the bottom.
            Every weight gets its gradient this way in a single backward pass, regardless of how many
            weights there are, which is what makes training large networks computationally feasible.
          </p>
          <p className="text-muted">
            Frameworks such as PyTorch and JAX implement this automatically, called autograd, so day
            to day the chain rule is rarely written out by hand.
          </p>
          <Callout label="From scratch">
            <a className="underline" href="https://github.com/samuellimabraz/cafedl" target="_blank" rel="noreferrer">cafedl</a> implements autograd in Java.
          </Callout>
        </div>
      ),
      viz: <BackpropChain />,
    },
    {
      id: "ch05-11",
      title: "Gradient descent",
      eyebrow: "Optimisation",
      layout: "scrollSplit",
      content: (
        <div className="space-y-4">
          <p>
            Backpropagation gives the gradient, the direction the loss increases fastest in. Gradient
            descent is the rule that uses it to update the parameters, taking a small step in the
            opposite direction since the goal is to make the loss go down:
          </p>
          <MBlock>{"\\theta_{t+1} = \\theta_t - \\eta\\,\\nabla_\\theta \\mathcal{L}(\\theta_t)"}</MBlock>
          <p>
            <M>\eta</M> is the learning rate, chosen before training, controlling how big each step is.
            Too small and training crawls, needing many more steps to reach a good solution. Too large
            and the update overshoots the minimum, sometimes making the loss worse at every step
            instead of better, diverging rather than converging.
          </p>
          <p>
            On the right, the curve is the loss as a function of a single parameter <M>\theta</M>, the
            tangent line is the local slope the gradient measures at the current point, and the
            horizontal arrow is the step the update takes, its length set by <M>\eta</M> times that
            slope. The slider changes <M>\eta</M> directly, showing how it changes whether, and how
            fast, the point settles at the minimum <M>{"\\theta^*"}</M>.
          </p>
          <p>
            Training repeats this update many times. One full pass through the training set is called
            an <strong>epoch</strong>. Within an epoch the data is split into batches (next slide), and
            each single weight update is one <strong>step</strong> or <strong>iteration</strong>. A
            typical run does tens to hundreds of epochs, each made of many steps, gradually reducing
            the loss until it stops improving on the validation set.
          </p>
        </div>
      ),
      viz: <GradDescentExplainer />,
    },
    {
      id: "ch05-12",
      title: "Batch, mini-batch, and stochastic gradient descent",
      eyebrow: "Optimisation",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Computing the exact gradient at every step means averaging over the entire training set,
            full batch gradient descent. It is accurate but expensive once the dataset has millions of
            examples, since one step then needs a full pass over all of them.
          </p>
          <MBlock>{"\\theta_{t+1} = \\theta_t - \\eta \\nabla_\\theta \\frac{1}{B}\\sum_{i \\in \\mathcal{B}} \\ell_i"}</MBlock>
          <p>
            Stochastic gradient descent instead estimates the gradient from a mini-batch of <M>B</M>{" "}
            examples at a time, commonly between 8 and 512 in practice. Each estimate is noisier than
            the full batch average, but it is far cheaper per step, and the noise itself often helps
            training avoid sharp minima that generalise poorly. <M>B=1</M> is the extreme case, one
            example per step, pure stochastic gradient descent. Most training in practice sits in
            between, a mini-batch.
          </p>
        </div>
      ),
      viz: <BatchSizeDemo />,
    },
    {
      id: "ch05-13",
      title: "Optimisers: momentum, RMSProp, Adam",
      eyebrow: "Beyond plain SGD",
      layout: "scrollSplit",
      content: (
        <div className="space-y-4">
          <p>
            Plain gradient descent treats every step independently and uses the same learning rate for
            every parameter. Three ideas build on top of it.
          </p>
          <p>
            <strong>Momentum</strong> keeps a running average of past gradients, called velocity, and
            updates using it instead of the raw gradient:
          </p>
          <MBlock>{"v_t = \\beta v_{t-1} + \\nabla_\\theta \\mathcal{L}, \\qquad \\theta_{t+1} = \\theta_t - \\eta\\, v_t"}</MBlock>
          <p className="text-muted">
            This smooths out the zig zag plain gradient descent produces on curved loss surfaces and
            keeps moving in directions that have been consistently downhill over recent steps.
          </p>
          <p>
            <strong>RMSProp</strong> keeps a running average of the squared gradient for every
            parameter and divides the step by its square root:
          </p>
          <MBlock>
            {"s_t = \\beta s_{t-1} + (1-\\beta)(\\nabla_\\theta \\mathcal{L})^2, \\qquad \\theta_{t+1} = \\theta_t - \\frac{\\eta}{\\sqrt{s_t}+\\varepsilon}\\nabla_\\theta \\mathcal{L}"}
          </MBlock>
          <p className="text-muted">
            Parameters with large recent gradients get smaller steps, and parameters that have been
            nearly flat get relatively larger steps, effectively giving every parameter its own
            learning rate.
          </p>
          <p>
            <strong>Adam</strong> combines both, momentum for the direction and a per parameter
            adaptive step size from RMSProp:
          </p>
          <MBlock>
            {"m_t = \\beta_1 m_{t-1} + (1-\\beta_1)\\nabla_\\theta \\mathcal{L}, \\qquad v_t = \\beta_2 v_{t-1} + (1-\\beta_2)(\\nabla_\\theta \\mathcal{L})^2"}
          </MBlock>
          <MBlock>{"\\theta_{t+1} = \\theta_t - \\eta \\frac{\\hat m_t}{\\sqrt{\\hat v_t} + \\varepsilon}, \\qquad \\hat m_t = \\frac{m_t}{1-\\beta_1^t}, \\ \\hat v_t = \\frac{v_t}{1-\\beta_2^t}"}</MBlock>
          <p className="text-muted">
            Adam is the default optimiser in almost every Nectar trainer, YOLO, DETR, RF-DETR, because
            it needs little tuning and converges reliably. Plain SGD with momentum is still preferred
            for some very large scale training runs, where the extra tuning effort pays off in final
            accuracy.
          </p>
        </div>
      ),
      viz: <LossSurface />,
    },
    {
      id: "ch05-14",
      title: "Weight initialisation",
      eyebrow: "Training",
      layout: "prose",
      tier: "reference",
      content: (
        <div className="space-y-4">
          <p>
            The scale of the initial random weights matters because backpropagation multiplies many of
            them together on the way back through the network. If the initial weights are too small,
            activations shrink toward zero layer after layer, if they are too large, they grow without
            bound, both before training has even made any progress.
          </p>
          <MBlock>{"\\mathrm{Xavier:}\\quad W \\sim \\mathcal{U}\\!\\left[-\\sqrt{\\frac{6}{n_{in}+n_{out}}}, \\sqrt{\\frac{6}{n_{in}+n_{out}}}\\right]"}</MBlock>
          <MBlock>{"\\mathrm{He:}\\quad W \\sim \\mathcal{N}\\!\\left(0, \\frac{2}{n_{in}}\\right) \\quad \\text{(for ReLU)}"}</MBlock>
          <p>
            Both choose the random scale so the variance of the signal stays roughly constant from
            layer to layer. Xavier is derived for sigmoid or tanh, He accounts for the fact that ReLU
            zeroes out half of its input on average, and uses a wider spread to compensate.
          </p>
        </div>
      ),
    },
    {
      id: "ch05-15",
      title: "Vanishing and exploding gradients",
      eyebrow: "Training",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            The chain rule at the heart of backpropagation multiplies one local derivative per layer.
            If most of these derivatives are smaller than one, as happens once sigmoid or tanh
            saturate, the product shrinks toward zero across many layers, the earliest layers get
            almost no gradient and effectively stop learning, called vanishing gradients. If the local
            derivatives or the weights are consistently larger than one, the product grows without
            bound instead, exploding gradients, and updates become unstable, jumping far in a single
            step.
          </p>
          <p>
            ReLU helps because its derivative is exactly one for any positive input, so it does not
            shrink the signal along that path, and skip connections (chapter 7) give the gradient an
            extra route that bypasses several layers entirely. The buttons on the right compare how
            gradient magnitude behaves layer by layer in each regime.
          </p>
        </div>
      ),
      viz: <GradientFlowDemo />,
    },
    {
      id: "ch05-16",
      title: "Batch normalisation",
      eyebrow: "Stabilisation",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>
            As training updates the weights of early layers, the distribution of activations reaching
            later layers keeps shifting, forcing those later layers to constantly readjust. Batch
            normalisation fixes the scale of activations at every layer by normalising them within
            each mini-batch:
          </p>
          <MBlock>
            {"\\hat x = \\frac{x - \\mu_B}{\\sqrt{\\sigma_B^2 + \\varepsilon}}, \\quad y = \\gamma \\hat x + \\beta"}
          </MBlock>
          <p>
            <M>\mu_B</M> and <M>{"\\sigma_B^2"}</M> are the mean and variance computed over the current
            batch. <M>\gamma</M> and <M>\beta</M> are learned parameters that let the network undo the
            normalisation if that turns out to help, so it never removes capacity, only stabilises the
            starting point, and it allows using a larger learning rate safely. Transformers normalise
            per token instead of per batch, called layer normalisation, since sequence length and
            batch composition vary too much for a per batch statistic to be reliable there.
          </p>
          <Callout label="Reference">
            <a className="underline" href="https://arxiv.org/abs/1502.03167" target="_blank" rel="noreferrer">
              Ioffe & Szegedy 2015
            </a>
          </Callout>
        </div>
      ),
    },
    {
      id: "ch05-17",
      title: "Regularisation",
      eyebrow: "Generalisation",
      layout: "split",
      content: (
        <div className="space-y-3">
          <p className="text-[14px] text-muted">
            A network with enough capacity can memorise the training set instead of learning the
            general pattern, the overfitting problem from chapter 4. These techniques fight it
            directly:
          </p>
          <ul className="space-y-2 text-[14px]">
            <li><strong>Dropout</strong> — zero random activations during training</li>
            <li><strong>Weight decay</strong> — add <M>{"\\lambda\\|W\\|^2"}</M> to loss</li>
            <li><strong>Early stopping</strong> — halt when val loss rises</li>
            <li><strong>Augmentation</strong> — chapter 13</li>
          </ul>
        </div>
      ),
      viz: <RegularizationViz />,
    },
    {
      id: "ch05-18",
      title: "Beyond the MLP",
      eyebrow: "Preview",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>
            This chapter built the universal training loop on a feedforward MLP: forward pass, loss,
            backpropagation, optimiser step. The same loop applies to every architecture family.
          </p>
          <p>
            Specialised layers change the forward pass only: convolution for local spatial structure,
            recurrence for sequences, attention for direct links between distant positions. Chapter 6
            covers each family with its defining operation and diagram. Chapter 7 goes deep on
            convolution for computer vision.
          </p>
        </div>
      ),
    },
    {
      id: "ch05-19",
      title: "PyTorch minimal example",
      eyebrow: "Code",
      layout: "scrollProse",
      content: (
        <CodeBlock language="python" filename="train_step.py">
{`import torch, torch.nn as nn

model = nn.Sequential(
    nn.Linear(784, 128), nn.ReLU(),
    nn.Linear(128, 10),
)
opt = torch.optim.Adam(model.parameters(), lr=1e-3)
loss_fn = nn.CrossEntropyLoss()

for x, y in loader:
    opt.zero_grad()
    logits = model(x.view(x.size(0), -1))
    loss = loss_fn(logits, y)
    loss.backward()
    opt.step()`}
        </CodeBlock>
      ),
    },
    {
      id: "ch05-20",
      title: "Interactive demos",
      eyebrow: "Practice",
      layout: "prose",
      tier: "reference",
      content: (
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            {PLAYGROUNDS.map((p) => (
              <a key={p.url} href={p.url} target="_blank" rel="noreferrer" className="underline text-[15px]">
                {p.name} — {p.note} ↗
              </a>
            ))}
          </div>
          <Callout>
            <a className="underline" href="https://github.com/samuellimabraz/cafedl" target="_blank" rel="noreferrer">
              cafedl QuickDraw
            </a>{" "}
            — train a sketch classifier and play the game after understanding the training loop.
          </Callout>
        </div>
      ),
    },
    {
      id: "ch05-21",
      title: "Chapter summary",
      eyebrow: "Summary",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>
            <strong>Train loop:</strong> the forward pass computes a prediction, the loss compares it
            to the target, backpropagation computes every gradient by the chain rule, and the
            optimiser uses those gradients to update every parameter. Repeat for many epochs.
          </p>
          <div className="overflow-hidden rounded-md border border-stroke text-sm">
            <table className="w-full border-collapse">
              <tbody>
                {[
                  ["Loss", "MSE for regression, cross-entropy for classification"],
                  ["Backprop", "chain rule, one local derivative per layer"],
                  ["Learning rate η", "step size; too large diverges, too small crawls"],
                  ["Batch size B", "SGD noise vs compute per step"],
                  ["Optimiser", "Adam default; SGD with momentum at scale"],
                  ["Depth / width", "capacity vs overfitting and trainability"],
                  ["Init", "Xavier / He, keeps signal scale stable"],
                  ["Regularisation", "dropout, weight decay, early stopping, augmentation"],
                ].map(([k, v]) => (
                  <tr key={k} className="border-b border-stroke">
                    <td className="px-4 py-2 font-medium">{k}</td>
                    <td className="px-4 py-2 text-muted">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>Next: chapter 6 — architecture families. Chapter 7 — convolutions. Chapter 8 — frameworks.</p>
        </div>
      ),
    },
  ],
};
