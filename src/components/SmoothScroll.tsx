"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let activeLenis: Lenis | null = null;

/** Smooth-scroll to a document y. Falls back to native scrolling when Lenis is off (reduced motion). */
export function scrollToY(y: number): void {
  if (activeLenis) {
    activeLenis.scrollTo(y, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
  } else {
    window.scrollTo({ top: y });
  }
}

/** Lenis drives scroll; its ticks are forwarded to ScrollTrigger via GSAP's ticker. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.075, wheelMultiplier: 0.9 });
    activeLenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      activeLenis = null;
    };
  }, []);

  return <>{children}</>;
}
