"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * lines: each line rises out of a mask.
 * chars: letters lift and untilt one after another.
 * words: words rise in a quick cascade.
 * flip:  words flip up around their baseline.
 */
export type RevealVariant = "lines" | "chars" | "words" | "flip";

const TO: Record<RevealVariant, gsap.TweenVars> = {
  lines: { yPercent: 0, y: 0, duration: 1.1, ease: "power4.out", stagger: 0.12 },
  chars: { y: 0, rotate: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out", stagger: 0.018 },
  words: { y: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out", stagger: 0.06 },
  flip: { rotateX: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out", stagger: 0.07 },
};

type Props = {
  lines: readonly string[];
  variant: RevealVariant;
  className?: string;
  delay?: number;
  /** Only self-animate below md; a parent timeline drives it on desktop. */
  mobileOnly?: boolean;
};

/** Split heading with a GSAP scroll reveal; the start pose lives in CSS (.rt-*) so nothing flashes. */
export function RevealText({ lines, variant, className, delay = 0, mobileOnly = false }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (mobileOnly && window.matchMedia("(min-width: 768px)").matches) return;
      gsap.to(ref.current?.querySelectorAll("[data-piece]") ?? [], {
        ...TO[variant],
        delay,
        scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
      });
    },
    { scope: ref },
  );

  const isMasked = variant === "lines" || variant === "chars";
  return (
    <span ref={ref} aria-label={lines.join(" ")} className={`rt-${variant} block ${className ?? ""}`}>
      {lines.map((line, li) => (
        <span key={li} aria-hidden="true" className={`block ${isMasked ? "overflow-hidden pb-[0.1em]" : "[perspective:600px]"}`}>
          {variant === "lines" && <span data-piece className="block">{line}</span>}
          {variant === "chars" &&
            line.split(" ").map((word, wi) => (
              <span key={wi} className="inline-block whitespace-nowrap">
                {Array.from(word).map((ch, ci) => (
                  <span key={ci} data-piece className="inline-block">{ch}</span>
                ))}
                {wi < line.split(" ").length - 1 && " "}
              </span>
            ))}
          {(variant === "words" || variant === "flip") &&
            line.split(" ").map((word, wi, arr) => (
              <span key={wi} data-piece className="inline-block">
                {word}
                {wi < arr.length - 1 && " "}
              </span>
            ))}
        </span>
      ))}
    </span>
  );
}
