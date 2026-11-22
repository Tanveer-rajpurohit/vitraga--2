"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Site-wide GSAP reveals. CSS holds each element in its hidden start state so
 * nothing flashes before hydration.
 *
 * Line work is scrubbed to the scroll position (smooth, and it undraws when you
 * scroll back), the way the reference draws its hairlines:
 *   .wipe    panels drawn in left to right
 *   .line-x  a rule that grows from the left
 *   .line-y  a rule that grows downward across its element
 * Objects play once as they enter:
 *   .pop  drops in from above   .slide-in  from the right   .rise  lifts from below
 */
export function RevealOnScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const scrub = (selector: string, vars: gsap.TweenVars, start: string, end: string) =>
        gsap.utils.toArray<Element>(selector).forEach((el) =>
          gsap.to(el, { ...vars, ease: "none", scrollTrigger: { trigger: el, start, end, scrub: 0.8 } }),
        );
      scrub(".wipe", { clipPath: "inset(0 0% 0 0)" }, "top 92%", "top 50%");
      scrub(".line-x", { scaleX: 1 }, "top 95%", "top 65%");
      scrub(".line-y", { scaleY: 1 }, "top 80%", "bottom 75%");

      const batch = (selector: string, vars: gsap.TweenVars, stagger: number) =>
        ScrollTrigger.batch(selector, {
          start: "top 88%",
          once: true,
          onEnter: (els) => gsap.to(els, { ...vars, stagger, overwrite: true }),
        });
      batch(".pop", { autoAlpha: 1, y: 0, duration: 0.9, ease: "back.out(1.6)" }, 0.18);
      batch(".slide-in", { x: 0, duration: 1.2, ease: "power3.out" }, 0.12);
      batch(".rise", { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out" }, 0.08);
      ScrollTrigger.refresh();
    });
    return () => ctx.revert();
  }, []);
  return null;
}
