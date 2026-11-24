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

/**
 * On desktop it is tucked under the end of the hero (negative margin, no
 * background), so it reaches the top the moment the white sweep closes. Its
 * content starts hidden in CSS and plays in right then, with no blank screen
 * between. Scrolling back hides it instantly, so a fast scroll up never shows it
 * fading over the hero. Then the
 * section pins and each stretch of scroll adds one service and one slab.
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

      // A timed reveal (not scrubbed) that plays as the section arrives, so the
      // content builds in rather than already being there when the sweep ends.
      gsap
        .timeline({ defaults: { ease: "power3.out" }, scrollTrigger: { trigger: section.current, start: window.matchMedia("(min-width: 768px)").matches ? "top top+=80" : "top 75%", toggleActions: "play none none none", onLeaveBack: (self) => self.animation?.pause(0) } })
        // Go opaque the instant this section takes over, so the hero scrolling
        // away underneath (and its border) never shows through.
        .fromTo(section.current, { backgroundColor: "rgb(255 255 255 / 0)" }, { backgroundColor: "rgb(255 255 255 / 1)", duration: 0.01 }, 0)
        .fromTo(q("[data-heading] [data-piece]"), { yPercent: 110 }, { yPercent: 0, y: 0, duration: 1, ease: "power4.out", stagger: 0.1 }, 0)
        .fromTo(q("[data-lead]"), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 }, 0.2)
        .fromTo(q("[data-list]"), { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 1, ease: "power3.inOut" }, 0.3)
        .fromTo(q("[data-stack]"), { x: 160, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1.1 }, 0.35);

      trigger.current = ScrollTrigger.create({
        trigger: section.current,
        start: "top top+=64",
        end: `+=${count * 80}%`,
        pin: true,
        onUpdate: (self) => setActive(Math.min(count - 1, Math.floor(self.progress * count))),
      });
    },
    { scope: section },
  );

  const goTo = (i: number) => {
    const st = trigger.current;
    if (!st) return setActive(i);
    scrollToY(st.start + ((i + 0.5) / SERVICES.length) * (st.end - st.start));
  };

  return (
    <section ref={section} id="services" className="relative z-10 min-h-[calc(100svh-4rem)] bg-paper md:-mt-[calc(100svh-4rem)] md:bg-transparent">
      <div className="grid gap-6 px-6 py-10 md:grid-cols-[1.2fr_1fr] md:px-24">
        <h2 data-heading className="font-display text-[clamp(1.75rem,3vw,2.75rem)] font-light leading-[1.1] tracking-[-0.02em] text-ink">
          <RevealText variant="lines" mobileOnly lines={["Your product, your code,", "your call."]} />
        </h2>
        <p data-lead className="max-w-lg text-sm leading-relaxed">
          For teams that have hit the limits of off-the-shelf tools. Every product is custom-built, and the code, documentation and access are handed over to you at delivery.
        </p>
      </div>
      <div className="grid items-center gap-8 px-6 pb-10 md:grid-cols-2 md:px-24">
        <div data-list className="rounded-2xl border border-line">
          {SERVICES.map((s, i) => {
            const isShown = i <= active;
            const isOpen = i === active;
            return (
              <div key={s.name} className={`grid transition-[grid-template-rows] duration-500 ease-out ${isShown ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className={`overflow-hidden ${i > 0 && isShown ? "border-t border-line" : ""}`}>
                  <button type="button" aria-expanded={isOpen} onClick={() => goTo(i)} className={`flex w-full items-center gap-4 px-8 py-5 text-left font-display text-2xl font-light transition-colors ${isOpen ? "text-ink" : "text-ink-3 hover:text-ink"}`}>
                    <span className="font-mono text-xs text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                    {s.name}
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <p className="max-w-md px-8 pb-5 text-sm leading-relaxed">{s.body}</p>
                      <div className="flex gap-2 px-8 pb-8">
                        <a href="#contact" className="rounded-lg bg-azure px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-azure-deep">Get in touch</a>
                        <a href="#work" className="rounded-lg border border-line px-4 py-2 text-sm text-ink-2 transition-colors hover:border-azure hover:text-azure">Learn more</a>
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
