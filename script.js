let cart = {}; // { id: { name, price, qty } }

function addToCart(btn) {
  const card = btn.closest('.card');
  const id = card.dataset.id;
  const name = card.dataset.name;
  const price = parseFloat(card.dataset.price) || 0;

  if (cart[id]) {
    btn.textContent = 'Kaufen';
    btn.classList.remove('added');
    removeFromCart(id)
  } else {
    cart[id] = { name, price, qty: 1 };
    btn.textContent = '✓ Hinzugefügt';
    btn.classList.add('added');
  }
  updateCartHeader();
}

function updateCartHeader() {
  const total = Object.values(cart).reduce((s, i) => s + i.qty, 0);
  const el = document.getElementById('cart-total');
  el.textContent = total === 0 ? '0 Sachen' : total === 1 ? '1 Sache' : `${total} Sachen`;
  const btn = document.getElementById('cart-btn');
  btn.classList.toggle('has-items', total > 0);
}

function openCheckout() {
  renderCartItems();
  document.getElementById('checkout-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCheckout(e, force) {
  if (force || (e && e.target === document.getElementById('checkout-overlay'))) {
    document.getElementById('checkout-overlay').classList.remove('open');
    document.body.style.overflow = '';
    // Reset success state if visible
    document.getElementById('checkout-success').style.display = 'none';
    document.getElementById('checkout-form').style.display = '';
  }
}

function renderCartItems() {
  const container = document.getElementById('checkout-items');
  const totalRow = document.getElementById('checkout-total-row');
  const totalPrice = document.getElementById('checkout-total-price');
  const form = document.getElementById('checkout-form');

  const items = Object.entries(cart);
  if (items.length === 0) {
    container.innerHTML = '<p class="checkout-empty">Noch nichts im Warenkorb.</p>';
    totalRow.style.display = 'none';
    form.style.display = 'none';
    return;
  }

  form.style.display = '';

  let html = '';
  let sum = 0;
  items.forEach(([id, item]) => {
    const lineTotal = item.price * item.qty;
    sum += lineTotal;
    const priceStr = item.price === 0 ? 'Gratis' : `€${lineTotal.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    html += `
      <div class="cart-item">
        <div class="cart-item-info">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-qty">× ${item.qty}</span>
        </div>
        <div class="cart-item-right">
          <span class="cart-item-price">${priceStr}</span>
          <button class="cart-item-remove" onclick="removeFromCart('${id}')">✕</button>
        </div>
      </div>`;
  });

  container.innerHTML = html;
  totalRow.style.display = 'flex';
  totalPrice.textContent = `€${sum.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function removeFromCart(id) {
  delete cart[id];
  updateCartHeader();
  renderCartItems();
}

function submitOrder(e) {
  e.preventDefault();
  document.getElementById('checkout-form').style.display = 'none';
  document.getElementById('checkout-items').style.display = 'none';
  document.getElementById('checkout-total-row').style.display = 'none';
  document.getElementById('checkout-success').style.display = 'flex';
  cart = {};
  updateCartHeader();
}