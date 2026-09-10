# LightPath Tecnologia

Site comercial da **LightPath Tecnologia**, posicionado em Dados, IA aplicada, Automação, Analytics e **Growth Systems / Revenue Architecture**.

## Premium Scrolltelling V2

A home foi reconstruída como uma experiência narrativa única:

- hero sticky/pinned com progressão `manual → inteligência → escala`;
- um único **LightPath Object** em canvas que muda de forma conforme a narrativa: `chaos → path → system → revenue → impact → growth → decision → mountain`;
- Growth scrollytelling com a pergunta **“R$1 entra aqui. Quanto chega no caixa?”**;
- business cases `Before → System → After` em capítulos controlados pelo scroll;
- métricas animadas e visualizações orientadas a transformação;
- Opportunity Scanner como CTA comercial interativo;
- fechamento em que o caminho converge visualmente para a montanha LightPath;
- mobile-first e `prefers-reduced-motion`.

## Arquitetura da home

Runtime intencionalmente pequeno e determinístico:

- `index.html` — todo o conteúdo comercial/semântico;
- `site-v2.css` — única direção visual, escrita mobile-first;
- `app-v2.js` — menu, scanner e comportamento de aplicação;
- `motion-director.js` — único diretor de motion/scrolltelling;
- `i18n-v2.js` — tradução semântica PT/EN por chaves `data-i18n`.

A home declara **um único canvas**. Não há mais múltiplos loops de background ou conteúdo estático injetado pelo runtime.

### Motion tiers

O `MotionDirector` seleciona automaticamente:

- `lite` — mobile, touch, dispositivos com menos CPU/memória;
- `medium` — tablets/notebooks intermediários;
- `high` — desktops com maior orçamento gráfico.

DPR, FPS, quantidade de sinais e smooth scrolling variam por tier.

## Apresentação interativa

Disponível em `/apresentacao/`, com navegação por clique, teclado e swipe, layout mobile-first e toggle PT/EN persistente.

## Validação

`python scripts/validate_site.py`

O validador cobra one-canvas architecture, semantic PT/EN, MotionDirector, reduced motion, Growth scrolltelling, business cases e integridade da apresentação.

## Publicação

GitHub Pages a partir da branch `gh-pages`.

- Home: `https://vfreis.github.io/lightpath.tech/`
- Apresentação: `https://vfreis.github.io/lightpath.tech/apresentacao/`

## Empresa

**Lightpath Tecnologia Ltda · CNPJ 65.652.507/0001-75**
