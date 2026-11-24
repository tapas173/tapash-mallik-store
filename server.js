const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

const products = [
  { id: 1, name: 'Basmati Rice 5kg', price: 640, icon: '🍚', category: 'Grocery' },
  { id: 2, name: 'Toor Dal 1kg', price: 165, icon: '🫘', category: 'Grocery' },
  { id: 3, name: 'Fresh Milk 1L', price: 56, icon: '🥛', category: 'Dairy' },
  { id: 4, name: 'Orange Nagpur 1kg', price: 90, icon: '🍊', category: 'Fruits' },
  { id: 5, name: 'Tomato 1kg', price: 35, icon: '🍅', category: 'Vegetables' },
  { id: 6, name: 'Masala Tea 250g', price: 130, icon: '🍵', category: 'Beverages' },
  { id: 7, name: 'Whole Wheat Atta 5kg', price: 255, icon: '🌾', category: 'Grocery' },
  { id: 8, name: 'Paneer 200g', price: 85, icon: '🧀', category: 'Dairy' }
];
const orders = [];

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.get('/api/products', (req, res) => res.json(products));

app.post('/api/orders', (req, res) => {
  const { name, phone, address, items } = req.body || {};
  if (!name || !phone || !address || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'name, phone, address and items are required' });
  }
  let total = 0;
  const lines = [];
  for (const it of items) {
    const p = products.find(x => x.id === Number(it.id));
    const qty = Number(it.qty);
    if (!p || !Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ error: 'invalid item in order' });
    }
    total += p.price * qty;
    lines.push({ id: p.id, name: p.name, qty, price: p.price });
  }
  const order = {
    orderId: 'TM' + Date.now(),
    name, phone, address,
    items: lines, total,
    createdAt: new Date().toISOString()
  };
  orders.push(order);
  res.status(201).json(order);
});

app.get('/api/orders', (req, res) => res.json(orders));

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Tapash Mallik Store running on port ${PORT}`));
}
module.exports = app;
