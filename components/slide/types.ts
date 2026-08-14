import type { ReactNode } from "react";

export type SlideLayout =
  | "title"
  | "split"
  | "scrollSplit"
  | "fullViz"
  | "wideViz"
  | "prose"
  | "scrollProse"
  | "compare";

export type SlideTier = "core" | "reference" | "deep";

export type Slide = {
  id: string;
  title: string;
  eyebrow?: string;
  layout: SlideLayout;
  content?: ReactNode;
  viz?: ReactNode;
  notes?: string;
  tier?: SlideTier;
};

export type Chapter = {
  id: string;
  number: number;
  part: number;
  title: string;
  slug: string;
  subtitle?: string;
  slides: Slide[];
};

export type CoursePart = {
  number: number;
  title: string;
  chapters: Chapter[];
};

export const PART_TITLES: Record<number, string> = {
  1: "Apresentação",
  2: "Workshop",
  3: "Referências"
};
