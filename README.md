# LightPath Tecnologia

Site institucional e de geração de demanda da **LightPath Tecnologia**.

## Posicionamento

A LightPath transforma dados, processos e operações em sistemas mais inteligentes, automatizados e mensuráveis. O foco não é vender IA como buzzword: é desenhar e implementar soluções que reduzam esforço manual, aumentem previsibilidade e criem capacidade operacional real.

## Pilares

- Engenharia de Dados e plataformas cloud
- Data Science e Analytics aplicado
- Soluções com IA e automação
- Otimização de processos, operações e projetos
- APIs, integrações e produtos internos

## Experiência do site

A landing page foi construída para combinar conversão B2B com linguagem visual premium:

- hero imersivo com canvas procedural;
- smooth scrolling com Lenis;
- animações e storytelling com GSAP + ScrollTrigger;
- microinterações, cursor, magnetic buttons e tilt cards;
- painel interativo de soluções;
- suporte a `prefers-reduced-motion`;
- layout responsivo para desktop e mobile.

## Arquitetura

Site estático, sem build e sem framework:

- `index.html` — conteúdo e estrutura;
- `styles.css` — design system, responsividade e animações CSS;
- `script.js` — motion, interações, canvas e formulário;
- `assets/social-card.svg` — social preview;
- `scripts/validate_site.py` — validação estrutural disponível no repositório;
- `.nojekyll` — publicação estática direta.

## Formulário durante a fase GitHub Pages

Como GitHub Pages não executa backend, o formulário valida os campos e abre o cliente de e-mail do visitante com o diagnóstico preenchido.

Quando o domínio próprio e a infraestrutura final forem conectados, essa camada poderá ser substituída por endpoint/API, CRM, webhook ou automação sem alterar a experiência visual.

## Deploy

A publicação inicial utiliza o **GitHub Pages nativo**, servindo a branch `main` como site estático. Isso mantém o fluxo simples, equivalente ao objetivo do portfólio público, sem etapa de build.

URL esperada:

```text
https://vfreis.github.io/lightpath.tech/
```
