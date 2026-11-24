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

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
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
