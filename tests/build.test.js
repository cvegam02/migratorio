const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { buildPage, whatsappUrl, mailtoUrl, PAGES } = require("../build.js");

const root = path.join(__dirname, "..");
const source = fs.readFileSync(path.join(root, "src/index.html"), "utf8");
const es = buildPage(source, "es");
const en = buildPage(source, "en");

function structuredData(html) {
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(match, "falta el bloque JSON-LD");
  return JSON.parse(match[1]);
}

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

test("cada página declara su idioma", () => {
  assert.match(es, /<html lang="es">/);
  assert.match(en, /<html lang="en">/);
});

test("la página en español no trae textos en inglés y viceversa", () => {
  assert.match(es, /Revisión gratuita por WhatsApp/);
  assert.doesNotMatch(es, /Free review on WhatsApp/);
  assert.match(en, /Free review on WhatsApp/);
  assert.doesNotMatch(en, /Revisión gratuita por WhatsApp/);
});

test("no quedan marcas de idioma ni marcadores sin reemplazar", () => {
  for (const html of [es, en]) {
    assert.doesNotMatch(html, /<(?!html)[^>]*\slang="(es|en)"/);
    assert.doesNotMatch(html, /\{\{/);
  }
});

test("cada página tiene su dirección canónica y ambas enlazan sus versiones con hreflang", () => {
  assert.match(es, /<link rel="canonical" href="https:\/\/migratoriosmx\.com\/">/);
  assert.match(en, /<link rel="canonical" href="https:\/\/migratoriosmx\.com\/en\/">/);
  for (const html of [es, en]) {
    assert.match(html, /<link rel="alternate" hreflang="es" href="https:\/\/migratoriosmx\.com\/">/);
    assert.match(html, /<link rel="alternate" hreflang="en" href="https:\/\/migratoriosmx\.com\/en\/">/);
    assert.match(html, /<link rel="alternate" hreflang="x-default" href="https:\/\/migratoriosmx\.com\/">/);
  }
});

test("el botón de idioma enlaza a la otra página", () => {
  assert.match(es, /<a class="lang-toggle" href="en\/"/);
  assert.match(en, /<a class="lang-toggle" href="\.\.\/"/);
});

test("la página en inglés carga los archivos desde la carpeta de arriba", () => {
  assert.match(en, /href="\.\.\/styles\.css"/);
  assert.match(en, /src="\.\.\/script\.js"/);
  assert.match(en, /src="\.\.\/img\/hero\.webp"/);
  assert.match(es, /href="styles\.css"/);
});

test("los enlaces de WhatsApp llevan el mensaje en el idioma de la página", () => {
  assert.match(es, /wa\.me\/526647358258\?text=Hola%20Anait/);
  assert.match(en, /wa\.me\/526647358258\?text=Hi%20Anait/);
});

test("los datos estructurados van en el idioma de cada página", () => {
  const dataEs = structuredData(es);
  const dataEn = structuredData(en);
  assert.equal(dataEs.url, "https://migratoriosmx.com/");
  assert.equal(dataEn.url, "https://migratoriosmx.com/en/");
  assert.match(dataEs.name, /Gestoría Migratoria/);
  assert.match(dataEn.name, /Mexico Expat Services/);
  assert.equal(dataEs.hasOfferCatalog.itemListElement.length, 11);
  assert.equal(dataEn.hasOfferCatalog.itemListElement.length, 11);
});

test("los títulos están optimizados para búsqueda en cada idioma", () => {
  assert.match(es, /<title>[^<]*Trámites migratorios en México[^<]*<\/title>/);
  assert.match(en, /<title>[^<]*Mexico Residency[^<]*Expats[^<]*<\/title>/);
});

test("las páginas publicadas están al día con src/index.html (corre: node build.js)", () => {
  for (const [lang, file] of Object.entries(PAGES)) {
    const onDisk = fs.readFileSync(path.join(root, file), "utf8");
    assert.equal(onDisk, buildPage(source, lang), `${file} está desactualizado`);
  }
});
