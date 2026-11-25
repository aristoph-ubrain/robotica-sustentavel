import { getTranslations } from "next-intl/server";

import Container from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { collectionCities, collectionPoints } from "@/lib/data/collection-points";

import CollectionPointsExplorer from "./CollectionPointsExplorer";

export default async function CollectionPoints() {
  const t = await getTranslations("CollectionPoints");

  return (
    <section
      id="pontos"
      aria-labelledby="pontos-titulo"
      className="py-secao lg:py-secao-lg"
    >
      <Container>
        <Reveal>
          <CollectionPointsExplorer
            points={collectionPoints}
            cities={collectionCities}
            heading={
              <SectionHeading
                id="pontos-titulo"
                title={t("title")}
                description={t("description")}
              />
            }
          />
        </Reveal>
      </Container>
    </section>
  );
}
