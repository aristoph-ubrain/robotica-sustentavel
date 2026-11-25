import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { ButtonLink } from "@/components/ui/Button";
import Container from "@/components/ui/Container";

import oficinaMontagem from "../../../public/images/home/oficina-montagem.jpg";

/** Linhas de circuito decorativas (canto superior direito). */
function CircuitLines({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 150 120"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M150 20H90l-20 20H40" />
      <circle cx="36" cy="40" r="5" />
      <path d="M150 60h-40l-14 14H70" />
      <circle cx="66" cy="74" r="5" />
    </svg>
  );
}

export default async function Hero() {
  const t = await getTranslations("Hero");

  return (
    <section
      aria-labelledby="hero-titulo"
      className="superficie-escura relative overflow-hidden"
    >
      <CircuitLines className="pointer-events-none absolute top-3 right-0 h-[120px] w-[150px] text-verde-claro lg:top-8 lg:h-[180px] lg:w-[225px]" />

      <Container className="relative grid gap-7 pt-8 pb-10 lg:grid-cols-2 lg:items-center lg:gap-14 lg:py-20">
        <div>
          <span className="inline-block rounded-pill bg-amarelo px-3 py-1.5 text-xs font-bold text-tinta">
            {t("badge")}
          </span>

          <h1
            id="hero-titulo"
            className="mt-4 text-display sm:text-6xl sm:leading-[1.02] lg:text-7xl"
          >
            {t.rich("title", {
              highlight: (chunks) => (
                <span className="text-amarelo">{chunks}</span>
              ),
            })}
          </h1>

          <p className="mt-3.5 max-w-xl text-[17px] leading-normal lg:text-lg">
            {t("description")}
          </p>

          <div className="mt-[22px] flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
            <ButtonLink href="#pontos" variant="amarelo" className="sm:px-7">
              {t("ctaPrimary")}
            </ButtonLink>
            <ButtonLink
              href="#instituto"
              variant="contorno-claro"
              className="sm:px-7"
            >
              {t("ctaSecondary")}
            </ButtonLink>
          </div>
        </div>

        <div className="relative h-[250px] overflow-hidden rounded-tr-[96px] rounded-bl-[96px] sm:h-[360px] lg:h-[440px]">
          <Image
            src={oficinaMontagem}
            alt={t("imageAlt")}
            fill
            preload
            sizes="(min-width: 1200px) 540px, (min-width: 1024px) calc(50vw - 60px), calc(100vw - 40px)"
            placeholder="blur"
            className="object-cover"
          />
        </div>
      </Container>
    </section>
  );
}
