import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Button, ButtonLink } from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

/*
 * Vitrine do Design System — só existe em desenvolvimento.
 * Abra /pt/design-system com `npm run dev`. Em produção responde 404.
 * Textos fixos de propósito: é ferramenta interna, não conteúdo do site.
 */

export const metadata: Metadata = {
  title: "Design System",
  robots: { index: false, follow: false },
};

const cores = [
  ["verde-escuro", "bg-verde-escuro", "#0A7000"],
  ["verde-claro", "bg-verde-claro", "#05A61D"],
  ["verde-complementar", "bg-verde-complementar", "#20731D"],
  ["amarelo", "bg-amarelo", "#F2D16D"],
  ["branco", "bg-branco", "#FFFFFF"],
  ["tinta", "bg-tinta", "#12301A"],
  ["tinta-suave", "bg-tinta-suave", "#4A5F4C"],
  ["borda", "bg-borda", "#E4ECE2"],
  ["fundo-suave", "bg-fundo-suave", "#F3F7F2"],
  ["creme", "bg-creme", "#FFF8DE"],
] as const;

const raios = [
  ["campo", "rounded-campo", "12px"],
  ["botao", "rounded-botao", "14px"],
  ["cartao", "rounded-cartao", "18px"],
  ["midia", "rounded-midia", "20px"],
  ["painel", "rounded-painel", "24px"],
  ["pill", "rounded-pill", "999px"],
] as const;

export default function DesignSystemPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <main id="conteudo" tabIndex={-1} className="pb-secao-lg outline-none">
      <Container className="py-secao">
        <SectionHeading
          as="h1"
          eyebrow="Ferramenta interna"
          title="Design System"
          description="Tokens e componentes de UI. Use Tab para conferir o foco visível."
          accent
        />

        <h2 className="mt-10 text-subtitulo">Cores</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {cores.map(([nome, classe, hex]) => (
            <li
              key={nome}
              className="overflow-hidden rounded-cartao border border-borda"
            >
              <div className={`h-16 ${classe}`} />
              <div className="p-3 text-sm">
                <p className="font-bold">{nome}</p>
                <p className="text-tinta-suave">{hex}</p>
              </div>
            </li>
          ))}
        </ul>

        <h2 className="mt-10 text-subtitulo">Tipografia</h2>
        <div className="mt-4 space-y-3">
          <p className="font-display text-display font-semibold">
            Display 44 — Baloo 2
          </p>
          <p className="font-display text-titulo font-semibold">
            Título 30 — Baloo 2
          </p>
          <p className="font-display text-subtitulo font-semibold">
            Subtítulo 22 — Baloo 2
          </p>
          <p>Texto 16 regular — Nunito Sans 400</p>
          <p className="font-semibold">Texto 16 semibold — Nunito Sans 600</p>
          <p className="font-bold">Texto 16 bold — Nunito Sans 700</p>
          <p className="text-sm text-tinta-suave">
            Texto secundário 14 — tinta-suave
          </p>
        </div>

        <h2 className="mt-10 text-subtitulo">Raios</h2>
        <ul className="mt-4 flex flex-wrap gap-4">
          {raios.map(([nome, classe, valor]) => (
            <li key={nome} className="text-center text-sm">
              <div
                className={`size-20 border-2 border-verde-escuro bg-fundo-suave ${classe}`}
              />
              <p className="mt-1 font-bold">{nome}</p>
              <p className="text-tinta-suave">{valor}</p>
            </li>
          ))}
        </ul>

        <h2 className="mt-10 text-subtitulo">Botões sobre fundo claro</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button>Primário</Button>
          <Button variant="secundario">Secundário</Button>
          <Button size="md">Primário md (44px)</Button>
          <Button disabled>Desabilitado</Button>
          <ButtonLink href="#escuro" variant="secundario">
            ButtonLink âncora
          </ButtonLink>
        </div>
      </Container>

      <section id="escuro" className="superficie-escura py-secao">
        <Container>
          <SectionHeading
            tone="escuro"
            eyebrow="Superfície escura"
            title="Do descarte ao impacto"
            description="Em fundo verde o foco vira amarelo (classe superficie-escura)."
          />
          <div className="mt-6 flex max-w-sm flex-col gap-2.5">
            <ButtonLink href="/" variant="amarelo" fullWidth>
              Amarelo (link interno)
            </ButtonLink>
            <Button variant="contorno-claro" fullWidth>
              Contorno claro
            </Button>
          </div>
        </Container>
      </section>

      <Container className="py-secao">
        <div className="rounded-painel bg-fundo-suave p-6">
          <SectionHeading eyebrow="Quem somos" title="Painel fundo-suave" />
        </div>
        <div className="mt-4 rounded-painel bg-creme p-6">
          <SectionHeading title="Painel creme" accent />
        </div>
      </Container>
    </main>
  );
}
