"use client";

import { useEffect, useRef } from "react";

type Props = {
  className?: string;
  /** "tetris": a stepped skyline with falling pieces. "scatter": squares flicker on and off. */
  mode: "tetris" | "scatter";
  color?: string;
};

/** Column heights for the skyline, repeated across the width. */
const SKYLINE = [2, 2, 3, 3, 6, 6, 6, 6, 4, 4, 4, 4, 2, 1, 0, 0, 2, 2, 2, 2, 5, 5, 5, 5, 3, 3];

const PIECES: readonly (readonly [number, number][])[] = [
  [[0, 0], [1, 0], [2, 0], [3, 0]],
  [[0, 0], [1, 0], [0, 1], [1, 1]],
  [[0, 0], [1, 0], [2, 0], [1, 1]],
  [[0, 0], [0, 1], [1, 1], [2, 1]],
  [[1, 0], [2, 0], [0, 1], [1, 1]],
];

const STEP_MS = 140;

export function PixelField({ className, mode, color = "#f4f2e8" }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = ref.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let cell = 42;
    let cols = 0;
    let rows = 0;
    let grid = new Uint8Array(0);
    let piece: { cells: readonly [number, number][]; x: number; y: number } | null = null;
    let lastStep = 0;
    let waitUntil = 0;

    const at = (c: number, r: number) => (c < 0 || c >= cols || r >= rows ? 1 : r < 0 ? 0 : grid[r * cols + c]);

    const reset = () => {
      grid = new Uint8Array(cols * rows);
      if (mode === "tetris") {
        for (let c = 0; c < cols; c++) {
          const height = Math.min(SKYLINE[c % SKYLINE.length], Math.floor(rows * 0.6));
          for (let r = rows - height; r < rows; r++) grid[r * cols + c] = 1;
        }
      } else {
        for (let i = 0; i < grid.length; i++) grid[i] = Math.random() < 0.35 ? 1 : 0;
      }
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = el.clientWidth;
      h = el.clientHeight;
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      cell = w < 768 ? 30 : 42;
      cols = Math.ceil(w / cell);
      rows = Math.ceil(h / cell);
      piece = null;
      reset();
    };
    resize();

    const fits = (cells: readonly [number, number][], x: number, y: number) =>
      cells.every(([dx, dy]) => at(x + dx, y + dy) === 0);

    const step = (now: number) => {
      if (mode === "scatter") {
        for (let i = 0; i < grid.length; i++) if (Math.random() < 0.03) grid[i] ^= 1;
        return;
      }
      if (!piece) {
        if (now < waitUntil) return;
        const cells = PIECES[Math.floor(Math.random() * PIECES.length)];
        piece = { cells, x: Math.floor(Math.random() * Math.max(1, cols - 3)), y: -2 };
        return;
      }
      if (fits(piece.cells, piece.x, piece.y + 1)) {
        piece.y += 1;
        return;
      }
      for (const [dx, dy] of piece.cells) {
        const r = piece.y + dy;
        if (r >= 0) grid[r * cols + piece.x + dx] = 1;
      }
      piece = null;
      waitUntil = now + 700;
      // Keep the skyline low: once any column passes 75% height, start over.
      const limit = Math.floor(rows * 0.25);
      for (let c = 0; c < cols; c++) if (grid[limit * cols + c]) return reset();
    };

    const square = (c: number, r: number) => ctx.fillRect(c * cell + 1, r * cell + 1, cell - 2, cell - 2);

    let raf = 0;
    const frame = (now: number) => {
      if (!isReduced && now - lastStep > (mode === "scatter" ? 320 : STEP_MS)) {
        lastStep = now;
        step(now);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      // Anchor rows to the bottom edge so the skyline sits on the floor.
      ctx.translate(0, h - rows * cell);
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (grid[r * cols + c]) square(c, r);
      if (piece) for (const [dx, dy] of piece.cells) square(piece.x + dx, piece.y + dy);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [mode, color]);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
