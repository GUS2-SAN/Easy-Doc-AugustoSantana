const siteHeader = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".site-nav a");
const revealItems = document.querySelectorAll("[data-reveal]");
const videoEmbeds = document.querySelectorAll("[data-video-embed]");
const marqueeTrack = document.querySelector(".logo-marquee__track");

const form = document.getElementById("contact-form");
const formFeedback = document.getElementById("form-feedback");

const stateData = [
  { uf: "AC", name: "Acre", cities: ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira", "Tarauacá"] },
  { uf: "AL", name: "Alagoas", cities: ["Maceió", "Arapiraca", "Rio Largo", "Palmeira dos Índios"] },
  { uf: "AP", name: "Amapá", cities: ["Macapá", "Santana", "Laranjal do Jari", "Oiapoque"] },
  { uf: "AM", name: "Amazonas", cities: ["Manaus", "Parintins", "Itacoatiara", "Manacapuru"] },
  { uf: "BA", name: "Bahia", cities: ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Lauro de Freitas"] },
  { uf: "CE", name: "Ceará", cities: ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú", "Sobral"] },
  { uf: "DF", name: "Distrito Federal", cities: ["Brasília", "Taguatinga", "Ceilândia", "Samambaia", "Gama"] },
  { uf: "ES", name: "Espírito Santo", cities: ["Vitória", "Vila Velha", "Serra", "Cariacica", "Linhares"] },
  { uf: "GO", name: "Goiás", cities: ["Goiânia", "Anápolis", "Aparecida de Goiânia", "Rio Verde", "Catalão"] },
  { uf: "MA", name: "Maranhão", cities: ["São Luís", "Imperatriz", "Timon", "Caxias", "Bacabal"] },
  { uf: "MT", name: "Mato Grosso", cities: ["Cuiabá", "Várzea Grande", "Rondonópolis", "Sinop", "Tangará da Serra"] },
  { uf: "MS", name: "Mato Grosso do Sul", cities: ["Campo Grande", "Dourados", "Três Lagoas", "Corumbá", "Ponta Porã"] },
  { uf: "MG", name: "Minas Gerais", cities: ["Belo Horizonte", "Betim", "Contagem", "Uberlândia", "Juiz de Fora"] },
  { uf: "PA", name: "Pará", cities: ["Belém", "Ananindeua", "Santarém", "Marabá", "Parauapebas"] },
  { uf: "PB", name: "Paraíba", cities: ["João Pessoa", "Campina Grande", "Santa Rita", "Patos", "Bayeux"] },
  { uf: "PR", name: "Paraná", cities: ["Curitiba", "Londrina", "Maringá", "São José dos Pinhais", "Cascavel"] },
  { uf: "PE", name: "Pernambuco", cities: ["Recife", "Jaboatão dos Guararapes", "Olinda", "Caruaru", "Petrolina"] },
  { uf: "PI", name: "Piauí", cities: ["Teresina", "Parnaíba", "Picos", "Floriano", "Piripiri"] },
  { uf: "RJ", name: "Rio de Janeiro", cities: ["Rio de Janeiro", "Niterói", "Duque de Caxias", "Nova Iguaçu", "Campos dos Goytacazes"] },
  { uf: "RN", name: "Rio Grande do Norte", cities: ["Natal", "Mossoró", "Parnamirim", "São Gonçalo do Amarante"] },
  { uf: "RS", name: "Rio Grande do Sul", cities: ["Porto Alegre", "Caxias do Sul", "Gravataí", "Novo Hamburgo", "Canoas"] },
  { uf: "RO", name: "Rondônia", cities: ["Porto Velho", "Ji-Paraná", "Ariquemes", "Vilhena", "Cacoal"] },
  { uf: "RR", name: "Roraima", cities: ["Boa Vista", "Rorainópolis", "Caracaraí", "Alto Alegre"] },
  { uf: "SC", name: "Santa Catarina", cities: ["Joinville", "Florianópolis", "Blumenau", "Itajaí", "Chapecó"] },
  { uf: "SP", name: "São Paulo", cities: ["Guarulhos", "São Paulo", "Campinas", "Jundiaí", "Santos", "Osasco", "Sorocaba"] },
  { uf: "SE", name: "Sergipe", cities: ["Aracaju", "Nossa Senhora do Socorro", "Lagarto", "Itabaiana"] },
  { uf: "TO", name: "Tocantins", cities: ["Palmas", "Araguaína", "Gurupi", "Porto Nacional"] },
];

const stateByUf = new Map(stateData.map((state) => [state.uf, state]));
const touchedFields = new Set();
let zipLookupTimer;
let lastZipLookup = "";

const zipFallbacks = {
  "01229010": {
    cep: "01229-010",
    logradouro: "Rua São Vicente de Paulo",
    bairro: "Santa Cecília",
    localidade: "São Paulo",
    uf: "SP",
  },
};

const selectors = {
  name: "#name",
  email: "#email",
  phone: "#phone",
  company: "#company",
  zip: "#zip",
  state: "#state",
  city: "#city",
  address: "#address",
  district: "#district",
  message: "#message",
  zipLoader: "#zip-loader",
  zipStatus: "#zip-status",
  zipSearch: "#zip-search",
  submit: "#contact-submit",
};

const getField = (name) => form?.querySelector(selectors[name]);
const onlyDigits = (value) => value.replace(/\D/g, "");

const setScrolledState = () => {
  siteHeader?.classList.toggle("is-scrolled", window.scrollY > 24);
};

setScrolledState();
window.addEventListener("scroll", setScrolledState, { passive: true });

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteHeader.classList.toggle("is-menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    siteHeader?.classList.remove("is-menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

if (navLinks.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    {
      threshold: 0.45,
      rootMargin: "-18% 0px -42% 0px",
    }
  );

  document.querySelectorAll("main section[id]").forEach((section) => {
    sectionObserver.observe(section);
  });
}

if (revealItems.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const buildIframe = (wrapper) => {
  const videoId = wrapper.dataset.videoId;
  const title = wrapper.dataset.videoTitle;

  wrapper.innerHTML = `
    <iframe
      src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0"
      title="${title}"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
    ></iframe>
  `;
};

videoEmbeds.forEach((wrapper) => {
  wrapper.querySelector(".play-button")?.addEventListener("click", () => buildIframe(wrapper));
});

document.querySelectorAll("[data-video-trigger]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const target = document.querySelector(trigger.dataset.videoTrigger);
    if (!target) return;

    buildIframe(target);
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  });
});

if (marqueeTrack) {
  marqueeTrack.innerHTML += marqueeTrack.innerHTML;
}

const maskPhone = (value) => {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length > 10) return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  if (digits.length > 6) return digits.replace(/(\d{2})(\d{4,5})(\d{0,4})/, "($1) $2-$3");
  if (digits.length > 2) return digits.replace(/(\d{2})(\d+)/, "($1) $2");
  if (digits.length > 0) return digits.replace(/(\d+)/, "($1");
  return "";
};

