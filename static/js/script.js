(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  /* ---------------------------------------------
     Lucide icons
  --------------------------------------------- */
  if (window.lucide) {
    window.lucide.createIcons();
  }

  /* ---------------------------------------------
     Kick off hero load animation
  --------------------------------------------- */
  requestAnimationFrame(function () {
    document.documentElement.classList.add("js-ready");
  });

  /* ---------------------------------------------
     Sticky header scroll state
  --------------------------------------------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------------------------------------
     Mobile drawer menu
  --------------------------------------------- */
  var toggleBtn = document.querySelector(".nav__toggle");
  var drawer = document.querySelector(".mobile-drawer");
  var drawerClose = document.querySelector(".drawer-close");
  var drawerScrim = document.querySelector(".mobile-drawer__scrim");

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add("is-open");
    toggleBtn.setAttribute("aria-expanded", "true");
    var firstLink = drawer.querySelector("a, button");
    if (firstLink) firstLink.focus();
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove("is-open");
    toggleBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    toggleBtn.focus();
  }

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener("click", openDrawer);
    drawerClose.addEventListener("click", closeDrawer);
    drawerScrim.addEventListener("click", closeDrawer);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) {
        closeDrawer();
      }
    });
    drawer.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeDrawer);
    });
  }

  /* ---------------------------------------------
     Hero parallax (mouse only, no touch)
  --------------------------------------------- */
  var heroMedia = document.querySelector(".hero__media img");
  var hero = document.querySelector(".hero");
  if (heroMedia && hero && !isTouch && !prefersReducedMotion) {
    hero.addEventListener("mousemove", function (e) {
      var rect = hero.getBoundingClientRect();
      var relX = (e.clientX - rect.left) / rect.width - 0.5;
      var relY = (e.clientY - rect.top) / rect.height - 0.5;
      heroMedia.style.transform =
        "translate(" + relX * 14 + "px, " + relY * 14 + "px) scale(1.04)";
    });
    hero.addEventListener("mouseleave", function () {
      heroMedia.style.transform = "translate(0, 0) scale(1)";
    });
  }

  /* ---------------------------------------------
     Scroll reveal via IntersectionObserver
  --------------------------------------------- */
  var revealEls = document.querySelectorAll("[data-reveal], [data-reveal-group]");
  if ("IntersectionObserver" in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------------------------------------------
     Favorites toggle
  --------------------------------------------- */
  document.querySelectorAll(".product-card__fav").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var active = btn.classList.toggle("is-active");
      btn.setAttribute("aria-pressed", active ? "true" : "false");
      var icon = btn.querySelector("svg");
      if (icon) {
        icon.setAttribute("fill", active ? "currentColor" : "none");
      }
    });
  });

  /* ---------------------------------------------
     Cart counter
  --------------------------------------------- */
  var cartCount = 0;
  var cartBadge = document.querySelector("[data-cart-count]");
  var cartIconBtn = document.querySelector("[data-cart-icon]");

  document.querySelectorAll("[data-add-to-cart]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      cartCount += 1;
      if (cartBadge) cartBadge.textContent = String(cartCount);
      if (cartIconBtn) {
        cartIconBtn.classList.remove("is-bumped");
        void cartIconBtn.offsetWidth;
        cartIconBtn.classList.add("is-bumped");
      }
      var original = btn.textContent;
      btn.textContent = "Agregada ✓";
      setTimeout(function () {
        btn.textContent = original;
      }, 1400);
    });
  });

  /* ---------------------------------------------
     Newsletter form
  --------------------------------------------- */
  var newsletterForm = document.querySelector(".newsletter__form");
  if (newsletterForm) {
    var emailInput = newsletterForm.querySelector("input[type='email']");
    var message = newsletterForm.querySelector(".newsletter__message");

    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var value = (emailInput.value || "").trim();
      var isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

      if (!isValid) {
        message.textContent = "Ingresa un correo electrónico válido.";
        message.style.color = "#B24C3C";
        emailInput.focus();
        return;
      }

      message.textContent = "¡Gracias! Ya formas parte de CanvaMarket.";
      message.style.color = "";
      newsletterForm.reset();
    });
  }

  /* ---------------------------------------------
     Horizontal carousel (Nuevas obras)
  --------------------------------------------- */
  var track = document.querySelector("[data-carousel-track]");
  var prevBtn = document.querySelector("[data-carousel-prev]");
  var nextBtn = document.querySelector("[data-carousel-next]");

  function updateCarouselButtons() {
    if (!track || !prevBtn || !nextBtn) return;
    var maxScroll = track.scrollWidth - track.clientWidth - 4;
    prevBtn.disabled = track.scrollLeft <= 4;
    nextBtn.disabled = track.scrollLeft >= maxScroll;
  }

  if (track && prevBtn && nextBtn) {
    var scrollStep = function () {
      var item = track.querySelector(".carousel__item");
      return item ? item.getBoundingClientRect().width + 16 : 320;
    };

    prevBtn.addEventListener("click", function () {
      track.scrollBy({ left: -scrollStep(), behavior: "smooth" });
    });
    nextBtn.addEventListener("click", function () {
      track.scrollBy({ left: scrollStep(), behavior: "smooth" });
    });
    track.addEventListener("scroll", updateCarouselButtons, { passive: true });
    window.addEventListener("resize", updateCarouselButtons);
    updateCarouselButtons();
  }
})();
