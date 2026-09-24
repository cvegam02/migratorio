const test = require("node:test");
const assert = require("node:assert/strict");
const { pickLang, whatsappUrl, mailtoUrl, countValue } = require("../script.js");

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

test("countValue va de 0 al objetivo con desaceleración", () => {
  assert.equal(countValue(12, 0), 0);
  assert.equal(countValue(12, 1), 12);
  assert.ok(countValue(12, 0.5) > 6, "ease-out: a la mitad ya pasó de la mitad");
  assert.equal(countValue(12, 1.5), 12, "no se pasa del objetivo");
  assert.equal(countValue(12, -1), 0, "no baja de cero");
});
