import { getTranslations } from "next-intl/server";

import Container from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

const values = [
  "innovation",
  "socialImpact",
  "sustainability",
  "creativity",
  "partnership",
] as const;

export default async function About() {
  const t = await getTranslations("About");

  return (
    <section id="instituto" aria-labelledby="instituto-titulo">
      <Container>
        <Reveal className="rounded-painel bg-fundo-suave px-5 py-6 lg:grid lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-12 lg:px-12 lg:py-12">
          <SectionHeading
            id="instituto-titulo"
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("description")}
          />

          <div className="mt-5 lg:mt-0">
            <h3 className="text-lg text-verde-escuro">{t("valuesTitle")}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {values.map((key) => (
                <li
                  key={key}
                  className="rounded-pill bg-branco px-3 py-1.5 text-sm font-bold"
                >
                  {t(`values.${key}`)}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-base leading-relaxed">
              <strong className="font-bold">{t("missionLabel")}</strong>{" "}
              {t("mission")}
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
