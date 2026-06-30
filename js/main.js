/* ============================================================
   Los 4 Fantásticos — Script principal
   ============================================================ */

(function () {
  "use strict";

  /**
   * Año actual en el pie de página.
   */
  function setCurrentYear() {
    const el = document.querySelector("[data-year]");
    if (el) {
      el.textContent = new Date().getFullYear();
    }
  }

  /**
   * Controla la visibilidad del placeholder ("Sube tu foto" /
   * "Imagen del proyecto") según si la imagen tiene una URL válida.
   *
   * Cada <img> con [data-img] empieza con src vacío. Cuando le
   * asignas una URL desde la base de datos, llama a:
   *
   *     L4F.setImage("member-cesar", "https://.../foto.jpg");
   *
   * o simplemente fija el atributo src y dispara este chequeo.
   */
  function refreshImage(img) {
    const wrapper = img.closest(".card__photo, .project-card__media, .hero__banner");
    if (!wrapper) return;

    const hasSrc = img.getAttribute("src") && img.getAttribute("src").trim() !== "";
    wrapper.classList.toggle("has-img", Boolean(hasSrc) && img.complete && img.naturalWidth > 0);
  }

  function initImages(root) {
    const scope = root || document;
    const images = scope.querySelectorAll("img[data-img]");

    images.forEach(function (img) {
      // Si la imagen falla al cargar, volvemos a mostrar el placeholder.
      img.addEventListener("error", function () {
        const wrapper = img.closest(".card__photo, .project-card__media, .hero__banner");
        if (wrapper) wrapper.classList.remove("has-img");
      });

      img.addEventListener("load", function () {
        refreshImage(img);
      });

      // Estado inicial (por si ya tuviera src al cargar la página).
      refreshImage(img);
    });
  }

  /**
   * API pública sencilla para asignar imágenes desde la base de datos.
   * Uso:  L4F.setImage("logo", "https://midb.com/logo.png");
   */
  const L4F = {
    setImage: function (key, url) {
      const targets = document.querySelectorAll('img[data-img="' + key + '"]');
      targets.forEach(function (img) {
        img.src = url;
        refreshImage(img);
      });
      return targets.length;
    },
    // Vuelve a vincular el control de placeholder a las imágenes nuevas
    // (por ejemplo, las tarjetas de proyecto creadas dinámicamente).
    initImages: initImages,
    // Inicializa el/los carruseles. Se llama desde projects.js una vez
    // que las tarjetas de proyectos ya están en el DOM.
    initCarousels: initCarousels,
  };

  // Exponer la API en window.
  window.L4F = L4F;

  /**
   * Carrusel de proyectos: navegación con flechas, puntos
   * indicadores y deslizamiento táctil. Funciona con scroll-snap,
   * así que se adapta a cuántas tarjetas quepan en pantalla.
   */
  function initCarousel(root) {
    const viewport = root.querySelector("[data-carousel-viewport]");
    const track = root.querySelector("[data-carousel-track]");
    const prevBtn = root.querySelector("[data-carousel-prev]");
    const nextBtn = root.querySelector("[data-carousel-next]");
    const dotsBox = root.querySelector("[data-carousel-dots]");
    const cards = Array.from(track.children);
    if (!cards.length) return;

    function step() {
      // Ancho de una tarjeta + el gap entre tarjetas.
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return cards[0].getBoundingClientRect().width + gap;
    }

    function visibleCount() {
      return Math.max(1, Math.round(viewport.clientWidth / step()));
    }

    function pages() {
      return Math.max(1, cards.length - visibleCount() + 1);
    }

    function currentIndex() {
      return Math.round(viewport.scrollLeft / step());
    }

    function goTo(index) {
      const max = cards.length - visibleCount();
      const clamped = Math.min(Math.max(index, 0), max);
      viewport.scrollTo({ left: clamped * step(), behavior: "smooth" });
    }

    function buildDots() {
      dotsBox.innerHTML = "";
      for (let i = 0; i < pages(); i++) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel__dot";
        dot.setAttribute("aria-label", "Ir al proyecto " + (i + 1));
        dot.addEventListener("click", function () {
          goTo(i);
        });
        dotsBox.appendChild(dot);
      }
    }

    function update() {
      const idx = currentIndex();
      const max = cards.length - visibleCount();
      prevBtn.disabled = idx <= 0;
      nextBtn.disabled = idx >= max;

      const dots = dotsBox.querySelectorAll(".carousel__dot");
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === Math.min(idx, dots.length - 1));
      });
    }

    prevBtn.addEventListener("click", function () {
      goTo(currentIndex() - 1);
    });
    nextBtn.addEventListener("click", function () {
      goTo(currentIndex() + 1);
    });

    let scrollTimer;
    viewport.addEventListener("scroll", function () {
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(update, 80);
    });

    let resizeTimer;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        buildDots();
        update();
      }, 150);
    });

    buildDots();
    update();
  }

  function initCarousels() {
    document.querySelectorAll("[data-carousel]").forEach(initCarousel);
  }

  // Inicialización.
  // Nota: el carrusel de proyectos NO se inicializa aquí, porque sus
  // tarjetas se cargan de forma asíncrona desde Firebase. De eso se
  // encarga js/projects.js llamando a L4F.initCarousels() al terminar.
  document.addEventListener("DOMContentLoaded", function () {
    setCurrentYear();
    initImages();
  });
})();
