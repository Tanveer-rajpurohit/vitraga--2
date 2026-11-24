"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  children: ReactNode;
  className?: string;
  /** Extra start delay in steps of 0.3s, for staggering boxes in a row. */
  delay?: number;
  as?: "div" | "article";
};

/**
 * Hairline box drawn with the scroll: top and left grow out of the top-left
 * corner, then right and bottom close the box, then the content lifts in.
 * One quick timed pass, so a box is never left half-drawn mid-scroll.
 */
export function DrawBox({ children, className, delay = 0, as: Tag = "div" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const q = gsap.utils.selector(ref);
      gsap
        .timeline({ delay: delay * 0.3, scrollTrigger: { trigger: ref.current, start: "top 85%", once: true } })
        .to(q("[data-edge='a']"), { scale: 1, duration: 0.5, ease: "power2.inOut" }, 0)
        .to(q("[data-edge='b']"), { scale: 1, duration: 0.5, ease: "power2.inOut" }, 0.35)
        .to(q("[data-box-body]"), { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0.3);
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={`relative ${className ?? ""}`}>
      <span aria-hidden="true" data-edge="a" className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-line" />
      <span aria-hidden="true" data-edge="a" className="pointer-events-none absolute inset-y-0 left-0 w-px origin-top scale-y-0 bg-line" />
      <span aria-hidden="true" data-edge="b" className="pointer-events-none absolute inset-y-0 right-0 w-px origin-top scale-y-0 bg-line" />
      <span aria-hidden="true" data-edge="b" className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-line" />
      <div data-box-body className="box-body h-full">{children}</div>
    </Tag>
  );
}
