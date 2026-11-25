import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  title: ReactNode;
  /** Rótulo curto acima do título (ex.: "QUEM SOMOS"). */
  eyebrow?: ReactNode;
  description?: ReactNode;
  /** Nível do título. Padrão: h2. Use h1 só no hero. */
  as?: "h1" | "h2" | "h3";
  /** Barrinha amarela abaixo do título. */
  accent?: boolean;
  /** "claro" para fundo branco/suave; "escuro" para fundo verde. */
  tone?: "claro" | "escuro";
  align?: "start" | "center";
  id?: string;
  className?: string;
};

export default function SectionHeading({
  title,
  eyebrow,
  description,
  as: Heading = "h2",
  accent = false,
  tone = "claro",
  align = "start",
  id,
  className,
}: SectionHeadingProps) {
  const escuro = tone === "escuro";

  return (
    <div
      className={cn(
        "flex flex-col",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "font-display text-sm font-semibold uppercase tracking-wide",
            // Amarelo sobre verde-escuro dá 4.25:1 — reprova em texto de 14px.
            escuro ? "text-branco" : "text-verde-complementar",
          )}
        >
          {eyebrow}
        </p>
      )}

      <Heading
        id={id}
        className={cn(
          "text-titulo md:text-4xl",
          eyebrow ? "mt-1" : undefined,
          escuro ? "text-branco" : "text-verde-escuro",
        )}
      >
        {title}
      </Heading>

      {accent && (
        <span
          aria-hidden="true"
          className="mt-1.5 block h-1.5 w-14 rounded-pill bg-amarelo"
        />
      )}

      {description && (
        <p
          className={cn(
            "mt-2.5 max-w-2xl text-base leading-relaxed",
            escuro ? "text-branco" : "text-tinta",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