const maskZip = (value) => {
  const digits = onlyDigits(value).slice(0, 8);
  if (digits.length > 5) return digits.replace(/(\d{5})(\d{0,3})/, "$1-$2");
  return digits;
};

const populateStates = (selectedUf = "SP") => {
  const state = getField("state");
  if (!state) return;

  state.innerHTML = "";
  stateData.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.uf;
    option.textContent = item.name;
    option.selected = item.uf === selectedUf;
    state.append(option);
  });
};

const populateCities = (uf = "SP", selectedCity = "") => {
  const city = getField("city");
  if (!city) return;

  const state = stateByUf.get(uf);
  const cities = state?.cities || [];
  const cityOptions = selectedCity && !cities.includes(selectedCity) ? [selectedCity, ...cities] : cities;

  city.innerHTML = "";
  cityOptions.forEach((cityName) => {
    const option = document.createElement("option");
    option.value = cityName;
    option.textContent = cityName;
    option.selected = selectedCity ? cityName === selectedCity : cityName === cityOptions[0];
    city.append(option);
  });

  city.disabled = cityOptions.length === 0;
};

const setZipLoading = (isLoading) => {
  const zip = getField("zip");
  const loader = getField("zipLoader");
  const searchButton = getField("zipSearch");
  const submit = getField("submit");

  zip?.classList.toggle("is-loading", isLoading);
  loader?.classList.toggle("is-visible", isLoading);
  if (searchButton) {
    searchButton.disabled = isLoading;
    searchButton.textContent = isLoading ? "Buscando..." : "Buscar endereço";
  }
  if (submit) submit.disabled = isLoading;
};

