import { getTranslations } from "next-intl/server";

import Container from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

import ContactForms from "./ContactForms";

/** "Fale com a gente": formulários de escola e empresa que abrem o WhatsApp. */
export default async function Contact() {
  const t = await getTranslations("Contact");

  return (
    <section
      id="contato"
      aria-labelledby="contato-titulo"
      className="py-secao lg:py-secao-lg"
    >
      <Container className="lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
        <Reveal className="lg:sticky lg:top-24 lg:self-start">
          <SectionHeading
            id="contato-titulo"
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("description")}
            accent
          />
        </Reveal>

        <div className="mt-6 lg:mt-0">
          <ContactForms />
        </div>
      </Container>
    </section>
  );
}
