import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito_Sans } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { routing } from "@/i18n/routing";
import "../globals.css";

// Títulos, navegação, botões e números.
const baloo = Baloo_2({
  subsets: ["latin"],
  weight: "600",
  display: "swap",
  variable: "--font-baloo",
});

// Textos corridos.
const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-nunito",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// Tema sempre claro: o site não tem versão escura e "only light" também
// impede o escurecimento automático de navegadores (Chrome/Samsung no Android).
export const viewport: Viewport = {
  colorScheme: "only light",
  themeColor: "#ffffff",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({
    locale,
    namespace: "Metadata",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html
      lang={locale === "pt" ? "pt-BR" : "en"}
      className={`${baloo.variable} ${nunito.variable}`}
      // Desliga o scroll suave durante trocas de rota (só vale para âncoras).
      data-scroll-behavior="smooth"
    >
      <body>
        <NextIntlClientProvider>
          <Header />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
