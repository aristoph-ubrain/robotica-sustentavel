/**
 * Itens do menu principal, na mesma ordem das seções da página. As âncoras apontam para seções da página inicial;
 * o `hash` é o mesmo nos dois idiomas, só o texto muda (messages → Header.nav).
 */
export const navItems = [
  { key: "institute", hash: "instituto" },
  { key: "whatWeDo", hash: "o-que-fazemos" },
  { key: "impact", hash: "impacto" },
  { key: "collectionPoints", hash: "pontos" },
  { key: "partner", hash: "parceiro" },
  // Só no menu mobile (drawer) e no rodapé; a barra do desktop não tem espaço.
  { key: "contact", hash: "contato", inDesktopBar: false },
] as const;

export type NavItemKey = (typeof navItems)[number]["key"];

/** Item já traduzido, pronto para ir ao Client Component. */
export type NavLink = {
  key: NavItemKey;
  /** false = não aparece na navegação inline do desktop. */
  inDesktopBar: boolean;
  label: string;
  href: { pathname: "/"; hash: string };
};
