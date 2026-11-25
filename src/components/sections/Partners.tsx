import { getTranslations } from "next-intl/server";

import { ButtonLink } from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { Reveal, RevealItem, RevealList } from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { contact } from "@/lib/data/contact";
import { cn } from "@/lib/cn";

const plans = ["donation", "sustainability", "technology", "robotics"] as const;

export default async function Partners() {
  const t = await getTranslations("Partners");

  return (
    <section
      id="parceiro"
      aria-labelledby="parceiro-titulo"
      className="bg-creme py-secao lg:py-secao-lg"
    >
      <Container>
        <Reveal>
          <SectionHeading
            id="parceiro-titulo"
            title={t("title")}
            description={t("description")}
          />
        </Reveal>

        <RevealList className="mt-[18px] grid gap-2.5 md:grid-cols-2 lg:mt-8 lg:grid-cols-4 lg:gap-5">
          {plans.map((key) => {
            const featured = key === "robotics";
            return (
              <RevealItem
                key={key}
                className={cn(
                  "rounded-cartao p-4 lg:p-6",
                  featured ? "superficie-escura" : "bg-branco",
                )}
              >
                <div className="flex items-baseline justify-between gap-3 lg:flex-col lg:gap-1">
                  <h3 className="text-[19px] lg:text-xl">{t(`plans.${key}.name`)}</h3>
                  <p
                    className={cn(
                      "font-display text-[17px] font-semibold whitespace-nowrap lg:text-2xl",
                      featured ? "text-amarelo" : "text-verde-escuro",
                    )}
                  >
                    {t(`plans.${key}.price`)}
                  </p>
                </div>
                <p className="mt-1 text-[13px] leading-snug lg:mt-3 lg:text-sm">
                  {t(`plans.${key}.description`)}
                </p>
              </RevealItem>
            );
          })}
        </RevealList>

        <Reveal>
          <p className="mt-3 text-xs text-tinta-suave">{t("pricesNote")}</p>

          <ButtonLink
          href={contact.whatsappUrl}
          variant="primario"
          fullWidth
          className="mt-[18px] md:w-auto md:px-8"
        >
            {t("cta")}
          </ButtonLink>
        </Reveal>
      </Container>
    </section>
  );
}
