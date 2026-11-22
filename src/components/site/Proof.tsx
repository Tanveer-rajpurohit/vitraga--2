import { SITE } from "@/content/site";
import { RevealText } from "./RevealText";

/** Outlined isometric cube; s is the half-width. */
function Cube({ x, y, s, label }: { x: number; y: number; s: number; label: string }) {
  const h = s * 0.577;
  return (
    <g transform={`translate(${x} ${y})`} fill="#f4f2e8" stroke="#0755b5" strokeWidth="1.3" strokeLinejoin="round">
      <path d={`M0 ${-h * 2}L${s} ${-h}V${h}L0 ${h * 2}L${-s} ${h}V${-h}Z`} />
      <path d={`M${-s} ${-h}L0 0L${s} ${-h}M0 0V${h * 2}`} fill="none" />
      <text transform={`translate(${s * 0.5} ${h * 0.6}) skewY(-30)`} textAnchor="middle" fontSize={s * 0.22} fill="#0755b5" stroke="none" fontFamily="var(--font-fira-mono)">{label}</text>
    </g>
  );
}

/** Faint isometric grid with cubes that drop in one after another. */
function IsoGrid() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="iso" width="60" height="34.64" patternUnits="userSpaceOnUse">
          <path d="M0 0L60 34.64M60 0L0 34.64" fill="none" stroke="#0755b5" strokeOpacity="0.18" />
        </pattern>
      </defs>
      <rect width="400" height="400" fill="url(#iso)" />
      <g className="pop" style={{ ["--d" as string]: "0.2s" }}><Cube x={140} y={280} s={70} label="{{00%}}" /></g>
      <g className="pop" style={{ ["--d" as string]: "0.5s" }}><Cube x={262} y={280} s={52} label="{{00}}" /></g>
      <g className="pop" style={{ ["--d" as string]: "0.8s" }}><Cube x={200} y={170} s={62} label="{{00x}}" /></g>
    </svg>
  );
}

export function Proof() {
  return (
    <section className="px-6 py-20 md:px-24">
      <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <h2 className="font-display text-[clamp(1.75rem,3vw,2.75rem)] font-light leading-[1.1] tracking-[-0.02em]">
          <RevealText variant="words" lines={["What our clients say."]} />
        </h2>
        <p className="rise max-w-lg text-sm leading-relaxed">
          A product they own, lower running costs and teams that evolve it themselves. They tell it best.
        </p>
      </div>

      <div className="wipe mt-14 border-y border-dashed border-line md:-mx-24">
        <div className="grid md:grid-cols-[1fr_2fr]">
          <div className="relative min-h-72 border-b border-dashed border-line md:border-b-0 md:border-r">
            <IsoGrid />
          </div>
          <div className="rise flex flex-col justify-between gap-8 p-8 md:p-12">
            <div className="flex items-start justify-between">
              <p className="font-display text-3xl font-light">{"{{Client logo}}"}</p>
              <span aria-hidden="true" className="font-display text-5xl leading-none">&ldquo;</span>
            </div>
            <p className="max-w-3xl text-sm leading-relaxed">
              {"{{Client quote: two or three sentences on what changed after working with Vitraga, in the client's own words.}}"}
            </p>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-line pt-6 text-sm">
              <span className="font-mono">{"{{Name}} // {{Role}}"}</span>
              <a href="#work" className="hover:underline">Read the case study ↗</a>
            </div>
          </div>
        </div>
        <div className="grid border-t border-dashed border-line md:grid-cols-2">
          <div className="flex items-center gap-8 p-8 md:pl-24">
            <p className="font-mono text-5xl">{"{{0}}"}</p>
            <div className="border-l border-dashed border-line pl-6 text-sm">
              <p>{"{{One measured result from a real client.}}"}</p>
              <p className="mt-2 font-medium">{"{{Name // Role}}"}</p>
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="slide-in flex h-full items-center justify-between bg-azure p-8 text-paper md:px-16">
              <div>
                <p className="font-display text-2xl font-light">Join our clients</p>
                <a href={`mailto:${SITE.email}`} className="mt-4 inline-block bg-paper px-5 py-3 text-sm text-azure transition-colors hover:bg-paper-2">Get in touch</a>
              </div>
              <svg viewBox="0 0 120 70" aria-hidden="true" className="hidden w-32 sm:block" fill="#f4f2e8" stroke="#0755b5" strokeWidth="1.3" strokeLinejoin="round">
                <path d="M8 32L62 8l50 24-54 30z" />
                <path d="M8 32l52 4 52-4M60 36l-2 26" fill="none" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
