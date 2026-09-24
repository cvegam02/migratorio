const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const SITE_URL = "https://migratoriosmx.com/";
const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

function structuredData() {
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(match, "falta el bloque JSON-LD");
  return JSON.parse(match[1]);
}

test("la página declara su dirección canónica", () => {
  assert.match(html, new RegExp(`<link rel="canonical" href="${SITE_URL}">`));
});

test("los datos estructurados describen el negocio", () => {
  const data = structuredData();
  assert.equal(data["@context"], "https://schema.org");
  assert.equal(data["@type"], "ProfessionalService");
  assert.equal(data.url, SITE_URL);
  assert.equal(data.telephone, "+52 664 735 8258");
  assert.equal(data.email, "migratoriosmxs@gmail.com");
  assert.equal(data.address.addressLocality, "Hermosillo");
  assert.deepEqual(data.availableLanguage, ["es", "en"]);
});

test("los datos estructurados listan los 11 servicios", () => {
  const services = structuredData().hasOfferCatalog.itemListElement;
  assert.equal(services.length, 11);
  services.forEach((offer) => assert.equal(offer.itemOffered["@type"], "Service"));
});

test("existe un sitemap con la dirección de la página", () => {
  const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
  assert.match(sitemap, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/);
  assert.match(sitemap, new RegExp(`<loc>${SITE_URL}</loc>`));
  assert.match(sitemap, new RegExp(`<loc>${SITE_URL}en/</loc>`));
});

test("los documentos internos no se publican", () => {
  const ignore = fs.readFileSync(path.join(root, ".gitignore"), "utf8");
  assert.match(ignore, /^docs\/$/m);
});

test("GitHub Pages usa el dominio propio", () => {
  const cname = fs.readFileSync(path.join(root, "CNAME"), "utf8").trim();
  assert.equal(cname, "migratoriosmx.com");
});

test("no quedan direcciones viejas de github.io en la página", () => {
  assert.doesNotMatch(html, /github\.io/);
});
