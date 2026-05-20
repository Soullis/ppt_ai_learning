import type { ReactNode } from "react";

export type SlideLayout = "title" | "split" | "fullViz" | "prose" | "compare";

export type Slide = {
  id: string;
  title: string;
  eyebrow?: string;
  layout: SlideLayout;
  content?: ReactNode;
  viz?: ReactNode;
  notes?: string;
};

export type Chapter = {
  id: string;
  number: number;
  title: string;
  slug: string;
  subtitle?: string;
  slides: Slide[];
};
