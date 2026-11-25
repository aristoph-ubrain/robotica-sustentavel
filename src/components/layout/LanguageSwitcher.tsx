import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";

/**
 * Seletor PT · EN. Troca o idioma só pela URL (/pt ↔ /en), sem cookie.
 *
 * Hoje o site tem uma página só, então o link leva à home do outro idioma.
 * Quando houver páginas internas, troque `href="/"` pelo caminho atual —
 * o que exige `usePathname` (Client Component).
 */
export default async function LanguageSwitcher({
  className,
}: {
  className?: string;
}) {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("Header"),
  ]);

  return (
    <nav aria-label={t("languageLabel")} className={className}>
      <ul className="flex items-center font-display text-sm font-semibold text-verde-escuro">
        {routing.locales.map((code, index) => {
          const current = code === locale;

          return (
            <li key={code} className="flex items-center">
              {index > 0 && (
                <span aria-hidden="true" className="px-0.5">
                  ·
                </span>
              )}
              <Link
                href="/"
                locale={code}
                lang={code}
                hrefLang={code}
                aria-current={current ? "true" : undefined}
                className={cn(
                  "inline-flex min-h-toque min-w-10 items-center justify-center rounded-campo",
                  current
                    ? "underline decoration-2 underline-offset-4"
                    : "hover:bg-fundo-suave",
                )}
              >
                {code.toUpperCase()}
                <span className="sr-only"> — {t(`languages.${code}`)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
