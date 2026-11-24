"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PILLARS = [
  {
    title: "Workflow",
    body: "Scope in week one, a clickable staging build every week after, a rollback-safe launch at the end.",
    points: ["Fixed scope and date", "Weekly staging releases", "Docs and runbooks handed over"],
  },
  {
    title: "Senior engineers",
    body: "AI drafts the first pass. A senior engineer reads, rewrites and signs off every change before it merges.",
    points: ["Every line human-reviewed", "Security and load checks", "One lead from brief to launch"],
  },
  {
    title: "Design",
    body: "Flows, interface and design system built with the product, so what you approve is what ships.",
    points: ["User flows before screens", "A real design system", "Accessible by default"],
  },
] as const;

/** The 1:1 hairline drawing is 1500 x 700; each card shows its own 500-wide third. */
const ART_W = 500;
const ART_H = 700;
const ISO = "matrix(0.866 0.5 -0.866 0.5 0 0)";

function Art() {
  const tiles = [];
  for (let i = -6; i <= 6; i++) {
    tiles.push(<path key={`a${i}`} d={`M${-420} ${i * 70}H420`} />, <path key={`b${i}`} d={`M${i * 70} -420V420`} />);
  }
  return (
    <>
      <rect width={ART_W * 3} height={ART_H} fill="#1a6ae8" />
      {/* Floor grid seen in isometric, fading toward the edges. */}
      <g transform={`translate(750 430) ${ISO}`} fill="none" stroke="#ffffff" strokeOpacity={0.22} strokeWidth={1}>{tiles}</g>
      {/* Three plates stepping up toward the centre: brief, build, launch. */}
      {[
        [330, 470, 0.8],
        [750, 360, 1.15],
        [1170, 470, 0.8],
      ].map(([x, y, k], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${k})`} strokeLinejoin="round">
          <path d="M-170 0L0 98L170 0V30L0 128L-170 30Z" fill="#1a6ae8" stroke="#ffffff" strokeWidth={1.4} />
          <path d="M-170 0L0 -98L170 0L0 98Z" fill="#ffffff" stroke="#ffffff" />
          <path d="M0 98V128" stroke="#ffffff" strokeWidth={1.4} />
          <g transform={`${ISO} scale(0.55)`} fill="none" stroke="#2b7fff" strokeWidth={3} strokeLinecap="round">
            {i === 0 && <path d="M-110 -80h150v110h-150zM-90 -50h80M-90 -25h110M-90 0h60M70 -80l50 50-50 50" />}
            {i === 1 && (
              <>
                {[0, 45, 90, 135, 180, 225, 270, 315].map((d, j) => (
                  <rect key={d} x={-14} y={-130} width={28} height={70} rx={14} transform={`rotate(${d})`} fill={j % 2 ? "#a9c9ff" : "#2b7fff"} stroke="none" />
                ))}
              </>
            )}
            {i === 2 && <path d="M-110 50l60-60 40 30 80-90M-110 -100v150h220" />}
          </g>
        </g>
      ))}
      {/* Dotted routes between the plates. */}
      <path d="M470 420C560 380 600 330 640 320M860 320C900 330 940 380 1030 420" fill="none" stroke="#ffffff" strokeWidth={1.6} strokeDasharray="2 8" strokeLinecap="round" className="flow" />
      <text x={750} y={110} textAnchor="middle" fill="#ffffff" fontSize={30} fontFamily="var(--font-space-grotesk)" fontWeight={300} letterSpacing={-0.5}>
        One brief, one team, one release
      </text>
    </>
  );
}

/**
 * Split-card section. One drawing sits across three joined panels; scrolling
 * narrows the row, opens gaps and rounds the cards, then flips each to show a
 * pillar of how we work. Fully scrubbed, so it reverses with the scroll.
 */
export function Process() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        gsap
          .timeline({ defaults: { ease: "power2.inOut" }, scrollTrigger: { trigger: root.current, start: "top top+=64", end: "+=320%", pin: true, scrub: 0.8 } })
          .fromTo(q("[data-sticky-head]"), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.25 }, 0.05)
          .fromTo(q("[data-row]"), { width: "78%" }, { width: "62%", duration: 0.3 }, 0)
          .to(q("[data-row]"), { gap: 20, duration: 0.2 }, 0.35)
          .to(q("[data-card]"), { borderRadius: 20, duration: 0.2 }, 0.35)
          .to(q("[data-card]"), { rotationY: 180, duration: 0.35, stagger: 0.06 }, 0.6)
          .to(q("[data-card='0'], [data-card='2']"), { y: 30, rotationZ: (i: number) => [-8, 8][i], duration: 0.35 }, 0.6);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="process" className="relative flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center overflow-hidden px-6 py-16 lg:py-0">
      <div data-sticky-head className="max-w-2xl text-center lg:absolute lg:top-[8%]">
        <h2 className="font-display text-[clamp(1.75rem,3vw,2.75rem)] font-light leading-[1.1] tracking-[-0.02em] text-ink">
          Three pillars, one release.
        </h2>
        <p className="mt-3 text-sm leading-relaxed">How every Vitraga project runs, from the first call to the day you own it.</p>
      </div>

      <div data-row className="mt-10 flex w-full flex-col gap-6 [perspective:1200px] lg:mt-16 lg:w-[78%] lg:flex-row lg:gap-0">
        {PILLARS.map((p, i) => (
          <div
            key={p.title}
            data-card={i}
            className={`relative mx-auto aspect-[5/7] w-full max-w-sm origin-top [transform-style:preserve-3d] lg:max-w-none lg:flex-1 ${i === 0 ? "lg:rounded-l-[20px]" : ""} ${i === 2 ? "lg:rounded-r-[20px]" : ""} max-lg:rounded-[20px]`}
          >
            <div className="absolute inset-0 overflow-hidden rounded-[inherit] [backface-visibility:hidden] max-lg:hidden">
              <svg viewBox={`${i * ART_W} 0 ${ART_W} ${ART_H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true" className="size-full">
                <Art />
              </svg>
            </div>
            <div className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[inherit] border border-line bg-paper p-8 [backface-visibility:hidden] lg:[transform:rotateY(180deg)]">
              <span className="font-mono text-sm text-ink-3">( {String(i + 1).padStart(2, "0")} )</span>
              <div>
                <h3 className="font-display text-3xl font-light">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed">{p.body}</p>
                <ul className="mt-6 space-y-2 border-t border-line pt-5 text-sm text-ink-2">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-3">
                      <span aria-hidden="true" className="h-px w-4 bg-azure" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
