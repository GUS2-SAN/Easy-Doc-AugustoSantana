/**
 * login.js — Módulo do formulário de autenticação
 *
 * Responsabilidades:
 *  1. Alternar visibilidade da senha
 *  2. Validação reativa por campo (blur + input)
 *  3. Validação completa no submit
 *  4. Simulação de envio com feedback ao usuário
 *  5. Reset de estado após sucesso
 *
 * Não polui o escopo global: todo o estado vive dentro da IIFE.
 */

(() => {
  "use strict";

  // ============================================================
  // TIPOS
  // ============================================================

  /**
   * @typedef {"success" | "error" | "info"} FeedbackType
   */

  /**
   * @typedef {Object} LoginElements
   * @property {HTMLFormElement}    form
   * @property {HTMLElement}        feedback
   * @property {HTMLInputElement}   emailField
   * @property {HTMLInputElement}   passwordField
   * @property {HTMLButtonElement}  passwordToggle
   * @property {HTMLButtonElement}  submitButton
   */

  // ============================================================
  // INICIALIZAÇÃO — guard de presença do formulário
  // ============================================================

  const form = /** @type {HTMLFormElement|null} */ (
    document.getElementById("login-form")
  );

  if (!form) return;

  // ============================================================
  // RESOLUÇÃO DE ELEMENTOS
  // Agrupados aqui para que qualquer ausência seja detectada
  // imediatamente, sem erros silenciosos em runtime.
  // ============================================================

  /** @type {LoginElements} */
  const EL = {
    form,
    feedback:       /** @type {HTMLElement}       */ (document.getElementById("login-feedback")),
    emailField:     /** @type {HTMLInputElement}   */ (document.getElementById("login-email")),
    passwordField:  /** @type {HTMLInputElement}   */ (document.getElementById("login-password")),
    passwordToggle: /** @type {HTMLButtonElement}  */ (form.querySelector(".password-toggle")),
    submitButton:   /** @type {HTMLButtonElement}  */ (form.querySelector(".auth-submit")),
  };

  const submitButtonInitialHtml = EL.submitButton.innerHTML;

  // ============================================================
  // ESTADO LOCAL
  // ============================================================

  /**
   * IDs dos campos com que o usuário já interagiu ao menos uma vez.
   * Controla quando os erros de validação devem aparecer visualmente.
   * @type {Set<string>}
   */
  const touchedFields = new Set();

  // ============================================================
  // VALIDADORES
  // Cada função recebe um HTMLInputElement e retorna `true`
  // (campo válido) ou uma string com a mensagem de erro.
  // @type {Record<string, (field: HTMLInputElement) => true | string>}
  // ============================================================

  const validators = {
    "login-email": (f) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()) ||
      "Digite um e-mail válido.",

    "login-password": (f) =>
      f.value.trim().length > 0 ||
      "Informe sua senha para continuar.",
  };

  // ============================================================
  // FEEDBACK GLOBAL
  // ============================================================

  /**
   * Exibe uma mensagem de feedback abaixo do formulário.
   * @param {string}       message
   * @param {FeedbackType} type
   */
  const showFeedback = (message, type) => {
    EL.feedback.textContent = message;
    EL.feedback.className   = `form-feedback is-${type}`;
  };

  /** Remove qualquer mensagem de feedback visível. */
  const clearFeedback = () => {
    EL.feedback.textContent = "";
    EL.feedback.className   = "form-feedback";
  };

  // ============================================================
  // ESTADO VISUAL DOS CAMPOS
  // ============================================================

  /**
   * Aplica ou remove as classes de estado (válido/inválido) em um campo,
   * exibindo a mensagem de erro associada apenas após o primeiro toque.
   *
   * @param {HTMLInputElement} field
   * @param {string}           [errorMessage] — vazio indica campo válido
   */
  const applyFieldState = (field, errorMessage = "") => {
    const errorEl   = form.querySelector(`[data-error-for="${field.id}"]`);
    const isTouched = touchedFields.has(field.id);
    const hasError  = Boolean(errorMessage);
    const showError = isTouched && hasError;
    const hasValue  = Boolean(field.value.trim());

    field.classList.toggle("is-invalid", showError);
    field.classList.toggle("is-valid",   isTouched && !hasError && hasValue);

    if (errorEl) {
      errorEl.textContent = showError ? errorMessage : "";
    }
  };

  // ============================================================
  // VALIDAÇÃO DE CAMPO
  // ============================================================

  /**
   * Valida um campo pelo seu `id`, atualiza o estado visual
   * e opcionalmente marca o campo como "tocado".
   *
   * @param {HTMLInputElement} field
   * @param {{ markTouched?: boolean }} [options]
   * @returns {boolean} `true` se o campo for válido.
   */
  const validateField = (field, { markTouched = true } = {}) => {
    if (markTouched) touchedFields.add(field.id);

    const validator = validators[field.id];
    const result    = validator ? validator(field) : true;
    const error     = result === true ? "" : result;

    applyFieldState(field, error);
    return !error;
  };

  /**
   * Valida todos os campos do formulário, marcando-os como tocados
   * para que os erros sejam exibidos mesmo sem interação prévia.
   *
   * @returns {{ isValid: boolean, firstInvalidField: HTMLInputElement | null }}
   */
  const validateAllFields = () => {
    const fieldIds = Object.keys(validators);

    fieldIds.forEach((id) => touchedFields.add(id));

    const firstInvalidId = fieldIds.find((id) => {
      const field = /** @type {HTMLInputElement} */ (document.getElementById(id));
      return field && !validateField(field, { markTouched: false });
    });

    return {
      isValid:           !firstInvalidId,
      firstInvalidField: firstInvalidId
        ? /** @type {HTMLInputElement} */ (document.getElementById(firstInvalidId))
        : null,
    };
  };

  // ============================================================
  // SIMULAÇÃO DE AUTENTICAÇÃO
  // Substitua o bloco interno pela chamada real à API de auth.
  // ============================================================

  /**
   * Simula o envio das credenciais para o servidor.
   * Em produção, substitua pela chamada real (ex.: fetch para /api/auth).
   *
   * @param {{ email: string, password: string, remember: boolean }} _credentials
   * @returns {Promise<void>}
   */
  const authenticateUser = async (_credentials) => {
    // TODO: substituir pela integração real. Exemplo:
    //
    // const response = await fetch("/api/auth/login", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(_credentials),
    // });
    //
    // if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);
    // const { redirectUrl } = await response.json();
    // window.location.href = redirectUrl;

    await new Promise((resolve) => setTimeout(resolve, 800));
  };

  // ============================================================
  // RESET DO FORMULÁRIO
  // ============================================================

  /**
   * Reinicia o formulário para o estado inicial limpo:
   * valores, estado de validação visual e campos tocados.
   */
  const resetForm = () => {
    form.reset();
    touchedFields.clear();

    Object.keys(validators).forEach((id) => {
      const field = /** @type {HTMLInputElement|null} */ (document.getElementById(id));
      if (!field) return;

      field.classList.remove("is-valid", "is-invalid");

      const errorEl = form.querySelector(`[data-error-for="${id}"]`);
      if (errorEl) errorEl.textContent = "";
    });

    clearFeedback();
  };

  // ============================================================
  // TOGGLE DE VISIBILIDADE DA SENHA
  // ============================================================

  EL.passwordToggle?.addEventListener("click", () => {
    const isVisible = EL.passwordField.type === "text";

    EL.passwordField.type          = isVisible ? "password" : "text";
    EL.passwordToggle.textContent  = isVisible ? "Mostrar" : "Ocultar";
    EL.passwordToggle.setAttribute(
      "aria-label",
      isVisible ? "Mostrar senha" : "Ocultar senha",
    );
  });

  // ============================================================
  // BINDING DE VALIDAÇÃO REATIVA
  // ============================================================

  Object.keys(validators).forEach((id) => {
    const field = /** @type {HTMLInputElement|null} */ (document.getElementById(id));
    if (!field) return;

    /** Valida ao sair do campo. */
    field.addEventListener("blur", () => validateField(field));

    /** Revalida durante a digitação, mas só após o primeiro toque. */
    field.addEventListener("input", () => {
      if (touchedFields.has(field.id)) {
        validateField(field, { markTouched: false });
      }
      clearFeedback();
    });
  });

  // ============================================================
  // SUBMIT
  // ============================================================

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const { isValid, firstInvalidField } = validateAllFields();

    if (!isValid) {
      showFeedback("Revise os campos destacados para continuar.", "error");
      firstInvalidField?.focus();
      return;
    }

    EL.submitButton.disabled  = true;
    EL.submitButton.innerHTML = "<span>Entrando...</span>";
    showFeedback("Validando acesso…", "info");

    const credentials = {
      email:    EL.emailField.value.trim(),
      password: EL.passwordField.value,
      remember: /** @type {HTMLInputElement} */ (
        form.querySelector('[name="remember"]')
      )?.checked ?? false,
    };

    try {
      await authenticateUser(credentials);
      showFeedback(
        "Acesso validado com sucesso. Preparando o ambiente do portal...",
        "success",
      );
      resetForm();
    } catch {
      showFeedback(
        "Não foi possível autenticar. Verifique suas credenciais e tente novamente.",
        "error",
      );
    } finally {
      EL.submitButton.disabled  = false;
      EL.submitButton.innerHTML = submitButtonInitialHtml;
    }
  });
})();
