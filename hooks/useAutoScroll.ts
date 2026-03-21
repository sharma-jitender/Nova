"use client";

import { useEffect, useRef } from "react";

export function useAutoScroll(dependency: unknown, isUserScrolling = false) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isUserScrolling || !scrollRef.current) return;
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [dependency, isUserScrolling]);

  return scrollRef;
}
