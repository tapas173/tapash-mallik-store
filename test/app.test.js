const test = require('node:test');
const assert = require('node:assert');
const app = require('../server');

let server, base;
test.before(async () => {
  await new Promise(r => { server = app.listen(0, r); });
  base = `http://127.0.0.1:${server.address().port}`;
});
test.after(() => server.close());

test('health endpoint', async () => {
  const r = await fetch(base + '/health');
  assert.strictEqual(r.status, 200);
});

test('products list', async () => {
  const r = await fetch(base + '/api/products');
  const data = await r.json();
  assert.ok(data.length > 0);
});

test('create order', async () => {
  const r = await fetch(base + '/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test', phone: '9999999999', address: 'Nagpur', items: [{ id: 1, qty: 2 }] })
  });
  assert.strictEqual(r.status, 201);
  const o = await r.json();
  assert.strictEqual(o.total, 1280);
});

test('reject empty order', async () => {
  const r = await fetch(base + '/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  assert.strictEqual(r.status, 400);
});
