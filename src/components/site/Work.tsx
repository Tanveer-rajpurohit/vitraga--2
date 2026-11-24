import { PROJECTS, SITE } from "@/content/site";
import { DrawBox } from "./DrawBox";
import { RevealText } from "./RevealText";

/** Isometric disc used as each tree node. */
function Node({ index }: { index: number }) {
  return (
    <svg viewBox="0 0 64 48" aria-hidden="true" className="w-16 shrink-0" fill="#ffffff" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M6 22l26 -14 26 14v8l-26 14 -26 -14z" />
      <path d="M6 22l26 14 26 -14M32 36v8" fill="none" />
      <text x="32" y="24" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" fontFamily="var(--font-fira-mono)">{String(index + 1).padStart(2, "0")}</text>
    </svg>
  );
}

export function Work() {
  return (
    <section id="work" data-theme="blue" className="bg-band px-6 py-20 text-paper md:px-24">
      <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <h2 className="font-display text-[clamp(1.75rem,3.4vw,3rem)] font-light leading-[1.1] tracking-[-0.02em]">
          <RevealText variant="flip" lines={["Selected work,", "built to be owned."]} />
        </h2>
        <p className="rise max-w-lg text-sm leading-relaxed md:text-base">Products we shipped, across health, AI, travel and education.</p>
      </div>

      <div className="wipe relative mt-14 rounded-2xl border border-paper bg-paper p-1.5 text-ink [&_p]:text-ink-3 [&_h3]:text-ink">
        <div className="rounded-xl border border-azure">
          <div className="flex items-center gap-2 border-b border-azure px-5 py-4" aria-hidden="true">
            {[0, 1, 2].map((i) => (<span key={i} className="size-3 rounded-full border border-azure" />))}
          </div>
          <div className="px-5 py-8 md:px-10">
            <p className="font-display text-2xl font-light">vitraga / work</p>
            <ul className="relative mt-8 ml-6 md:ml-12">
              <span aria-hidden="true" className="line-y absolute inset-y-0 left-0 border-l border-dotted border-azure" />
              {PROJECTS.map((p, i) => (
                <li key={p.title} className="relative grid gap-4 pb-8 pl-8 last:pb-0 md:grid-cols-[18rem_1fr] md:items-center md:pl-12">
                  <span aria-hidden="true" className="line-x absolute left-0 top-8 w-8 border-t border-dotted border-azure md:w-12" />
                  <div className="pop flex items-center gap-4">
                    <Node index={i} />
                    <span className="font-display text-lg font-light leading-tight">{p.category}</span>
                  </div>
                  <DrawBox as="article">
                    <div className="p-5">
                    <h3 className="font-display text-xl font-normal">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed">{p.summary}</p>
                    <p className="mt-3 text-xs">{p.stack.join(" / ")}</p>
                    <a href={`mailto:${SITE.email}?subject=${encodeURIComponent(p.title)}`} className="mt-4 inline-block rounded-lg bg-azure px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-azure-deep">
                      Ask about this project
                    </a>
                    </div>
                  </DrawBox>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
