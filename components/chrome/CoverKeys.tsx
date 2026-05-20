"use client";

import { useRouter } from "next/navigation";
import { useKey } from "@/lib/hooks/useKey";

export function CoverKeys({ firstSlug }: { firstSlug: string }) {
  const router = useRouter();

  useKey(["ArrowDown", "ArrowRight", " ", "Enter", "PageDown"], (e) => {
    e.preventDefault();
    router.push(`/chapter/${firstSlug}`);
  });

  return null;
}
