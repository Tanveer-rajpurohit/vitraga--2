"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import { RevealText } from "./RevealText";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STAGES = [
  { label: "MVP", users: "100", title: "Prove it", body: "A focused first version in weeks: the core flow, real auth, real data, deployed.", tags: ["Agile sprints", "Staging every week"] },
  { label: "Launch", users: "10K", title: "Go live safely", body: "Security-first from day one: OWASP-aligned code, encrypted data flows and role-based access.", tags: ["Security audits", "CI/CD pipeline"] },
  { label: "Growth", users: "250K", title: "Stay fast", body: "Auto-scaling and load balancing keep pages quick while traffic climbs, monitored 24/7.", tags: ["Auto-scaling", "24/7 monitoring"] },
  { label: "Scale", users: "1M+", title: "Keep shipping", body: "Modular systems your team can extend, with ongoing support and iteration after launch.", tags: ["Modular architecture", "Ongoing support"] },
] as const;

/** 5 x 5 city of blocks; each block's height per stage, so the skyline grows. */
const N = 5;
const TW = 64;
const TH = 37;
function heightFor(i: number, j: number, stage: number) {
  const centre = 2 - Math.max(Math.abs(i - 2), Math.abs(j - 2));
  const seed = ((i * 7 + j * 13) % 5) / 5;
  const grown = [0.2, 0.55, 1, 1.6][stage];
  return Math.max(6, (10 + centre * 26 + seed * 22) * grown);
}

function Block({ i, j }: { i: number; j: number }) {
  const x = (i - j) * (TW / 2);
  const y = (i + j) * (TH / 2);
  return (
    <g data-block={`${i}-${j}`} transform={`translate(${x} ${y})`} data-h={heightFor(i, j, 0)}>
      <path data-side="l" fill="#eaf2ff" stroke="#2b7fff" strokeWidth={1} strokeLinejoin="round" />
      <path data-side="r" fill="#d4e4ff" stroke="#2b7fff" strokeWidth={1} strokeLinejoin="round" />
      <path data-side="t" fill="#ffffff" stroke="#2b7fff" strokeWidth={1} strokeLinejoin="round" />
    </g>
  );
}

function shape(el: SVGGElement, h: number) {
  const hw = TW / 2 - 4;
  const hh = TH / 2 - 2.3;
  el.querySelector("[data-side='l']")?.setAttribute("d", `M${-hw} 0L0 ${hh}V${hh - h}L${-hw} ${-h}Z`);
  el.querySelector("[data-side='r']")?.setAttribute("d", `M${hw} 0L0 ${hh}V${hh - h}L${hw} ${-h}Z`);
  el.querySelector("[data-side='t']")?.setAttribute("d", `M0 ${-hh - h}L${hw} ${-h}L0 ${hh - h}L${-hw} ${-h}Z`);
}

/**
 * From MVP to a million users. Pinned and scrubbed: a small city of blocks
 * grows stage by stage while the user count climbs and the capability for each
 * stage comes forward. It tells clients what they get as their product grows.
 */
export function ScaleUp() {
  const root = useRef<HTMLElement>(null);
  const [stage, setStage] = useState(0);

  useGSAP(
    () => {
      const blocks = gsap.utils.toArray<SVGGElement>("[data-block]", root.current);
      const state = blocks.map((b) => ({ el: b, h: Number(b.dataset.h) }));
      state.forEach((s) => shape(s.el, s.h));
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top+=64",
          end: "+=240%",
          pin: true,
          scrub: 0.7,
          onUpdate: (self) => setStage(Math.min(STAGES.length - 1, Math.floor(self.progress * STAGES.length))),
        },
      });
      for (let st = 1; st < STAGES.length; st++) {
        tl.to(state, {
          h: (k: number) => {
            const [i, j] = blocks[k].dataset.block!.split("-").map(Number);
            return heightFor(i, j, st);
          },
          duration: 1,
          ease: "power2.inOut",
          stagger: { each: 0.02, from: "center" },
          onUpdate: () => state.forEach((s) => shape(s.el, s.h)),
        });
      }
      tl.to({}, { duration: 0.4 });
    },
    { scope: root },
  );

  const s = STAGES[stage];

  return (
    <section ref={root} className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden bg-paper-2/60 px-6 py-20 md:px-24">
      <div className="mx-auto grid w-full max-w-[84rem] gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.75rem)] font-light leading-[1.1] tracking-[-0.02em] text-ink">
            <RevealText variant="lines" lines={["Built for your first", "hundred users and your first million."]} />
          </h2>

          <ol className="mt-10 flex gap-2" aria-label="Growth stages">
            {STAGES.map((st, i) => (
              <li key={st.label} className={`flex-1 border-t-2 pt-3 transition-colors duration-300 ${i <= stage ? "border-azure" : "border-line"}`}>
                <span className={`font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${i === stage ? "text-azure" : "text-ink-3"}`}>{st.label}</span>
              </li>
            ))}
          </ol>

          <div key={stage} className="mt-10 animate-[stage-in_0.5s_cubic-bezier(0.22,1,0.36,1)]">
            <p className="font-mono text-5xl text-ink md:text-6xl">
              {s.users}
              <span className="ml-3 align-middle font-sans text-sm text-ink-3">users</span>
            </p>
            <h3 className="mt-6 font-display text-2xl font-light">{s.title}</h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed">{s.body}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {s.tags.map((t) => (
                <li key={t} className="rounded-full border border-line bg-paper px-3 py-1.5 text-xs text-ink-2">{t}</li>
              ))}
            </ul>
          </div>
        </div>

        <svg viewBox="-200 -230 400 400" aria-hidden="true" className="mx-auto w-full max-w-[34rem] overflow-visible">
          <g transform="translate(0 -40)">
            {/* Painter's order: back diagonal first so nearer blocks overlap farther ones. */}
            {Array.from({ length: N * N }, (_, k) => [k % N, Math.floor(k / N)] as const)
              .sort((a, b) => a[0] + a[1] - (b[0] + b[1]))
              .map(([i, j]) => <Block key={`${i}-${j}`} i={i} j={j} />)}
          </g>
        </svg>
      </div>
    </section>
  );
}
