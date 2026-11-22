import { RevealText } from "./RevealText";

type Tile = { a: string; b: string; title: string; cubes: readonly [number, number, number][] };

// Two-tone diamond grounds, as in the reference. Titles are placeholders.
const TILES: readonly Tile[] = [
  { a: "#1d7a4c", b: "#24895a", title: "{{Featured article title}}", cubes: [[140, 210, 60], [300, 170, 80], [460, 250, 70], [90, 320, 34], [520, 110, 44]] },
  { a: "#d4521e", b: "#e0662f", title: "{{Article title}}", cubes: [[110, 120, 36], [210, 200, 52], [300, 110, 30]] },
  { a: "#3c475d", b: "#465269", title: "{{Article title}}", cubes: [[200, 150, 58]] },
  { a: "#2639cf", b: "#3147de", title: "{{Article title}}", cubes: [[110, 170, 44], [230, 110, 36], [300, 210, 30]] },
  { a: "#1d7a4c", b: "#24895a", title: "{{Article title}}", cubes: [[120, 140, 40], [240, 190, 56], [300, 100, 30]] },
];

function Art({ tile, id, wide }: { tile: Tile; id: string; wide?: boolean }) {
  const vw = wide ? 640 : 400;
  return (
    <svg viewBox={`0 0 ${vw} 360`} aria-hidden="true" className="block w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id={id} width="56" height="32" patternUnits="userSpaceOnUse">
          <rect width="56" height="32" fill={tile.a} />
          <path d="M28 0L56 16 28 32 0 16z" fill={tile.b} />
        </pattern>
      </defs>
      <rect width={vw} height="360" fill={`url(#${id})`} />
      {tile.cubes.map(([x, y, s], i) => {
        const h = s * 0.577;
        return (
          <g key={i} transform={`translate(${x} ${y})`} fill="#f4f2e8" stroke={tile.a} strokeWidth="1.2" strokeLinejoin="round">
            <path d={`M0 ${-h * 2}L${s} ${-h}V${h}L0 ${h * 2}L${-s} ${h}V${-h}Z`} />
            <path d={`M${-s} ${-h}L0 0L${s} ${-h}M0 0V${h * 2}`} fill="none" />
          </g>
        );
      })}
    </svg>
  );
}

export function Journal() {
  return (
    <section className="px-6 pb-24 pt-8 md:px-24">
      <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <h2 className="font-display text-[clamp(1.75rem,3vw,2.75rem)] font-light leading-[1.1] tracking-[-0.02em]">
          <RevealText variant="lines" lines={["The journal"]} />
        </h2>
        <p className="rise text-sm leading-relaxed md:justify-self-end">
          Field notes on engineering, AI systems and shipping software.
        </p>
      </div>
      <div className="mt-12 grid border border-line md:grid-cols-[2fr_1fr_1fr]">
        {TILES.map((t, i) => (
          <a
            key={i}
            href="#contact"
            className={`wipe group block border-line transition-colors hover:bg-paper-2 ${i === 0 ? "md:row-span-2 md:border-r" : "max-md:border-t md:border-b-0"} ${i === 1 || i === 3 ? "md:border-r" : ""} ${i < 3 && i > 0 ? "md:border-b" : ""}`}
            style={{ ["--d" as string]: `${i * 0.12}s` }}
          >
            <div className="overflow-hidden border-b border-line">
              <div className="transition-transform duration-700 group-hover:scale-[1.04]">
                <Art tile={t} id={`jt${i}`} wide={i === 0} />
              </div>
            </div>
            <p className={`p-5 font-display font-light leading-snug ${i === 0 ? "text-2xl md:p-8" : "text-lg"}`}>{t.title}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
