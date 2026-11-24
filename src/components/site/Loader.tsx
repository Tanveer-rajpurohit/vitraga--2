"use client";

import { useEffect, useState } from "react";
import { VitragaIcon } from "@/components/brand/Logo";

/**
 * First-load screen: the pinwheel mark turns until fonts are ready and the
 * page has painted, then it settles and the screen lifts away. Server-rendered, so
 * it covers the hero from the very first frame (no flash of half-set layout).
 */
export function Loader() {
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // One full pulse cycle at least, so it never just blinks on and off.
    const minShow = new Promise((r) => setTimeout(r, 900));
    Promise.all([document.fonts.ready, minShow]).then(() => {
      requestAnimationFrame(() => requestAnimationFrame(() => !cancelled && setIsDone(true)));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div aria-hidden="true" className={`loader ${isDone ? "is-done" : ""}`}>
      <VitragaIcon className="loader-mark size-16" />
    </div>
  );
}
