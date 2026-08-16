import { initNavigation } from './navigation.js';
import { initHero } from './hero.js';
import { initScrollReveal, initEditorialParallax, initBackToTop } from './animations.js';
import { initCart } from './cart.js';

function initNewsletter() {
  const form = document.querySelector('.newsletter-form');
  const message = document.querySelector('.newsletter__message');
  if (!form) return;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const value = input.value.trim();

    if (!emailPattern.test(value)) {
      message.textContent = 'Introduce un email válido.';
      message.className = 'newsletter__message is-error';
      input.focus();
      return;
    }

    message.textContent = '¡Gracias por suscribirte!';
    message.className = 'newsletter__message is-success';
    form.reset();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHero();
  initScrollReveal();
  initEditorialParallax();
  initBackToTop();
  initCart();
  initNewsletter();
});
