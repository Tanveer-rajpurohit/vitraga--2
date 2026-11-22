import { FAQ, FAQ_GROUPS } from "@/content/site";
import { DrawBox } from "./DrawBox";
import { RevealText } from "./RevealText";

export function Faq() {
  return (
    <section id="faq" className="px-6 py-20 md:px-24">
      <h2 className="font-display text-[clamp(1.75rem,3.4vw,3rem)] font-light leading-[1.1] tracking-[-0.02em]">
        <RevealText variant="lines" lines={["Questions to ask", "before signing."]} />
      </h2>
      <div className="mt-12 space-y-8">
        {FAQ_GROUPS.map((g, gi) => (
          <DrawBox key={g.title}><div className="grid md:grid-cols-[1fr_2.2fr]">
            <div className="p-6 md:p-8">
              <p className="font-mono text-4xl">{String(gi + 1).padStart(2, "0")}</p>
              <p className="mt-3 font-display text-2xl font-light">{g.title}</p>
            </div>
            <div className="border-t border-line md:border-l md:border-t-0">
              {g.items.map((idx, i) => (
                <details key={idx} name="faq" className="group">
                  {i > 0 && <span aria-hidden="true" className="line-x block border-t border-dashed border-line" />}
                  <summary className="rise flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 text-sm transition-colors hover:bg-paper-2 md:px-8 [&::-webkit-details-marker]:hidden">
                    {FAQ[idx].q}
                    <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4 shrink-0 transition-transform duration-200 group-open:rotate-45">
                      <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </summary>
                  <p className="max-w-2xl px-6 pb-6 text-sm leading-relaxed md:px-8">{FAQ[idx].a}</p>
                </details>
              ))}
            </div>
          </div></DrawBox>
        ))}
      </div>
    </section>
  );
}
