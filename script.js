const COUNT_DURATION_MS = 1200;

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
}

if (typeof module !== "undefined") {
  module.exports = { countValue, ctaBarVisible, nextMenuOpen };
} else {
  document.addEventListener("DOMContentLoaded", init);
}
