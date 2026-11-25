## Resumo

Nova página inicial do Instituto Robótica Sustentável, seguindo a referência aprovada em `docs/referencia/pagina-inicial.html`, em português e inglês.

## O que entra

- **Design System** (`src/app/globals.css`): tokens de cor, tipografia (Baloo 2 + Nunito Sans via `next/font`), raios, espaçamentos, container de 1200px, foco visível e alvos de toque de 44px. Componentes `Container`, `Button`/`ButtonLink` e `SectionHeading`.
- **i18n só pela URL**: `localePrefix: "always"`, `localeCookie: false`, `localeDetection: false` — `/` sempre vai para `/pt`, sem cookie. `src/i18n/navigation.ts` com `createNavigation`.
- **Header** com seletor PT · EN e **menu mobile** acessível (Esc fecha, foco preso, rolagem travada, Motion respeitando `prefers-reduced-motion`).
- **Seções**: Hero, Impacto, Quem somos, O que fazemos, Do descarte ao impacto, O que você pode descartar, Pontos de coleta (com busca), Projetos e histórias, Seja parceiro e Footer.
- **Navegação por âncoras** (`AnchorLink`) que rola até a seção mesmo com o hash já na URL e move o foco para ela.
- **Animações de entrada** discretas (`Reveal`), só fade com reduced-motion.
- Textos em `src/messages/pt.json` e `en.json`; dados em `src/lib/data/`.
- Página `/[locale]/design-system` como vitrine de tokens (responde 404 em produção).

## Como testar

1. `npm run dev` e abra `http://localhost:3000/` → deve redirecionar para `/pt`, sem criar cookie.
2. Troque para EN no header → `/en`, textos em inglês, `<html lang="en">`.
3. Em 360px: abra o menu, navegue com Tab/Shift+Tab, feche com Esc; clique em um item e confira a rolagem até a seção.
4. Confira 360, 390, 768, 1024 e 1440px sem rolagem horizontal.
5. Ative "reduzir movimento" no sistema e confira que só há fade.

## Pendências

- Fotos em `public/images/home/` têm 300–720px e ficam borradas em telas grandes; substituir por originais com ≥1200px (mesmos nomes).
- Mapa interativo dos pontos de coleta (hoje é um espaço reservado).
- Política de privacidade.
- Confirmar o número de pontos de coleta, a periodicidade dos planos e o e-mail de contato (`gmail.com.br` parece incorreto).
- Favicon (`app/icon.png`) ainda não existe.
- `next build` exibe um aviso de vulnerabilidade conhecida no Next 16.4.3 — avaliar atualização.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
