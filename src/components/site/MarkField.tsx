"use client";

import { useEffect, useRef } from "react";

type Props = { className?: string; /** Grid cells per side (odd keeps the mark centred). */ size?: number };

const DIRS: readonly [number, number, boolean][] = [
  [0, -1, false], [1, -1, true], [1, 0, false], [1, 1, true],
  [0, 1, false], [-1, 1, true], [-1, 0, false], [-1, -1, true],
];

/** Height in "units" for each cell: the Vitraga mark extruded from a hairline floor. */
function markHeights(n: number): Float32Array {
  const out = new Float32Array(n * n);
  const c = (n - 1) / 2;
  const inner = Math.max(1, Math.round(n * 0.14));
  const outer = Math.round(c);
  for (const [dx, dy, isSoft] of DIRS) {
    for (let r = inner; r <= outer; r++) {
      const i = Math.round(c + dx * r);
      const j = Math.round(c + dy * r);
      out[j * n + i] = isSoft ? 1.4 : 2.8;
    }
  }
  return out;
}

/**
 * Isometric hairline figure of the brand mark. A floor of cream hairline tiles;
 * the mark's eight arms stand up as pillars (straight arms tall, diagonal arms
 * low, like the logo's solid and soft capsules). Pillars near the pointer lift,
 * a slow wave breathes through the floor, and heights ease frame-rate
 * independently. Colours follow the theme through CSS variables.
 */
export function MarkField({ className, size = 11 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = ref.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const n = size;
    const base = markHeights(n);
    const heights = Float32Array.from(base);
    let w = 0;
    let h = 0;
    let dpr = 1;
    let tw = 0;
    let unit = 0;
    let ox = 0;
    let oy = 0;
    const pointer = { x: -1e4, y: -1e4 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = el.clientWidth;
      h = el.clientHeight;
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      // Sized to fill most of its box; the figure is the hero's centrepiece.
      tw = Math.min((w * 1.0) / n, (h * 1.0) / (n / 2 + 3.4));
      unit = tw * 0.5;
      ox = w / 2;
      oy = h / 2 - (n * tw) / 4 + unit * 1.6;
    };
    resize();

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      const t = now / 1000;
      const css = getComputedStyle(el);
      const paper = css.getPropertyValue("--paper").trim() || "#f4f2e8";
      const azure = css.getPropertyValue("--azure").trim() || "#0755b5";
      const th = tw / 2;

      // Pointer position in grid space (floor plane).
      const X = (pointer.x - ox) / (tw / 2);
      const Y = (pointer.y - oy) / (th / 2);
      const pi = (X + Y) / 2;
      const pj = (Y - X) / 2;

      for (let j = 0; j < n; j++) {
        for (let i = 0; i < n; i++) {
          const k = j * n + i;
          let target = base[k];
          if (!isReduced) {
            target += 0.18 * (1 + Math.sin(i * 0.7 + j * 0.5 - t * 1.4));
            const d2 = (i - pi) ** 2 + (j - pj) ** 2;
            target += 2.2 * Math.exp(-d2 / 3.2);
          }
          heights[k] += (target - heights[k]) * Math.min(1, 6 * dt);
        }
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.lineJoin = "round";
      ctx.lineWidth = 1;
      ctx.strokeStyle = paper;
      // Back-to-front by diagonal so nearer pillars paint over farther ones.
      for (let s = 0; s <= 2 * (n - 1); s++) {
        for (let i = Math.max(0, s - n + 1); i <= Math.min(n - 1, s); i++) {
          const j = s - i;
          const hv = heights[j * n + i] * unit;
          const cx = ox + (i - j) * (tw / 2);
          const cy = oy + (i + j) * (th / 2);
          const top = cy - hv;
          const isPillar = hv > unit * 0.6;
          // Sides: blue fill with cream hairlines, so pillars read as line drawings.
          if (hv > 0.5) {
            ctx.fillStyle = azure;
            ctx.beginPath();
            ctx.moveTo(cx - tw / 2, top + th / 2);
            ctx.lineTo(cx, top + th);
            ctx.lineTo(cx + tw / 2, top + th / 2);
            ctx.lineTo(cx + tw / 2, cy + th / 2);
            ctx.lineTo(cx, cy + th);
            ctx.lineTo(cx - tw / 2, cy + th / 2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(cx, top + th);
            ctx.lineTo(cx, cy + th);
            ctx.stroke();
          }
          ctx.beginPath();
          ctx.moveTo(cx, top);
          ctx.lineTo(cx + tw / 2, top + th / 2);
          ctx.lineTo(cx, top + th);
          ctx.lineTo(cx - tw / 2, top + th / 2);
          ctx.closePath();
          ctx.fillStyle = isPillar ? paper : azure;
          ctx.fill();
          ctx.stroke();
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    };
    const onLeave = () => {
      pointer.x = pointer.y = -1e4;
    };
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
    };
  }, [size]);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
