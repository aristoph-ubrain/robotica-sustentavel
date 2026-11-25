import Image from "next/image";
import { getTranslations } from "next-intl/server";

import Container from "@/components/ui/Container";
import { Reveal, RevealItem, RevealList } from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

import roboSucata from "../../../public/images/home/robo-sucata.jpg";

const steps = ["donation", "collection", "reuse", "education"] as const;

export default async function ImpactProcess() {
  const t = await getTranslations("ImpactProcess");

  return (
    <section
      aria-labelledby="processo-titulo"
      className="superficie-escura py-secao lg:py-secao-lg"
    >
      <Container className="lg:grid lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-14">
        <div>
          <Reveal>
            <SectionHeading
              id="processo-titulo"
              tone="escuro"
              title={t("title")}
              description={t("description")}
            />
          </Reveal>

          <RevealList as="ol" className="mt-6 lg:mt-8">
            {steps.map((key, index) => {
              const last = index === steps.length - 1;
              return (
                <RevealItem key={key} className="flex gap-3.5">
                  <div className="flex flex-col items-center">
                    <span
                      aria-hidden="true"
                      className="flex size-11 shrink-0 items-center justify-center rounded-pill bg-amarelo font-display text-xl font-semibold text-tinta"
                    >
                      {index + 1}
                    </span>
                    {!last && (
                      <span
                        aria-hidden="true"
                        className="min-h-[18px] w-0.5 flex-1 bg-verde-claro"
                      />
                    )}
                  </div>
                  <div className={last ? undefined : "pb-[18px]"}>
                    <h3 className="text-xl">{t(`steps.${key}.title`)}</h3>
                    <p className="text-sm leading-normal lg:text-base">
                      {t(`steps.${key}.description`)}
                    </p>
                  </div>
                </RevealItem>
              );
            })}
          </RevealList>
        </div>

        <Reveal delay={0.15} className="relative mt-7 h-[220px] overflow-hidden rounded-midia sm:h-[320px] lg:mt-0 lg:h-[420px]">
          <Image
            src={roboSucata}
            alt={t("imageAlt")}
            fill
            sizes="(min-width: 1024px) 480px, 100vw"
            placeholder="blur"
            className="object-cover"
          />
        </Reveal>
      </Container>
    </section>
  );
}
