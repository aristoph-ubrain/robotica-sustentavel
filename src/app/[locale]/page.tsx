import About from "@/components/sections/About";
import CollectionPoints from "@/components/sections/CollectionPoints";
import Contact from "@/components/sections/Contact";
import Hero from "@/components/sections/Hero";
import Impact from "@/components/sections/Impact";
import ImpactProcess from "@/components/sections/ImpactProcess";
import Initiatives from "@/components/sections/Initiatives";
import Partners from "@/components/sections/Partners";
import Projects from "@/components/sections/Projects";
import WasteTypes from "@/components/sections/WasteTypes";

export default function HomePage() {
  return (
    <main id="conteudo" tabIndex={-1} className="outline-none">
      <Hero />
      <Impact />
      <About />
      <Initiatives />
      <ImpactProcess />
      <WasteTypes />
      <CollectionPoints />
      <Projects />
      <Partners />
      <Contact />
    </main>
  );
}
