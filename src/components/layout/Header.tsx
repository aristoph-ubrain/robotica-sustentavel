import Image from "next/image";
import { getTranslations } from "next-intl/server";

import Container from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

import AnchorLink from "./AnchorLink";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileMenu from "./MobileMenu";
import { navItems, type NavLink } from "./nav-items";
import logo from "../../../public/images/logo-instituto.png";

export default async function Header() {
  const t = await getTranslations("Header");

  const links: NavLink[] = navItems.map((item) => ({
    key: item.key,
    inDesktopBar: !("inDesktopBar" in item) || item.inDesktopBar,
    label: t(`nav.${item.key}`),
    href: { pathname: "/", hash: item.hash },
  }));

  return (
    <header className="sticky top-0 z-40 border-b border-borda bg-branco">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-campo focus:bg-amarelo focus:px-4 focus:py-2.5 focus:font-bold focus:text-tinta"
      >
        {t("skipToContent")}
      </a>

      <Container className="flex h-16 items-center justify-between gap-2">
        <Link
          href="/"
          aria-label={t("homeLabel")}
          className="flex min-h-toque shrink-0 items-center gap-2 rounded-campo"
        >
          <Image
            src={logo}
            alt=""
            width={50}
            height={40}
            className="h-10 w-auto"
          />
          <span className="font-display text-sm leading-[1.05] font-semibold text-verde-escuro">
            {t("nameLine1")}
            <br />
            {t("nameLine2")}
          </span>
        </Link>

        {/* Navegação inline a partir de lg; no mobile ela fica no MobileMenu. */}
        <nav aria-label={t("navLabel")} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.filter((link) => link.inDesktopBar).map(({ key, label, href }) =>
              key === "partner" ? (
                <li key={key} className="ml-2">
                  <AnchorLink
                    hash={href.hash}
                    className={buttonClasses({ variant: "primario", size: "md" })}
                  >
                    {label}
                  </AnchorLink>
                </li>
              ) : (
                <li key={key}>
                  <AnchorLink
                    hash={href.hash}
                    className="inline-flex min-h-toque items-center rounded-campo px-3 font-display font-semibold text-tinta transition-colors hover:bg-fundo-suave hover:text-verde-escuro"
                  >
                    {label}
                  </AnchorLink>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <MobileMenu
            links={links}
            labels={{
              open: t("openMenu"),
              close: t("closeMenu"),
              nav: t("navLabel"),
            }}
            className="lg:hidden"
          />
        </div>
      </Container>
    </header>
  );
}
