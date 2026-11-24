import { VitragaIcon } from "@/components/brand/Logo";
import { NAV, PROJECTS, SERVICES, SITE } from "@/content/site";
import { PinwheelField } from "./PinwheelField";
import { Scramble } from "./Scramble";

const ICONS = {
  linkedin: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z",
  x: "M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.63 7.58H.48l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93zm-1.29 19.5h2.04L6.48 3.24H4.3l13.31 17.41z",
  email: "M2 4h20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 2v.5l10 6.25L22 6.5V6H2zm20 2.86-9.47 5.92a1 1 0 0 1-1.06 0L2 8.86V18h20V8.86z",
} as const;

const SOCIALS = [
  { name: "LinkedIn", href: SITE.linkedin, icon: ICONS.linkedin },
  { name: "X", href: SITE.x, icon: ICONS.x },
  { name: "Email", href: `mailto:${SITE.email}`, icon: ICONS.email },
] as const;

function SocialTile({ name, href, icon }: (typeof SOCIALS)[number]) {
  const isExternal = href.startsWith("http");
  return (
    <a href={href} {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})} className="group flex flex-1 flex-col items-center justify-center gap-3 border-paper/70 p-6 transition-colors duration-150 hover:bg-azure-deep max-md:border-b md:border-b">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-7 transition-transform duration-300 group-hover:-translate-y-1" fill="currentColor"><path d={icon} /></svg>
      <span className="text-sm">{name}</span>
    </a>
  );
}

export function Contact() {
  return (
    <section id="contact" data-theme="blue" className="bg-band text-paper">
      <div className="grid md:grid-cols-[1fr_16rem]">
        <div className="flex flex-col">
          <div className="px-6 py-14 md:px-24 md:py-20">
            <h2 className="font-display text-[clamp(2rem,4.2vw,3.75rem)] font-light leading-[1.05] tracking-[-0.02em]">
              <Scramble text="Tell us what you want" className="block" />
              <Scramble text="to build." delay={0.5} className="block" />
            </h2>
            <div className="mt-8 flex gap-3">
              <a href={`mailto:${SITE.email}`} className="rounded-lg bg-paper px-5 py-3 text-sm font-medium text-azure transition-colors hover:bg-paper-2">Get in touch</a>
              <a href={`mailto:${SITE.email}`} className="rounded-lg border border-paper px-5 py-3 text-sm transition-colors hover:bg-paper hover:text-azure">Email us</a>
            </div>
          </div>
        </div>
        <div className="grid">
          <div className="flex flex-col border-paper/70 md:border-l">
            {SOCIALS.map((s) => (<div key={s.name} className="pop flex flex-1"><SocialTile {...s} /></div>))}
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
              {SOCIALS.map((s) => (
                <li key={s.name}>
                  <a href={s.href} {...(s.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})} className="underline-offset-4 hover:underline">{s.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-display text-2xl font-light">Studio</p>
            <ul className="mt-4 space-y-2 text-sm">
              {NAV.map((n) => (<li key={n.href}><a href={n.href} className="underline-offset-4 hover:underline">{n.label}</a></li>))}
            </ul>
          </div>
        </div>
      </footer>
      {/* Full-bleed sign-off: a field of our pinwheels that turn toward the pointer. */}
      <div className="relative h-[22rem] border-t border-paper/70 md:h-[34rem]">
        <PinwheelField className="absolute inset-0 size-full" />
      </div>
      <footer className="border-t border-paper/70 px-6 py-8 md:px-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
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
