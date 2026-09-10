# LightPath Tecnologia

Site comercial da **LightPath Tecnologia**, com posicionamento em engenharia de dados, IA aplicada, automação, analytics e Growth Systems.

## Experiência

- Hero premium com motion e canvas procedural
- Storytelling por scroll com GSAP/ScrollTrigger
- Navegação e interações mobile-first
- Business cases orientados a impacto
- Growth Systems / Revenue Architecture
- Apresentação interativa em `/apresentacao/`
- Apresentação com navegação por botões, teclado, swipe e scroll/trackpad convertidos em transições horizontais
- Fit adaptativo por viewport real (`visualViewport`) para evitar scroll interno e conteúdo cortado
- Toggle bilingue `PT | EN` com tradução determinística e persistência via `localStorage`
- `prefers-reduced-motion` e fallback mobile leve

## Arquitetura da home V2

A home usa uma arquitetura consolidada para evitar múltiplos loops e estilos concorrentes:

- `index.html` — conteúdo semântico
- `site-v2.css` — direção visual mobile-first
- `app-v2.js` — navegação e interações
- `motion-director.js` — único diretor de motion/scrolltelling
- `i18n-v2.js` — PT/EN por chaves semânticas

O objeto visual LightPath atravessa a narrativa completa e muda de comportamento conforme o estágio: `chaos → paths → system → revenue → measure → growth → flow → decision → final`.

## Apresentação

A rota `/apresentacao/` se comporta como um sales app adaptativo:

- cada cena ocupa apenas o viewport disponível;
- wheel ou trackpad vertical avança a narrativa horizontalmente;
- swipe vertical ou horizontal navega entre cenas;
- setas, botões, PageUp/PageDown e teclado continuam disponíveis;
- transições entre cenas ocorrem lateralmente, reforçando a sensação de aplicativo;
- `visualViewport` acompanha a altura real do Safari/mobile e alterações da barra do navegador;
- cada frame é medido depois de renderização, interação e troca PT/EN;
- quando necessário, o conteúdo recebe escala adaptativa para manter todos os elementos dentro da tela;
- não há necessidade de scroll interno para revelar o restante de uma cena;
- a escolha PT/EN continua compartilhada com a home.

## Publicação

Site estático publicado pelo GitHub Pages a partir da branch `gh-pages`.

URL:

`https://vfreis.github.io/lightpath.tech/`

Apresentação:

`https://vfreis.github.io/lightpath.tech/apresentacao/`

## Contato

Durante a fase GitHub Pages, o formulário usa `mailto:` como fallback de contato.