const setZipStatus = (message = "", type = "muted") => {
  const status = getField("zipStatus");
  if (!status) return;

  status.textContent = message;
  status.dataset.status = type;
};

const setFieldState = (field, errorMessage = "") => {
  if (!field) return;

  const error = form.querySelector(`[data-error-for="${field.id}"]`);
  const shouldShowError = touchedFields.has(field.id) && errorMessage;

  field.classList.toggle("is-invalid", Boolean(shouldShowError));
  field.classList.toggle("is-valid", touchedFields.has(field.id) && !errorMessage && Boolean(field.value.trim()));

  if (error) error.textContent = shouldShowError ? errorMessage : "";
};

const validators = {
  name: (field) => field.value.trim().length >= 3 || "Informe um nome com pelo menos 3 caracteres.",
  email: (field) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim()) || "Digite um e-mail válido.",
  phone: (field) => onlyDigits(field.value).length >= 10 || "Digite um telefone válido com DDD.",
  company: (field) => field.value.trim().length >= 2 || "Informe o nome da empresa.",
  zip: (field) => onlyDigits(field.value).length === 8 || "Digite um CEP válido com 8 números.",
  state: (field) => Boolean(field.value) || "Selecione um estado.",
  city: (field) => Boolean(field.value) || "Selecione uma cidade.",
  address: (field) => field.value.trim().length >= 3 || "Informe o logradouro.",
  district: (field) => field.value.trim().length >= 2 || "Informe o bairro.",
  message: (field) => field.value.trim().length >= 10 || "Escreva uma mensagem com pelo menos 10 caracteres.",
};

const validateField = (name, { markTouched = true } = {}) => {
  const field = getField(name);
  if (!field || !validators[name]) return true;

  if (markTouched) touchedFields.add(field.id);

  const result = validators[name](field);
  const error = result === true ? "" : result;
  setFieldState(field, error);

  return !error;
};

const validateForm = () => {
  const fieldNames = Object.keys(validators);
  fieldNames.forEach((name) => {
    const field = getField(name);
    if (field) touchedFields.add(field.id);
  });

  const invalidFieldName = fieldNames.find((name) => !validateField(name, { markTouched: false }));
  return {
    isValid: !invalidFieldName,
    firstInvalidField: invalidFieldName ? getField(invalidFieldName) : null,
  };
};

const fillAddressFromZip = (data) => {
  const zip = getField("zip");
  const address = getField("address");
  const district = getField("district");

  if (zip) zip.value = maskZip(data.cep || zip.value);
  if (address && data.logradouro) address.value = data.logradouro;
  if (district && data.bairro) district.value = data.bairro;

  if (data.uf) {
    populateStates(data.uf);
    populateCities(data.uf, data.localidade);
  }

  ["zip", "address", "district", "state", "city"].forEach((name) => {
    const field = getField(name);
    if (field) {
      touchedFields.add(field.id);
      validateField(name, { markTouched: false });
    }
  });
};

