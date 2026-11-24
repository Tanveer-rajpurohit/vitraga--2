"use client";

import { useEffect, useRef, useState } from "react";
import { VitragaLogo } from "@/components/brand/Logo";
import { MENUS, NAV_LINKS, type Menu } from "@/content/site";

/**
 * White bar: logo, centred links (two open a mega menu), one blue CTA.
 * Menus open on hover for pointers and on click for touch and keyboard, and
 * close on Escape or an outside click.
 */
export function Header() {
  const [open, setOpen] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const bar = useRef<HTMLElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    const onDown = (e: PointerEvent) => {
      if (bar.current && !bar.current.contains(e.target as Node)) setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  const active: Menu | undefined = MENUS.find((m) => m.label === open);

  return (
    <header ref={bar} onMouseLeave={() => setOpen(null)} className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-sm">
      <nav aria-label="Primary" className="relative mx-auto flex h-16 max-w-[90rem] items-center justify-between px-6 md:px-12">
        <a href="#top" aria-label="Vitraga home" className="text-ink [&_svg]:text-azure">
          <VitragaLogo />
        </a>

        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
          {MENUS.map((m) => (
            <li key={m.label}>
              <button
                type="button"
                aria-expanded={open === m.label}
                onMouseEnter={() => setOpen(m.label)}
                onClick={() => setOpen(open === m.label ? null : m.label)}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-[15px] text-ink-2 transition-colors duration-150 hover:bg-paper-2 hover:text-ink ${open === m.label ? "bg-paper-2 text-ink" : ""}`}
              >
                {m.label}
                <svg viewBox="0 0 12 12" aria-hidden="true" className={`size-3 transition-transform duration-200 ${open === m.label ? "rotate-45" : ""}`}>
                  <path d="M6 1.5v9M1.5 6h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </li>
          ))}
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} onMouseEnter={() => setOpen(null)} className="block rounded-lg px-4 py-2 text-[15px] text-ink-2 transition-colors duration-150 hover:bg-paper-2 hover:text-ink">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a href="#contact" className="rounded-lg bg-azure px-5 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-azure-deep active:translate-y-px">
            Get in touch
          </a>
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={isMobileOpen}
            onClick={() => setIsMobileOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-lg text-ink transition-colors hover:bg-paper-2 lg:hidden"
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5">
              <path d={isMobileOpen ? "M4 4l12 12M16 4L4 16" : "M3 6h14M3 14h14"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {active && (
          <div className="absolute inset-x-6 top-full hidden pt-2 lg:block">
            <div className="mx-auto max-w-5xl rounded-2xl border border-line bg-paper p-8 shadow-[0_24px_48px_-24px_rgb(13_24_40/0.18)]">
              <div className="grid gap-8" style={{ gridTemplateColumns: `repeat(${active.groups.length}, minmax(0, 1fr))` }}>
                {active.groups.map((g) => (
                  <div key={g.title}>
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">{g.title}</p>
                    <ul className="mt-4 space-y-1">
                      {g.items.map((it) => (
                        <li key={it.name}>
                          <a href={it.href} onClick={() => setOpen(null)} className="-mx-3 block rounded-lg px-3 py-2.5 transition-colors duration-150 hover:bg-paper-2">
                            <span className="block text-[15px] text-ink">{it.name}</span>
                            <span className="mt-0.5 block text-[13px] text-ink-3">{it.note}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {isMobileOpen && (
        <div className="border-t border-line bg-paper px-6 py-4 lg:hidden">
          <ul className="space-y-1">
            {[...MENUS.map((m) => ({ href: m.href, label: m.label })), ...NAV_LINKS].map((l) => (
              <li key={l.label}>
                <a href={l.href} onClick={() => setIsMobileOpen(false)} className="block rounded-lg px-3 py-3 text-ink-2 hover:bg-paper-2">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
