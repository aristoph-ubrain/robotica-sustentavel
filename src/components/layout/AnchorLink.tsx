"use client";

import type { ComponentProps, MouseEvent } from "react";

import { Link, usePathname } from "@/i18n/navigation";

type AnchorLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  /** id da seção da página inicial (sem "#"). */
  hash: string;
  /** Chamado antes de rolar (ex.: fechar o menu mobile). */
  onNavigate?: () => void;
};

/**
 * Link para uma seção da página inicial.
 *
 * O <Link> do Next não faz nada quando a URL de destino é igual à atual
 * (ex.: clicar duas vezes em "O Instituto" com /pt#instituto já na barra).
 * Na página inicial, este componente rola até a seção sempre que é clicado;
 * em outras páginas, deixa o <Link> navegar normalmente para /#secao.
 */
export default function AnchorLink({
  hash,
  onNavigate,
  onClick,
  ...props
}: AnchorLinkProps) {
  const pathname = usePathname();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);

    const modified =
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
    if (event.defaultPrevented || modified || pathname !== "/") return;

    const target = document.getElementById(hash);
    if (!target) return;

    event.preventDefault();
    onNavigate?.();

    // Dois frames: dá tempo do menu fechar e de a rolagem ser destravada.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        // scroll-padding-top do <html> desconta a altura do header.
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });

        if (window.location.hash !== `#${hash}`) {
          window.history.pushState(null, "", `#${hash}`);
        }

        // Leva o foco para a seção (teclado e leitores de tela continuam dali).
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }),
    );
  }

  return <Link {...props} href={{ pathname: "/", hash }} onClick={handleClick} />;
}
