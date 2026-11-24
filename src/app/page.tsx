import { Suspense } from "react";
import { Contact } from "@/components/site/Contact";
import { Faq } from "@/components/site/Faq";
import { Header } from "@/components/site/Header";
import { ScaleUp } from "@/components/site/ScaleUp";
import { Hero } from "@/components/site/Hero";
import { Process } from "@/components/site/Process";
import { Proof } from "@/components/site/Proof";
import { RevealOnScroll } from "@/components/site/RevealOnScroll";
import { Services } from "@/components/site/Services";
import { Work } from "@/components/site/Work";

type Props = { searchParams: Promise<{ hero?: string }> };

/** Reads the hero option from the URL; the only request-time part of the page. */
async function HeroSlot({ searchParams }: Props) {
  const { hero } = await searchParams;
  return <Hero variant={hero === "blocks" ? "blocks" : "logo"} />;
}

export default function Home({ searchParams }: Props) {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<section id="top" className="h-[calc(100svh-4rem)]" />}>
          <HeroSlot searchParams={searchParams} />
        </Suspense>
        <Services />
        <Process />
        <Proof />
        <ScaleUp />
        <Work />
        <Faq />
        <Contact />
      </main>
      {/* Last, so its effect runs after every section above has hydrated. */}
      <RevealOnScroll />
    </>
  );
}
