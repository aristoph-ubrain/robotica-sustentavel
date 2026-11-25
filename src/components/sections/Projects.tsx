import Image, { type StaticImageData } from "next/image";
import { getTranslations } from "next-intl/server";

import Container from "@/components/ui/Container";
import { Reveal, RevealItem, RevealList } from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

import caixaElixo from "../../../public/images/home/caixa-elixo.jpg";
import coletaCaminhao from "../../../public/images/home/coleta-caminhao.jpg";
import criancaComponentes from "../../../public/images/home/crianca-componentes.jpg";
import equipe from "../../../public/images/home/equipe.jpg";
import grupoCriancas from "../../../public/images/home/grupo-criancas.jpg";

const stories: { key: string; image: StaticImageData }[] = [
  { key: "campaign", image: coletaCaminhao },
  { key: "workshops", image: criancaComponentes },
  { key: "community", image: grupoCriancas },
  { key: "box", image: caixaElixo },
  { key: "team", image: equipe },
];

export default async function Projects() {
  const t = await getTranslations("Projects");

  return (
    <section id="projetos" aria-labelledby="projetos-titulo" className="pb-secao lg:pb-secao-lg">
      <Container>
        <Reveal>
          <SectionHeading id="projetos-titulo" title={t("title")} />
        </Reveal>
      </Container>

      {/* Carrossel nativo: rolagem horizontal com scroll-snap, sem biblioteca. */}
      <div className="mx-auto w-full max-w-site">
        <RevealList
          aria-label={t("carouselLabel")}
          tabIndex={0}
          className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-gutter px-gutter pb-2 md:scroll-px-gutter-lg md:px-gutter-lg lg:mt-8 lg:gap-5"
        >
          {stories.map(({ key, image }) => (
            <RevealItem key={key} className="w-[260px] shrink-0 snap-start lg:w-[340px]">
              <figure>
                <div className="relative h-[190px] overflow-hidden rounded-cartao lg:h-[250px]">
                  <Image
                    src={image}
                    alt={t(`items.${key}.imageAlt`)}
                    fill
                    sizes="(min-width: 1024px) 340px, 260px"
                    placeholder="blur"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-2 font-display text-base font-semibold">
                  {t(`items.${key}.caption`)}
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealList>
      </div>

      <Container>
        <Reveal className="mt-7 rounded-cartao bg-fundo-suave p-[18px] lg:mt-10 lg:flex lg:items-center lg:gap-6 lg:p-6">
          <h3 className="text-[15px] font-semibold uppercase text-verde-complementar">
            {t("mediaTitle")}
          </h3>
          <p className="mt-1 text-sm leading-relaxed lg:mt-0">{t("mediaList")}</p>
        </Reveal>
      </Container>
    </section>
  );
}
