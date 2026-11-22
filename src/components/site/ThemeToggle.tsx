"use client";

export const THEME_KEY = "vitraga-theme";

/**
 * Cream (default) or white. The theme is a data attribute on <html>, set
 * before paint by the inline script in layout.tsx; CSS shows which swatch is
 * active, so this component needs no state.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "white" ? "cream" : "white";
    root.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Storage can be blocked (private mode); the theme still applies for this visit.
    }
  };

  return (
    <button type="button" onClick={toggle} aria-label="Switch colour theme" className={className}>
      <span aria-hidden="true" className="theme-swatch theme-swatch-cream size-3.5 rounded-full border border-current bg-[#f4f2e8]" />
      <span aria-hidden="true" className="theme-swatch theme-swatch-white size-3.5 rounded-full border border-current bg-white" />
      <span className="ml-1">Theme</span>
    </button>
  );
}
