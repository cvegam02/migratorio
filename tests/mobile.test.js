const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ctaBarVisible, nextMenuOpen } = require("../script.js");

const read = (file) => fs.readFileSync(path.join(__dirname, "..", file), "utf8");
const html = read("index.html");
const css = read("styles.css");

test("la barra de WhatsApp aparece solo cuando no se ven los botones del banner ni el contacto", () => {
  assert.equal(ctaBarVisible({ heroCta: true, contact: false }), false);
  assert.equal(ctaBarVisible({ heroCta: false, contact: false }), true);
  assert.equal(ctaBarVisible({ heroCta: false, contact: true }), false);
  assert.equal(ctaBarVisible({ heroCta: true, contact: true }), false);
});

test("el menú abre, cierra y se cierra con Esc o al elegir una sección", () => {
  assert.equal(nextMenuOpen(false, "toggle"), true);
  assert.equal(nextMenuOpen(true, "toggle"), false);
  assert.equal(nextMenuOpen(true, "escape"), false);
  assert.equal(nextMenuOpen(true, "navigate"), false);
  assert.equal(nextMenuOpen(true, "outside"), false);
  assert.equal(nextMenuOpen(false, "escape"), false);
});

test("el botón del menú es accesible", () => {
  assert.match(html, /<button[^>]*id="menu-toggle"[^>]*aria-expanded="false"[^>]*aria-controls="mobile-menu"/);
  assert.match(html, /id="mobile-menu"/);
});

test("existe la barra fija de WhatsApp con texto visible", () => {
  assert.match(html, /class="cta-bar"[^>]*data-contact="whatsapp"/);
});

test("los botones de contacto no cortan el correo a media palabra", () => {
  assert.doesNotMatch(css, /word-break:\s*break-all/);
  assert.match(html, /class="btn-detail"[^>]*>migratoriosmxs@gmail\.com</);
});
