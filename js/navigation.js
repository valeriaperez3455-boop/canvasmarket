export function initNavigation() {
  const header = document.querySelector('.site-header');
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavScrim = document.querySelector('.mobile-nav__scrim');
  const mobileNavClose = document.querySelector('.mobile-nav__close');

  // Sticky header shadow on scroll
  const toggleHeaderShadow = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  toggleHeaderShadow();
  window.addEventListener('scroll', toggleHeaderShadow, { passive: true });

  // Mobile menu open/close
  const openMenu = () => {
    if (!mobileNav || !hamburger) return;
    mobileNav.classList.add('is-open');
    hamburger.classList.add('is-active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    if (!mobileNav || !hamburger) return;
    mobileNav.classList.remove('is-open');
    hamburger.classList.remove('is-active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav?.classList.contains('is-open');
      isOpen ? closeMenu() : openMenu();
    });
  }

  mobileNavScrim?.addEventListener('click', closeMenu);
  mobileNavClose?.addEventListener('click', closeMenu);

  document.querySelectorAll('.mobile-nav__list a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}
