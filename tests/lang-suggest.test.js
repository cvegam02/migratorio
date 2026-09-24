const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { suggestLanguage } = require("../script.js");
const { buildPage } = require("../build.js");

const source = fs.readFileSync(path.join(__dirname, "..", "src/index.html"), "utf8");

test("en la página en español sugiere inglés a navegadores que no están en español", () => {
  assert.equal(suggestLanguage("es", ["en-US", "en"], false), "en");
  assert.equal(suggestLanguage("es", ["fr-FR"], false), "en");
  assert.equal(suggestLanguage("es", ["es-MX", "en"], false), null);
});

test("en la página en inglés solo sugiere español a navegadores en español", () => {
  assert.equal(suggestLanguage("en", ["es-419"], false), "es");
  assert.equal(suggestLanguage("en", ["en-GB"], false), null);
  assert.equal(suggestLanguage("en", ["de-DE"], false), null);
});

test("no sugiere nada si el visitante ya cerró el aviso", () => {
  assert.equal(suggestLanguage("es", ["en-US"], true), null);
});

test("sin información del navegador no sugiere nada", () => {
  assert.equal(suggestLanguage("es", [], false), null);
  assert.equal(suggestLanguage("es", undefined, false), null);
});

test("cada página trae el aviso oculto, en el otro idioma y con enlace a la otra versión", () => {
  const es = buildPage(source, "es");
  const en = buildPage(source, "en");
  assert.match(es, /<div class="lang-suggest" data-suggest-lang="en" lang="en" hidden>/);
  assert.match(es, /This page is available in English\. <a href="en\/" hreflang="en">View in English<\/a>/);
  assert.match(en, /<div class="lang-suggest" data-suggest-lang="es" lang="es" hidden>/);
  assert.match(en, /Esta página está disponible en español\. <a href="\.\.\/" hreflang="es">Ver en español<\/a>/);
});
