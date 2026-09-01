# LightPath Tecnologia

Site institucional e de geração de demanda da LightPath Tecnologia.

## Posicionamento

A LightPath transforma dados, processos e operações em sistemas mais inteligentes, automatizados e mensuráveis. O foco não é vender IA como buzzword: é desenhar e implementar soluções que reduzam esforço manual, aumentem previsibilidade e criem capacidade operacional real.

## Pilares

- Engenharia de Dados e plataformas cloud
- Data Science e Analytics aplicado
- Soluções com IA e automação
- Otimização de processos, operações e projetos
- APIs, integrações e produtos internos

## Arquitetura

O site foi construído sem framework para ser rápido, portátil e simples de publicar em hospedagem compartilhada:

- `index.html` — conteúdo e estrutura
- `styles.css` — design system e responsividade
- `script.js` — interações e formulário
- `contact.php` — endpoint leve para leads via PHP

## Configuração do formulário

O endpoint `contact.php` utiliza a variável de ambiente `CONTACT_TO_EMAIL` como destinatário.

Configure-a no ambiente de hospedagem antes de publicar o formulário em produção.

Exemplo conceitual:

```text
CONTACT_TO_EMAIL=seu-email-de-destino
```

O site continua navegável sem a variável, mas o envio de leads retorna uma mensagem de configuração pendente.

## Deploy

Pode ser publicado diretamente na raiz pública de um domínio/subdomínio com suporte a HTML/CSS/JS e PHP 8+.

Não há etapa de build.
