/**
  support.js — Módulo da página de suporte
 
  Responsabilidades:
   1. Accordion de FAQ: garante que apenas um item fique aberto por vez, usando o evento nativo `toggle` para acessibilidade.
   2. Modularidade: cada funcionalidade é encapsulada em funções independentes, permitindo fácil manutenção e extensão futura.
   3. Robustez: tolera a ausência de elementos específicos no DOM, evitando erros em páginas sem FAQ.
 */

(() => {
  "use strict";

  // ============================================================
  // MÓDULO: ACCORDION DE FAQ
  // ============================================================

  /**
   Inicializa o comportamento de accordion exclusivo na lista de FAQ.
   Quando um item é aberto, todos os outros são fechados automaticamente.
   
   Utiliza o evento nativo `toggle` dos elementos `<details>`, que é
   disparado tanto por clique quanto por teclado — garantindo
   acessibilidade sem tratamento extra de eventos de teclado.
   */
  function initFaqAccordion() {
    const faqItems = /** @type {HTMLDetailsElement[]} */ ([
      ...document.querySelectorAll(".faq-item"),
    ]);

    if (!faqItems.length) return;

    /**
     Fecha todos os itens do accordion, exceto o item informado.
     @param {HTMLDetailsElement} exceptItem
     */
    const closeOthers = (exceptItem) => {
      faqItems.forEach((item) => {
        if (item !== exceptItem) {
          item.removeAttribute("open");
        }
      });
    };

    faqItems.forEach((item) => {
      item.addEventListener("toggle", () => {
        if (item.open) {
          closeOthers(item);
        }
      });
    });
  }

  // ============================================================
  // BOOTSTRAP
  // ============================================================

  /**
   Ponto de entrada: inicializa todos os comportamentos da página de suporte.
   Cada módulo é independente e tolera a ausência de seus elementos no DOM.
   */
  function init() {
    initFaqAccordion();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();