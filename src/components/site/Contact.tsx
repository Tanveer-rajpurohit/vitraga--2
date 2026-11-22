import { VitragaIcon } from "@/components/brand/Logo";
import { NAV, PROJECTS, SERVICES, SITE } from "@/content/site";
import { CodeWindow } from "./CodeWindow";
import { MarkField } from "./MarkField";
import { Scramble } from "./Scramble";

const SOCIALS = ["GitHub", "LinkedIn", "Instagram"] as const;

function SocialTile({ name }: { name: string }) {
  return (
    <a href={name === "GitHub" ? SITE.github : "#contact"} aria-label={name} className="group flex flex-1 flex-col items-center justify-center gap-3 border-paper/70 p-6 transition-colors duration-150 hover:bg-azure-deep max-md:border-b md:border-b">
      <svg viewBox="0 0 80 52" aria-hidden="true" className="w-20 transition-transform duration-300 group-hover:-translate-y-1" fill="#f4f2e8" stroke="#0755b5" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M6 24l34 -16 34 16v8l-34 16 -34 -16z" />
        <path d="M6 24l34 16 34 -16M40 40v8" fill="none" />
      </svg>
      <span className="text-sm">{name}</span>
    </a>
  );
}

export function Contact() {
  return (
    <section id="contact" data-theme="blue" className="bg-azure text-paper">
      <div className="grid md:grid-cols-[1fr_1fr]">
        <div className="flex flex-col">
          <div className="px-6 py-14 md:px-24 md:py-20">
            <h2 className="font-display text-[clamp(2rem,4.2vw,3.75rem)] font-light leading-[1.05] tracking-[-0.02em]">
              <Scramble text="Tell us what you want" className="block" />
              <Scramble text="to build." delay={0.5} className="block" />
            </h2>
            <div className="mt-8 flex gap-3">
              <a href={`mailto:${SITE.email}`} className="bg-paper px-5 py-3 text-sm text-azure transition-colors hover:bg-paper-2">Get in touch</a>
              <a href={`mailto:${SITE.email}`} className="border border-paper px-5 py-3 text-sm transition-colors hover:bg-paper hover:text-azure">Email us</a>
            </div>
          </div>
          <div className="relative min-h-56 flex-1 border-t border-paper/70">
            <MarkField size={9} className="absolute inset-0 size-full" />
          </div>
        </div>
        <div className="grid md:grid-cols-[1fr_16rem]">
          <div className="wipe p-6 md:p-10 md:pr-0 md:pt-20"><CodeWindow /></div>
          <div className="flex flex-col border-paper/70 md:border-l">
            {SOCIALS.map((s) => (<div key={s} className="pop flex flex-1" style={{ ["--d" as string]: `${0.3 + SOCIALS.indexOf(s) * 0.2}s` }}><SocialTile name={s} /></div>))}
          </div>
        </div>
      </div>

      <footer className="border-t border-paper/70 px-6 py-14 md:px-24">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)] [&>div]:rise">
          <div>
            <p className="font-display text-2xl font-light">Contact</p>
            <a href={`mailto:${SITE.email}`} className="mt-4 block text-base underline underline-offset-4">{SITE.email}</a>
            <p className="mt-3 text-sm">{"{{City}} · Worldwide"}</p>
          </div>
          <div>
            <p className="font-display text-2xl font-light">Services</p>
            <ul className="mt-4 space-y-2 text-sm">{SERVICES.map((s) => (<li key={s.name}>{s.name}</li>))}</ul>
          </div>
          <div>
            <p className="font-display text-2xl font-light">Work</p>
            <ul className="mt-4 space-y-2 text-sm">{PROJECTS.slice(0, 4).map((p) => (<li key={p.title}>{p.category}</li>))}</ul>
          </div>
          <div>
            <p className="font-display text-2xl font-light">Social</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href={SITE.github} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">GitHub</a></li>
              <li><a href="#contact" className="underline-offset-4 hover:underline">{"{{LinkedIn}}"}</a></li>
              <li><a href="#contact" className="underline-offset-4 hover:underline">{"{{Instagram}}"}</a></li>
            </ul>
          </div>
          <div>
            <p className="font-display text-2xl font-light">Studio</p>
            <ul className="mt-4 space-y-2 text-sm">
              {NAV.map((n) => (<li key={n.href}><a href={n.href} className="underline-offset-4 hover:underline">{n.label}</a></li>))}
            </ul>
          </div>
        </div>
        <div className="mt-20 flex flex-wrap items-end justify-between gap-6">
          <div className="flex items-center gap-4">
            <VitragaIcon className="size-14 md:size-20" />
            <span className="font-display text-5xl font-light tracking-[0.04em] md:text-7xl">vitraga</span>
          </div>
          <p className="text-xs">© {SITE.year} {SITE.name}. All rights reserved.</p>
        </div>
      </footer>
    </section>
  );
}
