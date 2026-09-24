# Página de Anait — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Página estática bilingüe (ES/EN) de servicios de migración de Anait, lista para GitHub Pages.

**Architecture:** Un `index.html` con todos los textos en ambos idiomas (`<span lang="es">` / `<span lang="en">`), un `styles.css` que oculta el idioma inactivo según `html[data-lang]`, y un `script.js` clásico con funciones puras (probadas con `node:test`) más un `init()` que conecta el DOM.

**Tech Stack:** HTML, CSS, JavaScript sin dependencias. Pruebas con `node --test` (Node 20). Validación con `npx html-validate`.

**Spec:** `docs/superpowers/specs/2026-09-23-pagina-anait-design.md`

## Global Constraints

- Sin frameworks, sin build, sin dependencias de producción; máximo una fuente de Google Fonts.
- Idiomas: `es` (por defecto) y `en`; sin JS la página se ve en español.
- WhatsApp y correo definidos una sola vez, en constantes al inicio de `script.js`.
- Textos de ejemplo: no decir que Anait es abogada ni prometer resultados; pie con aviso "No soy abogada; no ofrezco asesoría legal" / "I am not an attorney; I do not provide legal advice".
- Mobile-first, márgenes laterales de 16 px en celular, colores en variables `:root`.
- No abrir el navegador: la validación visual la hace el usuario.

## Review Focus

- `localStorage` con valor inválido (p. ej. `"fr"`) → se ignora y se usa el idioma del navegador.
- `navigator.language` ausente o vacío → español.
- Número de WhatsApp con `+`, espacios o guiones → la URL `wa.me` lleva solo dígitos.
- Mensaje con acentos, `&` o `?` → queda codificado en la URL y no rompe el enlace.
- `localStorage` que lanza excepción (modo privado) → la página funciona igual, sin errores.

---

### Task 1: Lógica de `script.js` con pruebas

**Files:**
- Create: `script.js`
- Test: `tests/script.test.js`

**Interfaces:**
- Produces: `pickLang(stored: string|null, browserLang: string|undefined) → "es"|"en"`, `whatsappUrl(number: string, message: string) → string`, `mailtoUrl(email: string, subject: string) → string`, exportados vía `module.exports` cuando existe `module`; en el navegador se llama `init()`.

- [ ] **Step 1: Escribir las pruebas**

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const { pickLang, whatsappUrl, mailtoUrl } = require("../script.js");

test("pickLang usa el idioma guardado si es válido", () => {
  assert.equal(pickLang("en", "es-MX"), "en");
  assert.equal(pickLang("es", "en-US"), "es");
});

test("pickLang ignora valores guardados inválidos", () => {
  assert.equal(pickLang("fr", "en-US"), "en");
  assert.equal(pickLang("fr", "de-DE"), "es");
});

test("pickLang usa el navegador o español por defecto", () => {
  assert.equal(pickLang(null, "en-GB"), "en");
  assert.equal(pickLang(null, "pt-BR"), "es");
  assert.equal(pickLang(null, undefined), "es");
  assert.equal(pickLang(null, ""), "es");
});

test("whatsappUrl deja solo dígitos y codifica el mensaje", () => {
  assert.equal(
    whatsappUrl("+1 (555) 123-4567", "Hola, ¿cómo & qué?"),
    "https://wa.me/15551234567?text=Hola%2C%20%C2%BFc%C3%B3mo%20%26%20qu%C3%A9%3F"
  );
});

test("mailtoUrl codifica el asunto", () => {
  assert.equal(
    mailtoUrl("anait@example.com", "Consulta de migración"),
    "mailto:anait@example.com?subject=Consulta%20de%20migraci%C3%B3n"
  );
});
```

- [ ] **Step 2: Correr y ver que fallan** — `node --test tests/` → FAIL (no existe `script.js`).

- [ ] **Step 3: Implementar `script.js`** con las constantes `WHATSAPP_NUMBER`, `EMAIL`, `MESSAGES` (`{ es: { whatsapp, subject }, en: {...} }`), las tres funciones puras, `readStoredLang()`/`storeLang()` envueltas en `try/catch`, `applyLang(lang)` (pone `data-lang` y `lang` en `<html>`, actualiza `href` de `a[data-contact="whatsapp"]` y `a[data-contact="email"]`, actualiza `aria-pressed` del botón), e `init()` que conecta `#lang-toggle`. Al final: `if (typeof module !== "undefined") module.exports = {...}; else document.addEventListener("DOMContentLoaded", init);`

- [ ] **Step 4: Correr pruebas** — `node --test tests/` → PASS.

- [ ] **Step 5: Commit** — `git add script.js tests && git commit -m "feat: add language and contact link logic"`

### Task 2: `index.html`, `styles.css`, imagen y README

**Files:**
- Create: `index.html`, `styles.css`, `img/anait.svg`, `README.md`, `.nojekyll`

**Interfaces:**
- Consumes: `script.js` espera `#lang-toggle`, `a[data-contact="whatsapp"]`, `a[data-contact="email"]`, y `<html data-lang="es" lang="es">`.

- [ ] **Step 1: `index.html`** — `<html lang="es" data-lang="es">`; encabezado con nombre y botón `#lang-toggle` (ES/EN); secciones `#inicio`, `#servicios` (6 tarjetas: visas, residencia permanente, ciudadanía, permisos de trabajo, reunificación familiar, formularios), `#sobre-mi` (imagen `img/anait.svg` con `alt`), `#contacto` (WhatsApp, correo, zona); pie con año y aviso legal. Cada texto visible en `<span lang="es">`/`<span lang="en">`. Enlaces de contacto con `href` de respaldo (`https://wa.me/15551234567`, `mailto:anait@example.com`) y `data-contact`. Meta viewport, description, `<script src="script.js" defer>`.
- [ ] **Step 2: `styles.css`** — variables en `:root`; `html[data-lang="es"] [lang="en"], html[data-lang="en"] [lang="es"] { display: none; }` (excluyendo el propio `<html>`); layout mobile-first con `padding-inline: 16px`, grid de tarjetas que pasa a 2–3 columnas en pantallas anchas; botones de contacto grandes y con contraste AA.
- [ ] **Step 3: `img/anait.svg`** — silueta genérica como placeholder.
- [ ] **Step 4: `README.md`** — qué editar (constantes en `script.js`, textos en `index.html`, foto en `img/`) y cómo publicar en GitHub Pages. `.nojekyll` vacío.
- [ ] **Step 5: Validar** — `npx --yes html-validate index.html` → sin errores; `node --test tests/` → PASS.
- [ ] **Step 6: Commit** — `git add . && git commit -m "feat: add bilingual page for Anait's migration services"`
