"use client";

import { useEffect } from "react";

type KeyHandler = (e: KeyboardEvent) => void;

export function useKey(target: string | string[], handler: KeyHandler) {
  useEffect(() => {
    const keys = Array.isArray(target) ? target : [target];
    function onKey(e: KeyboardEvent) {
      if (keys.includes(e.key)) handler(e);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [target, handler]);
}
