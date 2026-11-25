"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

import AnchorLink from "./AnchorLink";
import type { NavLink } from "./nav-items";

type MobileMenuProps = {
  links: NavLink[];
  labels: { open: string; close: string; nav: string };
  className?: string;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Menu do mobile (padrão "disclosure"): o botão continua visível no header
 * e o painel abre logo abaixo dele.
 * - Esc fecha e devolve o foco ao botão;
 * - Tab/Shift+Tab ficam presos entre o botão e os links do painel;
 * - a rolagem da página trava enquanto está aberto;
 * - fecha sozinho ao clicar num link ou ao passar para o layout desktop (lg).
 * Com prefers-reduced-motion, o Motion troca o deslize por um fade.
 */
export default function MobileMenu({ links, labels, className }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }, []);

  // Esc + prender o foco.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== "Tab" || !wrapperRef.current) return;

      const focusables = Array.from(
        wrapperRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !wrapperRef.current.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !wrapperRef.current.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  // Travar a rolagem da página.
  // Só no <html>: se o <body> também recebe overflow:hidden, ele vira o
  // contêiner de rolagem do header sticky, que "volta" para o topo do
  // documento (fora da tela) e leva junto o botão de fechar.
  useEffect(() => {
    if (!open) return;

    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";

    return () => {
      html.style.overflow = previous;
    };
  }, [open]);

  // Ao chegar no breakpoint lg (menu inline visível), fecha o painel.
  useEffect(() => {
    if (!open) return;

    const query = window.matchMedia("(min-width: 64rem)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) close(false);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [open, close]);

  return (
    <MotionConfig reducedMotion="user">
      <div ref={wrapperRef} className={className}>
        <button
          ref={buttonRef}
          type="button"
          aria-label={open ? labels.close : labels.open}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="flex size-toque items-center justify-center rounded-campo bg-verde-escuro text-branco transition-colors hover:bg-verde-complementar"
        >
          {open ? (
            <X aria-hidden="true" className="size-[22px]" strokeWidth={2} />
          ) : (
            <Menu aria-hidden="true" className="size-[22px]" strokeWidth={2} />
          )}
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              key="painel"
              id={panelId}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-x-0 top-16 bottom-0 z-30 overflow-y-auto overscroll-contain border-t border-borda bg-branco"
            >
              <nav aria-label={labels.nav} className="px-gutter pt-4 pb-10">
                <ul className="flex flex-col">
                  {links.map(({ key, label, href }) =>
                    key === "partner" ? (
                      <li key={key} className="mt-6">
                        <AnchorLink
                          hash={href.hash}
                          onNavigate={() => close(false)}
                          className={buttonClasses({ variant: "primario", fullWidth: true })}
                        >
                          {label}
                        </AnchorLink>
                      </li>
                    ) : (
                      <li key={key} className="border-b border-borda">
                        <AnchorLink
                          hash={href.hash}
                          onNavigate={() => close(false)}
                          className={cn(
                            "flex min-h-14 items-center rounded-campo font-display text-subtitulo font-semibold text-verde-escuro",
                            "hover:text-verde-complementar",
                          )}
                        >
                          {label}
                        </AnchorLink>
                      </li>
                    ),
                  )}
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
