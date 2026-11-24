/**
 * Single source of copy for every version. Anything wrapped in {{ }} is a
 * placeholder the team still has to confirm; nothing here is a made-up metric.
 */
export const SITE = {
  name: "Vitraga",
  // Placeholder address until the real inbox is confirmed.
  email: "hello@vitraga.com",
  linkedin: "https://www.linkedin.com/company/vitraga",
  // Placeholder until the studio X account is confirmed.
  x: "https://x.com/vitraga",
  year: 2026,
} as const;

export const NAV = [
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#work", label: "Work" },
  { href: "#faq", label: "FAQ" },
] as const;

type MenuItem = { name: string; note: string; href: string };
export type Menu = { label: string; href: string; groups: readonly { title: string; items: readonly MenuItem[] }[] };

/** Mega menus in the header. Every item links to a section on this page for now. */
export const MENUS: readonly Menu[] = [
  {
    label: "Services",
    href: "#services",
    groups: [
      { title: "Build", items: [
        { name: "Web platforms", note: "SaaS products and portals, typed and tested", href: "#services" },
        { name: "MVP development", note: "Prove the idea in weeks, not quarters", href: "#services" },
        { name: "Mobile apps", note: "Cross-platform on a shared backend", href: "#services" },
        { name: "Legacy modernisation", note: "Old stacks moved to a maintainable one", href: "#services" },
      ] },
      { title: "AI and data", items: [
        { name: "AI agents", note: "Agents connected to your tools and documents", href: "#services" },
        { name: "LLM integration", note: "Search, extraction and RAG inside your product", href: "#services" },
        { name: "Dashboards", note: "Metrics your team actually opens", href: "#services" },
      ] },
      { title: "Run and scale", items: [
        { name: "Cloud and DevOps", note: "Deploys, monitoring and rollbacks", href: "#services" },
        { name: "QA automation", note: "End-to-end and load tests in CI", href: "#services" },
        { name: "Dedicated team", note: "Senior engineers on your roadmap", href: "#contact" },
      ] },
    ],
  },
  {
    label: "Industries",
    href: "#work",
    groups: [
      { title: "Regulated", items: [
        { name: "Healthcare", note: "Clinical and patient software", href: "#work" },
        { name: "Fintech", note: "Payments, lending and reporting", href: "#work" },
      ] },
      { title: "Product and commerce", items: [
        { name: "SaaS", note: "Multi-tenant platforms", href: "#work" },
        { name: "Education", note: "Learning platforms and tools", href: "#work" },
      ] },
      { title: "Operations", items: [
        { name: "Travel", note: "Booking and itinerary systems", href: "#work" },
        { name: "Logistics", note: "Tracking, routing and dispatch", href: "#work" },
      ] },
    ],
  },
];

export const NAV_LINKS = [
  { href: "#process", label: "Process" },
  { href: "#work", label: "Work" },
  { href: "#faq", label: "FAQ" },
] as const;

export const SERVICES = [
  { name: "AI systems", body: "Custom agents and pipelines, connected to your documents and the tools you already use." },
  { name: "Web platforms", body: "SaaS products and portals built around how your business actually works, typed and tested." },
  { name: "Mobile apps", body: "Cross-platform apps on a shared backend, with content you can edit without us." },
  { name: "Cloud and infrastructure", body: "Secure deploys, monitoring and rollbacks, so launch day is quiet." },
] as const;

export const FAQ_GROUPS = [
  { title: "Ownership and independence", items: [0, 2] },
  { title: "Project and process", items: [1, 3] },
  { title: "Costs", items: [4] },
] as const;

export const HERO = {
  eyebrow: "Software studio",
  lead: "Senior engineers and AI-assisted workflows build your web app, backend and infrastructure. Secure by default, tested, and live in weeks.",
  cta: "Start a project",
} as const;

export const STORY = {
  label: "Why we exist",
  text: "Most software projects slow down in the handover between idea, design and code. We keep one senior-led team on the whole path, use AI where it removes repetition, and put every line in front of a human reviewer before it ships.",
} as const;

