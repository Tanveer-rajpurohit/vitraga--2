"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

const W = 230;
const H = 130;
const T = 56;
const GAP = 64;
/** How far right a waiting slab sits before it slides in. */
const OFFSTAGE_X = 520;

/** Flat 2D drawings placed on a slab top through an isometric matrix. */
const ISO = "matrix(0.866 0.5 -0.866 0.5 0 0)";

function Glyph({ index }: { index: number }) {
  return (
    <g transform={`${ISO} scale(0.62)`} fill="none" stroke="#0755b5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {index === 0 && (
        <>
          <rect x={-140} y={-60} width={90} height={50} rx={6} />
          <path d="M-125 -40h60M-125 -28h40" />
          <rect x={-30} y={-110} width={110} height={60} rx={6} />
          <path d="M-15 -90h80M-15 -78h80M-15 -66h50" />
          <rect x={60} y={-20} width={90} height={80} rx={6} />
          <rect x={80} y={0} width={50} height={40} />
          <rect x={-40} y={10} width={60} height={46} rx={10} />
          <circle cx={-22} cy={30} r={5} />
          <circle cx={2} cy={30} r={5} />
          <path d="M-50 -35v35M20 33h40M-10 56v30h40" />
        </>
      )}
      {index === 1 &&
        [-110, 0, 110].flatMap((x) =>
          [-60, 50].map((y) => (
            <g key={`${x}${y}`}>
              <rect x={x - 45} y={y - 40} width={90} height={80} rx={8} />
              <path d={`M${x - 30} ${y + 25}h30M${x - 30} ${y + 14}h20`} />
              <rect x={x - 5} y={y - 25} width={35} height={30} rx={3} />
            </g>
          )),
        )}
      {index === 2 && (
        <>
          <rect x={-150} y={-60} width={180} height={140} rx={8} />
          <path d="M-130 40l40 -40 40 20 50 -50" />
          <rect x={50} y={-110} width={110} height={60} rx={6} />
          <path d="M65 -90h80M65 -75h60" />
          <rect x={50} y={-20} width={110} height={90} rx={6} />
          <path d="M70 50v-20M90 50v-35M110 50v-25M130 50v-45" />
        </>
      )}
      {index === 3 && (
        <>
          <path d="M-120 60C-60 60 -80 -60 0 -40S60 80 120 -60" />
          <path d="M-120 60L-40 -90M120 -60L40 70M-60 -20L60 -10" strokeWidth={1.4} />
          {[[-120, 60], [-40, -90], [120, -60], [40, 70], [-60, -20], [60, -10], [0, -15]].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r={7} fill="#f4f2e8" />
          ))}
        </>
      )}
    </g>
  );
}

const slabPaths = (
  <>
    <path d={`M${-W} 0L0 ${H}L${W} 0V${T}L0 ${H + T}L${-W} ${T}Z`} />
    <path d={`M${-W} 0L0 ${-H}L${W} 0L0 ${H}Z`} />
    <path d={`M0 ${H}V${H + T}`} />
  </>
);

/**
 * One slab per service. Slab `active` is the solid top; each step, the new slab
 * slides in from the right to the top position while the ones already placed
 * drop one layer and turn into cream outlines. Scrolling back reverses it.
 */
export function IsoStack({ active, count }: { active: number; count: number }) {
  const root = useRef<SVGSVGElement>(null);
  const isFirst = useRef(true);

  useGSAP(
    () => {
      const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // First render places everything instantly, so waiting slabs never fly off on load.
      const d = isReduced || isFirst.current ? 0 : 1;
      isFirst.current = false;
      for (let j = 0; j < count; j++) {
        const placed = j <= active;
        const isTop = j === active;
        gsap.to(`[data-slab="${j}"]`, {
          x: placed ? 0 : OFFSTAGE_X,
          y: placed ? (active - j) * GAP : 0,
          autoAlpha: placed ? 1 : 0,
          duration: 0.9 * d,
          ease: "power3.inOut",
          overwrite: true,
        });
        gsap.to(`[data-slab="${j}"] [data-solid]`, { autoAlpha: isTop || !placed ? 1 : 0, duration: 0.45 * d, delay: isTop ? 0 : 0.35 * d, overwrite: true });
        gsap.to(`[data-slab="${j}"] [data-outline]`, { autoAlpha: placed && !isTop ? 1 : 0, duration: 0.45 * d, delay: 0.35 * d, overwrite: true });
      }
    },
    { scope: root, dependencies: [active, count] },
  );

  return (
    <svg ref={root} viewBox="-270 -180 540 560" role="img" aria-label="Isometric stack of layers" className="w-full max-w-[34rem] overflow-visible">
      {Array.from({ length: count }, (_, j) => (
        <g key={j} data-slab={j} style={{ visibility: j === 0 ? "visible" : "hidden" }}>
          <g data-outline fill="none" stroke="#f4f2e8" strokeWidth={1.5} strokeLinejoin="round" opacity={0}>{slabPaths}</g>
          <g data-solid>
            <g fill="#f4f2e8" stroke="#0755b5" strokeWidth={1.5} strokeLinejoin="round">{slabPaths}</g>
            <Glyph index={j} />
          </g>
        </g>
      ))}
    </svg>
  );
}
