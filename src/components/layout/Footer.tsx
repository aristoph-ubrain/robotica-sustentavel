import { AtSign, Mail, MessageCircle } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import Container from "@/components/ui/Container";
import { contact } from "@/lib/data/contact";

import AnchorLink from "./AnchorLink";
import { navItems } from "./nav-items";
import logo from "../../../public/images/logo-instituto.png";

export default async function Footer() {
  const t = await getTranslations("Footer");
  const tNav = await getTranslations("Header.nav");

  const contacts = [
    { icon: MessageCircle, label: contact.phoneDisplay, href: contact.whatsappUrl, external: true },
    { icon: Mail, label: contact.email, href: `mailto:${contact.email}`, external: false },
    { icon: AtSign, label: contact.instagramHandle, href: contact.instagramUrl, external: true },
  ];

  return (
    <footer className="superficie-escura py-9 lg:py-16">
      <Container className="grid gap-8 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-12">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex rounded-campo bg-branco p-1.5">
              <Image src={logo} alt="" width={45} height={36} className="h-9 w-auto" />
            </span>
            <p className="font-display text-[17px] leading-[1.05] font-semibold">
              Instituto Robótica
              <br />
              Sustentável
            </p>
          </div>
          <p className="mt-3.5 max-w-sm text-sm leading-relaxed">{t("description")}</p>
        </div>

        <nav aria-label={t("navLabel")}>
          <h2 className="text-lg">{t("navTitle")}</h2>
          <ul className="mt-2">
            {navItems.map(({ key, hash }) => (
              <li key={key}>
                <AnchorLink
                  hash={hash}
                  className="inline-flex min-h-10 items-center hover:underline"
                >
                  {tNav(key)}
                </AnchorLink>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-lg">{t("contactTitle")}</h2>
          <ul className="mt-2">
            {contacts.map(({ icon: Icon, label, href, external }) => (
              <li key={href}>
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="inline-flex min-h-10 items-center gap-2 break-all underline-offset-2 hover:underline"
                >
                  <Icon aria-hidden="true" className="size-4 shrink-0" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <Container>
        <div className="mt-8 border-t border-verde-complementar pt-5 text-[13px]">
          {/* Incluir aqui o link para a Política de privacidade quando a página existir. */}
          <p>{t("copyright")}</p>
        </div>
      </Container>
    </footer>
  );
}
