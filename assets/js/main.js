/**
 * main.js — Script principal do site
 *
 * Organização:
 *  1. Tipos / JSDoc
 *  2. Configuração central
 *  3. Utilitários puros
 *  4. Módulo: Header / Navegação
 *  5. Módulo: Animações e Mídia
 *  6. Módulo: Formulário de Contato
 *  7. Bootstrap
 */

(() => {
  "use strict";

  // ============================================================
  // 1. TIPOS / JSDOC
  // ============================================================

  /**
   * @typedef {Object} StateEntry
   * @property {string} uf   - Sigla do estado (ex.: "SP")
   * @property {string} name - Nome completo do estado
   * @property {string[]} cities - Cidades disponíveis para seleção
   */

  /**
   * @typedef {Object} ViaCepResponse
   * @property {string} cep
   * @property {string} logradouro
   * @property {string} bairro
   * @property {string} localidade
   * @property {string} uf
   * @property {boolean} [erro]
   */

  /**
   * @typedef {Object} ZipLookupResult
   * @property {boolean} ok
   * @property {ViaCepResponse|null} data
   * @property {string} [errorMessage]
   */

  /**
   * @typedef {Object} ValidationResult
   * @property {boolean} isValid
   * @property {string} errorMessage
   */

  /**
   * @typedef {Object} FormValidationSummary
   * @property {boolean} isValid
   * @property {HTMLElement|null} firstInvalidField
   */

  // ============================================================
  // 2. CONFIGURAÇÃO CENTRAL
  // ============================================================

  /** @type {StateEntry[]} */
  const STATE_DATA = [
    { uf: "AC", name: "Acre",                  cities: ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira", "Tarauacá"] },
    { uf: "AL", name: "Alagoas",               cities: ["Maceió", "Arapiraca", "Rio Largo", "Palmeira dos Índios"] },
    { uf: "AP", name: "Amapá",                 cities: ["Macapá", "Santana", "Laranjal do Jari", "Oiapoque"] },
    { uf: "AM", name: "Amazonas",              cities: ["Manaus", "Parintins", "Itacoatiara", "Manacapuru"] },
    { uf: "BA", name: "Bahia",                 cities: ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Lauro de Freitas"] },
    { uf: "CE", name: "Ceará",                 cities: ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú", "Sobral"] },
    { uf: "DF", name: "Distrito Federal",      cities: ["Brasília", "Taguatinga", "Ceilândia", "Samambaia", "Gama"] },
    { uf: "ES", name: "Espírito Santo",        cities: ["Vitória", "Vila Velha", "Serra", "Cariacica", "Linhares"] },
    { uf: "GO", name: "Goiás",                 cities: ["Goiânia", "Anápolis", "Aparecida de Goiânia", "Rio Verde", "Catalão"] },
    { uf: "MA", name: "Maranhão",              cities: ["São Luís", "Imperatriz", "Timon", "Caxias", "Bacabal"] },
    { uf: "MT", name: "Mato Grosso",           cities: ["Cuiabá", "Várzea Grande", "Rondonópolis", "Sinop", "Tangará da Serra"] },
    { uf: "MS", name: "Mato Grosso do Sul",    cities: ["Campo Grande", "Dourados", "Três Lagoas", "Corumbá", "Ponta Porã"] },
    { uf: "MG", name: "Minas Gerais",          cities: ["Belo Horizonte", "Betim", "Contagem", "Uberlândia", "Juiz de Fora"] },
    { uf: "PA", name: "Pará",                  cities: ["Belém", "Ananindeua", "Santarém", "Marabá", "Parauapebas"] },
    { uf: "PB", name: "Paraíba",               cities: ["João Pessoa", "Campina Grande", "Santa Rita", "Patos", "Bayeux"] },
    { uf: "PR", name: "Paraná",                cities: ["Curitiba", "Londrina", "Maringá", "São José dos Pinhais", "Cascavel"] },
    { uf: "PE", name: "Pernambuco",            cities: ["Recife", "Jaboatão dos Guararapes", "Olinda", "Caruaru", "Petrolina"] },
    { uf: "PI", name: "Piauí",                 cities: ["Teresina", "Parnaíba", "Picos", "Floriano", "Piripiri"] },
    { uf: "RJ", name: "Rio de Janeiro",        cities: ["Rio de Janeiro", "Niterói", "Duque de Caxias", "Nova Iguaçu", "Campos dos Goytacazes"] },
    { uf: "RN", name: "Rio Grande do Norte",   cities: ["Natal", "Mossoró", "Parnamirim", "São Gonçalo do Amarante"] },
    { uf: "RS", name: "Rio Grande do Sul",     cities: ["Porto Alegre", "Caxias do Sul", "Gravataí", "Novo Hamburgo", "Canoas"] },
    { uf: "RO", name: "Rondônia",              cities: ["Porto Velho", "Ji-Paraná", "Ariquemes", "Vilhena", "Cacoal"] },
    { uf: "RR", name: "Roraima",               cities: ["Boa Vista", "Rorainópolis", "Caracaraí", "Alto Alegre"] },
    { uf: "SC", name: "Santa Catarina",        cities: ["Joinville", "Florianópolis", "Blumenau", "Itajaí", "Chapecó"] },
    { uf: "SP", name: "São Paulo",             cities: ["Guarulhos", "São Paulo", "Campinas", "Jundiaí", "Santos", "Osasco", "Sorocaba"] },
    { uf: "SE", name: "Sergipe",               cities: ["Aracaju", "Nossa Senhora do Socorro", "Lagarto", "Itabaiana"] },
    { uf: "TO", name: "Tocantins",             cities: ["Palmas", "Araguaína", "Gurupi", "Porto Nacional"] },
  ];

  /**
   * Fallback local para CEPs conhecidos, usado quando a API ViaCEP
   * não está disponível (modo offline, rate-limit, etc.).
   * @type {Record<string, ViaCepResponse>}
   */
  const ZIP_FALLBACKS = {
    "01229010": {
      cep: "01229-010",
      logradouro: "Rua São Vicente de Paulo",
      bairro: "Santa Cecília",
      localidade: "São Paulo",
      uf: "SP",
    },
  };

  /** Seletores CSS dos campos do formulário de contato. */
  const FORM_FIELD_SELECTORS = /** @type {const} */ ({
    name:        "#name",
    email:       "#email",
    phone:       "#phone",
    company:     "#company",
    zip:         "#zip",
    state:       "#state",
    city:        "#city",
    address:     "#address",
    district:    "#district",
    message:     "#message",
    zipLoader:   "#zip-loader",
    submit:      "#contact-submit",
  });

  /**
   * Estado padrão do seletor de localização.
   * A cidade padrão é a primeira da lista do estado padrão,
   * resolvida dinamicamente para evitar acoplamento com os dados.
   */
  const DEFAULT_UF = "SP";

  /** Tempo de espera (ms) antes de disparar a busca de CEP após digitação. */
  const ZIP_DEBOUNCE_DELAY_MS = 450;

  // ============================================================
  // 3. UTILITÁRIOS PUROS
  // ============================================================

  /**
   * Remove todos os caracteres não numéricos de uma string.
   * @param {string} value
   * @returns {string}
   */
  const onlyDigits = (value) => value.replace(/\D/g, "");

  /**
   * Cria uma versão debounced de uma função.
   * @template {(...args: unknown[]) => void} T
   * @param {T} fn
   * @param {number} delayMs
   * @returns {T}
   */
  const debounce = (fn, delayMs) => {
    let timerId = null;
    return /** @type {T} */ ((...args) => {
      window.clearTimeout(timerId);
      timerId = window.setTimeout(() => fn(...args), delayMs);
    });
  };

  /**
   * Aplica máscara de telefone brasileiro: (DD) NNNNN-NNNN ou (DD) NNNN-NNNN.
   * @param {string} value
   * @returns {string}
   */
  const maskPhone = (value) => {
    const digits = onlyDigits(value).slice(0, 11);
    if (digits.length > 10) return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    if (digits.length > 6)  return digits.replace(/(\d{2})(\d{4,5})(\d{0,4})/, "($1) $2-$3");
    if (digits.length > 2)  return digits.replace(/(\d{2})(\d+)/, "($1) $2");
    if (digits.length > 0)  return digits.replace(/(\d+)/, "($1");
    return "";
  };

  /**
   * Aplica máscara de CEP brasileiro: NNNNN-NNN.
   * @param {string} value
   * @returns {string}
   */
  const maskZip = (value) => {
    const digits = onlyDigits(value).slice(0, 8);
    return digits.length > 5 ? digits.replace(/(\d{5})(\d{0,3})/, "$1-$2") : digits;
  };

  // ============================================================
  // 4. MÓDULO: HEADER / NAVEGAÇÃO
  // ============================================================

  /**
   * Inicializa o comportamento do header ao rolar a página.
   * Adiciona a classe `is-scrolled` quando o scroll passa de 24px.
   */
  function initHeaderScroll() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    const update = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /**
   * Inicializa o menu hambúrguer para dispositivos móveis.
   * Gerencia o estado `is-menu-open` no header e `aria-expanded` no botão.
   */
  function initMobileMenu() {
    const header     = document.querySelector(".site-header");
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks   = /** @type {HTMLAnchorElement[]} */ ([...document.querySelectorAll(".site-nav a")]);

    if (!header || !menuToggle) return;

    const closeMenu = () => {
      header.classList.remove("is-menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = header.classList.toggle("is-menu-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 1025px)").matches) closeMenu();
    });
  }

  /**
   * Suaviza a navegacao por ancoras compensando a altura do header fixo.
   * Isso evita que titulos fiquem escondidos atras do menu apos o clique.
   */
  function initAnchorNavigation() {
    const header     = document.querySelector(".site-header");
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks   = /** @type {HTMLAnchorElement[]} */ ([...document.querySelectorAll(".site-nav a")]);
    const anchorLinks = /** @type {HTMLAnchorElement[]} */ ([
      ...document.querySelectorAll('a[href^="#"]'),
    ]);

    const closeMenu = () => {
      header?.classList.remove("is-menu-open");
      menuToggle?.setAttribute("aria-expanded", "false");
    };

    const setActiveLink = (href) => {
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === href);
      });
    };

    anchorLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.getElementById(href.slice(1));
      if (!target) return;

      link.addEventListener("click", (event) => {
        event.preventDefault();
        closeMenu();
        setActiveLink(href);

        const offset = (header?.offsetHeight ?? 0) + 18;
        const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);

        window.scrollTo({ top, behavior: "smooth" });

        if (window.history?.pushState) {
          window.history.pushState(null, "", href);
        }
      });
    });
  }

  /**
   * Destaca o link de navegação correspondente à seção visível na tela,
   * usando IntersectionObserver para eficiência.
   */
  function initSectionObserver() {
    const navLinks = /** @type {HTMLAnchorElement[]} */ ([...document.querySelectorAll(".site-nav a")]);
    const sections = /** @type {HTMLElement[]} */ ([...document.querySelectorAll("main section[id]")]);

    if (!navLinks.length || !sections.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const activeHref = `#${entry.target.id}`;
          navLinks.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === activeHref);
          });
        });
      },
      { threshold: 0.45, rootMargin: "-18% 0px -42% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
  }

  // ============================================================
  // 5. MÓDULO: ANIMAÇÕES E MÍDIA
  // ============================================================

  /**
   * Revela elementos marcados com `data-reveal` conforme entram na viewport.
   * Em navegadores sem suporte a IntersectionObserver, exibe tudo imediatamente.
   */
  function initRevealOnScroll() {
    const items = /** @type {HTMLElement[]} */ ([...document.querySelectorAll("[data-reveal]")]);
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.16 },
    );

    items.forEach((item) => observer.observe(item));
  }

  /**
   * Cria um iframe do YouTube configurado para autoplay.
   * @param {string} videoId  - ID do vídeo no YouTube
   * @param {string} [title]  - Texto acessível para o `title` do iframe
   * @returns {HTMLIFrameElement}
   */
  function createYouTubeIframe(videoId, title = "Vídeo") {
    const iframe = document.createElement("iframe");
    iframe.src              = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    iframe.title            = title;
    iframe.loading          = "lazy";
    iframe.allow            = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.referrerPolicy   = "strict-origin-when-cross-origin";
    iframe.allowFullscreen  = true;
    return iframe;
  }

  /**
   * Substitui o conteúdo de um wrapper pelo iframe do YouTube correspondente.
   * A operação é idempotente: não remonta o iframe se já estiver montado.
   * @param {HTMLElement} wrapper
   */
  function mountVideo(wrapper) {
    if (!wrapper || wrapper.dataset.videoMounted === "true") return;

    const { videoId, videoTitle } = wrapper.dataset;
    if (!videoId) return;

    wrapper.replaceChildren(createYouTubeIframe(videoId, videoTitle));
    wrapper.dataset.videoMounted = "true";
  }

  /**
   * Inicializa players de vídeo lazy (click-to-play) e botões de
   * atalho que montam e scrollam até o vídeo-alvo.
   */
  function initVideoEmbeds() {
    document
      .querySelectorAll("[data-video-embed]")
      .forEach((wrapper) => {
        wrapper.querySelector(".play-button")
          ?.addEventListener("click", () => mountVideo(/** @type {HTMLElement} */ (wrapper)));
      });

    document
      .querySelectorAll("[data-video-trigger]")
      .forEach((trigger) => {
        trigger.addEventListener("click", () => {
          const selector = /** @type {HTMLElement} */ (trigger).dataset.videoTrigger;
          if (!selector) return;

          const target = /** @type {HTMLElement|null} */ (document.querySelector(selector));
          if (!target) return;

          mountVideo(target);
          target.scrollIntoView({ behavior: "smooth", block: "center" });
        });
      });
  }

  /**
   * Duplica os itens do marquee de logos para criar o efeito de loop contínuo.
   * A operação é idempotente via flag `data-cloned`.
   */
  function initMarquee() {
    const track = document.querySelector(".logo-marquee__track");
    if (!track || track.dataset.cloned === "true") return;

    track.innerHTML += track.innerHTML;
    track.dataset.cloned = "true";
  }

  // ============================================================
  // 6. MÓDULO: FORMULÁRIO DE CONTATO
  // ============================================================

  /**
   * Encapsula todo o estado e comportamento do formulário de contato.
   * Retorna `null` se o formulário não existir no documento.
   *
   * @returns {null}
   */
  function initContactForm() {
    const form         = /** @type {HTMLFormElement|null} */ (document.getElementById("contact-form"));
    const formFeedback = document.getElementById("form-feedback");

    if (!form) return null;

    // ----------------------------------------------------------
    // 6.1 Helpers de acesso ao DOM — escopados ao formulário
    // ----------------------------------------------------------

    /**
     * Retorna o campo do formulário pelo nome lógico.
     * @param {keyof typeof FORM_FIELD_SELECTORS} name
     * @returns {HTMLElement|null}
     */
    const getField = (name) => form.querySelector(FORM_FIELD_SELECTORS[name]);

    /**
     * Retorna o elemento de erro associado a um campo pelo seu `id`.
     * @param {string} fieldId
     * @returns {HTMLElement|null}
     */
    const getErrorEl = (fieldId) => form.querySelector(`[data-error-for="${fieldId}"]`);

    // ----------------------------------------------------------
    // 6.2 Estado local do formulário
    // ----------------------------------------------------------

    /** @type {Set<string>} Conjunto de IDs de campos que o usuário já interagiu. */
    const touchedFields = new Set();

    /** Último CEP consultado com sucesso (evita requisições duplicadas). */
    let lastZipQueried = "";

    /** AbortController da requisição de CEP em curso, se houver. */
    let zipAbortController = /** @type {AbortController|null} */ (null);

    // ----------------------------------------------------------
    // 6.3 Feedback global do formulário
    // ----------------------------------------------------------

    /**
     * Exibe uma mensagem de feedback global no formulário.
     * @param {string} message
     * @param {"success"|"error"|"info"} type
     */
    const showFeedback = (message, type) => {
      if (!formFeedback) return;
      formFeedback.textContent = message;
      formFeedback.className   = `form-feedback is-${type}`;
    };

    /** Remove a mensagem de feedback global. */
    const clearFeedback = () => {
      if (!formFeedback) return;
      formFeedback.textContent = "";
      formFeedback.className   = "form-feedback";
    };

    // ----------------------------------------------------------
    // 6.4 Gerenciamento de estado visual dos campos
    // ----------------------------------------------------------

    /**
     * Aplica visualmente o estado de válido/inválido a um campo.
     * O estado só é exibido se o campo já foi tocado pelo usuário.
     *
     * @param {HTMLElement} field
     * @param {string} [errorMessage] - Vazio indica campo válido.
     */
    const applyFieldState = (field, errorMessage = "") => {
      if (!field) return;

      const errorEl      = getErrorEl(field.id);
      const isTouched    = touchedFields.has(field.id);
      const hasError     = Boolean(errorMessage);
      const showError    = isTouched && hasError;
      const hasValue     = Boolean(/** @type {HTMLInputElement} */ (field).value?.trim());

      field.classList.toggle("is-invalid", showError);
      field.classList.toggle("is-valid",   isTouched && !hasError && hasValue);

      if (errorEl) {
        errorEl.textContent = showError ? errorMessage : "";
      }
    };

    // ----------------------------------------------------------
    // 6.5 Validadores por campo
    // ----------------------------------------------------------

    /**
     * Mapa de validadores. Cada função recebe o campo e retorna
     * `true` se válido, ou uma string com a mensagem de erro.
     * @type {Record<string, (field: HTMLInputElement) => true | string>}
     */
    const validators = {
      name:     (f) => f.value.trim().length >= 3    || "Informe um nome com pelo menos 3 caracteres.",
      email:    (f) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()) || "Digite um e-mail válido.",
      phone:    (f) => onlyDigits(f.value).length >= 10 || "Digite um telefone válido com DDD.",
      company:  (f) => f.value.trim().length >= 2    || "Informe o nome da empresa.",
      zip:      (f) => onlyDigits(f.value).length === 8 || "Digite um CEP válido com 8 números.",
      state:    (f) => Boolean(f.value)              || "Selecione um estado.",
      city:     (f) => Boolean(f.value)              || "Selecione uma cidade.",
      address:  (f) => f.value.trim().length >= 3    || "Informe o logradouro.",
      district: (f) => f.value.trim().length >= 2    || "Informe o bairro.",
      message:  (f) => f.value.trim().length >= 10   || "Escreva uma mensagem com pelo menos 10 caracteres.",
    };

    /**
     * Valida um campo individual e atualiza seu estado visual.
     *
     * @param {string} fieldName - Chave em `validators`
     * @param {{ markTouched?: boolean }} [options]
     * @returns {boolean} `true` se o campo for válido.
     */
    const validateField = (fieldName, { markTouched = true } = {}) => {
      const field     = /** @type {HTMLInputElement} */ (getField(fieldName));
      const validator = validators[fieldName];

      if (!field || !validator) return true;
      if (markTouched) touchedFields.add(field.id);

      const result       = validator(field);
      const errorMessage = result === true ? "" : result;

      applyFieldState(field, errorMessage);
      return !errorMessage;
    };

    /**
     * Valida todos os campos do formulário de uma vez.
     * Marca todos como "tocados" para exibir os erros.
     *
     * @returns {FormValidationSummary}
     */
    const validateAllFields = () => {
      const fieldNames = Object.keys(validators);

      fieldNames.forEach((name) => {
        const field = getField(name);
        if (field) touchedFields.add(field.id);
      });

      const firstInvalidName = fieldNames.find(
        (name) => !validateField(name, { markTouched: false }),
      );

      return {
        isValid:           !firstInvalidName,
        firstInvalidField: firstInvalidName ? /** @type {HTMLElement} */ (getField(firstInvalidName)) : null,
      };
    };

    // ----------------------------------------------------------
    // 6.6 População dinâmica de estado e cidade
    // ----------------------------------------------------------

    /**
     * Renderiza as opções do `<select>` de estados.
     * @param {string} [selectedUf]
     */
    const populateStates = (selectedUf) => {
      const stateField = /** @type {HTMLSelectElement|null} */ (getField("state"));
      if (!stateField) return;

      stateField.innerHTML = "";

      STATE_DATA.forEach(({ uf, name }) => {
        const option     = document.createElement("option");
        option.value     = uf;
        option.textContent = name;
        option.selected  = uf === selectedUf;
        stateField.append(option);
      });
    };

    /**
     * Renderiza as opções do `<select>` de cidades para um estado.
     * Se `selectedCity` não existir na lista, ela é inserida no topo.
     *
     * @param {string} uf
     * @param {string} [selectedCity]
     */
    const populateCities = (uf, selectedCity = "") => {
      const cityField = /** @type {HTMLSelectElement|null} */ (getField("city"));
      if (!cityField) return;

      const stateEntry = STATE_DATA.find((s) => s.uf === uf);
      const baseCities = stateEntry?.cities ?? [];
      const cityList   = selectedCity && !baseCities.includes(selectedCity)
        ? [selectedCity, ...baseCities]
        : [...baseCities];

      cityField.innerHTML  = "";
      cityField.disabled   = cityList.length === 0;

      cityList.forEach((cityName, index) => {
        const option       = document.createElement("option");
        option.value       = cityName;
        option.textContent = cityName;
        option.selected    = selectedCity ? cityName === selectedCity : index === 0;
        cityField.append(option);
      });
    };

    // ----------------------------------------------------------
    // 6.7 Busca de CEP (ViaCEP)
    // ----------------------------------------------------------

    /**
     * Ativa ou desativa o indicador de carregamento do campo de CEP.
     * Também desabilita o botão de submit durante a consulta para
     * evitar envios com dados incompletos.
     *
     * @param {boolean} isLoading
     */
    const setZipLoading = (isLoading) => {
      const zipField    = getField("zip");
      const zipLoader   = getField("zipLoader");
      const submitBtn   = /** @type {HTMLButtonElement|null} */ (getField("submit"));

      zipField?.classList.toggle("is-loading", isLoading);
      zipLoader?.classList.toggle("is-visible", isLoading);

      if (submitBtn) submitBtn.disabled = isLoading;
    };

    /**
     * Preenche os campos de endereço com os dados retornados pelo ViaCEP
     * e aciona a revalidação de todos os campos afetados.
     *
     * @param {ViaCepResponse} data
     */
    const fillAddressFromZip = (data) => {
      const zipField      = /** @type {HTMLInputElement|null} */ (getField("zip"));
      const addressField  = /** @type {HTMLInputElement|null} */ (getField("address"));
      const districtField = /** @type {HTMLInputElement|null} */ (getField("district"));

      if (zipField)      zipField.value      = maskZip(data.cep || zipField.value);
      if (addressField)  addressField.value  = data.logradouro || "";
      if (districtField) districtField.value = data.bairro     || "";

      if (data.uf) {
        populateStates(data.uf);
        populateCities(data.uf, data.localidade || "");
      }

      ["zip", "address", "district", "state", "city"].forEach((name) => {
        const field = getField(name);
        if (!field) return;
        touchedFields.add(field.id);
        validateField(name, { markTouched: false });
      });
    };

    /**
     * Consulta a API ViaCEP para um CEP de 8 dígitos.
     * Utiliza `AbortController` para cancelar requisições em voo
     * quando uma nova consulta é iniciada antes da anterior terminar.
     *
     * @param {string} zipDigits - 8 dígitos sem formatação
     * @returns {Promise<ZipLookupResult>}
     */
    const queryViaCep = async (zipDigits) => {
      if (zipAbortController) {
        zipAbortController.abort();
      }
      zipAbortController = new AbortController();

      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${zipDigits}/json/`,
          { signal: zipAbortController.signal },
        );

        if (!response.ok) {
          return { ok: false, data: null, errorMessage: "Falha na consulta do CEP." };
        }

        const data = /** @type {ViaCepResponse} */ (await response.json());

        if (data.erro) {
          return { ok: false, data: null, errorMessage: "CEP não encontrado." };
        }

        return { ok: true, data };
      } catch (error) {
        if (/** @type {Error} */ (error).name === "AbortError") {
          return { ok: false, data: null };
        }
        return { ok: false, data: null, errorMessage: "Não foi possível consultar o CEP. Verifique e tente novamente." };
      } finally {
        zipAbortController = null;
      }
    };

    /**
     * Orquestra a busca de CEP: checa o cache local, usa fallback offline
     * se disponível, ou chama a API ViaCEP.
     *
     * @param {{ force?: boolean }} [options]
     *   `force: true` ignora a checagem de CEP já consultado.
     */
    const fetchZip = async ({ force = false } = {}) => {
      const zipField  = /** @type {HTMLInputElement|null} */ (getField("zip"));
      if (!zipField) return;

      const zipDigits = onlyDigits(zipField.value);
      touchedFields.add(zipField.id);

      if (zipDigits.length !== 8) {
        validateField("zip", { markTouched: false });
        return;
      }

      if (!force && zipDigits === lastZipQueried) return;

      const fallback = ZIP_FALLBACKS[zipDigits];
      if (fallback) {
        lastZipQueried = zipDigits;
        fillAddressFromZip(fallback);
        return;
      }

      lastZipQueried = zipDigits;
      setZipLoading(true);

      const result = await queryViaCep(zipDigits);

      setZipLoading(false);

      if (!result.ok) {
        if (result.errorMessage) {
          lastZipQueried = "";
          applyFieldState(zipField, result.errorMessage);
        }
        return;
      }

      fillAddressFromZip(/** @type {ViaCepResponse} */ (result.data));
    };

    const debouncedFetchZip = debounce(() => fetchZip(), ZIP_DEBOUNCE_DELAY_MS);

    /**
     * Reagenda ou executa imediatamente a busca de CEP conforme o estado
     * atual do campo. Limpa `lastZipQueried` se o CEP ficar incompleto
     * para garantir que a próxima digitação completa dispare a consulta.
     */
    const scheduledFetchZip = () => {
      const zipField  = /** @type {HTMLInputElement|null} */ (getField("zip"));
      if (!zipField) return;

      const zipDigits = onlyDigits(zipField.value);

      if (zipDigits.length < 8) {
        lastZipQueried = "";

        if (touchedFields.has(zipField.id)) {
          validateField("zip", { markTouched: false });
        }
        return;
      }

      if (ZIP_FALLBACKS[zipDigits]) {
        fetchZip({ force: true });
        return;
      }

      debouncedFetchZip();
    };

    // ----------------------------------------------------------
    // 6.8 Binding de eventos — validação em tempo real
    // ----------------------------------------------------------

    /**
     * Adiciona listeners de `blur` e `input` a um campo para validação
     * reativa: valida ao sair do campo e revalida a cada digitação
     * após o campo ter sido tocado ao menos uma vez.
     *
     * @param {string} fieldName
     */
    const bindRealtimeValidation = (fieldName) => {
      const field = getField(fieldName);
      if (!field) return;

      field.addEventListener("blur", () => validateField(fieldName));

      field.addEventListener("input", () => {
        if (touchedFields.has(field.id)) {
          validateField(fieldName, { markTouched: false });
        }
        clearFeedback();
      });
    };

    // ----------------------------------------------------------
    // 6.9 Reset completo do formulário
    // ----------------------------------------------------------

    /**
     * Reinicia o formulário para o estado inicial:
     * - Limpa o estado nativo do formulário
     * - Limpa os campos de estilo de validação
     * - Reseta o Set de campos tocados
     * - Reseta o cache de CEP consultado
     * - Restaura os selects de estado e cidade para os valores padrão
     * - Limpa o feedback global
     */
    const resetForm = () => {
      form.reset();
      touchedFields.clear();
      lastZipQueried = "";

      Object.keys(validators).forEach((name) => {
        const field = getField(name);
        if (!field) return;
        field.classList.remove("is-valid", "is-invalid");

        const errorEl = getErrorEl(field.id);
        if (errorEl) errorEl.textContent = "";
      });

      const defaultCity = STATE_DATA.find((s) => s.uf === DEFAULT_UF)?.cities[0] ?? "";
      populateStates(DEFAULT_UF);
      populateCities(DEFAULT_UF, defaultCity);
      clearFeedback();
    };

    // ----------------------------------------------------------
    // 6.10 Envio do formulário
    // ----------------------------------------------------------

    /**
     * Serializa os campos visíveis do formulário em um objeto
     * pronto para ser enviado a uma API.
     *
     * @returns {Record<string, string>}
     */
    const serializeForm = () => {
      const data = {};
      const fieldNames = Object.keys(validators).filter(
        (name) => !["zipLoader", "submit"].includes(name),
      );

      fieldNames.forEach((name) => {
        const field = /** @type {HTMLInputElement|null} */ (getField(name));
        if (field) data[name] = field.value.trim();
      });

      return data;
    };

    /**
     * Envia os dados do formulário para o endpoint configurado.
     * Substitua o bloco interno pelo método de envio adequado
     * (fetch para uma API REST, integração com serviço de e-mail, etc.).
     *
     * @param {Record<string, string>} _payload
     * @returns {Promise<void>}
     */
    const submitFormData = async (_payload) => {
      // TODO: substituir pelo endpoint real de envio.
      // Exemplo com fetch:
      //
      // const response = await fetch("/api/contact", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(_payload),
      // });
      //
      // if (!response.ok) {
      //   throw new Error(`Erro HTTP ${response.status}`);
      // }

      // Simulação de latência para fins de demonstração:
      await new Promise((resolve) => setTimeout(resolve, 600));
    };

    // ----------------------------------------------------------
    // 6.11 Inicialização interna do formulário
    // ----------------------------------------------------------

    const defaultCity = STATE_DATA.find((s) => s.uf === DEFAULT_UF)?.cities[0] ?? "";
    populateStates(DEFAULT_UF);
    populateCities(DEFAULT_UF, defaultCity);

    const phoneField = /** @type {HTMLInputElement|null} */ (getField("phone"));
    const zipField   = /** @type {HTMLInputElement|null} */ (getField("zip"));
    const stateField = /** @type {HTMLSelectElement|null} */ (getField("state"));
    const submitBtn  = /** @type {HTMLButtonElement|null} */ (getField("submit"));
    const submitBtnInitialHtml = submitBtn?.innerHTML ?? "";

    phoneField?.addEventListener("input", (e) => {
      /** @type {HTMLInputElement} */ (e.target).value = maskPhone(/** @type {HTMLInputElement} */ (e.target).value);
      clearFeedback();
    });

    zipField?.addEventListener("input", (e) => {
      /** @type {HTMLInputElement} */ (e.target).value = maskZip(/** @type {HTMLInputElement} */ (e.target).value);
      scheduledFetchZip();
      clearFeedback();
    });

    zipField?.addEventListener("keydown", (e) => {
      if (/** @type {KeyboardEvent} */ (e).key !== "Enter") return;
      e.preventDefault();
      fetchZip({ force: true });
    });

    zipField?.addEventListener("blur", () => fetchZip());

    stateField?.addEventListener("change", (e) => {
      populateCities(/** @type {HTMLSelectElement} */ (e.target).value);
      validateField("state");
      validateField("city");
      clearFeedback();
    });

    Object.keys(validators).forEach((fieldName) => {
      if (fieldName === "zip" || fieldName === "state") return;
      bindRealtimeValidation(fieldName);
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const { isValid, firstInvalidField } = validateAllFields();

      if (!isValid) {
        showFeedback("Revise os campos destacados antes de enviar.", "error");
        firstInvalidField?.focus();
        return;
      }

      if (submitBtn) {
        submitBtn.disabled    = true;
        submitBtn.innerHTML   = "<span>Enviando...</span>";
      }

      try {
        await submitFormData(serializeForm());
        showFeedback("Mensagem enviada com sucesso! Entraremos em contato em breve.", "success");
        resetForm();
      } catch {
        showFeedback("Ocorreu um erro ao enviar. Tente novamente em alguns instantes.", "error");
      } finally {
        if (submitBtn) {
          submitBtn.disabled    = false;
          submitBtn.innerHTML   = submitBtnInitialHtml;
        }
      }
    });

    return null;
  }

  // ============================================================
  // 7. BOOTSTRAP
  // ============================================================

  /**
   * Ponto de entrada: inicializa todos os módulos na ordem correta.
   * Cada módulo é independente e tolera a ausência de seus elementos no DOM.
   */
  function init() {
    initHeaderScroll();
    initMobileMenu();
    initAnchorNavigation();
    initSectionObserver();
    initRevealOnScroll();
    initVideoEmbeds();
    initMarquee();
    initContactForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
