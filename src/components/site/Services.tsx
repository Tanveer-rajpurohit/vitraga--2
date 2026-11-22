"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import { scrollToY } from "@/components/SmoothScroll";
import { SERVICES } from "@/content/site";
import { IsoStack } from "./IsoStack";
import { RevealText } from "./RevealText";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Share of the pinned scroll spent on the intro before the steps begin. */
const INTRO = 0.16;

/**
 * Pinned blue section. On desktop it is pulled up over the hero by one screen
 * (negative margin) and stays transparent and empty, so it rides up over the
 * hero's sweep unseen. When the hero pin ends this section reaches the top and
 * one scrubbed timeline takes over: its blue and content come in first, then
 * each further stretch of scroll adds one service and one slab. Everything is
 * tied to scroll position, so scrolling back reverses it cleanly.
 */
export function Services() {
  const section = useRef<HTMLElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const q = gsap.utils.selector(section);
      const count = SERVICES.length;
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: section.current,
          start: "top top+=48",
          end: `+=${count * 90}%`,
          pin: true,
          scrub: 0.6,
          onUpdate: (self) => {
            const p = (self.progress - INTRO) / (1 - INTRO);
            setActive(Math.min(count - 1, Math.max(0, Math.floor(p * count))));
          },
        },
      });
      trigger.current = tl.scrollTrigger ?? null;

      // Desktop: this section rides up over the hero transparent and empty, then
      // its blue and content scrub in from the moment it reaches the top.
      if (window.matchMedia("(min-width: 768px)").matches) {
        tl.fromTo(section.current, { backgroundColor: "rgb(7 85 181 / 0)" }, { backgroundColor: "rgb(7 85 181 / 1)", duration: 0.01 }, 0)
          .fromTo(q("[data-heading] [data-piece]"), { yPercent: 110 }, { yPercent: 0, y: 0, duration: 0.5, stagger: 0.08 }, 0)
          .fromTo(q("[data-lead]"), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5 }, 0.15)
          .fromTo(q("[data-list]"), { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.6, ease: "power2.inOut" }, 0.2)
          .fromTo(q("[data-stack]"), { x: 240, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.6 }, 0.25);
      }
      // Pad so the intro takes the first INTRO share of the pin and the steps the rest.
      const introDuration = Math.max(tl.duration(), 0.85);
      tl.to({}, { duration: (introDuration * (1 - INTRO)) / INTRO }, introDuration);
    },
    { scope: section },
  );

  const goTo = (i: number) => {
    const st = trigger.current;
    if (!st) return setActive(i);
    scrollToY(st.start + ((i + 0.5) / SERVICES.length) * (st.end - st.start));
  };

  return (
    <section ref={section} id="services" data-theme="blue" className="relative z-10 min-h-[calc(100svh-3rem)] bg-azure text-paper md:-mt-[calc(100svh-3rem)]">
      <div data-intro className="grid gap-6 px-6 py-10 md:grid-cols-[1.2fr_1fr] md:px-24">
        <h2 data-heading className="font-display text-[clamp(1.75rem,3vw,2.75rem)] font-light leading-[1.1] tracking-[-0.02em]">
          <RevealText variant="lines" mobileOnly lines={["Your product, your code,", "your call."]} />
        </h2>
        <p data-lead className="max-w-lg text-sm leading-relaxed">
          For teams that have hit the limits of off-the-shelf tools. Every product is custom-built, and the code, documentation and access are handed over to you at delivery.
        </p>
      </div>
      <div data-intro className="grid items-center gap-8 px-6 pb-10 md:grid-cols-2 md:px-24">
        <div data-list className="border border-paper/80">
          {SERVICES.map((s, i) => {
            const isShown = i <= active;
            const isOpen = i === active;
            return (
              <div key={s.name} className={`grid transition-[grid-template-rows] duration-500 ease-out ${isShown ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className={`overflow-hidden ${i > 0 && isShown ? "border-t border-paper/80" : ""}`}>
                  <button type="button" aria-expanded={isOpen} onClick={() => goTo(i)} className="block w-full px-8 py-5 text-left font-display text-2xl font-light">
                    {s.name}
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <p className="max-w-md px-8 pb-5 text-sm leading-relaxed">{s.body}</p>
                      <div className="flex gap-2 px-8 pb-8">
                        <a href="#contact" className="bg-paper px-4 py-2 text-sm text-azure transition-colors hover:bg-paper-2">Get in touch</a>
                        <a href="#work" className="border border-paper px-4 py-2 text-sm transition-colors hover:bg-paper hover:text-azure">Learn more</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div data-stack className="flex justify-center md:justify-end">
          <IsoStack active={active} count={SERVICES.length} />
        </div>
      </div>
    </section>
  );
}
