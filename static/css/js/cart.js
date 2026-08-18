let cartCount = 0;

function showToast(message) {
  const toast = document.querySelector('.toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

function bumpCartIcon() {
  const cartIcon = document.querySelector('.icon-btn--cart');
  if (!cartIcon) return;
  cartIcon.classList.remove('is-bumping');
  // force reflow so the animation can restart
  void cartIcon.offsetWidth;
  cartIcon.classList.add('is-bumping');
}

export function initCart() {
  const badge = document.querySelector('.cart-badge');

  document.querySelectorAll('[data-add-to-cart]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      cartCount += 1;
      if (badge) badge.textContent = String(cartCount);
      bumpCartIcon();

      const name = btn.getAttribute('data-product-name') || 'Producto';
      showToast(`${name} se agregó al carrito`);
    });
  });
}
