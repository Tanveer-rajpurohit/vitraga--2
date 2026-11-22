"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "abcdefghijklmnopqrstuvwxyz0123456789{}<>/_=+";
const TRAIL = 4;

type Props = {
  text: string;
  /** Seconds to wait after entering the viewport. */
  delay?: number;
  /** Milliseconds per character. */
  speed?: number;
  className?: string;
};

/**
 * Types text in left to right with a short trail of random glyphs ahead of the
 * cursor. Unrevealed characters stay in the layout (visibility hidden), so the
 * line never reflows. Screen readers get the full text from aria-label.
 */
export function Scramble({ text, delay = 0, speed = 28, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(-1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timer = 0;
    let interval = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      if (isReduced) return void setCount(text.length);
      timer = window.setTimeout(() => {
        let c = 0;
        interval = window.setInterval(() => {
          c += 1;
          setCount(c);
          if (c >= text.length) window.clearInterval(interval);
        }, speed);
      }, delay * 1000);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
      window.clearInterval(interval);
    };
  }, [text, delay, speed]);

  return (
    <span ref={ref} aria-label={text} className={className}>
      {Array.from(text).map((ch, i) => {
        if (i < count) return <span key={i} aria-hidden="true">{ch}</span>;
        const isTrail = count >= 0 && i < count + TRAIL && ch !== " ";
        return (
          <span key={i} aria-hidden="true" className={isTrail ? "opacity-60" : "invisible"}>
            {isTrail ? GLYPHS[(i * 7 + count * 13) % GLYPHS.length] : ch}
          </span>
        );
      })}
    </span>
  );
}
