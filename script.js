document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');
  const cartTotal = document.getElementById('cart-total');

  let totals = {};

  cards.forEach(card => {
    const id = card.dataset.id;
    totals[id] = 0;

    const minusBtn = card.querySelector('.btn-minus');
    const plusBtn  = card.querySelector('.btn-plus');
    const badge    = card.querySelector('.qty-badge');
    const numEl    = card.querySelector('.qty-num');

    minusBtn.disabled = true;

    function updateDisplay(val) {
      numEl.textContent = val;

      // pop animation
      numEl.classList.remove('popping');
      void numEl.offsetWidth; // reflow to restart animation
      numEl.classList.add('popping');

      if (val > 0) {
        badge.classList.add('active');
        minusBtn.disabled = false;
      } else {
        badge.classList.remove('active');
        minusBtn.disabled = true;
      }

      updateCart();
    }

    plusBtn.addEventListener('click', () => {
      totals[id]++;
      updateDisplay(totals[id]);
    });

    minusBtn.addEventListener('click', () => {
      if (totals[id] > 0) {
        totals[id]--;
        updateDisplay(totals[id]);
      }
    });
  });

  function updateCart() {
    const sum = Object.values(totals).reduce((a, b) => a + b, 0);
    cartTotal.textContent = sum === 0
      ? '0 Sachen'
      : sum === 1 ? '1 Sache' : `${sum} Sachen`;

    if (sum > 0) {
      cartTotal.classList.add('has-items');
    } else {
      cartTotal.classList.remove('has-items');
    }
  }
});