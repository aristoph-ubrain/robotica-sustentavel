import { getTranslations } from "next-intl/server";

import Container from "@/components/ui/Container";
import { Reveal, RevealItem, RevealList } from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

// Cores de identificação das "linhas" de eletroeletrônicos (padrão do setor),
// usadas só como marcador pequeno, sem competir com a paleta da marca.
const lines = [
  { key: "white", dot: "bg-linha-branca ring-1 ring-tinta-suave/40" },
  { key: "brown", dot: "bg-linha-marrom" },
  { key: "green", dot: "bg-verde-claro" },
  { key: "blue", dot: "bg-linha-azul" },
] as const;

export default async function WasteTypes() {
  const t = await getTranslations("WasteTypes");

  return (
    <section aria-labelledby="descarte-titulo">
      <Container>
        <Reveal>
          <SectionHeading
            id="descarte-titulo"
            title={t("title")}
            description={t("description")}
          />
        </Reveal>

        <RevealList className="mt-4 grid grid-cols-2 gap-2.5 lg:mt-8 lg:grid-cols-4 lg:gap-5">
          {lines.map(({ key, dot }) => (
            <RevealItem
              key={key}
              className="rounded-cartao border border-borda p-3.5 lg:p-5"
            >
              <h3 className="flex items-center gap-1.5 text-[17px] lg:text-xl">
                <span
                  aria-hidden="true"
                  className={cn("size-3 shrink-0 rounded-pill lg:size-3.5", dot)}
                />
                {t(`lines.${key}.title`)}
              </h3>
              <p className="mt-1 text-[13px] leading-snug lg:text-sm">
                {t(`lines.${key}.items`)}
              </p>
            </RevealItem>
          ))}
        </RevealList>
      </Container>
    </section>
  );
}