export const METHOD = [
  {
    step: "01",
    title: "Scope",
    time: "Week 1",
    body: "A working session turns the brief into a plan: user flows, architecture, data model and a delivery date you can hold us to.",
  },
  {
    step: "02",
    title: "Build",
    time: "Weeks 2 to 3",
    body: "Weekly releases to a staging site you can click. AI drafts code and tests; a senior engineer reviews every change.",
  },
  {
    step: "03",
    title: "Ship",
    time: "Week 4",
    body: "Security review, load checks, monitoring and a rollback-safe deploy. You get the repository, docs and runbooks.",
  },
  {
    step: "04",
    title: "Run",
    time: "Ongoing",
    body: "We stay on for fixes and new features, or hand over cleanly to your own team. The code is yours either way.",
  },
] as const;

export type Project = {
  category: string;
  title: string;
  summary: string;
  stack: readonly string[];
  scope: string;
};

// Projects 1 to 4 come from the current vitraga.com. Project 5 is a placeholder.
export const PROJECTS: readonly Project[] = [
  {
    category: "Healthcare",
    title: "NDIS management system",
    summary:
      "A participant and provider platform that streamlines care plans, funding tracking and compliance reporting.",
    stack: ["Next.js", "Supabase", "PostgreSQL"],
    scope: "Product, platform, compliance",
  },
  {
    category: "AI",
    title: "AI image compositor and analyser",
    summary:
      "Merges multiple uploaded images into one cohesive output, then returns a deep analysis of the result.",
    stack: ["Python", "Next.js", "Computer vision"],
    scope: "ML pipeline, web app",
  },
  {
    category: "Travel",
    title: "Travel booking engine",
    summary:
      "A premium booking portal with a dynamic package builder, live availability and automated quote generation.",
    stack: ["Next.js", "Supabase", "Payments"],
    scope: "Booking, payments, PDF quotes",
  },
  {
    category: "Education",
    title: "Education resource app",
    summary:
      "A mobile resource library, global member database and multilingual CMS for an international education network.",
    stack: ["React Native", "Headless CMS", "i18n"],
    scope: "Mobile app, CMS",
  },
  {
    category: "{{Category}}",
    title: "{{Project five}}",
    summary: "{{One-line outcome for the fifth case study.}}",
    stack: ["{{Stack}}"],
    scope: "{{Scope}}",
  },
] as const;

export const PLANS = [
  {
    name: "Product sprint",
    term: "2 to 4 weeks, fixed scope",
    summary: "Validate an idea or ship one critical feature with a senior engineer on point.",
    items: [
      "Scoping workshop and technical plan",
      "Architecture and data model",
      "One feature live in production",
      "Handover with docs and tests",
    ],
    cta: "Book a sprint",
  },
  {
    name: "Embedded team",
    term: "Monthly, dedicated",
    summary: "A senior-led squad that plans, builds and releases with you every week.",
    items: [
      "Lead engineer plus specialists",
      "Weekly production releases",
      "AI-assisted code review and QA",
      "Scale up or down each month",
    ],
    cta: "Build a team",
  },
  {
    name: "Enterprise",
    term: "Custom, long-term",
    summary: "For regulated, high-traffic or legacy systems that cannot afford downtime.",
    items: [
      "Security review and compliance readiness",
      "SLAs with 24/7 monitoring",
      "Dedicated solutions architect",
      "Private cloud or on-prem deploys",
    ],
    cta: "Talk to us",
  },
] as const;

export const FAQ = [
  {
    q: "How is Vitraga different from a regular dev agency?",
    a: "Every project is led by senior engineers, and AI-assisted workflows handle the repetitive work. You get agency-level output on a shorter timeline.",
  },
  {
    q: "Where does AI fit in, and who reviews the code?",
    a: "AI drafts code, tests and docs. A senior engineer reviews and owns every line that ships. Nothing reaches production without a human sign-off.",
  },
  {
    q: "Do we own the code and the IP?",
    a: "Yes. The repository, the code and all IP are yours from the first commit.",
  },
  {
    q: "How fast can you start?",
    a: "The first sprint opens with scoping, so you see a plan and a delivery date within the first few days.",
  },
  {
    q: "What does a project cost?",
    a: "It depends on scope. A sprint is fixed-price and teams are billed monthly. Book a call and we will send a written estimate.",
  },
] as const;
