"use client";

import { useEffect, useState } from "react";

const ARMS = [0, 45, 90, 135, 180, 225, 270, 315] as const;

/**
 * First-load screen: the mark's eight capsules pulse in turn until fonts are
 * ready and the page has painted, then the screen fades. Server-rendered, so
 * it covers the hero from the very first frame (no flash of half-set layout).
 */
export function Loader() {
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const minShow = new Promise((r) => setTimeout(r, 500));
    Promise.all([document.fonts.ready, minShow]).then(() => {
      requestAnimationFrame(() => requestAnimationFrame(() => !cancelled && setIsDone(true)));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div aria-hidden="true" className={`loader ${isDone ? "is-done" : ""}`}>
      <svg viewBox="-50 -50 100 100" className="size-16">
        {ARMS.map((deg, i) => (
          <rect key={deg} data-arm style={{ ["--i" as string]: i }} x={-5} y={-44} width={10} height={24} rx={5} fill="currentColor" transform={`rotate(${deg})`} />
        ))}
      </svg>
    </div>
  );
}
