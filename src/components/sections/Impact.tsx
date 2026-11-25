import { getFormatter, getTranslations } from "next-intl/server";

import Container from "@/components/ui/Container";
import { Reveal, RevealItem, RevealList } from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { impactStats } from "@/lib/data/impact";

export default async function Impact() {
  const t = await getTranslations("Impact");
  const format = await getFormatter();

  return (
    <section
      id="impacto"
      aria-labelledby="impacto-titulo"
      className="py-secao lg:py-secao-lg"
    >
      <Container>
        <Reveal>
          <SectionHeading id="impacto-titulo" title={t("title")} accent />
        </Reveal>

        <RevealList as="dl" className="mt-5 grid grid-cols-2 gap-3 lg:mt-8 lg:grid-cols-4 lg:gap-5">
          {impactStats.map(({ key, value, suffix }) => (
            // dt vem antes no DOM (leitores de tela); visualmente o número fica em cima.
            <RevealItem
              as="div"
              key={key}
              className="flex flex-col-reverse justify-end rounded-cartao border border-borda px-3.5 py-4 lg:px-6 lg:py-6"
            >
              <dt className="mt-1.5 text-sm leading-snug lg:text-base">
                {t(`stats.${key}`)}
              </dt>
              <dd className="font-display text-[34px] leading-none font-semibold text-verde-escuro lg:text-5xl">
                {format.number(value)}
                {suffix}
              </dd>
            </RevealItem>
          ))}
        </RevealList>

        <p className="mt-2.5 text-xs text-tinta-suave lg:text-sm">
          {t("note")}
        </p>
      </Container>
    </section>
  );
}
