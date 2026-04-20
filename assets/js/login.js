const loginForm = document.getElementById("login-form");
const loginFeedback = document.getElementById("login-feedback");
const passwordInput = document.getElementById("login-password");
const passwordToggle = document.querySelector(".password-toggle");
const loginTouched = new Set();

const loginValidators = {
  "login-email": (field) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim()) || "Digite um e-mail válido.",
  "login-password": (field) => field.value.trim().length > 0 || "Informe sua senha para continuar.",
};

const setLoginError = (field, message = "") => {
  const error = loginForm.querySelector(`[data-error-for="${field.id}"]`);
  const showError = loginTouched.has(field.id) && message;

  field.classList.toggle("is-invalid", Boolean(showError));
  field.classList.toggle("is-valid", loginTouched.has(field.id) && !message && Boolean(field.value.trim()));
  if (error) error.textContent = showError ? message : "";
};

const validateLoginField = (field, markTouched = true) => {
  if (markTouched) loginTouched.add(field.id);
  const result = loginValidators[field.id]?.(field) ?? true;
  const message = result === true ? "" : result;
  setLoginError(field, message);
  return !message;
};

passwordToggle?.addEventListener("click", () => {
  const shouldShow = passwordInput.type === "password";
  passwordInput.type = shouldShow ? "text" : "password";
  passwordToggle.textContent = shouldShow ? "Ocultar" : "Mostrar";
  passwordToggle.setAttribute("aria-label", shouldShow ? "Ocultar senha" : "Mostrar senha");
});

Object.keys(loginValidators).forEach((id) => {
  const field = document.getElementById(id);
  field?.addEventListener("blur", () => validateLoginField(field));
  field?.addEventListener("input", () => {
    if (loginTouched.has(field.id)) validateLoginField(field, false);
  });
});

loginForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const fields = Object.keys(loginValidators).map((id) => document.getElementById(id));
  fields.forEach((field) => loginTouched.add(field.id));

  const firstInvalid = fields.find((field) => !validateLoginField(field, false));
  if (firstInvalid) {
    loginFeedback.textContent = "Revise os campos destacados para continuar.";
    loginFeedback.className = "form-feedback is-error";
    firstInvalid.focus();
    return;
  }

  const submitButton = loginForm.querySelector(".auth-submit");
  submitButton.disabled = true;
  loginFeedback.textContent = "Validando acesso...";
  loginFeedback.className = "form-feedback";

  window.setTimeout(() => {
    submitButton.disabled = false;
    loginFeedback.textContent = "Login simulado com sucesso. Integração real não faz parte do escopo.";
    loginFeedback.className = "form-feedback is-success";
  }, 800);
});
