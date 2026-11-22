"use client";

import { useEffect, useRef, useState } from "react";

const CODE = `type Project = {
  name: string
  email: string
  message: string
  budget?: number
  deadline?: Date
}`;

const KEYWORD = /^(type)$/;
const TYPES = /^(string|number|Date)$/;

/** Colours one line: keywords, field names and types get distinct tones. */
function Line({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\s+|[:{}?])/).map((tok, i) => {
        const cls = KEYWORD.test(tok) ? "text-[#8a3fc7]" : TYPES.test(tok) ? "text-azure" : /^[a-z]+$/.test(tok) && i > 0 ? "text-[#d9531e]" : "";
        return <span key={i} className={cls}>{tok}</span>;
      })}
    </>
  );
}

/** Types the code once when it scrolls into view; shows it whole under reduced motion. */
export function CodeWindow() {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let id = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      if (isReduced) return void setCount(CODE.length);
      id = window.setInterval(() => {
        setCount((c) => {
          if (c >= CODE.length) {
            window.clearInterval(id);
            return c;
          }
          return c + 1;
        });
      }, 35);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, []);

  return (
    <div ref={ref} className="rounded-tl-2xl border border-azure bg-paper text-azure">
      <div className="flex items-center gap-2 border-b border-azure px-5 py-4" aria-hidden="true">
        {[0, 1, 2].map((i) => (<span key={i} className="size-3 rounded-full border border-azure" />))}
      </div>
      <pre className="min-h-72 overflow-x-auto p-8 font-mono text-sm leading-7" aria-label={CODE}>
        {CODE.slice(0, count).split("\n").map((line, i) => (
          <span key={i} className="block"><Line text={line} /></span>
        ))}
        <span aria-hidden="true" className="inline-block h-5 w-px animate-pulse bg-azure align-middle" />
      </pre>
    </div>
  );
}
