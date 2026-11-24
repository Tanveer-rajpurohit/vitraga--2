"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { LOGO_PATH, LOGO_SIZE } from "@/components/brand/Logo";
import { HERO } from "@/content/site";
import { MarkField } from "./MarkField";
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
        .timeline({ scrollTrigger: { trigger: root.current, start: "top top+=64", end: "+=110%", pin: true, scrub: 0.5, invalidateOnRefresh: true, refreshPriority: 1 } })
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

type Variant = "logo" | "blocks";
const VARIANTS: readonly { id: Variant; label: string; href: string }[] = [
  { id: "logo", label: "A · Logo stack", href: "/" },
  { id: "blocks", label: "B · Block field", href: "/?hero=blocks" },
];

/**
 * B: full-bleed block field. The figure fills the screen, the headline sits
 * over it in white, and scrolling shrinks the whole hero into a rounded card
 * that then lifts up and away, as Services builds in underneath.
 */
function HeroField() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const q = gsap.utils.selector(root);
      gsap.from(q("[data-field-in]"), { y: 28, autoAlpha: 0, stagger: 0.1, duration: 0.9, ease: "power3.out", delay: 0.5 });
      gsap.matchMedia().add("(min-width: 768px)", () => {
        // Offset set by GSAP (not a CSS class) so the glide back to centre lands exactly at 0.
        gsap.set(q("[data-field]"), { xPercent: 16 });
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top top+=64", end: "+=170%", pin: true, scrub: 1.2, refreshPriority: 1 } })
          .to(q("[data-field-copy]"), { y: -40, autoAlpha: 0, duration: 0.3 }, 0)
          // The figure glides to the centre of the card as the copy leaves.
          .to(q("[data-field]"), { xPercent: 0, ease: "power2.inOut", duration: 0.5 }, 0.05)
          .to(q("[data-scrim]"), { autoAlpha: 0, duration: 0.3 }, 0.05)
          .fromTo(q("[data-frame]"), { clipPath: "inset(0% 0% 0% 0% round 0px)" }, { clipPath: "inset(10% 14% 10% 14% round 28px)", ease: "power2.inOut", duration: 0.7 }, 0.1)
          .to({}, { duration: 0.15 })
          .to(q("[data-frame]"), { yPercent: -110, ease: "power1.inOut", duration: 0.6 });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" className="relative md:h-[calc(100svh-4rem)]">
      <div data-frame data-theme="blue" className="relative h-[calc(100svh-4rem)] overflow-hidden bg-band text-white">
        <div data-field className="absolute inset-0"><MarkField size={13} className="absolute inset-0 size-full" /></div>
        {/* Band-coloured scrim under the copy so the headline never sits on bare figure lines. */}
        <div data-scrim aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--band)_0%,var(--band)_28%,rgb(26_106_232/0)_62%),linear-gradient(to_top,var(--band)_0%,rgb(26_106_232/0)_45%)]" />
        <div data-field-copy className="relative flex h-full flex-col justify-between p-6 md:p-12">
          <ul data-field-in className="flex flex-wrap gap-2">
            {["Senior-led", "AI-assisted", "Human-reviewed"].map((t) => (
              <li key={t} className="rounded-full border border-white/40 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em]">{t}</li>
            ))}
          </ul>
          <div className="grid items-end gap-8 md:grid-cols-[1.4fr_1fr]">
            <h1 className="font-display text-[clamp(2.5rem,5.6vw,5.25rem)] font-light leading-[1.02] tracking-[-0.03em]">
              <RevealText variant="lines" delay={0.4} lines={["Production software,", "at 10x speed."]} />
            </h1>
            <div data-field-in className="rounded-2xl bg-white p-6 text-ink md:justify-self-end md:max-w-sm">
              <p className="text-sm leading-relaxed text-ink-3">{HERO.lead}</p>
              <a href="#contact" className="mt-5 inline-block rounded-lg bg-azure px-5 py-3 text-sm font-medium text-white transition-colors duration-150 hover:bg-azure-deep">
                {HERO.cta}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Two hero options for the team to compare. Switching is a full page load
 * (the choice lives in the URL), so every scroll trigger is measured fresh.
 * Remove the switch once one is chosen.
 */
export function Hero({ variant }: { variant: Variant }) {
  // The hero streams in after the sections below have created their triggers,
  // so re-measure them once its pin exists.
  useEffect(() => {
    ScrollTrigger.refresh();
    window.dispatchEvent(new Event("vitraga:hero-ready"));
  }, []);

  return (
    <>
      {variant === "logo" ? <HeroSweep /> : <HeroField />}
      <div role="group" aria-label="Hero option" className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 gap-1 rounded-xl border border-line bg-paper p-1 shadow-[0_12px_32px_-12px_rgb(13_24_40/0.3)]">
        {VARIANTS.map((v) => (
          <a
            key={v.id}
            href={v.href}
            aria-current={variant === v.id ? "page" : undefined}
            className={`rounded-lg px-4 py-2 font-mono text-xs transition-colors duration-150 ${variant === v.id ? "bg-ink text-white" : "text-ink-2 hover:bg-paper-2"}`}
          >
            {v.label}
          </a>
        ))}
      </div>
    </>
  );
}
