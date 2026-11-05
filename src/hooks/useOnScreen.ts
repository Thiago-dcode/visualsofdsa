"use client";
import { useEffect, useState } from "react";
import { Ref } from "@/types";

export default function useOnScreen() {
  const [isIntersecting, setIntersecting] = useState(false);
  const [ref, setRef] = useState<Ref>(null);
  const [observer, setObserver] = useState<IntersectionObserver | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting));
    setObserver(observer);
  }, [ref]);
  useEffect(() => {
    console.log("observer", observer);
    if (!observer || !ref) return;
    observer.observe(ref);

    return () => observer.disconnect();
  }, [observer, ref]);

  return { isIntersecting, setRef };
}
