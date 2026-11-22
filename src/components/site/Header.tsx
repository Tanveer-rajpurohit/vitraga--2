"use client";

import { useEffect, useState } from "react";
import { VitragaLogo } from "@/components/brand/Logo";
import { NAV, SITE } from "@/content/site";
import { ThemeToggle } from "./ThemeToggle";

const HEADER_PX = 48;

/**
 * Bordered-cell bar. It inverts (blue bar, cream text) while a section marked
 * data-theme="blue" sits under it, watched through a 1px band below the bar.
 */
export function Header() {
  const [isBlue, setIsBlue] = useState(false);

  useEffect(() => {
    const hits = new Set<Element>();
    let io: IntersectionObserver | null = null;
    const watch = () => {
      io?.disconnect();
      hits.clear();
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) hits.add(e.target);
            else hits.delete(e.target);
          }
          setIsBlue(hits.size > 0);
        },
        { rootMargin: `-${HEADER_PX}px 0px -${Math.max(0, window.innerHeight - HEADER_PX - 1)}px 0px` },
      );
      document.querySelectorAll('[data-theme="blue"]').forEach((el) => io?.observe(el));
    };
    watch();
    window.addEventListener("resize", watch);
    return () => {
      io?.disconnect();
      window.removeEventListener("resize", watch);
    };
  }, []);

  const tone = isBlue ? "bg-azure text-paper border-paper/50" : "bg-paper text-ink border-line";
  const hover = isBlue ? "hover:bg-paper hover:text-azure" : "hover:bg-azure hover:text-paper";
  const cell = `flex h-full items-center border-r border-inherit px-5 text-sm transition-colors duration-150 ${hover}`;

  return (
    <header className={`sticky top-0 z-40 border-b transition-colors duration-300 ${tone}`}>
      <nav aria-label="Primary" className="flex h-12 items-stretch border-inherit">
        <a href="#top" aria-label="Vitraga home" className="flex items-center border-r border-inherit px-4">
          <VitragaLogo />
        </a>
        <ul className="hidden items-stretch border-inherit md:flex">
          {NAV.map((l) => (
            <li key={l.href} className="flex border-inherit">
              <a href={l.href} className={cell}>{l.label}</a>
            </li>
          ))}
        </ul>
        <span className="flex-1" />
        <ThemeToggle className={`${cell} gap-1.5 border-l`} />
        <a href={SITE.github} target="_blank" rel="noreferrer" className={`${cell} gap-2 border-l max-md:hidden`}>
          <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4" fill="currentColor">
            <path d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.93-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.8.06 1.23.83 1.23.83.72 1.22 1.88.87 2.33.66.07-.52.28-.87.5-1.07-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.22 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.66 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 8 0Z" />
          </svg>
          GitHub
        </a>
        <a
          href="#contact"
          className={`flex items-center px-5 text-sm transition-colors duration-300 ${isBlue ? "bg-paper text-azure hover:bg-paper-2" : "bg-azure text-paper hover:bg-azure-deep"}`}
        >
          Get in touch
        </a>
      </nav>
    </header>
  );
}
