import Image, { type StaticImageData } from "next/image";
import { getTranslations } from "next-intl/server";

import Container from "@/components/ui/Container";
import { Reveal, RevealItem, RevealList } from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

import exposicao from "../../../public/images/home/exposicao.jpg";
import manutencao from "../../../public/images/home/manutencao-computadores.jpg";
import oficinaSala from "../../../public/images/home/oficina-sala.jpg";

const initiatives: { key: string; image: StaticImageData }[] = [
  { key: "robotics", image: oficinaSala },
  { key: "inclusion", image: manutencao },
  { key: "events", image: exposicao },
];

const topics = [
  "robotics",
  "environmental",
  "computing",
  "maintenance",
  "automation",
  "programming",
] as const;

export default async function Initiatives() {
  const t = await getTranslations("Initiatives");

  return (
    <section
      id="o-que-fazemos"
      aria-labelledby="o-que-fazemos-titulo"
      className="py-secao lg:py-secao-lg"
    >
      <Container>
        <Reveal>
          <SectionHeading id="o-que-fazemos-titulo" title={t("title")} />
        </Reveal>

        <RevealList className="mt-4 grid gap-4 md:grid-cols-2 lg:mt-8 lg:grid-cols-3 lg:gap-6">
          {initiatives.map(({ key, image }) => (
            <RevealItem key={key}>
              <article className="flex h-full flex-col overflow-hidden rounded-midia border border-borda">
                <div className="relative h-[170px] lg:h-[220px]">
                  <Image
                    src={image}
                    alt={t(`items.${key}.imageAlt`)}
                    fill
                    sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
                    placeholder="blur"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col px-[18px] pt-4 pb-1.5">
                  <h3 className="text-subtitulo">{t(`items.${key}.title`)}</h3>
                  <p className="mt-1 flex-1 text-[15px] leading-normal">
                    {t(`items.${key}.description`)}
                  </p>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealList>

        <Reveal>
          <h3 className="mt-6 text-lg lg:mt-10">{t("topicsTitle")}</h3>
        </Reveal>
        <RevealList className="mt-2.5 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
          {topics.map((key) => (
            <RevealItem
              key={key}
              className="rounded-campo border-[1.5px] border-borda-forte px-3 py-2.5 text-sm font-bold"
            >
              {t(`topics.${key}`)}
            </RevealItem>
          ))}
        </RevealList>
      </Container>
    </section>
  );
}
