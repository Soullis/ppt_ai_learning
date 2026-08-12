import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function pad(n: number, w = 2) {
  return n.toString().padStart(w, "0");
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function clamp(x: number, min: number, max: number) {
  return Math.min(max, Math.max(min, x));
}

export function range(n: number) {
  return Array.from({ length: n }, (_, i) => i);
}
