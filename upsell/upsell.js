/* ==== CONFIGURAÇÃO: preencha aqui ==== */
const CONFIG = {
  preco: '27',      // Vazio: o preço não aparece na página.
  compraUrl: '',    // link ou ação de compra do upsell na Cakto.
  recusaUrl: '',    // para onde vai quem recusa. Vazio: o link de recusa não aparece.
  pixelId: '1681507720164487',
  fimDaVenda: '2026-11-28T00:00:00-03:00',
};
/* ===================================== */

(() => {
  'use strict';
  const $$ = (s) => [...document.querySelectorAll(s)];

  if (Date.now() >= new Date(CONFIG.fimDaVenda).getTime()) {
    document.querySelector('#conteudo').innerHTML = '<div class="encerrada"><h1>Campanha encerrada</h1><p>As vendas da campanha de Black Friday 2026 terminaram.</p></div>';
    document.querySelector('.faixa').remove();
    return;
  }

  if (CONFIG.preco) {
    $$('[data-preco]').forEach((e) => { e.textContent = `R$ ${CONFIG.preco}`; e.hidden = false; });
    $$('[data-preco-texto]').forEach((e) => { e.textContent = ` por R$ ${CONFIG.preco}`; });
  }

  const evento = (nome, dados) => { if (window.fbq) window.fbq('track', nome, dados); };
  const oferta = { content_name: 'Agenda Profissional', currency: 'BRL', ...(CONFIG.preco ? { value: Number(CONFIG.preco.replace(',', '.')) } : {}) };

  if (CONFIG.pixelId) {
    addEventListener('load', () => setTimeout(() => {
      /* eslint-disable */
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */
      window.fbq('init', CONFIG.pixelId);
      window.fbq('track', 'PageView');
      evento('ViewContent', oferta);
    }, 1200), { once: true });
  }

  const comParametros = (url) => {
    const destino = new URL(url);
    new URLSearchParams(location.search).forEach((v, k) => { if (!destino.searchParams.has(k)) destino.searchParams.set(k, v); });
    return destino.href;
  };
  if (CONFIG.compraUrl) {
    $$('[data-compra]').forEach((a) => {
      a.href = comParametros(CONFIG.compraUrl);
      a.addEventListener('click', () => evento('InitiateCheckout', oferta));
    });
  }
  if (CONFIG.recusaUrl) {
    $$('[data-recusa]').forEach((a) => { a.href = comParametros(CONFIG.recusaUrl); a.hidden = false; });
  }
})();