const fetchZip = async ({ force = false } = {}) => {
  const zip = getField("zip");
  if (!zip) return;

  const zipDigits = onlyDigits(zip.value);
  const fallbackData = zipFallbacks[zipDigits];
  touchedFields.add(zip.id);

  if (zipDigits.length !== 8) {
    validateField("zip", { markTouched: false });
    setZipStatus("Digite os 8 números do CEP para buscar automaticamente.", "error");
    return;
  }

  if (!force && zipDigits === lastZipLookup) return;
  lastZipLookup = zipDigits;

  setZipLoading(true);
  setZipStatus("Buscando endereço pelo CEP...", "loading");

  try {
    const response = await fetch(`https://viacep.com.br/ws/${zipDigits}/json/`);
    if (!response.ok) throw new Error("Não foi possível consultar o CEP.");

    const data = await response.json();
    if (data.erro) {
      if (fallbackData) {
        fillAddressFromZip(fallbackData);
        setZipStatus("Endereço preenchido pela base local de apoio. Revise os dados antes de enviar.", "success");
        return;
      }

      setZipStatus("CEP não encontrado. Você pode preencher o endereço manualmente.", "error");
      setFieldState(zip, "CEP não encontrado.");
      lastZipLookup = "";
      return;
    }

    fillAddressFromZip(data);
    const hasFullAddress = Boolean(data.logradouro && data.bairro);
    setZipStatus(
      hasFullAddress
        ? "Endereço preenchido automaticamente. Revise os dados antes de enviar."
        : "CEP localizado. Complete logradouro e bairro manualmente, se necessário.",
      "success"
    );
  } catch (error) {
    if (fallbackData) {
      fillAddressFromZip(fallbackData);
      setZipStatus("Endereço preenchido pela base local de apoio. Revise os dados antes de enviar.", "success");
      return;
    }

    lastZipLookup = "";
    setZipStatus("Não foi possível buscar o CEP agora. Preencha manualmente para continuar.", "error");
  } finally {
    setZipLoading(false);
  }
};

const scheduleZipLookup = () => {
  const zip = getField("zip");
  if (!zip) return;

  const zipDigits = onlyDigits(zip.value);
  window.clearTimeout(zipLookupTimer);

  if (zipDigits.length < 8) {
    lastZipLookup = "";
    setZipStatus("Digite um CEP para preencher endereço, estado e cidade automaticamente.");
    return;
  }

  setZipStatus("CEP completo. Buscando automaticamente...", "loading");
  zipLookupTimer = window.setTimeout(fetchZip, 450);
};

if (form) {
  populateStates("SP");
  populateCities("SP", "Guarulhos");

  getField("phone")?.addEventListener("input", (event) => {
    event.target.value = maskPhone(event.target.value);
  });

  getField("zip")?.addEventListener("input", (event) => {
    event.target.value = maskZip(event.target.value);
    scheduleZipLookup();
  });

  getField("zip")?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;

    event.preventDefault();
    window.clearTimeout(zipLookupTimer);
    fetchZip({ force: true });
  });

  getField("zip")?.addEventListener("blur", (event) => {
    if (event.relatedTarget === getField("zipSearch")) return;

    window.clearTimeout(zipLookupTimer);
    fetchZip();
  });

  getField("zipSearch")?.addEventListener("click", () => {
    window.clearTimeout(zipLookupTimer);
    fetchZip({ force: true });
  });

  getField("state")?.addEventListener("change", (event) => {
    populateCities(event.target.value);
    validateField("state");
    validateField("city");
    setZipStatus("Estado alterado manualmente. A cidade foi atualizada pela seleção dinâmica.", "muted");
  });

  Object.keys(validators).forEach((name) => {
    const field = getField(name);
    if (!field || name === "zip" || name === "state") return;

    field.addEventListener("blur", () => validateField(name));
    field.addEventListener("input", () => {
      if (touchedFields.has(field.id)) validateField(name, { markTouched: false });
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const { isValid, firstInvalidField } = validateForm();

    if (!isValid) {
      formFeedback.textContent = "Revise os campos destacados antes de enviar.";
      formFeedback.className = "form-feedback is-error";
      firstInvalidField?.focus();
      return;
    }

    formFeedback.textContent = "Formulário validado com sucesso. O envio real de dados permanece desabilitado.";
    formFeedback.className = "form-feedback is-success";
  });
}
