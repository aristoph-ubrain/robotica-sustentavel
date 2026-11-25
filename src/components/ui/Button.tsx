import type { ComponentProps, ComponentPropsWithoutRef } from "react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "primario" // fundo verde-escuro, texto branco — sobre fundo claro
  | "secundario" // contorno verde-escuro — sobre fundo claro
  | "amarelo" // fundo amarelo, texto tinta — sobre fundo verde
  | "contorno-claro"; // contorno branco — sobre fundo verde

export type ButtonSize = "md" | "lg";

type StyleProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Ocupa toda a largura disponível. */
  fullWidth?: boolean;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-botao px-5 text-center " +
  "font-display font-semibold leading-tight no-underline " +
  "transition-colors duration-150 " +
  "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primario:
    "bg-verde-escuro text-branco hover:bg-verde-complementar active:bg-tinta",
  secundario:
    "border-2 border-verde-escuro text-verde-escuro hover:bg-fundo-suave active:bg-borda",
  // Sobre fundo verde o contorno de foco fica branco (amarelo some no botão amarelo).
  amarelo:
    "bg-amarelo text-tinta hover:brightness-95 active:brightness-90 [--cor-foco:var(--color-branco)]",
  "contorno-claro":
    "border-2 border-branco text-branco hover:bg-branco/10 active:bg-branco/20 [--cor-foco:var(--color-amarelo)]",
};

const sizes: Record<ButtonSize, string> = {
  md: "min-h-toque text-base", // 44px
  lg: "min-h-botao text-lg", // 54px
};

/** Classes de botão, para casos em que outro elemento precisa do mesmo visual. */
export function buttonClasses({
  variant = "primario",
  size = "lg",
  fullWidth = false,
}: StyleProps = {}) {
  return cn(base, variants[variant], sizes[size], fullWidth && "w-full");
}

type ButtonProps = StyleProps & ComponentPropsWithoutRef<"button">;

export function Button({
  variant,
  size,
  fullWidth,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonClasses({ variant, size, fullWidth }), className)}
      {...props}
    />
  );
}

type ButtonLinkProps = StyleProps &
  Omit<ComponentProps<typeof Link>, "href"> & {
    /**
     * Rotas internas ("/pontos") ganham o prefixo de idioma automaticamente.
     * Âncoras ("#pontos"), "mailto:", "tel:" e URLs externas viram <a> comum.
     */
    href: string;
  };

const isPlainHref = (href: string) =>
  href.startsWith("#") || /^[a-z][a-z0-9+.-]*:/i.test(href);

export function ButtonLink({
  variant,
  size,
  fullWidth,
  className,
  href,
  ...props
}: ButtonLinkProps) {
  const classes = cn(buttonClasses({ variant, size, fullWidth }), className);

  if (isPlainHref(href)) {
    const isExternal = /^https?:/i.test(href);
    return (
      <a
        href={href}
        className={classes}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...(props as ComponentPropsWithoutRef<"a">)}
      />
    );
  }

  return <Link href={href} className={classes} {...props} />;
}
