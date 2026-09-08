(() => {
  'use strict';

  const STORAGE_KEY = 'lightpath-language';
  const isEnglish = () => localStorage.getItem(STORAGE_KEY) === 'en' || document.documentElement.lang === 'en';

  const exact = new Map(Object.entries({
    'inteligência.':'intelligence.','CAMINHOS':'PATHWAYS','GARGALO':'BOTTLENECK','SISTEMA':'SYSTEM','APRESENTAÇÃO INTERATIVA':'INTERACTIVE PRESENTATION',
    'Veja como pensamos um bottleneck até virar result.':'See how we take a bottleneck all the way to results.','Veja como pensamos um gargalo até virar resultado.':'See how we take a bottleneck all the way to results.',
    'Uma experience clicável de impact, arquitetura, growth e diagnóstico — sem deck de 40 slides.':'A clickable experience of impact, architecture, growth and diagnosis — without a 40-slide deck.','Uma experiência clicável de impacto, arquitetura, growth e diagnóstico — sem deck de 40 slides.':'A clickable experience of impact, architecture, growth and diagnosis — without a 40-slide deck.','ABRIR ↗':'OPEN ↗','ABRIR':'OPEN',
    'AWS + Spark/PySpark + EMR + Airflow + arquitetura lakehouse.':'AWS + Spark/PySpark + EMR + Airflow + lakehouse architecture.','Engenharia de crescimento':'Growth Engineering','ANÚNCIO → LANDING → CHECKOUT → PAGAMENTO → RETENÇÃO':'AD → LANDING → CHECKOUT → PAYMENT → RETENTION','Do clique ao caixa.':'From click to cash.','Where o value vaza?':'Where does value leak?','Onde o valor vaza?':'Where does value leak?',
    'Você investe para trazer uma pessoa. Entre o anúncio e o dinheiro no caixa, muita coisa pode quebrar. Nós conectamos e medimos o caminho inteiro para descobrir o que otimizar primeiro.':'You invest to bring someone in. Between the ad and cash collected, many things can break. We connect and measure the entire path to discover what to optimize first.',
    'LIGHTPATH / REVENUE SYSTEM CAMINHO ATIVO':'LIGHTPATH / REVENUE SYSTEM ACTIVE PATH','CAMINHO ATIVO':'ACTIVE PATH','Meta · Google · criativos':'Meta · Google · creatives','mensagem · UX · segmentação':'messaging · UX · segmentation','oferta · pagamento · recovery':'offer · payment · recovery','venda real · pagamento · CRM':'real sale · payment · CRM','RASTREAMENTO — O QUE LIGA A ORIGEM AO RESULTADO':'TRACKING — WHAT CONNECTS SOURCE TO OUTCOME','O QUE PERGUNTAMOS':'WHAT WE ASK',
    'Seguimos o caminho até o pedido real para separar tráfego barato de acquisition que gera revenue.':'We follow the path to the real order to separate cheap traffic from acquisition that generates revenue.','Seguimos o caminho até o pedido real para separar tráfego barato de aquisição que gera receita.':'We follow the path to the real order to separate cheap traffic from acquisition that generates revenue.','Medimos → CAC · revenue · quality do tráfego':'Measure → CAC · revenue · traffic quality','Medimos → CAC · receita · qualidade do tráfego':'Measure → CAC · revenue · traffic quality',
    'Quando o funil deixa de ser um conjunto de ferramentas e vira um system.':'When the funnel stops being a set of tools and becomes a system.','Quando o funil deixa de ser um conjunto de ferramentas e vira um sistema.':'When the funnel stops being a set of tools and becomes a system.',
    'Media, landing/quiz, checkout, pagamento, acesso ao produto e analytics conectados. Assim fica possível enxergar where a revenue entra, where ela vaza e qual mudança merece o next investimento.':'Media, landing/quiz, checkout, payment, product access and analytics connected. This makes it possible to see where revenue enters, where it leaks and which change deserves the next investment.','Mídia, landing/quiz, checkout, pagamento, acesso ao produto e analytics conectados. Assim fica possível enxergar onde a receita entra, onde ela vaza e qual mudança merece o próximo investimento.':'Media, landing/quiz, checkout, payment, product access and analytics connected. This makes it possible to see where revenue enters, where it leaks and which change deserves the next investment.',
    'Cada ferramenta conta uma história.':'Each tool tells a different story.','Métricas divergentes e pouca confiança para saber se o problema está no anúncio, página, checkout ou oferta.':'Divergent metrics and low confidence to know whether the problem is in the ad, page, checkout or offer.','Um caminho rastreável.':'A traceable path.','Sessão, campanha, checkout, pedido e eventos conectados para reconstruir a jornada comercial de ponta a ponta.':'Session, campaign, checkout, order and events connected to reconstruct the commercial journey end to end.','O next teste deixa de ser chute.':'The next test stops being a guess.','O próximo teste deixa de ser chute.':'The next test stops being a guess.','Decisões de media, criativo, landing, checkout e oferta passam a usar result comercial real.':'Media, creative, landing, checkout and offer decisions start using real commercial outcomes.','Decisões de mídia, criativo, landing, checkout e oferta passam a usar resultado comercial real.':'Media, creative, landing, checkout and offer decisions start using real commercial outcomes.','Tráfego pago':'Paid media','Criativos & testes':'Creatives & tests','Checkout & oferta':'Checkout & offer','FLUXO':'FLOW','RESULTADO':'RESULT',
    'TESE':'THESIS','DIAGNÓSTICO':'DIAGNOSIS','ARQUITETURA':'ARCHITECTURE','MÉTODO':'METHOD','ENGENHARIA COM PROVA':'ENGINEERING WITH PROOF','Métrica':'Metric','PRIMEIRO VETOR':'FIRST VECTOR','DADOS DISPERSOS':'SCATTERED DATA','PROCESSO MANUAL':'MANUAL PROCESS','DECISÃO ATRASADA':'DELAYED DECISION','IA SEM CONTEXTO':'AI WITHOUT CONTEXT','SEGURANÇA':'SECURITY','OBSERVABILIDADE':'OBSERVABILITY','GOVERNANÇA':'GOVERNANCE','TESTES':'TESTS','Diagnóstico':'Diagnosis','Desenho':'Design','Implementação':'Implementation','Otimização':'Optimization','PROCESSADOS / MÊS':'PROCESSED / MONTH','FLUXOS AUTOMATIZADOS':'AUTOMATED FLOWS','ESFORÇO MANUAL':'MANUAL EFFORT','EFICIÊNCIA OPERACIONAL':'OPERATIONAL EFFICIENCY','LEITURA DE NEGÓCIO':'BUSINESS VIEW','Processo manual':'Manual process','Dados dispersos':'Scattered data','Decisão atrasada':'Delayed decision','IA sem caso de uso':'AI without a use case','Operação sem escala':'Operations without scale','Abrir diagnóstico':'Open diagnosis','Ativar o fluxo':'Activate flow','Cena anterior':'Previous scene','Próxima cena':'Next scene','Fim da apresentação':'End of presentation','Ir para cena':'Go to scene','Fluxo comercial':'Commercial flow','Etapas do método':'Method stages','Selecione seu principal gargalo':'Select your main bottleneck'
  }));

  const fragments = [
    ['APRESENTAÇÃO INTERATIVA','INTERACTIVE PRESENTATION'],['Engenharia de crescimento','Growth Engineering'],['ANÚNCIO','AD'],['PAGAMENTO','PAYMENT'],['RETENÇÃO','RETENTION'],['PEDIDO','ORDER'],['CAMINHO ATIVO','ACTIVE PATH'],['RASTREAMENTO','TRACKING'],['ORIGEM','SOURCE'],['O QUE PERGUNTAMOS','WHAT WE ASK'],['Tráfego pago','Paid media'],['tráfego pago','paid media'],['Criativos','Creatives'],['criativos','creatives'],['mensagem','messaging'],['segmentação','segmentation'],['oferta','offer'],['pagamento','payment'],['pedido','order'],['venda real','real sale'],['reconciliação','reconciliation'],['funil','funnel'],['Funil','Funnel'],['clique','click'],['caixa','cash'],['anúncio','ad'],['Anúncio','Ad'],['página','page'],['Página','Page'],['produto','product'],['Produto','Product'],['acesso','access'],['investimento','investment'],['próximo','next'],['próxima','next'],['teste','test'],['chute','guess'],['ferramentas','tools'],['ferramenta','tool'],['história','story'],['Métricas','Metrics'],['métricas','metrics'],['divergentes','divergent'],['confiança','confidence'],['problema','problem'],['Sessão','Session'],['sessão','session'],['campanha','campaign'],['eventos','events'],['jornada','journey'],['comercial','commercial'],['resultado','result'],['Resultado','Result'],['qualidade do tráfego','traffic quality'],['qualidade','quality'],['origem','source'],['arquitetura','architecture'],['Engenharia','Engineering'],['engenharia','engineering'],['crescimento','growth'],['rastreamento','tracking'],['diagnóstico','diagnosis'],['Diagnóstico','Diagnosis'],['método','method'],['Método','Method'],['otimização','optimization'],['Otimização','Optimization'],['decisão','decision'],['Decisão','Decision'],['tecnologia','technology'],['gargalo','bottleneck'],['Gargalo','Bottleneck'],['CAMINHOS','PATHWAYS'],['GARGALO','BOTTLENECK'],['SISTEMA','SYSTEM'],['inteligência','intelligence'],['Inteligência','Intelligence'],['experiência','experience'],['Experiência','Experience'],['impacto','impact'],['Impacto','Impact'],['receita','revenue'],['Receita','Revenue'],['aquisição','acquisition'],['Aquisição','Acquisition'],['retenção','retention'],['Retenção','Retention'],['integração','integration'],['Integração','Integration'],['integrações','integrations'],['processos','processes'],['processo','process'],['dados','data'],['Dados','Data'],['automação','automation'],['Automação','Automation'],['operação','operations'],['Operação','Operations'],['produção','production'],['Produção','Production'],['segurança','security'],['Segurança','Security'],['observabilidade','observability'],['governança','governance'],['testes','tests'],['Métrica','Metric'],['métrica','metric'],['medimos','we measure'],['Medimos','We measure'],['vaza','leaks'],['vazando','leaking'],['entra','enters'],['conectados','connected'],['conectadas','connected'],['onde','where'],['Onde','Where'],['você','you'],['Você','You'],['Nós','We'],['nós','we']
  ].sort((a,b) => b[0].length - a[0].length);

  const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const boundaryReplace = (input, from, to) => {
    const letters = 'A-Za-zÀ-ÖØ-öø-ÿ';
    const re = new RegExp(`(^|[^${letters}])(${escapeRegExp(from)})(?=$|[^${letters}])`, 'g');
    return input.replace(re, (_, prefix) => prefix + to);
  };

  const translateResidual = raw => {
    const trimmed = raw.trim();
    if (!trimmed) return raw;
    if (exact.has(trimmed)) return raw.replace(trimmed, exact.get(trimmed));
    let out = raw;
    fragments.forEach(([pt,en]) => { out = boundaryReplace(out, pt, en); });
    return out;
  };

  const skip = el => !!el?.closest?.('script,style,noscript,svg,.lp-language-toggle,[data-no-i18n]');
  const applyFixes = (root = document.body) => {
    if (!isEnglish() || !root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!node.parentElement || skip(node.parentElement) || !node.nodeValue.trim()) continue;
      const next = translateResidual(node.nodeValue);
      if (next !== node.nodeValue) node.nodeValue = next;
    }
    root.querySelectorAll?.('[placeholder],[aria-label],[title]').forEach(el => {
      if (skip(el)) return;
      ['placeholder','aria-label','title'].forEach(attr => {
        if (!el.hasAttribute(attr)) return;
        const value = el.getAttribute(attr);
        const next = translateResidual(value);
        if (next !== value) el.setAttribute(attr,next);
      });
    });
  };

  const scheduleFix = scope => {
    if (!isEnglish()) return;
    requestAnimationFrame(() => applyFixes(scope || document.body));
    setTimeout(() => applyFixes(scope || document.body), 40);
  };

  window.addEventListener('lightpath:languagechange', event => {
    if (event.detail?.lang === 'en') scheduleFix(document.body);
  });
  document.addEventListener('click', event => {
    if (!isEnglish() || event.target.closest('.lp-language-toggle')) return;
    const interactive = event.target.closest('button,a,[data-panel],[data-growth],[data-signal],[data-method],[data-proof],[data-ai-step],[data-diagnostic],[data-bottleneck],[data-solution],[data-impact],[data-arch]');
    if (!interactive) return;
    scheduleFix(interactive.closest('section,.command-center,.growth-systems,.scanner-app,.story') || document.body);
  });
  if (isEnglish()) scheduleFix(document.body);
})();