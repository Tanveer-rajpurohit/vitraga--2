"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { LOGO_PATH, LOGO_SIZE } from "@/components/brand/Logo";
import { HERO } from "@/content/site";
import { RevealText } from "./RevealText";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ISO = "matrix(0.866 0.5 -0.866 0.5 0 0)";
const LAYERS = 9;
const GAP = 7;

type Tone = "light" | "blue";
const TONES: Record<Tone, { floor: string; top: string; topStroke: string; body: string; bodyStroke: string; shadow: string }> = {
  light: { floor: "var(--line)", top: "#2b7fff", topStroke: "#1a66e8", body: "#ffffff", bodyStroke: "#a9c9ff", shadow: "#2b7fff" },
  blue: { floor: "rgb(255 255 255 / 0.18)", top: "#ffffff", topStroke: "#ffffff", body: "#1a6ae8", bodyStroke: "rgb(255 255 255 / 0.7)", shadow: "#0d1828" },
};

function Floor({ tone }: { tone: Tone }) {
  const lines = [];
  for (let i = -5; i <= 5; i++) {
    lines.push(<path key={`x${i}`} d={`M-300 ${i * 60}H300`} />, <path key={`y${i}`} d={`M${i * 60} -300V300`} />);
  }
  return <g transform={ISO} fill="none" stroke={TONES[tone].floor} strokeWidth={1}>{lines}</g>;
}

/** The official mark extruded into a stack of layers, in isometric. */
function MarkStack({ tone, className }: { tone: Tone; className?: string }) {
  const c = TONES[tone];
  return (
    <svg viewBox="-330 -330 660 600" aria-hidden="true" className={`overflow-visible ${className ?? ""}`}>
      <Floor tone={tone} />
      <ellipse data-shadow cx={0} cy={18} rx={150} ry={86} fill={c.shadow} opacity={0.1} />
      <g data-tilt>
        {Array.from({ length: LAYERS }, (_, k) => {
          const isTop = k === LAYERS - 1;
          return (
            <g key={k} data-layer={k} transform={`translate(0 ${-k * GAP})`}>
              <g transform={`${ISO} scale(1.35)`}>
                <g data-spin>
                  <path
                    d={LOGO_PATH}
                    fillRule="evenodd"
                    transform={`translate(${-LOGO_SIZE / 2} ${-LOGO_SIZE / 2})`}
                    fill={isTop ? c.top : c.body}
                    stroke={isTop ? c.topStroke : c.bodyStroke}
                    strokeWidth={0.9}
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              </g>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/** Spin, entrance and pointer tilt shared by both hero variants. */
function useMarkMotion(scope: React.RefObject<HTMLElement | null>, extra?: (q: (s: string) => Element[]) => void) {
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const q = gsap.utils.selector(scope);
      gsap.to(q("[data-spin]"), { rotation: 360, svgOrigin: "0 0", duration: 40, ease: "none", repeat: -1 });
      gsap.from(q("[data-layer]"), { y: 40, autoAlpha: 0, stagger: 0.06, duration: 1, ease: "power3.out", delay: 0.4 });
      const tiltX = gsap.quickTo(q("[data-tilt]"), "x", { duration: 0.8, ease: "power3.out" });
      const tiltY = gsap.quickTo(q("[data-tilt]"), "y", { duration: 0.8, ease: "power3.out" });
      const onMove = (e: PointerEvent) => {
        tiltX((e.clientX / window.innerWidth - 0.5) * 24);
        tiltY((e.clientY / window.innerHeight - 0.5) * 16);
      };
      window.addEventListener("pointermove", onMove);
      extra?.(q);
      return () => window.removeEventListener("pointermove", onMove);
    },
    { scope },
  );
}

/**
 * The sweep. Text band over a blue block holding the mark; on scroll the band
 * collapses and the white side panel sweeps over the block until white fills
 * the screen and Services (also white) carries on. The mark's layers lift
 * apart while the panel closes over it.
 */
function HeroSweep() {
  const root = useRef<HTMLElement>(null);
  useMarkMotion(root, (q) => {
    gsap.matchMedia().add("(min-width: 768px)", () => {
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top top+=64", end: "+=110%", pin: true, scrub: 0.5, invalidateOnRefresh: true } })
        .to(q("[data-band]"), { height: 0, ease: "power1.inOut", duration: 0.5 }, 0)
        .to(q("[data-side-content]"), { autoAlpha: 0, duration: 0.25 }, 0.1)
        .to(q("[data-layer]"), { y: (i: number) => -i * 22, ease: "power2.inOut", duration: 0.7 }, 0)
        .to(q("[data-side]"), { width: "100%", ease: "power2.inOut", duration: 0.65 }, 0.2)
        .to(q("[data-side]"), { borderColor: "rgb(13 24 40 / 0)", duration: 0.05 }, 0.85)
        .to({}, { duration: 0.1 });
    });
  });

  return (
    <section ref={root} id="top" className="flex flex-col md:h-[calc(100svh-4rem)]">
      <div data-band className="overflow-hidden md:h-[13rem]">
        <div className="grid gap-6 px-6 py-12 md:grid-cols-[1.2fr_1fr] md:px-24 md:py-16">
          <h1 className="font-display text-[clamp(2.25rem,4.4vw,3.75rem)] font-light leading-[1.08] tracking-[-0.02em] text-ink">
            <RevealText variant="lines" delay={0.5} lines={["Production software,", "at 10x speed."]} />
          </h1>
          <p className="rise max-w-md text-sm leading-relaxed text-ink-3 md:justify-self-end md:pt-2 md:text-base">{HERO.lead}</p>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden bg-band max-md:flex max-md:flex-col">
        <div className="relative flex h-80 items-center justify-center md:absolute md:inset-y-0 md:left-0 md:right-[22rem] md:h-auto">
          <MarkStack tone="blue" className="h-[88%] w-auto max-w-full" />
        </div>
        <div data-side className="grid grid-rows-[auto_1fr] border-ink/15 bg-paper text-ink md:absolute md:inset-y-0 md:right-0 md:w-[22rem] md:border-l md:border-t">
          <div data-side-content className="border-b border-ink/15 p-8">
            <p className="font-display text-3xl font-medium leading-[1.1] tracking-tight text-ink">Senior-led.<br />AI-assisted.<br />Human-reviewed.</p>
          </div>
          <div className="flex min-h-[14rem] flex-col justify-end p-8">
            <a data-side-content href="#contact" className="self-end rounded-lg bg-azure px-5 py-3 text-sm font-medium text-white transition-colors duration-150 hover:bg-azure-deep">
              {HERO.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Hero() {
  return <HeroSweep />;
}
