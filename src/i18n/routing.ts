import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pt", "en"],
  defaultLocale: "pt",
  // O idioma vem só da URL: /pt/... ou /en/...
  localePrefix: "always",
  // Sem cookie de idioma (nem gravado pelo proxy, nem pelo <Link>).
  localeCookie: false,
  // Ignora cookie e Accept-Language: "/" e rotas sem prefixo vão para /pt.
  localeDetection: false,
});
