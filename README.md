# LightPath Tecnologia

Site comercial premium da LightPath Tecnologia, publicado via GitHub Pages.

## Arquitetura atual

A home usa uma direção de motion unificada (`site-v2.css`, `app-v2.js`, `motion-director.js`, `i18n-v2.js`) e a apresentação interativa vive em `/apresentacao/`.

A apresentação foi tratada como app responsivo e possui:

- 10 cenas interativas;
- navegação por botões, teclado, swipe e wheel/trackpad;
- transição horizontal entre cenas;
- regra **1 gesto = 1 slide**, absorvendo inércia de trackpad sem bloquear o gesto seguinte;
- viewport real via `visualViewport`;
- fit automático por cena;
- guard de layout que revalida após resize, orientação, PT/EN e interações;
- chrome superior e dock inferior isolados da área de conteúdo;
- QA específico das 10 cenas para impedir sobreposição de cards, painéis e CTAs;
- PT/EN persistido entre home e apresentação.

## QA de layout da apresentação

O layout mobile reserva matematicamente o retângulo entre appbar e dock. A cena de impacto deixa de usar cards sobre o núcleo em telas estreitas; arquitetura usa matriz 2×3; método usa grid 2×2; growth, proof e AI são compactados por viewport; e o discovery final mantém diagnóstico e CTA em fluxo normal. O CTA global de diagnóstico é ocultado no mobile para não competir com o conteúdo.

## Publicação

GitHub Pages usa a branch `gh-pages` em `/ (root)`.

URL esperada:

`https://vfreis.github.io/lightpath.tech/`

Apresentação:

`https://vfreis.github.io/lightpath.tech/apresentacao/`
