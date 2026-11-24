let products = [];
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

const $ = id => document.getElementById(id);

async function loadProducts() {
  const res = await fetch('/api/products');
  products = await res.json();
  $('products').innerHTML = products.map(p => `
    <div class="card">
      <div class="icon">${p.icon}</div>
      <h4>${p.name}</h4>
      <small>${p.category}</small>
      <div class="price">₹${p.price}</div>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    </div>`).join('');
  renderCart();
}

function save() { localStorage.setItem('cart', JSON.stringify(cart)); renderCart(); }

function addToCart(id) {
  const item = cart.find(i => i.id === id);
  if (item) item.qty++; else cart.push({ id, qty: 1 });
  save();
}

function changeQty(id, d) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += d;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  save();
}

function renderCart() {
  $('cartCount').textContent = cart.reduce((s, i) => s + i.qty, 0);
  let total = 0;
  $('cartItems').innerHTML = cart.map(i => {
    const p = products.find(x => x.id === i.id);
    if (!p) return '';
    total += p.price * i.qty;
    return `<div class="cart-row"><span>${p.icon} ${p.name} × ${i.qty}</span>
      <span><button onclick="changeQty(${i.id},-1)">-</button> <button onclick="changeQty(${i.id},1)">+</button></span></div>`;
  }).join('') || '<p>Cart is empty</p>';
  $('cartTotal').textContent = total;
}

$('cartBtn').onclick = () => $('cartPanel').classList.toggle('hidden');

$('placeOrder').onclick = async () => {
  const body = { name: $('name').value.trim(), phone: $('phone').value.trim(), address: $('address').value.trim(), items: cart };
  const res = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json();
  if (res.ok) {
    $('msg').style.color = 'green';
    $('msg').textContent = `Order placed! ID: ${data.orderId}, Total ₹${data.total}`;
    cart = []; save();
  } else {
    $('msg').style.color = 'red';
    $('msg').textContent = data.error || 'Order failed';
  }
};

loadProducts();
