const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const read = (file) => fs.readFileSync(path.join(__dirname, "..", file), "utf8");
const html = read("src/index.html");
const css = read("styles.css");
const js = read("script.js");

function luminance(hex) {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function cssVar(name) {
  return css.match(new RegExp(`${name}:\\s*(#[0-9A-Fa-f]{6})`))[1];
}

test("los años en el INM no se exageran (son 8, no 'más de 8')", () => {
  assert.doesNotMatch(html, /Más de 8 años/);
  assert.doesNotMatch(html, /Over 8 years/);
});

test("el texto no insinúa acceso interno al INM", () => {
  assert.doesNotMatch(html, /desde adentro/);
  assert.doesNotMatch(html, /from the inside/);
});

test("el contenido solo se oculta para animar si script.js corrió", () => {
  assert.doesNotMatch(html, /classList\.add\("js"\)/, "el HTML no debe ocultar contenido por su cuenta");
  assert.match(js, /classList\.add\("reveal-ready"\)/);
  assert.match(css, /\.reveal-ready \[data-reveal\]/);
  assert.doesNotMatch(css, /\.js \[data-reveal\]/);
});

test("al imprimir se ve todo el contenido", () => {
  assert.match(css, /@media print[\s\S]*\[data-reveal\][\s\S]*opacity:\s*1/);
});

test("el texto terracota pequeño cumple AA (4.5:1) sobre arena", () => {
  const eyebrow = css.match(/\.eyebrow \{[^}]*color: var\((--[\w-]+)\)/)[1];
  assert.ok(contrast(cssVar(eyebrow), cssVar("--color-sand")) >= 4.5);
});
