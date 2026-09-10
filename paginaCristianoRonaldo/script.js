/**
 * script.js — Interactividad para la página de Cristiano Ronaldo
 * Vanilla JavaScript, sin dependencias externas
 */

(function () {
  'use strict';

  /* ===========================
     MENÚ MÓVIL
     =========================== */
  var menuToggle = document.getElementById('menuToggle');
  var mainNav = document.getElementById('mainNav');

  if (menuToggle && mainNav) {
    var CLOSE_LABEL = 'Cerrar menú de navegación';
    var OPEN_LABEL = 'Abrir menú de navegación';

    function setMenuState(isOpen) {
      mainNav.classList.toggle('nav-open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? CLOSE_LABEL : OPEN_LABEL);
    }

    menuToggle.addEventListener('click', function () {
      var isOpen = !mainNav.classList.contains('nav-open');
      setMenuState(isOpen);
    });

    // Cerrar menú al hacer clic en un enlace
    var navLinks = mainNav.querySelectorAll('.nav-link');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        setMenuState(false);
      });
    });

    // Cerrar menú con tecla Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mainNav.classList.contains('nav-open')) {
        setMenuState(false);
        menuToggle.focus();
      }
    });
  }

  /* ===========================
     NAVEGACIÓN ACTIVA (SCROLL SPY)
     =========================== */
  var sections = document.querySelectorAll('section[id]');
  var allNavLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    var scrollPos = window.scrollY + 120;
    var matched = false;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        matched = true;
        allNavLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });

    // Hero no tiene enlace propio: Inicio queda activo por defecto
    if (!matched) {
      allNavLinks.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#inicio');
      });
    }
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* ===========================
     LÍNEA DE TIEMPO INTERACTIVA
     =========================== */
  var timelineMarkers = document.querySelectorAll('.timeline-marker');

  timelineMarkers.forEach(function (marker) {
    marker.addEventListener('click', function () {
      var controlsId = this.getAttribute('aria-controls');
      var detail = document.getElementById(controlsId);
      if (!detail) return;

      var isExpanded = this.getAttribute('aria-expanded') === 'true';

      // Cerrar todos los demás detalles abiertos
      timelineMarkers.forEach(function (otherMarker) {
        if (otherMarker !== marker) {
          otherMarker.setAttribute('aria-expanded', 'false');
          var otherId = otherMarker.getAttribute('aria-controls');
          var otherDetail = document.getElementById(otherId);
          if (otherDetail) {
            otherDetail.hidden = true;
          }
        }
      });

      // Alternar el actual
      this.setAttribute('aria-expanded', String(!isExpanded));
      detail.hidden = isExpanded;
    });
  });

  /* ===========================
     CONTADOR ANIMADO DE ESTADÍSTICAS
     =========================== */
  var statNumbers = document.querySelectorAll('.stat-number[data-target]');
  var statsAnimated = false;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function renderStatFinal(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var value = target.toLocaleString('es-ES');
    el.textContent = target >= 100 ? value + '+' : value;
  }

  function animateCounters() {
    if (reduceMotion) {
      // Sin animación: mostrar valores finales de inmediato
      statNumbers.forEach(renderStatFinal);
      return;
    }

    statNumbers.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      var duration = 2000;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        // Función de easing (ease-out cubic)
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(eased * target);
        el.textContent = current.toLocaleString('es-ES');
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          renderStatFinal(el);
        }
      }

      requestAnimationFrame(step);
    });
  }

  // Intersection Observer para disparar la animación
  var statsSection = document.getElementById('estadisticas');

  if (statsSection && 'IntersectionObserver' in window) {
    var statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  } else {
    // Fallback: animar siempre si no hay soporte
    animateCounters();
  }

  /* ===========================
     ANIMACIÓN DE ENTRADA (FADE IN)
     =========================== */
  var fadeElements = document.querySelectorAll('.stat-card, .gallery-item, .timeline-item');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    // Sin animación de entrada si hay preferencia de movimiento reducido
    // o si no hay soporte de IntersectionObserver
    fadeElements.forEach(function (el) {
      el.classList.add('visible');
    });
  } else {
    fadeElements.forEach(function (el) {
      el.classList.add('fade-in');
    });

    var fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    fadeElements.forEach(function (el) {
      fadeObserver.observe(el);
    });
  }

  /* ===========================
     SMOOTH SCROLL PARA ENLACES INTERNOS
     =========================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#' || href === '') return;

      var target = document.querySelector(href);
      if (target) {
        // No cancelar el evento predeterminado: el navegador actualiza el hash
        // y desplaza la vista respetando html { scroll-behavior: smooth }.
        // Solo gestionamos el foco para la navegación con teclado.
        var needsFocus = !target.hasAttribute('tabindex');
        if (needsFocus) {
          target.setAttribute('tabindex', '-1');
        }
        target.focus({ preventScroll: true });
      }
    });
  });

})();
