---
title: AI Learning
emoji: 🐝
colorFrom: yellow
colorTo: gray
sdk: docker
app_port: 7860
pinned: false
short_description: From perceptrons to the Nectar SDK detection workflow.
---

# AI Learning — Black Bee Drones

A Next.js + TypeScript presentation that walks from "what is AI" to a deep
tour of the [Nectar SDK](https://github.com/Black-Bee-Drones/nectar-sdk)
detection workflow. Designed as a live, in-room talk to a teammate joining
from the hardware side.

Hosted at <https://huggingface.co/spaces/blackbeedrones/ai-learning>.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

Production build identical to what the Space runs:

```bash
docker build -t ai-learning .
docker run --rm -p 7860:7860 ai-learning
# open http://localhost:7860
```

## Navigation

- **Cover** (`/`) lists every chapter.
- Inside a chapter:
  - `→` / `Space` — next slide (rolls into next chapter at the end)
  - `←` — previous slide
  - `↑` / `↓` — previous / next chapter
  - Dots in the footer — jump to a specific slide

## Layout

```
ai-learning/
├─ app/                          # Next.js App Router
│  ├─ page.tsx                   # Cover
│  └─ chapter/[slug]/page.tsx    # SlideRunner over a chapter manifest
├─ content/
│  ├─ chapters.ts                # Ordered chapter list
│  └─ slides/                    # One .tsx per chapter, slide objects
├─ components/
│  ├─ chrome/                    # SlideChrome · ProgressDots · CoverKeys
│  ├─ slide/                     # Slide · SlideRunner
│  ├─ math/                      # KaTeX wrappers
│  ├─ ui/                        # Kbd · Callout · CodeBlock
│  └─ viz/                       # ≈ 30 visualisation primitives
├─ lib/
│  ├─ hooks/                     # useKey · useReducedMotion · useInView
│  └─ utils.ts
├─ Dockerfile                    # HF Space build (Node 20-slim)
├─ next.config.mjs               # output: "standalone"
└─ tailwind.config.ts
```

## Chapters

| #  | Slug             | Title                       |
|----|------------------|-----------------------------|
| 1  | `what-is-ai`     | What is AI                  |
| 2  | `data`           | Data                        |
| 3  | `paradigms`      | Learning paradigms          |
| 4  | `classical-ml`   | Classical machine learning  |
| 5  | `deep-learning`  | Deep learning foundations   |
| 6  | `blocks`         | Architectural blocks        |
| 7  | `cv-tasks`       | Computer vision tasks       |
| 8  | `detection`      | Object detection            |
| 9  | `lifecycle`      | Training and evaluation     |
| 10 | `deployment`     | Deployment to the edge      |
| 11 | `nectar`         | The Nectar AI module        |
| 12 | `closing`        | Closing                     |

## Stack

- Next.js 14 (App Router) + TypeScript, strict mode
- Tailwind CSS with custom design tokens
- Framer Motion for transitions and primitive animations
- KaTeX for inline / block math
- HTML Canvas for the convolution, augmentation gallery, loss surface,
  decision boundary
- D3 reserved for future curves (light dependency)

## Editing content

Each chapter lives in `content/slides/chXX-*.tsx` as an array of `Slide`
objects. To add or reorder slides, edit the array — no router changes
needed. The slide manifest contract is in `components/slide/types.ts`.

## Reduced motion

Auto-running animations (loss surface, convolution, augmentations, agent
loop, gradient descent) honour `prefers-reduced-motion: reduce` and either
freeze on a representative frame or stop iterating.

## License

For internal Black Bee Drones use.
