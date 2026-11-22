"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { HERO } from "@/content/site";
import { PixelField } from "./PixelField";
import { Scramble } from "./Scramble";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Pixel arrow on an 8x8 grid so it stays crisp at any size. */
function PixelArrow() {
  const on = [0, 1, 2, 3, 4, 8, 16, 24, 32, 9, 18, 27, 36, 45];
  return (
    <svg viewBox="0 0 8 8" aria-hidden="true" className="size-16 md:size-20" shapeRendering="crispEdges">
      {on.map((i) => (
        <rect key={i} x={i % 8} y={Math.floor(i / 8)} width="1" height="1" fill="currentColor" />
      ))}
    </svg>
  );
}

/**
 * Cream band + blue block. On desktop the section pins and, as you scroll, the
 * band collapses while the side panel's edge sweeps left over the skyline until
 * the blue fills the screen and hands over to Services (same blue).
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top top+=48", end: "+=110%", pin: true, scrub: 0.8, invalidateOnRefresh: true },
        });
        tl.to("[data-band]", { height: 0, ease: "power1.inOut", duration: 0.5 }, 0)
          .to("[data-side-content]", { autoAlpha: 0, duration: 0.25 }, 0.1)
          .to("[data-side]", { width: "100%", ease: "power2.inOut", duration: 0.75 }, 0.2)
          .to("[data-side]", { borderLeftColor: "rgb(244 242 232 / 0)", duration: 0.05 }, 0.95);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" className="flex flex-col md:h-[calc(100svh-3rem)]">
      <div data-band className="overflow-hidden md:h-[13rem]">
        <div className="grid gap-6 px-6 py-12 md:grid-cols-[1.2fr_1fr] md:px-24 md:py-16">
          <h1 className="font-display text-[clamp(2.25rem,4.4vw,3.75rem)] font-light leading-[1.08] tracking-[-0.02em]">
            <Scramble text="Production software," className="block" />
            <Scramble text="at 10x speed." delay={0.6} className="block" />
          </h1>
          <p className="max-w-md text-sm leading-relaxed md:justify-self-end md:pt-2 md:text-base">
            <Scramble text={HERO.lead} speed={8} delay={0.3} />
          </p>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden bg-azure text-paper max-md:flex max-md:flex-col">
        <div className="relative h-72 md:absolute md:inset-0 md:h-auto">
          <PixelField mode="tetris" className="absolute inset-0 size-full" />
        </div>
        <div data-side className="grid grid-rows-[auto_1fr] border-paper/70 bg-azure md:absolute md:inset-y-0 md:right-0 md:w-[22rem] md:border-l">
          <div data-side-content className="border-b border-paper/70 p-8">
            <p className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight">Senior-led.<br />AI-assisted.<br />Human-reviewed.</p>
          </div>
          <div className="flex min-h-[14rem] flex-col justify-between p-8">
            <PixelArrow />
            <a data-side-content href="#contact" className="self-end bg-paper px-5 py-3 text-sm text-azure transition-colors duration-150 hover:bg-paper-2">
              {HERO.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
