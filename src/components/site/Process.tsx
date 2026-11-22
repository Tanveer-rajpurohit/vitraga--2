import { METHOD } from "@/content/site";
import { DrawBox } from "./DrawBox";
import { RevealText } from "./RevealText";

const ICON = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

const ICONS = [
  <g key="a" {...ICON}>
    <path d="M10 44l14-8v-12l12-7 4 2v-6l-4-2-16 9v12l-10 6zM10 44l4 2 10-6" />
    <path d="M62 28l-14 8v12l-12 7-4-2v6l4 2 16-9V40l10-6z" />
  </g>,
  <g key="b" {...ICON}>
    <path d="M8 34c0-8 10-10 16-6s10 2 14-2 14-4 18 2-2 12-8 12-10 4-16 8-14 2-18-2-6-6-6-12z" />
    <path d="M8 34v6c0 6 2 10 6 12s12 4 18 2M56 30v6c0 6-4 10-8 10" />
  </g>,
  <g key="c" {...ICON}>
    <path d="M36 8l24 13v28L36 62 12 49V21zM12 21l24 13 24-13M36 34v28M24 14l24 13" />
  </g>,
  <g key="d" {...ICON}>
    <path d="M10 36c0-12 12-20 26-20s26 8 26 20-12 18-26 18-26-6-26-18z" />
    <path d="M10 36v6c0 12 12 18 26 18s26-6 26-18v-6M36 16v38M18 26c6 4 12 6 18 6s12-2 18-6" />
  </g>,
] as const;

/** Dotted curves converging on the row; dashes flow toward the centre. */
function Fan({ flip }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 220 420" aria-hidden="true" className={`absolute top-[2.5rem] hidden h-[26rem] w-48 -translate-y-1/2 lg:block ${flip ? "-right-24 -scale-x-100" : "-left-24"}`}>
      {Array.from({ length: 17 }, (_, k) => {
        const y = 6 + k * 25.5;
        return (
          <path
            key={k}
            className="flow"
            d={`M0 ${y} C110 ${y} 140 210 216 210`}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.1}
            strokeDasharray="1 6"
            strokeLinecap="round"
            style={{ animationDelay: `${k * -0.07}s` }}
          />
        );
      })}
      {Array.from({ length: 10 }, (_, k) => (
        <text key={`t${k}`} x={20 + ((k * 37) % 110)} y={40 + ((k * 71) % 340)} fontSize="11" fill="currentColor" fontFamily="var(--font-fira-mono)">
          {"7d0f3a8b1e"[k]}
        </text>
      ))}
    </svg>
  );
}

export function Process() {
  return (
    <section id="process" className="relative overflow-hidden px-6 py-20 md:px-24">
      <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <h2 className="font-display text-[clamp(1.75rem,3vw,2.75rem)] font-light leading-[1.1] tracking-[-0.02em]">
          <RevealText variant="chars" lines={["Built and shipped", "your way."]} />
        </h2>
        <p className="rise max-w-lg text-sm leading-relaxed">
          Delivered with everything you need to carry on without us. No code gets written until the scope is set, and nothing wraps up until you can run the product yourself. In between, you see progress every week.
        </p>
      </div>

      <div className="relative mt-16">
        <Fan />
        <Fan flip />
        <ol className="relative mx-auto grid max-w-5xl gap-8 md:grid-cols-4 md:gap-3">
          {METHOD.map((m, i) => (
            <li key={m.step} className="flex flex-col items-center">
              <div className="flex h-20 w-full items-center">
                <span className={`line-x h-px flex-1 border-t-2 border-dotted border-line ${i === 0 ? "invisible" : ""}`} style={{ ["--d" as string]: `${0.3 + i * 0.2}s` }} />
                <svg viewBox="0 0 72 72" aria-hidden="true" className="pop mx-3 size-16 shrink-0" style={{ ["--d" as string]: `${0.2 + i * 0.2}s` }}>{ICONS[i]}</svg>
                <span className={`line-x h-px flex-1 border-t-2 border-dotted border-line ${i === METHOD.length - 1 ? "invisible" : ""}`} style={{ ["--d" as string]: `${0.4 + i * 0.2}s` }} />
              </div>
              <span aria-hidden="true" className="h-8 border-l border-dotted border-line" />
              <DrawBox as="article" delay={0.2 + i * 0.2} className="w-full md:min-h-44">
                <div className="p-5">
                  <h3 className="font-display text-2xl font-light">{m.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed">{m.body}</p>
                </div>
              </DrawBox>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
