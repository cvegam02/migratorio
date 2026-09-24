const COUNT_DURATION_MS = 1200;
const SUGGEST_DISMISSED_KEY = "langSuggestDismissed";

// Idioma a sugerir según el idioma principal del navegador, o null si no hace falta.
// En la página en español se sugiere inglés a cualquier navegador que no esté en español;
// en la página en inglés solo se sugiere español a navegadores en español.
function suggestLanguage(pageLang, browserLangs, dismissed) {
  const primary = String((browserLangs || [])[0] || "").toLowerCase();
  if (dismissed || !primary) return null;
  const browserIsSpanish = primary.startsWith("es");
  if (pageLang === "es") return browserIsSpanish ? null : "en";
  return browserIsSpanish ? "es" : null;
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

function readDismissed() {
  try {
    return localStorage.getItem(SUGGEST_DISMISSED_KEY) === "1";
  } catch (error) {
    return false;
  }
}

function storeDismissed() {
  try {
    localStorage.setItem(SUGGEST_DISMISSED_KEY, "1");
  } catch (error) {
    // Almacenamiento bloqueado (modo privado): el aviso puede volver a salir.
  }
}

function setupLangSuggest() {
  const banner = document.querySelector(".lang-suggest");
  if (!banner) return;
  const browserLangs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
  const target = suggestLanguage(document.documentElement.lang, browserLangs, readDismissed());
  if (target !== banner.dataset.suggestLang) return;
  banner.hidden = false;
  banner.querySelector(".lang-suggest-close").addEventListener("click", () => {
    banner.hidden = true;
    storeDismissed();
  });
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

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  setupReveal();
  setupHeader();
  setupMenu();
  setupCtaBar();
  setupLangSuggest();
}

if (typeof module !== "undefined") {
  module.exports = { countValue, ctaBarVisible, nextMenuOpen, suggestLanguage };
} else {
  document.addEventListener("DOMContentLoaded", init);
}
