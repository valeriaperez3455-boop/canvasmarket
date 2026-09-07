/* =========================================================
   CANVAMARKET — script.js
   Vanilla JS ES6+  |  Navigation, Hero, Animations, Cart
   ========================================================= */

(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ===================================================
     NAVIGATION MODULE
     =================================================== */
  const Navigation = (() => {
    const header = document.getElementById("siteHeader");
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const mobileNav = document.getElementById("mobileNav");
    const mobileNavClose = document.getElementById("mobileNavClose");
    const mobileNavOverlay = document.getElementById("mobileNavOverlay");
    const searchToggle = document.getElementById("searchToggle");
    const searchBar = document.getElementById("searchBar");

    let lastScrollY = window.scrollY;

    const openMobileNav = () => {
      mobileNav.classList.add("is-open");
      mobileNavOverlay.classList.add("is-visible");
      mobileNav.setAttribute("aria-hidden", "false");
      hamburgerBtn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    };

    const closeMobileNav = () => {
      mobileNav.classList.remove("is-open");
      mobileNavOverlay.classList.remove("is-visible");
      mobileNav.setAttribute("aria-hidden", "true");
      hamburgerBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    };

    const toggleSearch = () => {
      const isOpen = searchBar.classList.toggle("is-open");
      searchToggle.setAttribute("aria-expanded", String(isOpen));
      if (isOpen) {
        const input = searchBar.querySelector("input");
        setTimeout(() => input && input.focus(), 220);
      }
    };

    const handleScrollState = () => {
      const y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 8);
      lastScrollY = y;
    };

    const bindEvents = () => {
      hamburgerBtn?.addEventListener("click", openMobileNav);
      mobileNavClose?.addEventListener("click", closeMobileNav);
      mobileNavOverlay?.addEventListener("click", closeMobileNav);
      searchToggle?.addEventListener("click", toggleSearch);

      mobileNav?.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMobileNav);
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          closeMobileNav();
          if (searchBar.classList.contains("is-open")) toggleSearch();
        }
      });

      window.addEventListener("scroll", handleScrollState, { passive: true });
    };

    const init = () => {
      if (!header) return;
      bindEvents();
      handleScrollState();
    };

    return { init };
  })();

  /* ===================================================
     HERO MODULE
     =================================================== */
  const Hero = (() => {
    const hero = document.querySelector(".hero");
    const heroMedia = document.getElementById("heroMedia");
    const heroImg = document.getElementById("heroImg");

    const revealHero = () => {
      const start = () => {
        heroMedia.classList.add("is-loaded");
        requestAnimationFrame(() => {
          hero.classList.add("is-revealed");
        });
      };
      if (heroImg.complete) {
        start();
      } else {
        heroImg.addEventListener("load", start, { once: true });
        // Fallback in case the load event is delayed
        setTimeout(start, 900);
      }
    };

    const initParallax = () => {
      if (prefersReducedMotion) return;
      let ticking = false;

      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const rect = hero.getBoundingClientRect();
          if (rect.bottom > 0 && rect.top < window.innerHeight) {
            const offset = rect.top * -0.18;
            heroImg.style.transform = `translateY(${offset}px) scale(1.08)`;
          }
          ticking = false;
        });
      };
      window.addEventListener("scroll", onScroll, { passive: true });
    };

    const initMouseMove = () => {
      if (prefersReducedMotion || window.matchMedia("(max-width: 860px)").matches) return;

      let rafId = null;

      hero.addEventListener("mousemove", (e) => {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
          const { innerWidth, innerHeight } = window;
          const x = (e.clientX / innerWidth - 0.5) * 14;
          const y = (e.clientY / innerHeight - 0.5) * 14;
          heroImg.style.translate = `${x}px ${y}px`;
          rafId = null;
        });
      });

      hero.addEventListener("mouseleave", () => {
        heroImg.style.translate = "0 0";
      });
    };

    const init = () => {
      if (!hero || !heroImg) return;
      revealHero();
      initParallax();
      initMouseMove();
    };

    return { init };
  })();

  /* ===================================================
     ANIMATIONS MODULE  (IntersectionObserver reveals)
     =================================================== */
  const Animations = (() => {
    const initScrollReveal = () => {
      const targets = document.querySelectorAll(".reveal-on-scroll");
      if (!targets.length) return;

      if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        targets.forEach((el) => el.classList.add("is-visible"));
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.14, rootMargin: "0px 0px -60px 0px" }
      );

      targets.forEach((el) => observer.observe(el));
    };

    const initEditorialParallax = () => {
      if (prefersReducedMotion) return;
      const media = document.querySelector(".editorial-banner__media img");
      const section = document.querySelector(".editorial-banner");
      if (!media || !section) return;

      let ticking = false;
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const rect = section.getBoundingClientRect();
          if (rect.bottom > 0 && rect.top < window.innerHeight) {
            const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
            const shift = (progress - 0.5) * 60;
            media.style.transform = `translateY(${shift}px)`;
          }
          ticking = false;
        });
      };
      window.addEventListener("scroll", onScroll, { passive: true });
    };

    const initBackToTop = () => {
      const btn = document.getElementById("backToTop");
      if (!btn) return;

      window.addEventListener(
        "scroll",
        () => {
          btn.classList.toggle("is-visible", window.scrollY > 640);
        },
        { passive: true }
      );

      btn.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
      });
    };

    const init = () => {
      initScrollReveal();
      initEditorialParallax();
      initBackToTop();
    };

    return { init };
  })();

  /* ===================================================
     CART MODULE
     =================================================== */
  const Cart = (() => {
    const cartBadge = document.getElementById("cartBadge");
    const cartToast = document.getElementById("cartToast");
    let count = 0;
    let toastTimer = null;

    const bumpBadge = () => {
      cartBadge.textContent = String(count);
      cartBadge.classList.add("is-bumped");
      setTimeout(() => cartBadge.classList.remove("is-bumped"), 220);
    };

    const showToast = (productName) => {
      clearTimeout(toastTimer);
      cartToast.textContent = `“${productName}” se agregó al carrito`;
      cartToast.classList.add("is-visible");
      toastTimer = setTimeout(() => cartToast.classList.remove("is-visible"), 2200);
    };

    const addToCart = (button) => {
      const name = button.dataset.product || "Producto";
      count += 1;
      bumpBadge();
      showToast(name);

      button.classList.add("is-added");
      const originalText = button.textContent;
      button.textContent = "Agregado ✓";
      setTimeout(() => {
        button.classList.remove("is-added");
        button.textContent = originalText;
      }, 1500);
    };

    const init = () => {
      document.querySelectorAll(".btn-add").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          addToCart(btn);
        });
      });
    };

    return { init };
  })();

  /* ===================================================
     NEWSLETTER MODULE
     =================================================== */
  const Newsletter = (() => {
    const form = document.getElementById("newsletterForm");
    const emailInput = document.getElementById("newsletterEmail");
    const msg = document.getElementById("newsletterMsg");

    const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    const setMessage = (text, type) => {
      msg.textContent = text;
      msg.classList.remove("is-error", "is-success");
      if (type) msg.classList.add(type);
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const value = emailInput.value.trim();

      if (!isValidEmail(value)) {
        setMessage("Introduce un email válido.", "is-error");
        emailInput.focus();
        return;
      }

      setMessage("¡Gracias por suscribirte!", "is-success");
      form.reset();
    };

    const init = () => {
      if (!form) return;
      form.addEventListener("submit", handleSubmit);
      emailInput.addEventListener("input", () => setMessage("", null));
    };

    return { init };
  })();

  /* ===================================================
     AUTH MODAL MODULE
     (solo UI/animación: cambio de pestañas y visibilidad
     de contraseña. No incluye lógica de autenticación real;
     el envío de los formularios solo evita la recarga de página.)
     =================================================== */
  const AuthModal = (() => {
    const modalEl = document.getElementById("authModal");
    const tabsEl = document.getElementById("authTabs");

    const setActiveTab = (target) => {
      if (!tabsEl || !target) return;

      tabsEl.setAttribute("data-active", target);

      tabsEl.querySelectorAll("[data-auth-tab]").forEach((tab) => {
        const isActive = tab.dataset.authTab === target;
        tab.classList.toggle("is-active", isActive);
        tab.setAttribute("aria-selected", String(isActive));
      });

      modalEl.querySelectorAll("[data-auth-panel]").forEach((panel) => {
        panel.classList.toggle("is-active", panel.dataset.authPanel === target);
      });
    };

    const bindTabSwitching = () => {
      modalEl.querySelectorAll("[data-auth-tab]").forEach((btn) => {
        btn.addEventListener("click", () => setActiveTab(btn.dataset.authTab));
      });
    };

    const bindPasswordToggles = () => {
      modalEl.querySelectorAll("[data-toggle-password]").forEach((toggleBtn) => {
        toggleBtn.addEventListener("click", () => {
          const input = toggleBtn.closest(".form-field").querySelector("input");
          const icon = toggleBtn.querySelector("i");
          const isHidden = input.type === "password";

          input.type = isHidden ? "text" : "password";
          icon.classList.toggle("fa-eye", !isHidden);
          icon.classList.toggle("fa-eye-slash", isHidden);
          toggleBtn.setAttribute("aria-label", isHidden ? "Ocultar contraseña" : "Mostrar contraseña");
        });
      });
    };

    const bindOpenTargets = () => {
      // Cualquier disparador con data-auth-target abre el modal
      // ya en la pestaña correspondiente (Bootstrap gestiona el modal).
      document.querySelectorAll("[data-auth-target]").forEach((trigger) => {
        trigger.addEventListener("click", () => setActiveTab(trigger.dataset.authTarget));
      });
    };

    const preventDemoSubmit = () => {
      // Solo evita la recarga de página; no procesa ni valida datos.
      modalEl.querySelectorAll(".auth-panel").forEach((form) => {
        form.addEventListener("submit", (e) => e.preventDefault());
      });
    };

    const init = () => {
      if (!modalEl || !tabsEl) return;
      bindTabSwitching();
      bindPasswordToggles();
      bindOpenTargets();
      preventDemoSubmit();
    };

    return { init };
  })();

  /* ===================================================
     BOOTSTRAP
     =================================================== */
  document.addEventListener("DOMContentLoaded", () => {
    Navigation.init();
    Hero.init();
    Animations.init();
    Cart.init();
    Newsletter.init();
    AuthModal.init();
  });
})();
