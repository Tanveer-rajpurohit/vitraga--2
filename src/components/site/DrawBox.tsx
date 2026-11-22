"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  children: ReactNode;
  className?: string;
  /** Pushes the draw later in the scroll (0 to 1), for staggering boxes in a row. */
  delay?: number;
  as?: "div" | "article";
};

/**
 * Hairline box drawn with the scroll: top and left grow out of the top-left
 * corner, then right and bottom close the box, then the content lifts in.
 * Scrubbed, so it is continuous and undraws on the way back up.
 */
export function DrawBox({ children, className, delay = 0, as: Tag = "div" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const q = gsap.utils.selector(ref);
      const offset = Math.round(delay * 12);
      gsap
        .timeline({ scrollTrigger: { trigger: ref.current, start: `top ${94 - offset}%`, end: `top ${58 - offset}%`, scrub: 0.8 } })
        .to(q("[data-edge='a']"), { scale: 1, ease: "none", duration: 1 }, 0)
        .to(q("[data-edge='b']"), { scale: 1, ease: "none", duration: 1 }, 0.7)
        .to(q("[data-box-body]"), { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.9 }, 0.6);
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={`relative ${className ?? ""}`}>
      <span aria-hidden="true" data-edge="a" className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-current" />
      <span aria-hidden="true" data-edge="a" className="pointer-events-none absolute inset-y-0 left-0 w-px origin-top scale-y-0 bg-current" />
      <span aria-hidden="true" data-edge="b" className="pointer-events-none absolute inset-y-0 right-0 w-px origin-top scale-y-0 bg-current" />
      <span aria-hidden="true" data-edge="b" className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-current" />
      <div data-box-body className="box-body h-full">{children}</div>
    </Tag>
  );
}
