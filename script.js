// Datos de contacto. Si los cambias, cambia también los enlaces y textos de
// respaldo en index.html (busca 526647358258 y migratoriosmxs).
const WHATSAPP_NUMBER = "+52 664 735 8258";
const EMAIL = "migratoriosmxs@gmail.com";

const MESSAGES = {
  es: {
    whatsapp: "Hola Anait, me gustaría una revisión gratuita de mi caso migratorio.",
    subject: "Revisión gratuita de mi caso migratorio",
  },
  en: {
    whatsapp: "Hi Anait, I'd like a free review of my immigration case.",
    subject: "Free review of my immigration case",
  },
};

const LANGS = ["es", "en"];
const STORAGE_KEY = "lang";
const COUNT_DURATION_MS = 1200;

function pickLang(stored, browserLang) {
  if (LANGS.includes(stored)) return stored;
  return String(browserLang || "").toLowerCase().startsWith("en") ? "en" : "es";
}

function whatsappUrl(number, message) {
  const digits = String(number).replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

function mailtoUrl(email, subject) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}

// Valor del contador animado para un avance entre 0 y 1 (ease-out cúbico).
function countValue(target, progress) {
  const p = Math.min(Math.max(progress, 0), 1);
  return Math.round(target * (1 - Math.pow(1 - p, 3)));
}

// La barra fija de WhatsApp (celular) no repite botones que ya están en pantalla.
function ctaBarVisible({ heroCta, contact }) {
  return !heroCta && !contact;
}

// Estado del menú móvil tras un evento: "toggle", "escape", "navigate" u "outside".
function nextMenuOpen(isOpen, event) {
  return event === "toggle" ? !isOpen : false;
}

function readStoredLang() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    return null;
  }
}

function storeLang(lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (error) {
    // Almacenamiento bloqueado (modo privado): el idioma no se recuerda.
  }
}

function applyLang(lang) {
  const root = document.documentElement;
  const text = MESSAGES[lang];
  root.dataset.lang = lang;
  root.lang = lang;

  document.querySelectorAll('a[data-contact="whatsapp"]').forEach((link) => {
    link.href = whatsappUrl(WHATSAPP_NUMBER, text.whatsapp);
  });
  document.querySelectorAll('a[data-contact="email"]').forEach((link) => {
    link.href = mailtoUrl(EMAIL, text.subject);
  });

  const toggle = document.getElementById("lang-toggle");
  if (toggle) {
    toggle.querySelectorAll("[data-lang-option]").forEach((option) => {
      option.classList.toggle("is-active", option.dataset.langOption === lang);
    });
    toggle.setAttribute("aria-label", lang === "es" ? "Switch to English" : "Cambiar a español");
  }
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function animateCount(element) {
  const target = Number(element.dataset.count);
  if (prefersReducedMotion()) {
    element.textContent = target;
    return;
  }
  const start = performance.now();
  const step = (now) => {
    const progress = (now - start) / COUNT_DURATION_MS;
    element.textContent = countValue(target, progress);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function setupReveal() {
  const items = document.querySelectorAll("[data-reveal], [data-count]");
  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        if (entry.target.dataset.count) animateCount(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  items.forEach((item) => observer.observe(item));
}

function setupHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", update, { passive: true });
  update();
}

function setupMenu() {
  const button = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-menu");
  if (!button || !menu) return;
  let open = false;

  const update = (event) => {
    open = nextMenuOpen(open, event);
    menu.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
  };

  button.addEventListener("click", () => update("toggle"));
  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) update("navigate");
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && open) {
      update("escape");
      button.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (open && !menu.contains(event.target) && !button.contains(event.target)) update("outside");
  });
}

function setupCtaBar() {
  const bar = document.querySelector(".cta-bar");
  const heroCta = document.getElementById("hero-cta");
  const contact = document.getElementById("contacto");
  if (!bar || !heroCta || !contact || !("IntersectionObserver" in window)) return;
  const seen = { heroCta: true, contact: false };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      seen[entry.target === heroCta ? "heroCta" : "contact"] = entry.isIntersecting;
    });
    bar.classList.toggle("is-visible", ctaBarVisible(seen));
  });
  observer.observe(heroCta);
  observer.observe(contact);
}

function init() {
  // Solo se oculta contenido para animarlo si este script realmente corre.
  document.documentElement.classList.add("reveal-ready");
  let lang = pickLang(readStoredLang(), navigator.language);
  applyLang(lang);

  const toggle = document.getElementById("lang-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      lang = lang === "es" ? "en" : "es";
      applyLang(lang);
      storeLang(lang);
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  setupReveal();
  setupHeader();
  setupMenu();
  setupCtaBar();
}

if (typeof module !== "undefined") {
  module.exports = { pickLang, whatsappUrl, mailtoUrl, countValue, ctaBarVisible, nextMenuOpen };
} else {
  document.addEventListener("DOMContentLoaded", init);
}
