
(() => {
  "use strict";

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // 1. REVEAL ELEMENTS WHEN THEY ENTER THE VIEWPORT

  const revealItems = $$(".reveal");

  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealItems.forEach((item) => {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => {
      item.classList.add("visible");
    });
  }

  // 2. MOBILE NAVIGATION

  const menuToggle = $(".menu-toggle");
  const nav = $(".nav");

  function closeMenu() {
    if (!nav || !menuToggle) return;

    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isExpanded =
        menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute(
        "aria-expanded",
        String(!isExpanded)
      );

      nav.classList.toggle("open", !isExpanded);
    });

    $$(".nav a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (
        nav.classList.contains("open") &&
        !nav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }

  // 3. INTERACTIVE FRONTIER FILTERS

  const filterButtons = $$(".filter");
  const cards = $$(".frontier-card");
  const emptyMessage = $(".empty-message");

  filterButtons.forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.classList.contains("active"))
    );

    button.addEventListener("click", () => {
      const filter = button.dataset.filter || "all";

      filterButtons.forEach((candidate) => {
        const isActive = candidate === button;

        candidate.classList.toggle("active", isActive);
        candidate.setAttribute(
          "aria-pressed",
          String(isActive)
        );
      });

      let visibleCount = 0;

      cards.forEach((card) => {
        const category = card.dataset.category;

        const shouldShow =
          filter === "all" || category === filter;

        card.hidden = !shouldShow;

        if (shouldShow) {
          visibleCount++;
        }
      });

      if (emptyMessage) {
        emptyMessage.hidden = visibleCount !== 0;
      }
    });
  });

  // 4. ACCESSIBLE FAQ ACCORDION

  $$(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");

      if (!item) return;

      const expanded =
        button.getAttribute("aria-expanded") === "true";

      button.setAttribute(
        "aria-expanded",
        String(!expanded)
      );

      item.classList.toggle("open", !expanded);
    });
  });

  // 5. SUBTLE 3D POINTER EFFECT ON THE HERO ARTWORK

  const heroArt = $(".hero-art");

  if (
    heroArt &&
    window.matchMedia("(pointer: fine)").matches &&
    !reducedMotion
  ) {
    heroArt.addEventListener("pointermove", (event) => {
      const rect = heroArt.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) / rect.width - 0.5;

      const y =
        (event.clientY - rect.top) / rect.height - 0.5;

      heroArt.style.setProperty(
        "--tilt-x",
        `${(-y * 2).toFixed(2)}deg`
      );

      heroArt.style.setProperty(
        "--tilt-y",
        `${(x * 2).toFixed(2)}deg`
      );
    });

    heroArt.addEventListener("pointerleave", () => {
      heroArt.style.setProperty("--tilt-x", "0deg");
      heroArt.style.setProperty("--tilt-y", "0deg");
    });
  }

  // 6. AUTOMATIC COPYRIGHT YEAR

  const yearElement = $("#year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 7. OPTIONAL: PAUSE THE MOVING TICKER WHEN THE USER HOVERS

  const ticker = $(".ticker-track");

  if (ticker) {
    ticker.addEventListener("mouseenter", () => {
      ticker.style.animationPlayState = "paused";
    });

    ticker.addEventListener("mouseleave", () => {
      ticker.style.animationPlayState = "running";
    });
  }

  // 8. LOG A SIMPLE DEVELOPMENT MESSAGE

  console.info(
    "TECHFEST — IMAGINE BEYOND | Landing page initialized."
  );

})();
