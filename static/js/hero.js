export function initHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const media = hero.querySelector('.hero__media');
  const img = hero.querySelector('.hero__media img');
  const title = hero.querySelector('.hero__title');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Split title into words for stagger reveal
  if (title && !title.dataset.split) {
    const text = title.textContent.trim();
    title.dataset.split = 'true';
    title.innerHTML = text
      .split(' ')
      .map((word) => `<span class="word">${word}</span>`)
      .join(' ');

    title.querySelectorAll('.word').forEach((word, i) => {
      word.style.transitionDelay = `${i * 55}ms`;
    });
  }

  // Entrance sequence
  const reveal = () => {
    media?.classList.add('is-loaded');
    requestAnimationFrame(() => {
      hero.classList.add('is-ready');
    });
  };

  if (img && !img.complete) {
    img.addEventListener('load', reveal, { once: true });
  } else {
    reveal();
  }

  if (prefersReducedMotion) return;

  // Parallax on scroll
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const offset = window.scrollY;
      if (offset < window.innerHeight * 1.2 && media) {
        media.style.transform = `translateY(${offset * 0.22}px)`;
      }
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Subtle mouse-move parallax (desktop only)
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (isFinePointer && img) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      img.style.transform = `scale(1.05) translate(${x * -12}px, ${y * -8}px)`;
    });

    hero.addEventListener('mouseleave', () => {
      img.style.transform = '';
    });
  }
}
