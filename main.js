/* ==== CONFIGURAÇÃO: preencha aqui antes de subir os anúncios ==== */
const CONFIG = {
  checkoutUrl: 'https://pay.cakto.com.br/z6fy5s9_1263697',
  pixelId: '1681507720164487',
  fimDaVenda: '2026-11-28T00:00:00-03:00',
  legal: {
    responsavel: 'Renan Brandão', // nome ou razão social
    documento: '',            // CNPJ
    suporte: '',              // e-mail de suporte
    termos: '',               // link dos termos de uso
    privacidade: '',          // link da política de privacidade
  },
};
/* ================================================================ */

(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* Depois do fim da venda, a página deixa de oferecer o kit. */
  if (Date.now() >= new Date(CONFIG.fimDaVenda).getTime()) {
    $('#conteudo').innerHTML = '<div class="encerrada"><h1>Campanha encerrada</h1><p>As vendas do Kit Black Friday para Manicures 2026 terminaram.</p></div>';
    $('#barra').remove();
    $('.faixa').remove();
    return;
  }

  /* Pixel: carrega depois da primeira exibição para não atrasar a página. */
  const evento = (nome, dados) => { if (window.fbq) window.fbq('track', nome, dados); };
  const oferta = { content_name: 'Kit Black Friday para Manicures', value: 29.9, currency: 'BRL' };
  if (CONFIG.pixelId) {
    const iniciar = () => {
      /* eslint-disable */
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */
      window.fbq('init', CONFIG.pixelId);
      window.fbq('track', 'PageView');
      evento('ViewContent', oferta);
    };
    addEventListener('load', () => ('requestIdleCallback' in window ? requestIdleCallback(iniciar, { timeout: 2500 }) : setTimeout(iniciar, 1200)), { once: true });
  }

  /* Botões: repassam UTMs e identificadores de clique ao checkout. */
  if (CONFIG.checkoutUrl) {
    const destino = new URL(CONFIG.checkoutUrl);
    new URLSearchParams(location.search).forEach((valor, chave) => {
      if (/^(utm_|fbclid$|gclid$|src$|sck$)/.test(chave)) destino.searchParams.set(chave, valor);
    });
    $$('[data-checkout]').forEach((a) => {
      a.href = destino.href;
      a.addEventListener('click', () => evento('InitiateCheckout', oferta));
    });
  }

  /* Rodapé legal: só aparece o que estiver preenchido. */
  const { responsavel, documento, suporte, termos, privacidade } = CONFIG.legal;
  const legal = [responsavel, documento && `CNPJ ${documento}`].filter(Boolean).join(' · ');
  if (legal) { const p = $('#rodape-legal'); p.textContent = legal; p.hidden = false; }
  const links = [[suporte && `mailto:${suporte}`, 'Suporte'], [termos, 'Termos de uso'], [privacidade, 'Política de privacidade']].filter(([u]) => u);
  if (links.length) {
    const nav = $('#rodape-links');
    links.forEach(([u, t]) => { const a = document.createElement('a'); a.href = u; a.textContent = t; nav.append(a); });
    nav.hidden = false;
  }

  /* Barra fixa: aparece quando o botão da abertura sai da tela e some na oferta e na chamada final. */
  const barra = $('#barra');
  const linkBarra = $('a', barra);
  const visiveis = new Set();
  const atualizar = (ativa) => {
    barra.classList.toggle('ativa', ativa);
    barra.setAttribute('aria-hidden', String(!ativa));
    linkBarra.tabIndex = ativa ? 0 : -1;
  };
  const obs = new IntersectionObserver((itens) => {
    itens.forEach((i) => (i.isIntersecting ? visiveis.add(i.target) : visiveis.delete(i.target)));
    const acima = $('#cta-abertura').getBoundingClientRect().bottom > 0;
    atualizar(!acima && visiveis.size === 0);
  });
  ['#cta-abertura', '#calendario', '#cta-oferta', '#cta-final', '.rodape'].forEach((s) => obs.observe($(s)));

  /* Calendário: dados do cronograma do kit. */
  const artes = {
    'Feed 01': ['feed-01', 'feed'], 'Feed 02': ['feed-02', 'feed'], 'Feed 03': ['feed-03', 'feed'],
    'Feed 04': ['feed-04', 'feed'], 'Feed 06': ['feed-06', 'feed'], 'Feed 10': ['feed-10', 'feed'],
    'Story 04': ['story-04', 'story'], 'Story 05': ['story-05', 'story'],
  };
  const dias = {
    13: ['Sexta', [['Feed 01', 'Black Friday da Beleza', 'Anúncio da campanha', '10h', 'Publique como aquecimento; ainda não apresente preços.'],
                   ['Story 01', 'Você já está preparada para a Black Friday?', 'Enquete', '19h', 'Insira o adesivo de enquete no Instagram.']]],
    14: ['Sábado', [['Story 02', 'Tem promoção especial chegando por aqui!', 'Anúncio', '19h', 'Deixe a promoção em suspense; as ofertas começam amanhã.']]],
    15: ['Domingo', [['Feed 02', 'Nossa Black Friday começou!', 'Abertura das ofertas', '10h', 'Publique somente quando a campanha estiver realmente ativa.']]],
    16: ['Segunda', [['Feed 03', 'Seu momento de cuidado', 'Promoção mão e pé', '19h', 'Personalize a condição do combo com os seus valores reais.']]],
    17: ['Terça', [['Feed 04', 'Unhas dos sonhos', 'Alongamento de unhas', '19h', 'Divulgue o serviço apenas se você oferecer alongamento.']]],
    18: ['Quarta', [['Feed 05', 'Agenda aberta!', 'Horários disponíveis', '10h', 'Verifique a disponibilidade da agenda antes de publicar.'],
                    ['Story 03', 'A agenda está aberta!', 'Chamada para agendamento', '19h', 'Responda às mensagens do direct e ofereça horários atualizados.']]],
    19: ['Quinta', [['Feed 06', 'Cuide do seu alongamento', 'Oferta de manutenção', '19h', 'Se não oferece manutenção de alongamento, adapte o serviço.']]],
    20: ['Sexta', [['Feed 07', 'Você merece esse carinho', 'Oferta para clientes antigas', '10h', 'Mencione a condição especial apenas se ela existir.']]],
    21: ['Sábado', [['Feed 08', 'Qual vai ser sua próxima escolha?', 'Apresentação dos serviços', '10h', 'Adapte a lista para os serviços que você realmente oferece.']]],
    22: ['Domingo', [['Feed 09', 'Um tempinho só pra você', 'Incentivo ao autocuidado', '19h', 'Use uma fotografia que represente o seu atendimento.']]],
    23: ['Segunda', [['Feed 10', 'Dois cuidados, uma oferta especial', 'Divulgação de combo', '10h', 'Defina previamente o preço e as regras do combo.'],
                     ['Story 04', 'Condição especial de Black Friday', 'Divulgação de oferta', '19h', 'Substitua os campos e adicione o adesivo de link no Instagram.']]],
    24: ['Terça', [['Feed 11', 'Seu momento em boas mãos', 'Apresentação profissional', '19h', 'Mostre sua forma de atender sem prometer resultados garantidos.']]],
    25: ['Quarta', [['Feed 12', 'Resultados que falam por si', 'Prova social', '19h', 'Use somente fotografias reais dos seus trabalhos, com autorização quando necessária.']]],
    26: ['Quinta', [['Feed 13', 'Já escolheu seu horário?', 'Lembrete da campanha', '19h', 'Fale em disponibilidade apenas se houver horários confirmados.']]],
    27: ['Sexta', [['Feed 14', 'É hoje!', 'Último dia', '10h', 'Use apenas em 27/11 se a campanha terminar nessa data.'],
                   ['Story 05', 'Último dia da Black Friday!', 'Encerramento', '19h', 'Publique no último dia real da campanha, sem urgência artificial.']]],
    28: ['Sábado', [['Feed 15', 'Obrigada por fazer parte!', 'Encerramento', '10h', 'Post de agradecimento no dia seguinte, sem oferta ativa.']]],
  };

  const palco = $('#palco'); const img = $('#palco-img'); const sem = $('#palco-sem');
  const botoesDia = $$('#dias button'); const pecasBox = $('#ficha-pecas');
  let pedido = 0;
  let rotuloDia = 'Segunda, 16/11';
  const semMovimento = matchMedia('(prefers-reduced-motion: reduce)');

  const mostrarPeca = async ([cod, titulo, fin, hora, uso]) => {
    const atual = ++pedido;
    $('#ficha-titulo').textContent = titulo;
    $('#ficha-meta').textContent = `${rotuloDia} · ${cod} · ${fin} · ${hora} (sugestão)`;
    $('#ficha-uso').textContent = uso;
    const arte = artes[cod];
    let nova = null;
    if (arte) {
      const [nome, tipo] = arte;
      const [p, g] = tipo === 'feed' ? [420, 720] : [320, 540];
      nova = new Image();
      nova.sizes = tipo === 'feed' ? '(min-width: 1000px) 400px, 240px' : '(min-width: 1000px) 282px, 169px';
      nova.srcset = `assets/img/${nome}-${p}.webp ${p}w, assets/img/${nome}-${g}.webp ${g}w`;
      nova.src = `assets/img/${nome}-${p}.webp`;
      nova.dimensoes = tipo === 'feed' ? [720, 900] : [540, 960];
      try { await nova.decode(); } catch (e) { /* mostra mesmo assim */ }
      if (atual !== pedido) return;
    }
    palco.classList.add('troca');
    setTimeout(() => {
      if (atual !== pedido) return;
      if (nova) {
        img.hidden = false; sem.hidden = true; palco.classList.remove('palco--sem');
        img.width = nova.dimensoes[0]; img.height = nova.dimensoes[1];
        img.sizes = nova.sizes; img.srcset = nova.srcset; img.src = nova.src;
        img.alt = `Arte ${cod}: ${titulo}.`;
      } else {
        img.hidden = true; sem.hidden = false; palco.classList.add('palco--sem');
      }
      palco.classList.remove('troca');
    }, 180);
  };

  const escolherDia = (n) => {
    const [semana, pecas] = dias[n];
    botoesDia.forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.dia === n)));
    rotuloDia = `${semana}, ${n}/11`;
    const primeira = Math.max(pecas.findIndex((p) => artes[p[0]]), 0);
    pecasBox.textContent = '';
    pecasBox.hidden = pecas.length < 2;
    if (pecas.length > 1) {
      pecas.forEach((p, i) => {
        const b = document.createElement('button');
        b.type = 'button'; b.textContent = p[0];
        b.setAttribute('aria-pressed', String(i === primeira));
        b.addEventListener('click', () => {
          $$('button', pecasBox).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
          mostrarPeca(p);
        });
        pecasBox.append(b);
      });
    }
    mostrarPeca(pecas[primeira]);
  };

  botoesDia.forEach((b) => {
    if (!b.hasAttribute('aria-pressed')) b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => {
      escolherDia(+b.dataset.dia);
      /* No celular, deixa as datas no topo da tela para o resultado caber logo abaixo. */
      if (innerWidth < 1000) $('.mes__sem').scrollIntoView({ block: 'start', behavior: semMovimento.matches ? 'auto' : 'smooth' });
    });
  });
})();
