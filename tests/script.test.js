const test = require("node:test");
const assert = require("node:assert/strict");
const { countValue } = require("../script.js");

test("countValue va de 0 al objetivo con desaceleración", () => {
  assert.equal(countValue(12, 0), 0);
  assert.equal(countValue(12, 1), 12);
  assert.ok(countValue(12, 0.5) > 6, "ease-out: a la mitad ya pasó de la mitad");
  assert.equal(countValue(12, 1.5), 12, "no se pasa del objetivo");
  assert.equal(countValue(12, -1), 0, "no baja de cero");
});
