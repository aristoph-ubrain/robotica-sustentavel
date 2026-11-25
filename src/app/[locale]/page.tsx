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

/**
 * Ordem de leitura: apresenta o Instituto, mostra como o trabalho funciona e
 * os resultados, e termina nas formas de participar (do visitante à empresa).
 */
export default function HomePage() {
  return (
    <main id="conteudo" tabIndex={-1} className="outline-none">
      <Hero />

      {/* 1. Quem somos e o que fazemos */}
      <About />
      <Initiatives />

      {/* 2. Como funciona e o que já mudou */}
      <ImpactProcess />
      <Impact />
      <Projects />

      {/* 3. Como você participa: descartar, apoiar, falar com a gente */}
      <WasteTypes />
      <CollectionPoints />
      <Partners />
      <Contact />
    </main>
  );
}
