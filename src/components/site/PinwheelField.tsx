"use client";

import { useEffect, useRef } from "react";
import { LOGO_PATH, LOGO_SIZE } from "@/components/brand/Logo";

/** Cell size in CSS px; smaller screens get a denser grid. */
const CELL = 64;
const CELL_SM = 44;

/**
 * A full-width field of the official mark. Each pinwheel turns toward the
 * pointer, a slow wave rolls through the grid, and marks near the pointer grow
 * and go solid. Pauses off-screen; colours are read once.
 */
export function PinwheelField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = ref.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mark = new Path2D(LOGO_PATH);
    let w = 0;
    let h = 0;
    let dpr = 1;
    let cell = CELL;
    let cols = 0;
    let rows = 0;
    let angles = new Float32Array(0);
    let scales = new Float32Array(0);
    const pointer = { x: -1e4, y: -1e4 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = el.clientWidth;
      h = el.clientHeight;
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      cell = w < 768 ? CELL_SM : CELL;
      cols = Math.ceil(w / cell) + 1;
      rows = Math.ceil(h / cell) + 1;
      angles = new Float32Array(cols * rows);
      scales = new Float32Array(cols * rows).fill(0.42);
    };
    resize();

    let raf = 0;
    let last = performance.now();
    let isVisible = false;
    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      const t = now / 1000;
      const ease = Math.min(1, 7 * dt);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const ox = (w - (cols - 1) * cell) / 2;
      const oy = (h - (rows - 1) * cell) / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const k = r * cols + c;
          const x = ox + c * cell;
          const y = oy + r * cell;
          const dx = pointer.x - x;
          const dy = pointer.y - y;
          const dist = Math.hypot(dx, dy);
          const near = Math.exp(-(dist * dist) / (2 * 140 * 140));
          const wave = isReduced ? 0 : Math.sin(c * 0.35 + r * 0.25 - t * 1.2);
          const target = Math.atan2(dy, dx) * near + wave * 0.6;
          angles[k] += (target - angles[k]) * ease;
          scales[k] += (0.42 + near * 0.5 + wave * 0.05 - scales[k]) * ease;
          const s = (scales[k] * cell) / LOGO_SIZE;
          ctx.setTransform(dpr * s * Math.cos(angles[k]), dpr * s * Math.sin(angles[k]), -dpr * s * Math.sin(angles[k]), dpr * s * Math.cos(angles[k]), dpr * x, dpr * y);
          ctx.translate(-LOGO_SIZE / 2, -LOGO_SIZE / 2);
          ctx.globalAlpha = 0.18 + near * 0.82;
          ctx.fillStyle = "#ffffff";
          ctx.fill(mark, "evenodd");
        }
      }
      ctx.globalAlpha = 1;
      raf = isVisible ? requestAnimationFrame(frame) : 0;
    };

    const io = new IntersectionObserver(([e]) => {
      const wasVisible = isVisible;
      isVisible = e.isIntersecting;
      if (isVisible && !wasVisible) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    }, { rootMargin: "200px 0px" });
    io.observe(el);

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
