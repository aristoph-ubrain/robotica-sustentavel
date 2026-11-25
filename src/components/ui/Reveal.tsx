"use client";

import { motion, MotionConfig, type Variants } from "motion/react";
import type { ReactNode } from "react";

/*
 * Scroll Reveal discreto.
 * - Anima só uma vez, quando o elemento entra na tela.
 * - Com "reduzir movimento" ativado no sistema, o MotionConfig desliga o
 *   deslocamento e fica só um fade curto (mesmo padrão do MobileMenu).
 * - Os filhos podem ser Server Components: só este wrapper roda no cliente.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

/** Margem para disparar um pouco antes do elemento ficar todo visível. */
const VIEWPORT = { once: true, amount: 0.15, margin: "0px 0px -8% 0px" } as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE, delay },
  }),
};

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Atraso em segundos, para escalonar blocos vizinhos. */
  delay?: number;
};

/** Bloco que sobe e aparece ao entrar na tela. */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className={className}
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        custom={delay}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}

type ListTag = "ul" | "ol" | "dl" | "div";

const listTags = {
  ul: motion.ul,
  ol: motion.ol,
  dl: motion.dl,
  div: motion.div,
} as const;

type RevealListProps = {
  children: ReactNode;
  className?: string;
  as?: ListTag;
  "aria-label"?: string;
  tabIndex?: number;
};

/** Lista cujos itens (RevealItem) aparecem em cascata. */
export function RevealList({
  children,
  className,
  as = "ul",
  ...rest
}: RevealListProps) {
  const Tag = listTags[as];
  return (
    <MotionConfig reducedMotion="user">
      <Tag
        className={className}
        variants={listVariants}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        {...rest}
      >
        {children}
      </Tag>
    </MotionConfig>
  );
}

const itemTags = { li: motion.li, div: motion.div } as const;

type RevealItemProps = {
  children: ReactNode;
  className?: string;
  as?: keyof typeof itemTags;
};

/** Item de uma RevealList. */
export function RevealItem({ children, className, as = "li" }: RevealItemProps) {
  const Tag = itemTags[as];
  return (
    <Tag className={className} variants={itemVariants}>
      {children}
    </Tag>
  );
}
