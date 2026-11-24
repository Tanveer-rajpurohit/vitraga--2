"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import { SITE } from "@/content/site";
import { RevealText } from "./RevealText";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Quotes as published on vitraga.com. Initials are derived from the names. */
const REVIEWS = [
  { initials: "CT", name: "Christopher Teoh", role: "Co-Founder & CTO", file: "performance", quote: "Thanks to their work, we not only hit our performance targets but exceeded them. Truly impressive execution and technical depth." },
  { initials: "SV", name: "Samira Verma", role: "Head of Engineering", file: "delivery", quote: "A deeply knowledgeable partner that consistently delivers high-quality work. Detail-oriented, thorough, and communication was seamless from start to finish." },
  { initials: "CD", name: "Chloe Davies", role: "Product Director", file: "complex project", quote: "We brought them on for a complex project, and when we hit an early snag, their team navigated us through it effortlessly." },
  { initials: "SM", name: "Sean Murphy", role: "Founder & CEO", file: "SaaS launch", quote: "Their team assisted with delivering a great SaaS product for our business idea. Would absolutely partner with them again." },
  { initials: "FP", name: "Fiona Phillips", role: "VP of Operations", file: "ongoing", quote: "Always responsive, proactive across time zones, and consistently producing high-quality work." },
] as const;

// Sample figures so the layout can be judged; replace with confirmed numbers before launch.
const STATS = [
  { value: "40+", label: "Products shipped" },
  { value: "12", label: "Countries served" },
  { value: "4.9/5", label: "Average client rating" },
] as const;

/**
 * Client words presented the way we work: as a review thread. Each quote is a
 * card in a deck, tagged with what the project was about.
 * The deck advances on click or with the arrows, and the stack shifts with GSAP.
 */
export function Proof() {
  const root = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const count = REVIEWS.length;

  const { contextSafe } = useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from("[data-review]", { y: 60, autoAlpha: 0, stagger: 0.12, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: "[data-deck]", start: "top 80%", once: true } });
    },
    { scope: root },
  );

  const go = contextSafe((dir: 1 | -1) => {
    const next = (index + dir + count) % count;
    setIndex(next);
  });

  return (
    <section ref={root} className="px-6 py-24 md:px-24">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-center">
        <div>
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.75rem)] font-light leading-[1.1] tracking-[-0.02em] text-ink">
            <RevealText variant="words" lines={["What our clients say."]} />
          </h2>
          <p className="rise mt-4 max-w-md text-sm leading-relaxed">
            From early-stage startups to enterprise teams, in their own words.
          </p>
          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-6">
            {STATS.map((s) => (
              <div key={s.label} className="rise">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-mono text-2xl text-ink">{s.value}</dd>
                <dd className="mt-1 text-xs text-ink-3">{s.label}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 flex items-center gap-2">
            <button type="button" onClick={() => go(-1)} aria-label="Previous review" className="grid size-11 place-items-center rounded-lg border border-line text-ink-2 transition-colors hover:border-azure hover:text-azure active:translate-y-px">←</button>
            <button type="button" onClick={() => go(1)} aria-label="Next review" className="grid size-11 place-items-center rounded-lg border border-line text-ink-2 transition-colors hover:border-azure hover:text-azure active:translate-y-px">→</button>
            <span className="ml-3 font-mono text-xs text-ink-3">{String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span>
          </div>
        </div>

        <div data-deck className="relative h-[26rem]" aria-live="polite">
          {REVIEWS.map((r, i) => {
            const offset = (i - index + count) % count;
            return (
              <article
                key={i}
                data-review
                onClick={() => go(1)}
                aria-hidden={offset !== 0}
                className="absolute inset-x-0 top-0 cursor-pointer rounded-2xl border border-line bg-paper shadow-[0_24px_48px_-28px_rgb(13_24_40/0.25)] transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ transform: `translateY(${offset * 22}px) scale(${1 - offset * 0.05})`, zIndex: count - offset, opacity: offset > 1 ? 0.5 : 1 }}
              >
                <div className="flex items-center justify-between border-b border-line px-6 py-4">
                  <span className="font-mono text-xs text-ink-3">client review / <span className="text-ink-2">{r.file}</span></span>
                  <span className="font-mono text-[11px] tracking-[0.2em] text-azure" aria-label="5 out of 5">★★★★★</span>
                </div>
                <div className="relative p-6 md:p-8">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-full bg-azure font-mono text-[11px] text-white">{r.initials}</span>
                    <div>
                      <p className="text-sm text-ink">{r.name}</p>
                      <p className="text-xs text-ink-3">{r.role}</p>
                    </div>
                  </div>
                  <p className="mt-6 font-display text-xl font-light leading-snug text-ink-2 md:text-2xl">&ldquo;{r.quote}&rdquo;</p>
                  <div className="mt-8 flex items-center justify-between border-t border-dashed border-line pt-5 text-xs text-ink-3">
                    <span className="font-mono">verified client &middot; vitraga.com</span>
                    <a href={`mailto:${SITE.email}`} onClick={(e) => e.stopPropagation()} className="text-azure hover:underline">Ask for a reference</a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
