(() => {
  'use strict';

  const STORAGE_KEY = 'lightpath-language';
  let currentLang = localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'pt';
  const originalText = new WeakMap();
  const originalAttrs = new WeakMap();

  const exact = new Map(Object.entries({
    /* Global / navigation */
    'tecnologia':'technology','Soluções':'Solutions','Apresentação':'Presentation','Growth':'Growth','Impacto':'Impact','Método':'Method','Experiência':'Experience',
    'Diagnosticar oportunidade':'Diagnose opportunity','Encontrar oportunidade':'Find opportunity','Diagnosticar uma oportunidade':'Diagnose an opportunity','Encontrar oportunidade de ganho':'Find a growth opportunity',
    'Abrir menu':'Open menu','Fechar menu':'Close menu','Navegação principal':'Main navigation','LightPath, início':'LightPath, home','Voltar ao topo ↑':'Back to top ↑','Voltar ao topo':'Back to top',

    /* Hero */
    'Dados · IA · Automação · Performance operacional':'Data · AI · Automation · Operational Performance',
    'Dados · IA · Automação · Growth Systems':'Data · AI · Automation · Growth Systems',
    'Menos operação manual.':'Less manual work.','Mais inteligência.':'More intelligence.','Mais escala.':'More scale.',
    'Transformamos gargalos de dados e processos em sistemas que':'We turn data and process bottlenecks into systems that',
    'reduzem custo operacional, aceleram decisões e criam capacidade de escala':'reduce operating cost, accelerate decisions and create capacity to scale',
    '— da arquitetura à produção.':'— from architecture to production.',
    'Conectamos':'We connect','dados, sistemas, IA e funis comerciais':'data, systems, AI and commercial funnels',
    'para reduzir trabalho manual, melhorar conversão e criar operações que crescem com controle.':'to reduce manual work, improve conversion and build operations that scale with control.',
    'Ver como geramos resultado':'See how we create results','Ver a LightPath em 2 minutos':'See LightPath in 2 minutes','Abrir apresentação interativa':'Open interactive presentation',
    'DADOS + PROCESSOS':'DATA + PROCESSES','AUTOMAÇÃO + IA':'AUTOMATION + AI','IMPACTO MENSURÁVEL':'MEASURABLE IMPACT',
    'Resultados e escala já operados em produção':'Results and scale already operated in production','processados / mês':'processed / month','de fluxos recorrentes automatizados':'of recurring flows automated','de esforço manual em ingestão':'less manual ingestion effort','de eficiência operacional':'operational efficiency',
    'MENOS TRABALHO MANUAL':'LESS MANUAL WORK','DADOS CONFIÁVEIS':'TRUSTED DATA','DECISÕES MAIS RÁPIDAS':'FASTER DECISIONS','IA EM PRODUÇÃO':'AI IN PRODUCTION','PROCESSOS ESCALÁVEIS':'SCALABLE PROCESSES',

    /* Clarity paths */
    'Onde a LightPath entra?':'Where does LightPath fit?','Do gargalo ao':'From bottleneck to','resultado.':'results.',
    'Construímos e conectamos os sistemas que movem uma empresa — da aquisição à operação, do dado à decisão.':'We build and connect the systems that move a company — from acquisition to operations, from data to decision.',
    'RECEITA':'REVENUE','Do clique':'From click','ao caixa.':'to cash.','Mídia, landing, checkout, tracking, CRM e retenção trabalhando juntos.':'Media, landing pages, checkout, tracking, CRM and retention working together.',
    'DECISÃO':'DECISION','Do dado':'From data','à decisão.':'to decision.','Integração, pipelines, BI e analytics para enxergar e agir mais rápido.':'Integrations, pipelines, BI and analytics to see and act faster.',
    'OPERAÇÃO':'OPERATIONS','Da rotina':'From routine','ao sistema.':'to system.','Automação, APIs, integrações e software para tirar trabalho manual do caminho.':'Automation, APIs, integrations and software to remove manual work from the way.',
    'INOVAÇÃO':'INNOVATION','Da IA':'From AI','ao produto.':'to product.','Agentes, RAG, copilots e aplicações de IA conectadas ao trabalho real.':'Agents, RAG, copilots and AI applications connected to real work.',

    /* Problems / services */
    'O problema real':'The real problem','IA sem processo, dados e métrica vira':'AI without process, data and metrics becomes an','piloto caro.':'expensive pilot.',
    'O valor aparece quando a tecnologia entra no processo certo, sustentada por dados confiáveis, uma decisão clara e uma métrica de sucesso que o negócio consegue enxergar.':'Value appears when technology enters the right process, supported by trusted data, a clear decision and a success metric the business can actually see.',
    'O problema raramente é falta de tecnologia. É':'The problem is rarely a lack of technology. It is','valor travado entre as peças.':'value trapped between the pieces.',
    'Uma campanha sem tracking, um processo manual, dados espalhados ou IA sem contexto têm algo em comum: dinheiro, tempo e velocidade ficam pelo caminho.':'A campaign without tracking, a manual process, scattered data or AI without context all have one thing in common: money, time and speed get lost along the way.',
    '01 / DADOS':'01 / DATA','Se o dado chega tarde, a decisão já perdeu valor.':'If data arrives late, the decision has already lost value.','Integramos fontes, criamos pipelines confiáveis e preparamos a base para analytics, automação e IA.':'We integrate sources, build reliable pipelines and prepare the foundation for analytics, automation and AI.',
    'ETL / ELT e integrações':'ETL / ELT and integrations','Qualidade, observabilidade e governança':'Quality, observability and governance','Engenharia de Dados':'Data Engineering',
    '02 / IA':'02 / AI','IA só gera ROI quando executa trabalho real.':'AI only generates ROI when it performs real work.','Projetamos soluções com LLMs, classificação, extração, recomendação e agentes conectados ao contexto real da operação.':'We design solutions with LLMs, classification, extraction, recommendation and agents connected to the real operational context.',
    'Assistentes e copilots internos':'Internal assistants and copilots','RAG e conhecimento corporativo':'RAG and corporate knowledge','Agentes e workflows com supervisão':'Agents and supervised workflows','IA Aplicada':'Applied AI',
    '03 / AUTOMAÇÃO':'03 / AUTOMATION','Rotina repetitiva é margem escondida.':'Repetitive routine is hidden margin.','Redesenhamos rotinas e conectamos sistemas para reduzir handoffs, retrabalho e dependência de planilhas.':'We redesign routines and connect systems to reduce handoffs, rework and spreadsheet dependency.','APIs e webhooks':'APIs and webhooks','Orquestração de processos':'Process orchestration','Integrações entre sistemas e times':'Integrations across systems and teams','Automação & Integração':'Automation & Integration',
    '04 / GROWTH':'04 / GROWTH','Se você não sabe onde o funil vaza, otimiza no escuro.':'If you do not know where the funnel leaks, you optimize in the dark.','Conectamos aquisição, experiência, checkout e dados para descobrir o que realmente aumenta receita.':'We connect acquisition, experience, checkout and data to discover what actually increases revenue.','Tráfego pago e estratégia de aquisição':'Paid media and acquisition strategy','Landing, quiz, oferta e checkout':'Landing, quiz, offer and checkout','Tracking, CRO, CRM e analytics':'Tracking, CRO, CRM and analytics',
    '04 / DECISÃO':'04 / DECISION','05 / DECISÃO':'05 / DECISION','Dados só valem quando mudam a decisão.':'Data only matters when it changes a decision.','Criamos indicadores, modelos e produtos de dados que colocam a informação certa na decisão certa.':'We create indicators, models and data products that put the right information into the right decision.','BI e analytics operacional':'BI and operational analytics','Data Science aplicada':'Applied Data Science','Forecast, segmentação e otimização':'Forecasting, segmentation and optimization',
    'ROTINA REPETITIVA':'REPETITIVE ROUTINE','VIRA MARGEM.':'BECOMES MARGIN.','OPERAÇÃO MANUAL':'MANUAL OPERATIONS',

    /* Build */
    'O que construímos':'What we build','Da arquitetura ao':'From architecture to','resultado em produção.':'results in production.','Do gargalo ao':'From bottleneck to','sistema que trabalha.':'a system that works.',
    'Não entregamos estratégia para outro time descobrir como executar. Desenhamos, construímos, integramos e medimos a solução no fluxo real da operação.':'We do not deliver strategy for another team to figure out. We design, build, integrate and measure the solution inside the real operational flow.',
    'Podemos melhorar uma peça — tracking, checkout, automação, dados — ou conectar a cadeia inteira. Desenhamos, construímos, integramos e medimos no fluxo real da empresa.':'We can improve one piece — tracking, checkout, automation, data — or connect the entire chain. We design, build, integrate and measure inside the company’s real workflow.',
    'Uma base preparada para crescer.':'A foundation built to scale.','Pipelines escaláveis, contratos de dados, qualidade e observabilidade para transformar fontes dispersas em dados prontos para uso.':'Scalable pipelines, data contracts, quality and observability to turn scattered sources into ready-to-use data.',
    'IA conectada ao contexto da empresa.':'AI connected to the company context.','Camadas de conhecimento, ferramentas e avaliação para que agentes e assistentes executem tarefas úteis — com rastreabilidade.':'Knowledge layers, tools and evaluation so agents and assistants perform useful tasks — with traceability.',
    'Processos que deixam de depender de memória.':'Processes that no longer depend on memory.','Integrações, eventos, filas, automações e alertas que movem o trabalho sem exigir acompanhamento manual constante.':'Integrations, events, queues, automations and alerts that move work without constant manual follow-up.',
    'Dados que apontam o próximo movimento.':'Data that points to the next move.','KPIs operacionais, modelos analíticos e interfaces de decisão que tornam risco, capacidade e oportunidade visíveis.':'Operational KPIs, analytical models and decision interfaces that make risk, capacity and opportunity visible.',
    'Veja a LightPath funcionando como uma experiência.':'See LightPath working as an experience.','Abra a apresentação interativa — arquitetura, impacto, growth e diagnóstico em uma narrativa clicável.':'Open the interactive presentation — architecture, impact, growth and diagnosis in a clickable narrative.','ABRIR DEMO ↗':'OPEN DEMO ↗',

    /* Business cases */
    'Business impact':'Business impact','Tecnologia só importa quando':'Technology only matters when it','move o resultado.':'moves results.','Experiência aplicada em produção':'Experience applied in production',
    'Casos que mostram como':'Cases showing how','arquitetura, automação e IA se traduzem em capacidade, custo, velocidade e eficiência operacional':'architecture, automation and AI translate into capacity, cost, speed and operational efficiency','— as métricas que chegam ao negócio.':'— the metrics that reach the business.',
    'Capacidade + custo':'Capacity + cost','Escalar processamento sem transformar infraestrutura em gargalo.':'Scale processing without turning infrastructure into a bottleneck.','Operações de dados com volume crescente exigem arquitetura distribuída, observabilidade e otimização contínua — não apenas mais compute.':'Growing data operations require distributed architecture, observability and continuous optimization — not just more compute.','Gargalo':'Bottleneck','Grandes volumes, pipelines distribuídos e janelas críticas de processamento.':'Large volumes, distributed pipelines and critical processing windows.','Sistema':'System','de dados processados mensalmente em workloads de produção.':'of data processed monthly in production workloads.','mais capacidade':'more capacity','menor custo marginal':'lower marginal cost',
    'Produtividade':'Productivity','Retirar pessoas da operação repetitiva sem perder controle.':'Remove people from repetitive operations without losing control.','Automação de valor não é criar atalhos. É transformar rotinas recorrentes em sistemas observáveis, recuperáveis e previsíveis.':'Value automation is not about shortcuts. It is about turning recurring routines into observable, recoverable and predictable systems.','Execuções recorrentes dependentes de intervenção, memória e acompanhamento manual.':'Recurring executions dependent on intervention, memory and manual follow-up.','Orquestração, scheduling, alertas, retries e monitoramento operacional.':'Orchestration, scheduling, alerts, retries and operational monitoring.','dos fluxos recorrentes automatizados no contexto operado.':'of recurring flows automated in the operated context.','menos handoffs':'fewer handoffs','menor risco operacional':'lower operational risk','capacidade liberada':'released capacity',
    'Eficiência':'Efficiency','Transformar coleta manual em um serviço reutilizável.':'Turn manual collection into a reusable service.','Quando ingestão depende de pessoas baixando, movendo e preparando arquivos, crescimento significa contratar mais operação. A arquitetura certa quebra essa relação.':'When ingestion depends on people downloading, moving and preparing files, growth means hiring more operations. The right architecture breaks that relationship.','Coleta e movimentação manual de dados entre fontes e consumidores internos.':'Manual data collection and movement between sources and internal consumers.','Serviços FastAPI, integrações e camada programática de ingestão.':'FastAPI services, integrations and a programmable ingestion layer.','de esforço manual associado ao processo de ingestão.':'manual effort associated with the ingestion process.','menos horas operacionais':'fewer operational hours','mais velocidade':'more speed','escala via software':'scale through software',
    'Performance':'Performance','Fazer a gestão enxergar antes — e agir mais rápido.':'Help management see earlier — and act faster.','Indicadores só criam valor quando reduzem o tempo entre um desvio operacional aparecer e alguém conseguir decidir sobre ele.':'Indicators only create value when they reduce the time between an operational deviation appearing and someone being able to act on it.','Informação dispersa, consolidação manual e baixa visibilidade de performance.':'Scattered information, manual consolidation and low performance visibility.','SQL, automação, BI e camada analítica orientada a planejamento e gestão.':'SQL, automation, BI and an analytical layer oriented to planning and management.','de eficiência operacional no contexto de gestão e planejamento.':'operational efficiency in management and planning.','decisão mais rápida':'faster decisions','menos retrabalho':'less rework','mais previsibilidade':'more predictability',
    'Nova capacidade digital':'New digital capability','Levar IA multimodal do experimento até um produto operável.':'Take multimodal AI from experiment to an operable product.','Um produto com IA precisa de muito mais que uma chamada de modelo: dados, outputs estruturados, APIs, autenticação, tracking, experiência multilíngue e operação de ponta a ponta.':'An AI product needs much more than a model call: data, structured outputs, APIs, authentication, tracking, multilingual experience and end-to-end operations.','Converter capacidade de IA em uma experiência confiável, rastreável e utilizável.':'Turn AI capability into a reliable, traceable and usable experience.','Curadoria de dados + IA multimodal + APIs + auth + tracking + produto web.':'Data curation + multimodal AI + APIs + auth + tracking + web product.','Repertório de produto aplicado para transformar modelos em fluxo real de usuário e operação.':'Applied product experience to turn models into real user and operational workflows.','IA em produção':'AI in production','produto end-to-end':'end-to-end product','capacidade escalável':'scalable capacity',
    'Transparência:':'Transparency:','os cases acima representam experiência técnica real em sistemas e produtos de produção. Não implicam que todos tenham sido contratados originalmente sob a marca LightPath Tecnologia.':'the cases above represent real technical experience in production systems and products. They do not imply that all were originally contracted under the LightPath Tecnologia brand.',
    'ANTES':'BEFORE','DEPOIS':'AFTER','VALOR':'VALUE',

    /* Growth systems */
    'AQUISIÇÃO → CONVERSÃO → DADOS → RETENÇÃO':'ACQUISITION → CONVERSION → DATA → RETENTION','Da mídia ao caixa.':'From media to cash.','Um sistema de receita.':'One revenue system.','Um único sistema.':'One system.',
    'Você investe para trazer uma pessoa. Nós seguimos o caminho até a receita para descobrir onde o valor está vazando.':'You invest to bring someone in. We follow the path to revenue to find where value is leaking.',
    'Não tratamos tráfego, site, checkout, tracking e operação como peças isoladas. Projetamos o':'We do not treat traffic, website, checkout, tracking and operations as isolated pieces. We design the','sistema comercial completo':'complete commercial system','para que cada investimento gere sinal, cada sinal gere decisão e cada venda volte como aprendizado para o funil.':'so every investment creates a signal, every signal informs a decision and every sale feeds learning back into the funnel.',
    'MÍDIA':'MEDIA','O anúncio trouxe comprador — ou só clique?':'Did the ad bring a buyer — or just a click?','PÁGINA':'PAGE','A pessoa entendeu valor e avançou?':'Did the person understand the value and move forward?','CHECKOUT':'CHECKOUT','Ela quis comprar. Onde a venda morreu?':'They wanted to buy. Where did the sale die?','VENDA REAL':'REAL SALE','Qual venda aconteceu de verdade?':'Which sale actually happened?','RETENÇÃO':'RETENTION','Quem comprou ativou, ficou e voltou?':'Did the buyer activate, stay and return?','DADOS QUE FECHAM O LOOP':'DATA THAT CLOSES THE LOOP',
    'Do clique ao caixa, sem caixa-preta.':'From click to cash, without a black box.','Conectamos sessão, campanha, checkout, pedido e entrega para saber se o próximo ganho está no anúncio, na página, na oferta, no pagamento ou na retenção.':'We connect session, campaign, checkout, order and delivery to know whether the next gain is in the ad, page, offer, payment or retention.',
    'Aquisição com feedback de negócio.':'Acquisition with business feedback.','Criativo e mídia são avaliados até o pedido real — não apenas por clique, LPV ou evento incompleto.':'Creative and media are evaluated through the real order — not only by click, LPV or incomplete events.','Decisão → CAC · receita · qualidade do tráfego':'Decision → CAC · revenue · traffic quality',
    'Conversão tratada como sistema.':'Conversion treated as a system.','Mensagem, UX, quiz, segmentação e roteamento são medidos por avanço real no funil e não por opinião estética.':'Message, UX, quiz, segmentation and routing are measured by real funnel progress, not aesthetic opinion.','Decisão → LPV→checkout · intenção · abandono':'Decision → LPV→checkout · intent · abandonment',
    'Checkout como infraestrutura de receita.':'Checkout as revenue infrastructure.','Oferta, pagamento, recovery e eventos de fundo de funil precisam funcionar juntos e continuar rastreáveis.':'Offer, payment, recovery and bottom-funnel events need to work together and remain traceable.','Decisão → checkout→payment · aprovação · perda':'Decision → checkout→payment · approval · loss',
    'Uma verdade comercial confiável.':'A reliable commercial truth.','Pedido e pagamento são reconciliados com sessão, campanha e eventos para impedir que telemetria incompleta governe a mídia.':'Order and payment are reconciled with session, campaign and events so incomplete telemetry does not govern media decisions.','Decisão → purchase real · deduplicação · atribuição':'Decision → real purchase · deduplication · attribution',
    'Receita continua depois da compra.':'Revenue continues after the purchase.','Entitlement, members, lifecycle e suporte fecham o loop entre aquisição, entrega e retenção.':'Entitlement, members, lifecycle and support close the loop between acquisition, delivery and retention.','Decisão → ativação · retenção · LTV':'Decision → activation · retention · LTV',
    'Quando o funil inteiro vira um produto de engenharia.':'When the whole funnel becomes an engineering product.','Ecossistema real combinando mídia paga, landing/quiz, checkout externo, verdade comercial, acesso ao produto, tracking e analytics. O desafio deixa de ser “rodar anúncios” e passa a ser':'A real ecosystem combining paid media, landing/quiz, external checkout, commercial truth, product access, tracking and analytics. The challenge stops being “running ads” and becomes','saber exatamente onde o valor entra, onde vaza e qual mudança merece o próximo real investido.':'knowing exactly where value enters, where it leaks and which change deserves the next dollar invested.',
    'Sinais desconectados':'Disconnected signals','Plataformas divergentes, eventos incompletos e pouca confiança para diagnosticar mídia, landing ou checkout.':'Divergent platforms, incomplete events and low confidence to diagnose media, landing or checkout.','Reconciliação ponta a ponta':'End-to-end reconciliation','Pedido, sessão, UTM, event_id, checkout, webhooks e destinos analíticos conectados numa arquitetura observável.':'Order, session, UTM, event_id, checkout, webhooks and analytical destinations connected in an observable architecture.','Growth com engenharia':'Growth with engineering','Gates de decisão por criativo, landing, checkout e oferta; mídia passa a aprender com resultado comercial real.':'Decision gates by creative, landing, checkout and offer; media starts learning from real commercial outcomes.','Estratégia de mídia':'Media strategy','Arquitetura de funil':'Funnel architecture',

    /* Method */
    'Como atuamos':'How we work','Primeiro o impacto.':'Impact first.','Depois a':'Then the','tecnologia.':'technology.','Depois a tecnologia.':'Technology second.','Cada projeto começa por uma pergunta de negócio: qual mudança mensurável justificaria construir essa solução?':'Every project starts with a business question: what measurable change would justify building this solution?',
    'DIAGNÓSTICO':'DIAGNOSIS','Diagnóstico':'Diagnosis','Mapeamos onde o valor está travado.':'We map where value is stuck.','Processos, dados, decisões, tempos de espera, retrabalho, custo e risco. O objetivo é separar oportunidade real de hype.':'Processes, data, decisions, waiting time, rework, cost and risk. The goal is to separate real opportunity from hype.','Mapa de oportunidades priorizado':'Prioritized opportunity map',
    'DESENHO':'DESIGN','Desenho':'Design','Escolhemos a menor arquitetura que resolve.':'We choose the smallest architecture that solves it.','Definimos solução, integrações, dados, segurança, métricas e caminho de entrega sem superdimensionar tecnologia.':'We define the solution, integrations, data, security, metrics and delivery path without overengineering.','Arquitetura + plano de execução':'Architecture + execution plan',
    'IMPLEMENTAÇÃO':'IMPLEMENTATION','Implementação':'Implementation','Construímos para uso real, não para demo.':'We build for real use, not for a demo.','Integrações, pipelines, interfaces, modelos, automações, testes e observabilidade até a solução entrar no fluxo da equipe.':'Integrations, pipelines, interfaces, models, automations, tests and observability until the solution enters the team workflow.','Solução em produção':'Solution in production',
    'OTIMIZAÇÃO':'OPTIMIZATION','Otimização':'Optimization','Medimos o que mudou e iteramos.':'We measure what changed and iterate.','Medimos o que mudou e ampliamos o ganho.':'We measure what changed and expand the gain.','Tempo poupado, qualidade, custo, capacidade, conversão ou produtividade. O projeto continua apenas onde o impacto aparece.':'Time saved, quality, cost, capacity, conversion or productivity. The project continues only where impact appears.','ROI operacional + próximos ganhos':'Operational ROI + next gains',

    /* Proof */
    'Engenharia com prova':'Engineering with proof','Experiência construída em':'Experience built in','produção.':'production.','O repertório técnico por trás da LightPath vem de sistemas de dados, automação e produtos com IA operando sobre problemas reais.':'The technical experience behind LightPath comes from data systems, automation and AI products operating on real problems.',
    'processados por mês':'processed per month','Pipelines distribuídos em Spark/PySpark sobre AWS EMR, com arquitetura lakehouse e orquestração Airflow.':'Distributed Spark/PySpark pipelines on AWS EMR, with lakehouse architecture and Airflow orchestration.','dos fluxos recorrentes automatizados':'of recurring flows automated','Orquestração de ETL com ganho de confiabilidade de agenda e redução de operação manual.':'ETL orchestration with improved scheduling reliability and reduced manual operation.','de esforço manual':'manual effort','Serviços de ingestão via FastAPI substituindo coleta e movimentação manual de dados.':'FastAPI ingestion services replacing manual data collection and movement.','SQL, BI e automação aplicados à gestão de performance e planejamento operacional.':'SQL, BI and automation applied to performance management and operational planning.','Produto com IA multimodal, do dado ao deploy.':'Multimodal AI product, from data to deployment.','Curadoria de dados, APIs, outputs estruturados, autenticação, tracking e operação de uma aplicação AI-assisted multilíngue.':'Data curation, APIs, structured outputs, authentication, tracking and operation of a multilingual AI-assisted application.',

    /* Fit */
    'Quando faz sentido':'When it makes sense','Nem todo problema precisa de IA.':'Not every problem needs AI.','O seu pode precisar.':'Yours might.','Sua equipe ainda move dados entre planilhas, e-mails e sistemas manualmente.':'Your team still moves data manually between spreadsheets, email and systems.','Decisões importantes dependem de informação atrasada ou pouco confiável.':'Important decisions depend on delayed or unreliable information.','Existe um processo repetitivo consumindo pessoas que deveriam estar decidindo, não copiando.':'A repetitive process is consuming people who should be deciding, not copying.','Você quer aplicar IA, mas precisa transformar uma ideia genérica em caso de uso com ROI.':'You want to apply AI but need to turn a generic idea into an ROI-backed use case.','O negócio cresceu mais rápido do que a arquitetura de dados e operação.':'The business grew faster than its data and operations architecture.',

    /* Scanner */
    'Opportunity scanner':'Opportunity scanner','Onde está o próximo':'Where is the next','ganho?':'gain?','Escolha a pressão que mais incomoda sua operação. A LightPath traduz o sintoma em um primeiro vetor de solução e nas métricas que precisam provar valor.':'Choose the pressure that hurts your operation most. LightPath translates the symptom into a first solution vector and the metrics that need to prove value.','Escolha o principal sinal operacional':'Choose the main operational signal','TEMPO':'TIME','CUSTO':'COST','RISCO':'RISK','CAPACIDADE':'CAPACITY','DECISÃO':'DECISION','RECEITA / CONVERSÃO':'REVENUE / CONVERSION','PRIMEIRO VETOR':'FIRST VECTOR','Automação de processo':'Process automation','Mapeamos esperas, handoffs e tarefas repetitivas. O primeiro alvo é reduzir lead time sem criar uma nova camada de operação.':'We map waits, handoffs and repetitive tasks. The first target is reducing lead time without creating a new operational layer.','horas recuperadas':'hours recovered','Transformar em diagnóstico':'Turn into diagnosis','Growth System / CRO':'Growth System / CRO','Conectamos mídia, landing, checkout e venda real para encontrar onde a conversão está vazando e qual etapa merece o próximo investimento.':'We connect media, landing, checkout and real sales to find where conversion leaks and which step deserves the next investment.',

    /* Contact */
    'Onde sua empresa perde':'Where does your company lose','tempo, conversão ou margem?':'time, conversion or margin?','Onde sua operação está deixando':'Where is your operation leaving','resultado na mesa?':'results on the table?','Mostre onde dói. Nós ajudamos a descobrir onde está o maior ganho antes de propor tecnologia.':'Show us where it hurts. We help find the biggest gain before proposing technology.','Mostre o processo que consome tempo, atrasa decisão ou limita escala. Nós avaliamos o impacto potencial primeiro — e só então decidimos se vale construir.':'Show us the process that consumes time, delays decisions or limits scale. We assess potential impact first — and only then decide whether it is worth building.','Falar direto pelo LinkedIn':'Talk directly on LinkedIn',
    'Seu nome':'Your name','Como podemos chamar você?':'What should we call you?','Empresa':'Company','Nome da empresa':'Company name','E-mail corporativo':'Work email','Onde está o gargalo?':'Where is the bottleneck?','Ex.: temos 4 pessoas consolidando relatórios toda semana e a diretoria só recebe os números dois dias depois...':'E.g. four people consolidate reports every week and leadership only gets the numbers two days later...','Principal objetivo':'Main goal','Selecione uma opção':'Select an option','Automatizar processos':'Automate processes','Estruturar dados / Data Platform':'Structure data / Data Platform','Aplicar IA em um processo':'Apply AI to a process','Analytics / Data Science':'Analytics / Data Science','Desenvolver uma solução sob medida':'Build a custom solution','Otimizar funil / Growth System':'Optimize funnel / Growth System','Ainda não sei — quero diagnosticar':'I am not sure yet — I want a diagnosis','Mapear meu gargalo':'Map my bottleneck','Quero diagnosticar a oportunidade':'I want to diagnose the opportunity','Você traz o gargalo. Nós ajudamos a transformar em hipótese de impacto, arquitetura e próximos passos.':'You bring the bottleneck. We help turn it into an impact hypothesis, architecture and next steps.','Preencha os campos principais para preparar o contato.':'Fill in the main fields to prepare the contact.','Digite um e-mail válido.':'Enter a valid email address.','Tudo certo. Abrindo seu cliente de e-mail com o diagnóstico preenchido.':'All set. Opening your email client with the diagnosis filled in.',
    'Engenharia de dados, IA aplicada e automação para operações mais inteligentes.':'Data engineering, applied AI and automation for smarter operations.',

    /* Presentation base */
    'interactive story':'interactive story','Diagnóstico':'Diagnosis','Seu próximo ganho está':'Your next gain is','escondido no processo.':'hidden in the process.','Do clique ao caixa. Do dado à decisão. Da rotina ao sistema. Da IA ao produto.':'From click to cash. From data to decision. From routine to system. From AI to product.','Explorar onde há ganho':'Explore where value is hiding','01 / TESE':'01 / THESIS','Tecnologia não é o produto.':'Technology is not the product.','O impacto é.':'Impact is.','Clique no resultado que mais importa agora.':'Tap the outcome that matters most now.','IMPACTO':'IMPACT','mensurável':'measurable','REDUZIR':'REDUCE','ACELERAR':'ACCELERATE','CRIAR':'CREATE','ESCALA':'SCALE',
    '02 / DIAGNÓSTICO':'02 / DIAGNOSIS','Onde o valor':'Where does value','trava?':'get stuck?','Escolha o gargalo. O sistema mostra o primeiro vetor de ataque.':'Choose the bottleneck. The system shows the first attack vector.','DADOS DISPERSOS':'SCATTERED DATA','PROCESSO MANUAL':'MANUAL PROCESS','DECISÃO ATRASADA':'DELAYED DECISION','IA SEM CONTEXTO':'AI WITHOUT CONTEXT','Integrar fontes, criar contratos e tornar o dado confiável antes de acelerar analytics ou IA.':'Integrate sources, create contracts and make data reliable before accelerating analytics or AI.','Métrica → latência + qualidade':'Metric → latency + quality',
    '03 / SOLUÇÕES':'03 / SOLUTIONS','Quatro capacidades.':'Four capabilities.','Uma operação mais inteligente.':'One smarter operation.','Toque em uma frente para abrir o que ela destrava.':'Tap a capability to see what it unlocks.','Base confiável para decidir, automatizar e escalar.':'A reliable foundation to decide, automate and scale.','Pipelines · lakehouse · qualidade · observabilidade':'Pipelines · lakehouse · quality · observability',
    '04 / ARQUITETURA':'04 / ARCHITECTURE','Como o valor':'How value','flui.':'flows.','A menor arquitetura capaz de produzir mudança operacional mensurável.':'The smallest architecture capable of producing measurable operational change.','tempo · custo · capacidade':'time · cost · capacity','SEGURANÇA':'SECURITY','OBSERVABILIDADE':'OBSERVABILITY','GOVERNANÇA':'GOVERNANCE','TESTES':'TESTS','Ativar o fluxo':'Activate flow',
    '05 / GROWTH SYSTEMS':'05 / GROWTH SYSTEMS','Da mídia ao caixa.':'From media to cash.','Um único sistema.':'One system.','BUSINESS CASE · DIGITAL COMMERCE':'BUSINESS CASE · DIGITAL COMMERCE',
    '06 / MÉTODO':'06 / METHOD','07 / ENGENHARIA COM PROVA':'07 / ENGINEERING WITH PROOF','Escala real.':'Real scale.','Menos esforço. Mais capacidade.':'Less effort. More capacity.','Toque nos números para ver o que eles significam para a operação.':'Tap the numbers to see what they mean for operations.','PROCESSADOS / MÊS':'PROCESSED / MONTH','FLUXOS AUTOMATIZADOS':'AUTOMATED FLOWS','ESFORÇO MANUAL':'MANUAL EFFORT','EFICIÊNCIA OPERACIONAL':'OPERATIONAL EFFICIENCY','LEITURA DE NEGÓCIO':'BUSINESS VIEW','Capacidade para crescer sem linearizar infraestrutura.':'Capacity to grow without linear infrastructure growth.','Pipelines distribuídos e runtime otimizado transformam volume em capacidade operacional previsível.':'Distributed pipelines and optimized runtime turn volume into predictable operational capacity.',
    '08 / APPLIED AI':'08 / APPLIED AI','IA multimodal,':'Multimodal AI,','do dado ao deploy.':'from data to deployment.','Modelo é só uma peça. Produto exige fluxo, controle e medição.':'The model is only one piece. Product requires flow, control and measurement.','Contexto entra. A análise começa com dados estruturados.':'Context comes in. Analysis starts with structured data.',
    '09 / DISCOVERY':'09 / DISCOVERY','Qual gargalo merece ser':'Which bottleneck should be','removido primeiro?':'removed first?','Escolha um sinal da sua operação. O diagnóstico aponta onde começar.':'Choose a signal from your operation. The diagnosis points to where to start.','Traga o problema em linguagem de negócio. Nós encontramos o primeiro vetor de ganho.':'Bring the problem in business language. We find the first vector of gain.','Processo manual':'Manual process','Dados dispersos':'Scattered data','Decisão atrasada':'Delayed decision','IA sem caso de uso':'AI without a use case','Operação sem escala':'Operations without scale','SELECIONE UM GARGALO ↑':'SELECT A BOTTLENECK ↑','Encontramos o primeiro vetor de ganho.':'We found the first vector of gain.','Vamos medir tempo, custo, risco e capacidade antes de propor qualquer arquitetura.':'We will measure time, cost, risk and capacity before proposing any architecture.','Abrir diagnóstico':'Open diagnosis',
    'Voltar para LightPath Tecnologia':'Back to LightPath Tecnologia','Navegação da apresentação':'Presentation navigation','Cena anterior':'Previous scene','Próxima cena':'Next scene','Ir para cena':'Go to scene','Fim da apresentação':'End of presentation',

    /* Presentation dynamic states */
    'MENOS CUSTO':'LOWER COST','menos handoffs · retrabalho · operação manual':'fewer handoffs · rework · manual operations','MAIS VELOCIDADE':'MORE SPEED','dado confiável no momento da decisão':'reliable data at the decision point','MAIS ESCALA':'MORE SCALE','crescimento sem multiplicar esforço humano':'growth without multiplying human effort',
    'Remover passos repetitivos, criar eventos, integrações, retries e observabilidade operacional.':'Remove repetitive steps, create events, integrations, retries and operational observability.','Métrica → horas + retrabalho':'Metric → hours + rework','Levar indicador, alerta ou modelo até o ponto exato em que a decisão acontece.':'Bring an indicator, alert or model to the exact point where the decision happens.','Métrica → tempo de decisão + acurácia':'Metric → decision time + accuracy','Conectar modelo a contexto, ferramentas, guardrails e uma métrica de valor real.':'Connect the model to context, tools, guardrails and a real value metric.','Métrica → tarefa resolvida + qualidade':'Metric → task solved + quality',
    'IA conectada ao contexto e ao trabalho real da empresa.':'AI connected to the company context and real work.','RAG · agentes · copilots · avaliação':'RAG · agents · copilots · evaluation','Processos que deixam de depender de memória e acompanhamento.':'Processes that no longer depend on memory and follow-up.','APIs · webhooks · eventos · filas · alertas':'APIs · webhooks · events · queues · alerts','Dados que apontam o próximo movimento da operação.':'Data that points to the operation’s next move.','KPIs · BI · forecast · segmentação · otimização':'KPIs · BI · forecast · segmentation · optimization',
    'Rotina deixa de consumir atenção humana.':'Routine stops consuming human attention.','Orquestração recorrente reduz intervenção, dependência de memória e risco de execução.':'Recurring orchestration reduces intervention, memory dependency and execution risk.','Software absorve trabalho antes feito por pessoas.':'Software absorbs work previously done by people.','Serviços de ingestão substituem coleta e movimentação manual, liberando horas para trabalho de maior valor.':'Ingestion services replace manual collection and movement, freeing hours for higher-value work.','Informação chega mais perto da decisão.':'Information gets closer to the decision.','SQL, BI e automação reduzem latência operacional e aumentam previsibilidade de gestão.':'SQL, BI and automation reduce operational latency and increase management predictability.','O modelo executa dentro de um fluxo controlado — não isolado.':'The model runs inside a controlled flow — not in isolation.','A saída vira contrato estruturado para software e operação.':'The output becomes a structured contract for software and operations.','Eventos e outcomes fecham o loop para medir qualidade e valor.':'Events and outcomes close the loop to measure quality and value.',
    'Mapear passos, horas e handoffs. Depois automatizar o trecho com maior recorrência e menor risco.':'Map steps, hours and handoffs. Then automate the most recurring, lowest-risk segment.','Medir → horas recuperadas · retrabalho · SLA':'Measure → hours recovered · rework · SLA','Identificar fontes críticas e criar uma camada confiável antes de multiplicar dashboards ou IA.':'Identify critical sources and create a reliable layer before multiplying dashboards or AI.','Medir → latência · qualidade · disponibilidade':'Measure → latency · quality · availability','Levar informação, alerta ou modelo até a decisão que hoje acontece tarde demais.':'Bring information, alert or model to the decision that currently happens too late.','Medir → lead time · acurácia · perda evitada':'Measure → lead time · accuracy · avoided loss','Escolher uma tarefa real, definir baseline e provar valor antes de ampliar modelo, agente ou arquitetura.':'Choose a real task, define a baseline and prove value before expanding the model, agent or architecture.','Medir → tarefa resolvida · qualidade · custo por execução':'Measure → task solved · quality · cost per execution','Encontrar o componente que cresce linearmente com pessoas, volume ou custo e redesenhar esse gargalo.':'Find the component that grows linearly with people, volume or cost and redesign that bottleneck.','Medir → throughput · custo marginal · capacidade':'Measure → throughput · marginal cost · capacity'
  }));

  const phraseFallback = [
    ['de dados','of data'],['do dado','from data'],['com dados','with data'],['em dados','in data'],['dados','data'],['IA','AI'],
    ['automação','automation'],['Automação','Automation'],['integrações','integrations'],['Integrações','Integrations'],['processos','processes'],['Processos','Processes'],['processo','process'],
    ['decisões','decisions'],['decisão','decision'],['Decisão','Decision'],['resultado','result'],['resultados','results'],['receita','revenue'],['Receita','Revenue'],['conversão','conversion'],['Conversão','Conversion'],
    ['custo','cost'],['Custo','Cost'],['risco','risk'],['Risco','Risk'],['capacidade','capacity'],['Capacidade','Capacity'],['tempo','time'],['Tempo','Time'],['margem','margin'],
    ['experiência','experience'],['Experiência','Experience'],['produção','production'],['Produção','Production'],['qualidade','quality'],['Qualidade','Quality'],['segurança','security'],['Segurança','Security'],
    ['gargalos','bottlenecks'],['gargalo','bottleneck'],['Gargalo','Bottleneck'],['operação','operations'],['Operação','Operations'],['operacional','operational'],['empresa','company'],['Empresa','Company'],
    ['soluções','solutions'],['Soluções','Solutions'],['solução','solution'],['Método','Method'],['impacto','impact'],['Impacto','Impact'],['aplicada','applied'],['Aplicada','Applied'],
    ['manual','manual'],['Manual','Manual'],['escala','scale'],['Escala','Scale'],['mídia','media'],['Mídia','Media'],['aquisição','acquisition'],['Aquisição','Acquisition'],['retenção','retention'],['Retenção','Retention'],
    ['Antes','Before'],['ANTES','BEFORE'],['Depois','After'],['DEPOIS','AFTER'],['Sistema','System'],['sistema','system'],['Valor','Value'],['valor','value'],['mensurável','measurable'],
    ['confiáveis','reliable'],['confiável','reliable'],['recorrentes','recurring'],['automatizados','automated'],['eficiência','efficiency'],['esforço','effort'],['ganhos','gains'],['ganho','gain'],
    ['próximos','next'],['próximo','next'],['objetivo','goal'],['principal','main'],['Escolha','Choose'],['escolha','choose'],['Encontrar','Find'],['encontrar','find'],['Transformar','Turn'],['transformar','turn'],
    ['Voltar','Back'],['Abrir','Open'],['Fechar','Close'],['Seu','Your'],['sua','your'],['Sua','Your'],['onde','where'],['Onde','Where'],['mais','more'],['Mais','More'],['menos','less'],['Menos','Less']
  ].sort((a,b) => b[0].length - a[0].length);

  const ATTRS = ['placeholder','aria-label','title'];
  const skip = el => !!el?.closest?.('script,style,noscript,svg,.lp-language-toggle,[data-no-i18n]');

  const preserveSpace = (raw, translated) => `${raw.match(/^\s*/)?.[0] || ''}${translated}${raw.match(/\s*$/)?.[0] || ''}`;

  const translateCore = core => {
    if (exact.has(core)) return exact.get(core);
    let out = core;
    phraseFallback.forEach(([pt,en]) => {
      if (out.includes(pt)) out = out.split(pt).join(en);
    });
    return out;
  };

  const rememberText = node => {
    if (!originalText.has(node)) originalText.set(node, node.nodeValue || '');
  };

  const translateNode = node => {
    const raw = node.nodeValue || '';
    if (!raw.trim()) return;
    rememberText(node);
    const source = originalText.get(node) || raw;
    node.nodeValue = preserveSpace(source, translateCore(source.trim()));
  };

  const rememberAttrs = el => {
    if (!originalAttrs.has(el)) originalAttrs.set(el, {});
    const saved = originalAttrs.get(el);
    ATTRS.forEach(attr => {
      if (el.hasAttribute(attr) && !(attr in saved)) saved[attr] = el.getAttribute(attr);
    });
  };

  const translateAttrs = el => {
    rememberAttrs(el);
    const saved = originalAttrs.get(el);
    ATTRS.forEach(attr => {
      if (saved[attr] != null) el.setAttribute(attr, translateCore(saved[attr]));
    });
  };

  const walk = (root, mode) => {
    if (!root) return;
    const processText = node => {
      const parent = node.parentElement;
      if (!parent || skip(parent) || !node.nodeValue.trim()) return;
      if (mode === 'en') translateNode(node);
      else if (originalText.has(node)) node.nodeValue = originalText.get(node);
    };
    if (root.nodeType === Node.TEXT_NODE) processText(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) processText(node);
    if (root instanceof Element && !skip(root)) {
      if (mode === 'en') translateAttrs(root);
      else if (originalAttrs.has(root)) Object.entries(originalAttrs.get(root)).forEach(([a,v]) => root.setAttribute(a,v));
    }
    root.querySelectorAll?.('[placeholder],[aria-label],[title]').forEach(el => {
      if (skip(el)) return;
      if (mode === 'en') translateAttrs(el);
      else if (originalAttrs.has(el)) Object.entries(originalAttrs.get(el)).forEach(([a,v]) => el.setAttribute(a,v));
    });
  };

  const pageKind = document.querySelector('.story#story') ? 'presentation' : 'home';
  const META = {
    home:{
      pt:{title:'LightPath Tecnologia — Dados, IA, Automação e Growth Systems',description:'Construímos e conectamos dados, sistemas, IA e funis comerciais para reduzir trabalho manual, melhorar conversão e criar operações que crescem com controle.'},
      en:{title:'LightPath Tecnologia — Data, AI, Automation and Growth Systems',description:'We build and connect data, systems, AI and commercial funnels to reduce manual work, improve conversion and create operations that scale with control.'}
    },
    presentation:{
      pt:{title:'Apresentação Interativa — LightPath Tecnologia',description:'Apresentação interativa da LightPath Tecnologia: do clique ao caixa, do dado à decisão, da rotina ao sistema e da IA ao produto.'},
      en:{title:'Interactive Presentation — LightPath Tecnologia',description:'Interactive LightPath Tecnologia presentation: from click to cash, data to decision, routine to system and AI to product.'}
    }
  };

  const applyMeta = lang => {
    const data = META[pageKind][lang];
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
    document.title = data.title;
    const desc = document.querySelector('meta[name="description"]'); if (desc) desc.content = data.description;
    const ogTitle = document.querySelector('meta[property="og:title"]'); if (ogTitle) ogTitle.content = data.title;
    const ogDesc = document.querySelector('meta[property="og:description"]'); if (ogDesc) ogDesc.content = data.description;
  };

  const style = document.createElement('style');
  style.textContent = `
    .lp-language-toggle{position:relative;z-index:10040;display:inline-flex;align-items:center;gap:7px;flex:0 0 auto;margin-left:auto;margin-right:13px;height:34px;padding:4px 7px;border:1px solid rgba(255,255,255,.12);border-radius:999px;background:rgba(7,10,14,.82);color:#7f8a93;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:inset 0 1px 0 rgba(255,255,255,.04),0 9px 30px rgba(0,0,0,.16);cursor:pointer;font:800 8px/1 Manrope,system-ui,sans-serif;letter-spacing:.08em;transition:border-color .25s,background .25s,box-shadow .25s}
    .lp-language-toggle:hover{border-color:rgba(183,255,55,.38);background:rgba(13,18,22,.94)}
    .lp-language-toggle .lp-lang-label{transition:color .22s}.lp-language-toggle:not(.is-en) .lp-lang-pt,.lp-language-toggle.is-en .lp-lang-en{color:#eaffc9}.lp-language-toggle.is-en .lp-lang-pt,.lp-language-toggle:not(.is-en) .lp-lang-en{color:#657078}
    .lp-lang-track{position:relative;width:30px;height:16px;border-radius:999px;background:rgba(255,255,255,.08);box-shadow:inset 0 0 0 1px rgba(255,255,255,.05)}.lp-lang-track i{position:absolute;top:3px;left:3px;width:10px;height:10px;border-radius:50%;background:#b7ff37;box-shadow:0 0 10px rgba(183,255,55,.58);transition:transform .28s cubic-bezier(.2,.8,.2,1)}.lp-language-toggle.is-en .lp-lang-track i{transform:translateX(14px)}
    .appbar .lp-language-toggle{margin-left:auto;margin-right:9px}.appbar .app-cta{flex:0 0 auto}body.menu-open .lp-language-toggle{z-index:10050;background:#080c10;border-color:rgba(183,255,55,.24)}
    @media(max-width:900px){.lp-language-toggle{height:32px;margin-right:8px;padding:4px 6px;gap:6px}.lp-lang-track{width:28px;height:15px}.lp-lang-track i{width:9px;height:9px}.lp-language-toggle.is-en .lp-lang-track i{transform:translateX(13px)}}
    @media(max-width:430px){.appbar .app-status{display:none}.appbar .lp-language-toggle{margin-left:auto;margin-right:5px}.appbar .app-cta{font-size:0;min-width:38px}.appbar .app-cta span{font-size:13px}}
  `;
  document.head.appendChild(style);

  const toggle = document.createElement('button');
  toggle.type = 'button'; toggle.className = 'lp-language-toggle';
  toggle.innerHTML = '<span class="lp-lang-label lp-lang-pt">PT</span><span class="lp-lang-track" aria-hidden="true"><i></i></span><span class="lp-lang-label lp-lang-en">EN</span>';

  const headerInner = document.querySelector('.header-inner');
  const appbar = document.querySelector('.appbar');
  if (headerInner) {
    const menu = headerInner.querySelector('.menu-toggle');
    headerInner.insertBefore(toggle, menu || headerInner.querySelector('.nav'));
  } else if (appbar) {
    const cta = appbar.querySelector('.app-cta');
    appbar.insertBefore(toggle, cta || null);
  } else document.body.appendChild(toggle);

  const updateToggle = () => {
    const isEn = currentLang === 'en';
    toggle.classList.toggle('is-en', isEn);
    toggle.setAttribute('aria-pressed', String(isEn));
    toggle.setAttribute('aria-label', isEn ? 'Switch to Portuguese' : 'Switch to English');
    toggle.title = isEn ? 'Português' : 'English';
  };

  const applyLanguage = lang => {
    currentLang = lang === 'en' ? 'en' : 'pt';
    localStorage.setItem(STORAGE_KEY, currentLang);
    walk(document.body, currentLang);
    applyMeta(currentLang);
    updateToggle();
    window.LIGHTPATH_LANGUAGE = currentLang;
    window.dispatchEvent(new CustomEvent('lightpath:languagechange', { detail:{lang:currentLang} }));
  };

  toggle.addEventListener('click', () => applyLanguage(currentLang === 'pt' ? 'en' : 'pt'));

  /* Dynamic UI text is translated only after user interaction. No MutationObserver = no loop/freezing. */
  document.addEventListener('click', event => {
    if (currentLang !== 'en' || event.target.closest('.lp-language-toggle')) return;
    const trigger = event.target.closest('button,a,[data-panel],[data-growth],[data-signal],[data-method],[data-proof],[data-ai-step],[data-diagnostic],[data-bottleneck],[data-solution],[data-impact],[data-arch]');
    if (!trigger) return;
    setTimeout(() => {
      const scope = trigger.closest('section,.command-center,.growth-systems,.scanner-app,.story') || document.body;
      walk(scope, 'en');
    }, 0);
  });

  applyLanguage(currentLang);
})();
