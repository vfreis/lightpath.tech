(() => {
  'use strict';

  const STORAGE_KEY = 'lightpath-language';

  const exact = new Map(Object.entries({
    /* Home — legacy/static copy still rendered in base HTML */
    'Dados · IA · Automação · Performance operacional':'Data · AI · Automation · Operational Performance',
    'Transformamos gargalos de dados e processos em sistemas que':'We turn data and process bottlenecks into systems that',
    'reduzem custo operacional, aceleram decisões e criam capacidade de escala':'reduce operating cost, accelerate decisions and create capacity to scale',
    '— da arquitetura à produção.':'— from architecture to production.',
    'Diagnosticar uma oportunidade':'Diagnose an opportunity',
    'Ver como geramos resultado':'See how we create results',
    'IA sem processo, dados e métrica vira':'AI without process, data and metrics becomes an',
    'piloto caro.':'expensive pilot.',
    'O valor aparece quando a tecnologia entra no processo certo, sustentada por dados confiáveis, uma decisão clara e uma métrica de sucesso que o negócio consegue enxergar.':'Value appears when technology enters the right process, supported by trusted data, a clear decision and a success metric the business can actually see.',
    'Da arquitetura ao':'From architecture to',
    'resultado em produção.':'results in production.',
    'Não entregamos estratégia para outro time descobrir como executar. Desenhamos, construímos, integramos e medimos a solução no fluxo real da operação.':'We do not deliver strategy for another team to figure out. We design, build, integrate and measure the solution inside the real operational flow.',
    'Uma base preparada para crescer.':'A foundation built to scale.',
    'Pipelines escaláveis, contratos de dados, qualidade e observabilidade para transformar fontes dispersas em dados prontos para uso.':'Scalable pipelines, data contracts, quality and observability to turn scattered sources into usable data.',
    'IA conectada ao contexto da empresa.':'AI connected to the company context.',
    'Camadas de conhecimento, ferramentas e avaliação para que agentes e assistentes executem tarefas úteis — com rastreabilidade.':'Knowledge layers, tools and evaluation so agents and assistants perform useful work — with traceability.',
    'Processos que deixam de depender de memória.':'Processes that no longer depend on memory.',
    'Integrações, eventos, filas, automações e alertas que movem o trabalho sem exigir acompanhamento manual constante.':'Integrations, events, queues, automations and alerts that move work without constant manual follow-up.',
    'Dados que apontam o próximo movimento.':'Data that points to the next move.',
    'KPIs operacionais, modelos analíticos e interfaces de decisão que tornam risco, capacidade e oportunidade visíveis.':'Operational KPIs, analytical models and decision interfaces that make risk, capacity and opportunity visible.',
    'Tecnologia só importa quando':'Technology only matters when it',
    'move o resultado.':'moves results.',
    'Casos que mostram como':'Cases showing how',
    '— as métricas que chegam ao negócio.':'— the metrics that reach the business.',
    'Primeiro o impacto.':'Impact first.',
    'Depois a':'Then the',
    'tecnologia.':'technology.',
    'Cada projeto começa por uma pergunta de negócio: qual mudança mensurável justificaria construir essa solução?':'Every project starts with a business question: what measurable change would justify building this solution?',
    'Experiência construída em':'Experience built in',
    'produção.':'production.',
    'Nem todo problema precisa de IA.':'Not every problem needs AI.',
    'O seu pode precisar.':'Yours might.',
    'Onde sua operação está deixando':'Where is your operation leaving',
    'resultado na mesa?':'results on the table?',
    'Mostre o processo que consome tempo, atrasa decisão ou limita escala. Nós avaliamos o impacto potencial primeiro — e só então decidimos se vale construir.':'Show us the process that consumes time, delays decisions or limits scale. We assess potential impact first — and only then decide whether it is worth building.',
    'Quero diagnosticar a oportunidade':'I want to diagnose the opportunity',
    'Você traz o gargalo. Nós ajudamos a transformar em hipótese de impacto, arquitetura e próximos passos.':'You bring the bottleneck. We help turn it into an impact hypothesis, architecture and next steps.',
    'Engenharia de dados, IA aplicada e automação para operações mais inteligentes.':'Data engineering, applied AI and automation for smarter operations.',
    'Voltar ao topo':'Back to top',
    'Brasil':'Brazil',

    /* Service cards */
    'Data lakes & lakehouses':'Data lakes & lakehouses',
    'APIs e webhooks':'APIs and webhooks',
    'Assistentes e copilots internos':'Internal assistants and copilots',
    'RAG e conhecimento corporativo':'RAG and corporate knowledge',
    'Agentes e workflows com supervisão':'Agents and supervised workflows',
    'Forecast, segmentação e otimização':'Forecasting, segmentation and optimization',

    /* Business cases */
    'CASE 01 · DATA SCALE':'CASE 01 · DATA SCALE',
    'CASE 02 · AUTOMATION':'CASE 02 · AUTOMATION',
    'CASE 03 · API INGESTION':'CASE 03 · API INGESTION',
    'CASE 04 · OPERATIONS':'CASE 04 · OPERATIONS',
    'CASE 05 · APPLIED AI PRODUCT':'CASE 05 · APPLIED AI PRODUCT',
    'Capacidade + custo':'Capacity + cost',
    'Escalar processamento sem transformar infraestrutura em gargalo.':'Scale processing without turning infrastructure into a bottleneck.',
    'Operações de dados com volume crescente exigem arquitetura distribuída, observabilidade e otimização contínua — não apenas mais compute.':'Growing data operations require distributed architecture, observability and continuous optimization — not just more compute.',
    'Grandes volumes, pipelines distribuídos e janelas críticas de processamento.':'Large volumes, distributed pipelines and critical processing windows.',
    'de dados processados mensalmente em workloads de produção.':'of data processed monthly in production workloads.',
    'mais capacidade':'more capacity',
    'menor custo marginal':'lower marginal cost',
    'Retirar pessoas da operação repetitiva sem perder controle.':'Remove people from repetitive operations without losing control.',
    'Automação de valor não é criar atalhos. É transformar rotinas recorrentes em sistemas observáveis, recuperáveis e previsíveis.':'Value automation is not about shortcuts. It is about turning recurring routines into observable, recoverable and predictable systems.',
    'Execuções recorrentes dependentes de intervenção, memória e acompanhamento manual.':'Recurring executions dependent on intervention, memory and manual follow-up.',
    'dos fluxos recorrentes automatizados no contexto operado.':'of recurring flows automated in the operated context.',
    'menos handoffs':'fewer handoffs',
    'menor risco operacional':'lower operational risk',
    'capacidade liberada':'released capacity',
    'Transformar coleta manual em um serviço reutilizável.':'Turn manual collection into a reusable service.',
    'Coleta e movimentação manual de dados entre fontes e consumidores internos.':'Manual data collection and movement between sources and internal consumers.',
    'de esforço manual associado ao processo de ingestão.':'manual effort associated with the ingestion process.',
    'menos horas operacionais':'fewer operational hours',
    'mais velocidade':'more speed',
    'escala via software':'scale through software',
    'Fazer a gestão enxergar antes — e agir mais rápido.':'Help management see earlier — and act faster.',
    'Informação dispersa, consolidação manual e baixa visibilidade de performance.':'Scattered information, manual consolidation and low performance visibility.',
    'de eficiência operacional no contexto de gestão e planejamento.':'operational efficiency in management and planning.',
    'decisão mais rápida':'faster decisions',
    'menos retrabalho':'less rework',
    'mais previsibilidade':'more predictability',
    'Nova capacidade digital':'New digital capability',
    'Levar IA multimodal do experimento até um produto operável.':'Take multimodal AI from experiment to an operable product.',
    'Converter capacidade de IA em uma experiência confiável, rastreável e utilizável.':'Turn AI capability into a reliable, traceable and usable experience.',
    'IA em produção':'AI in production',
    'produto end-to-end':'end-to-end product',
    'capacidade escalável':'scalable capacity',

    /* Method */
    'Mapeamos onde o valor está travado.':'We map where value is stuck.',
    'Processos, dados, decisões, tempos de espera, retrabalho, custo e risco. O objetivo é separar oportunidade real de hype.':'Processes, data, decisions, waiting time, rework, cost and risk. The goal is to separate real opportunity from hype.',
    'Mapa de oportunidades priorizado':'Prioritized opportunity map',
    'Escolhemos a menor arquitetura que resolve.':'We choose the smallest architecture that solves it.',
    'Definimos solução, integrações, dados, segurança, métricas e caminho de entrega sem superdimensionar tecnologia.':'We define the solution, integrations, data, security, metrics and delivery path without overengineering.',
    'Arquitetura + plano de execução':'Architecture + execution plan',
    'Construímos para uso real, não para demo.':'We build for real use, not for a demo.',
    'Integrações, pipelines, interfaces, modelos, automações, testes e observabilidade até a solução entrar no fluxo da equipe.':'Integrations, pipelines, interfaces, models, automations, tests and observability until the solution enters the team workflow.',
    'Solução em produção':'Solution in production',
    'Medimos o que mudou e iteramos.':'We measure what changed and iterate.',
    'Tempo poupado, qualidade, custo, capacidade, conversão ou produtividade. O projeto continua apenas onde o impacto aparece.':'Time saved, quality, cost, capacity, conversion or productivity. The project continues only where impact appears.',
    'ROI operacional + próximos ganhos':'Operational ROI + next gains',

    /* Proof */
    'processados por mês':'processed per month',
    'dos fluxos recorrentes automatizados':'of recurring flows automated',
    'de esforço manual':'manual effort',
    'de eficiência operacional':'operational efficiency',
    'Produto com IA multimodal, do dado ao deploy.':'Multimodal AI product, from data to deployment.',

    /* Fit */
    'Sua equipe ainda move dados entre planilhas, e-mails e sistemas manualmente.':'Your team still moves data manually between spreadsheets, email and systems.',
    'Decisões importantes dependem de informação atrasada ou pouco confiável.':'Important decisions depend on delayed or unreliable information.',
    'Existe um processo repetitivo consumindo pessoas que deveriam estar decidindo, não copiando.':'A repetitive process is consuming people who should be deciding, not copying.',
    'Você quer aplicar IA, mas precisa transformar uma ideia genérica em caso de uso com ROI.':'You want to apply AI but need to turn a generic idea into an ROI-backed use case.',
    'O negócio cresceu mais rápido do que a arquitetura de dados e operação.':'The business grew faster than its data and operations architecture.',

    /* Scanner */
    'Onde está o próximo':'Where is the next',
    'ganho?':'gain?',
    'Escolha a pressão que mais incomoda sua operação. A LightPath traduz o sintoma em um primeiro vetor de solução e nas métricas que precisam provar valor.':'Choose the pressure that hurts your operation most. LightPath translates the symptom into a first solution vector and the metrics that need to prove value.',
    'Transformar em diagnóstico':'Turn into diagnosis',

    /* Form */
    'Seu nome':'Your name',
    'Empresa':'Company',
    'E-mail corporativo':'Work email',
    'Onde está o gargalo?':'Where is the bottleneck?',
    'Principal objetivo':'Main goal',
    'Selecione uma opção':'Select an option',
    'Automatizar processos':'Automate processes',
    'Estruturar dados / Data Platform':'Structure data / Data Platform',
    'Aplicar IA em um processo':'Apply AI to a process',
    'Analytics / Data Science':'Analytics / Data Science',
    'Desenvolver uma solução sob medida':'Build a custom solution',
    'Otimizar funil / Growth System':'Optimize funnel / Growth System',
    'Ainda não sei — quero diagnosticar':'I am not sure yet — I want a diagnosis',

    /* Presentation */
    'Seu próximo ganho está':'Your next gain is',
    'escondido no processo.':'hidden in the process.',
    'Explorar onde há ganho':'Explore where value is hiding',
    'Tecnologia não é o produto.':'Technology is not the product.',
    'O impacto é.':'Impact is.',
    'Clique no resultado que mais importa agora.':'Tap the outcome that matters most now.',
    'REDUZIR':'REDUCE',
    'ACELERAR':'ACCELERATE',
    'CRIAR':'CREATE',
    'Onde o valor':'Where does value',
    'trava?':'get stuck?',
    'Escolha o gargalo. O sistema mostra o primeiro vetor de ataque.':'Choose the bottleneck. The system shows the first attack vector.',
    'DADOS DISPERSOS':'SCATTERED DATA',
    'PROCESSO MANUAL':'MANUAL PROCESS',
    'DECISÃO ATRASADA':'DELAYED DECISION',
    'IA SEM CONTEXTO':'AI WITHOUT CONTEXT',
    'PRIMEIRO VETOR':'FIRST VECTOR',
    'Métrica → latência + qualidade':'Metric → latency + quality',
    'Quatro capacidades.':'Four capabilities.',
    'Uma operação mais inteligente.':'One smarter operation.',
    'Toque em uma frente para abrir o que ela destrava.':'Tap a capability to see what it unlocks.',
    'Como o valor':'How value',
    'flui.':'flows.',
    'A menor arquitetura capaz de produzir mudança operacional mensurável.':'The smallest architecture capable of producing measurable operational change.',
    'SEGURANÇA':'SECURITY',
    'OBSERVABILIDADE':'OBSERVABILITY',
    'GOVERNANÇA':'GOVERNANCE',
    'TESTES':'TESTS',
    'Ativar o fluxo':'Activate flow',
    'Da mídia ao caixa.':'From media to cash.',
    'Um único sistema.':'One system.',
    'Você investe para trazer uma pessoa. Nós seguimos o caminho até a receita para descobrir onde o valor está vazando.':'You invest to bring someone in. We follow the path to revenue to find where value is leaking.',
    'Do clique ao caixa, sem caixa-preta.':'From click to cash, without a black box.',
    'Primeiro o impacto.':'Impact first.',
    'Depois a tecnologia.':'Technology second.',
    'Diagnóstico':'Diagnosis',
    'Desenho':'Design',
    'Implementação':'Implementation',
    'Otimização':'Optimization',
    'Escala real.':'Real scale.',
    'Menos esforço. Mais capacidade.':'Less effort. More capacity.',
    'Toque nos números para ver o que eles significam para a operação.':'Tap the numbers to see what they mean for operations.',
    'PROCESSADOS / MÊS':'PROCESSED / MONTH',
    'FLUXOS AUTOMATIZADOS':'AUTOMATED FLOWS',
    'ESFORÇO MANUAL':'MANUAL EFFORT',
    'EFICIÊNCIA OPERACIONAL':'OPERATIONAL EFFICIENCY',
    'LEITURA DE NEGÓCIO':'BUSINESS VIEW',
    'Capacidade para crescer sem linearizar infraestrutura.':'Capacity to grow without linear infrastructure growth.',
    'IA multimodal,':'Multimodal AI,',
    'do dado ao deploy.':'from data to deployment.',
    'Modelo é só uma peça. Produto exige fluxo, controle e medição.':'The model is only one piece. Product requires flow, control and measurement.',
    'Qual gargalo merece ser':'Which bottleneck should be',
    'removido primeiro?':'removed first?',
    'Traga o problema em linguagem de negócio. Nós encontramos o primeiro vetor de ganho.':'Bring the problem in business language. We find the first vector of gain.',
    'Processo manual':'Manual process',
    'Dados dispersos':'Scattered data',
    'Decisão atrasada':'Delayed decision',
    'IA sem caso de uso':'AI without a use case',
    'Operação sem escala':'Operations without scale',
    'SELECIONE UM GARGALO ↑':'SELECT A BOTTLENECK ↑',
    'Encontramos o primeiro vetor de ganho.':'We found the first vector of gain.',
    'Vamos medir tempo, custo, risco e capacidade antes de propor qualquer arquitetura.':'We will measure time, cost, risk and capacity before proposing any architecture.',
    'Abrir diagnóstico':'Open diagnosis',
    'Voltar para LightPath Tecnologia':'Back to LightPath Tecnologia',
    'Navegação da apresentação':'Presentation navigation',
    'Cena anterior':'Previous scene',
    'Próxima cena':'Next scene',
    'Ir para cena':'Go to scene'
  }));

  const fragments = [
    [/\bDados\b/g,'Data'],[/\bdados\b/g,'data'],[/\bIA\b/g,'AI'],
    [/\bAutomação\b/g,'Automation'],[/\bautomação\b/g,'automation'],
    [/\bIntegrações\b/g,'Integrations'],[/\bintegrações\b/g,'integrations'],
    [/\bProcessos\b/g,'Processes'],[/\bprocessos\b/g,'processes'],[/\bprocesso\b/g,'process'],
    [/\bDecisão\b/g,'Decision'],[/\bdecisão\b/g,'decision'],[/\bdecisões\b/g,'decisions'],
    [/\bResultado\b/g,'Result'],[/\bresultado\b/g,'result'],[/\bresultados\b/g,'results'],
    [/\bReceita\b/g,'Revenue'],[/\breceita\b/g,'revenue'],
    [/\bCusto\b/g,'Cost'],[/\bcusto\b/g,'cost'],
    [/\bRisco\b/g,'Risk'],[/\brisco\b/g,'risk'],
    [/\bCapacidade\b/g,'Capacity'],[/\bcapacidade\b/g,'capacity'],
    [/\bTempo\b/g,'Time'],[/\btempo\b/g,'time'],
    [/\bExperiência\b/g,'Experience'],[/\bexperiência\b/g,'experience'],
    [/\bProdução\b/g,'Production'],[/\bprodução\b/g,'production'],
    [/\bQualidade\b/g,'Quality'],[/\bqualidade\b/g,'quality'],
    [/\bSegurança\b/g,'Security'],[/\bsegurança\b/g,'security'],
    [/\bGargalo\b/g,'Bottleneck'],[/\bgargalo\b/g,'bottleneck'],[/\bgargalos\b/g,'bottlenecks'],
    [/\bOperação\b/g,'Operations'],[/\boperação\b/g,'operations'],[/\boperacional\b/g,'operational'],
    [/\bEmpresa\b/g,'Company'],[/\bempresa\b/g,'company'],
    [/\bSoluções\b/g,'Solutions'],[/\bsolução\b/g,'solution'],[/\bsoluções\b/g,'solutions'],
    [/\bMétodo\b/g,'Method'],[/\bImpacto\b/g,'Impact'],[/\bimpacto\b/g,'impact'],
    [/\bAplicada\b/g,'Applied'],[/\baplicada\b/g,'applied'],
    [/\bManual\b/g,'Manual'],[/\bmanual\b/g,'manual'],
    [/\bEscala\b/g,'Scale'],[/\bescala\b/g,'scale'],
    [/\bMídia\b/g,'Media'],[/\bmídia\b/g,'media'],
    [/\bConversão\b/g,'Conversion'],[/\bconversão\b/g,'conversion'],
    [/\bAquisição\b/g,'Acquisition'],[/\baquisição\b/g,'acquisition'],
    [/\bRetenção\b/g,'Retention'],[/\bretenção\b/g,'retention'],
    [/\bAntes\b/g,'Before'],[/\bDepois\b/g,'After'],[/\bSistema\b/g,'System'],[/\bsistema\b/g,'system'],
    [/\bValor\b/g,'Value'],[/\bvalor\b/g,'value'],
    [/\bMais\b/g,'More'],[/\bmenos\b/g,'less'],
    [/\bmensurável\b/g,'measurable'],[/\bconfiável\b/g,'reliable'],[/\bconfiáveis\b/g,'reliable'],
    [/\brecorrentes\b/g,'recurring'],[/\bautomatizados\b/g,'automated'],
    [/\beficiência\b/g,'efficiency'],[/\besforço\b/g,'effort'],
    [/\bganho\b/g,'gain'],[/\bganhos\b/g,'gains'],
    [/\bpróximo\b/g,'next'],[/\bpróximos\b/g,'next'],
    [/\bobjetivo\b/g,'goal'],[/\bprincipal\b/g,'main'],
    [/\bEscolha\b/g,'Choose'],[/\bescolha\b/g,'choose'],
    [/\bEncontrar\b/g,'Find'],[/\btransformar\b/g,'turn'],
    [/\bVoltar\b/g,'Back'],[/\bAbrir\b/g,'Open'],[/\bFechar\b/g,'Close'],
    [/\bJaneiro\b/g,'January']
  ];

  const skip = el => !!el.closest('script,style,noscript,svg,.lp-language-toggle,[data-no-i18n]');

  const translateString = raw => {
    if (!raw || !raw.trim()) return raw;
    const leading = raw.match(/^\s*/)?.[0] || '';
    const trailing = raw.match(/\s*$/)?.[0] || '';
    const core = raw.trim();
    if (exact.has(core)) return leading + exact.get(core) + trailing;
    let out = core;
    fragments.forEach(([pattern,replacement]) => { out = out.replace(pattern,replacement); });
    return leading + out + trailing;
  };

  const translateSubtree = root => {
    if ((window.LIGHTPATH_LANGUAGE || localStorage.getItem(STORAGE_KEY)) !== 'en' || !root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let node;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      if (!parent || skip(parent) || !node.nodeValue.trim()) continue;
      nodes.push(node);
    }
    nodes.forEach(node => { node.nodeValue = translateString(node.nodeValue); });

    root.querySelectorAll?.('[placeholder],[aria-label],[title]').forEach(el => {
      if (skip(el)) return;
      ['placeholder','aria-label','title'].forEach(attr => {
        if (el.hasAttribute(attr)) el.setAttribute(attr, translateString(el.getAttribute(attr)));
      });
    });
  };

  const applyAll = () => {
    if ((window.LIGHTPATH_LANGUAGE || localStorage.getItem(STORAGE_KEY)) === 'en') {
      requestAnimationFrame(() => translateSubtree(document.body));
    }
  };

  window.addEventListener('lightpath:languagechange', event => {
    if (event.detail?.lang === 'en') applyAll();
  });

  /* Dynamic UI changes happen after the click handlers in script.js/storytelling.js/presentation.js. */
  document.addEventListener('click', event => {
    if ((window.LIGHTPATH_LANGUAGE || localStorage.getItem(STORAGE_KEY)) !== 'en') return;
    const target = event.target.closest('button,a,[data-panel],[data-growth],[data-signal],[data-method],[data-proof],[data-ai-step],[data-diagnostic]');
    if (!target) return;
    setTimeout(() => {
      const scope = target.closest('section,.command-center,.growth-systems,.scanner-app,.story') || document.body;
      translateSubtree(scope);
    }, 0);
  }, true);

  applyAll();
})();
