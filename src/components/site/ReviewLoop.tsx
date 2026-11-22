"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useRef, useState } from "react";
import { DrawBox } from "./DrawBox";
import { RevealText } from "./RevealText";

gsap.registerPlugin(MotionPathPlugin, useGSAP);

const W = 150;
const H = 86;
const T = 26;

const STATIONS = [
  { x: 210, y: 250, title: "AI drafts", body: "Models write the first pass: routes, tests, migrations, docs. Fast, cheap, and never shipped as-is." },
  { x: 600, y: 170, title: "Senior review", body: "An engineer reads every change, rewrites what is wrong and signs it off. This is where a draft becomes code." },
  { x: 990, y: 250, title: "Production", body: "Only reviewed work merges. It deploys behind monitoring with a rollback ready." },
] as const;

/** The route capsules travel: over each plate top, dipping between them. */
const ROUTE = "M120 250 C 260 200 420 120 600 170 S 880 300 1080 250";
const CAPSULES = 7;
const LOOP_S = 7;

function Plate({ x, y, index, isActive }: { x: number; y: number; index: number; isActive: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g style={{ transform: `translateY(${isActive ? -12 : 0}px)`, transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)" }} strokeLinejoin="round">
        <path d={`M${-W} 0L0 ${H}L${W} 0V${T}L0 ${H + T}L${-W} ${T}Z`} style={{ fill: "var(--paper)" }} stroke="currentColor" strokeWidth={1.3} />
        <path d={`M${-W} 0L0 ${-H}L${W} 0L0 ${H}Z`} style={{ fill: "var(--paper)" }} stroke="currentColor" strokeWidth={1.3} />
        <path d={`M0 ${H}V${H + T}`} stroke="currentColor" strokeWidth={1.3} />
        <g transform="matrix(0.866 0.5 -0.866 0.5 0 0) scale(0.5)" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
          {index === 0 && <path d="M-60 -60l20 50 50 20 -50 20 -20 50 -20 -50 -50 -20 50 -20zM60 -70l8 20 20 8 -20 8 -8 20 -8 -20 -20 -8 20 -8z" />}
          {index === 1 && (
            <>
              <circle cx={-20} cy={-20} r={50} />
              <path d="M16 16l60 60M-45 -20l18 18 34 -38" />
            </>
          )}
          {index === 2 && <path d="M-90 -70h180v40h-180zM-90 -10h180v40h-180zM-90 50h180v40h-180zM50 -50h20M50 10h20M50 70h20" />}
        </g>
      </g>
    </g>
  );
}

/**
 * Our own section in place of a blog: the review loop. Capsules (the logo's
 * shape) ride from plate to plate. They travel soft, at the logo's 41% tint,
 * until the senior review plate, and leave it solid: soft capsules are drafts,
 * solid ones shipped. Hovering a station card lifts its plate.
 */
export function ReviewLoop() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.utils.toArray<SVGRectElement>("[data-capsule]").forEach((el, i) => {
        const delay = -(i / CAPSULES) * LOOP_S;
        gsap
          .timeline({ repeat: -1, delay })
          .set(el, { opacity: 0.41 })
          .to(el, { duration: LOOP_S / 2, ease: "none", motionPath: { path: "#route", align: "#route", alignOrigin: [0.5, 0.5], autoRotate: true, start: 0, end: 0.5 } })
          .set(el, { opacity: 1 })
          .to(el, { duration: LOOP_S / 2, ease: "none", motionPath: { path: "#route", align: "#route", alignOrigin: [0.5, 0.5], autoRotate: true, start: 0.5, end: 1 } });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="overflow-hidden px-6 pb-24 pt-8 md:px-24">
      <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <h2 className="font-display text-[clamp(1.75rem,3vw,2.75rem)] font-light leading-[1.1] tracking-[-0.02em]">
          <RevealText variant="lines" lines={["Every line passes", "a human."]} />
        </h2>
        <p className="rise max-w-lg text-sm leading-relaxed">
          Look at our mark: four solid capsules and four soft ones. Soft is a draft, solid is shipped. Nothing moves from one to the other without a senior engineer in between.
        </p>
      </div>

      <div className="wipe mt-12 -mx-6 md:-mx-24">
        <svg viewBox="0 0 1200 420" role="img" aria-label="Drafts travel from AI, through senior review, to production" className="w-full">
          <path id="route" d={ROUTE} fill="none" stroke="currentColor" strokeWidth={1.2} strokeDasharray="2 7" strokeLinecap="round" className="flow" />
          {STATIONS.map((s, i) => (
            <Plate key={s.title} x={s.x} y={s.y} index={i} isActive={active === i} />
          ))}
          {Array.from({ length: CAPSULES }, (_, i) => (
            <rect key={i} data-capsule width={30} height={11} rx={5.5} x={-15} y={-5.5} fill="#0755b5" opacity={0} />
          ))}
        </svg>
      </div>

      <ol className="mt-6 grid gap-4 md:grid-cols-3">
        {STATIONS.map((s, i) => (
          <li key={s.title} onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)} onFocus={() => setActive(i)} onBlur={() => setActive(null)}>
            <DrawBox delay={i * 0.4} className="h-full">
              <div tabIndex={0} className="p-6 outline-none">
                <p className="font-mono text-sm">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 font-display text-2xl font-light">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed">{s.body}</p>
              </div>
            </DrawBox>
          </li>
        ))}
      </ol>
    </section>
  );
}
