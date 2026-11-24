/**
 * ==========================================================================
 * SHARED SCROLL REVEAL & HERO UTILITIES
 * Hadi Education System (HES)
 * Page load/transition animations disabled for immediate static hero rendering.
 * Scroll-triggered reveal animations below the fold remain active.
 * ==========================================================================
 */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.remove('gw-active', 'gw-subsequent');

  var overlay = document.getElementById('gwOverlay');
  if (overlay && overlay.parentNode) {
    overlay.remove();
  }

  var isGatewayDone = true;
  window.isGatewayDone = true;

  function dispatchGatewayEvent(name) {
    try {
      var event = new CustomEvent(name, { bubbles: true, cancelable: true });
      document.dispatchEvent(event);
      window.dispatchEvent(event);
    } catch (e) {
      var evt = document.createEvent('Event');
      evt.initEvent(name, true, true);
      document.dispatchEvent(evt);
    }
  }

  // --------------------------------------------------------------------------
  // HERO RENDERING: IMMEDIATELY VISIBLE IN STATIC STATE
  // --------------------------------------------------------------------------
  function setupHeroEntrance() {
    var heroElem = document.querySelector('.hero-content, .cl-hero-text');
    if (heroElem) {
      heroElem.classList.add('hero-stagger-active');
    }
    var visual = document.querySelector('.cl-hero-visual');
    if (visual) visual.classList.add('is-visible');
    var fadeElems = document.querySelectorAll('.cl-fade-elem');
    fadeElems.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // --------------------------------------------------------------------------
  // SHARED SCROLL REVEAL UTILITY (IntersectionObserver)
  // Preserves below-the-fold scroll animations
  // --------------------------------------------------------------------------
  function setupScrollReveal() {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom');

    if (reduced) {
      revealElements.forEach(function (el) {
        el.classList.add('is-revealed', 'is-visible');
      });
      return;
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed', 'is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -30px 0px' }
      );

      revealElements.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      revealElements.forEach(function (el) {
        el.classList.add('is-revealed', 'is-visible');
      });
    }
  }

  // --------------------------------------------------------------------------
  // GLOBAL SKELETON LOADING CONTROLLER
  // --------------------------------------------------------------------------
  var SKELETON_ID = 'hesSkeleton';
  var MIN_DISPLAY_TIME = 400; // ms minimum duration so shimmer state is smoothly perceived
  var MAX_SAFETY_TIMEOUT = 1200; // ms safety timeout
  var loadStartTime = (window.__hesLoadStart = window.__hesLoadStart || Date.now());

  function hideSkeleton() {
    var sk = document.getElementById(SKELETON_ID);
    if (!sk || sk.classList.contains('is-loaded')) return;

    var elapsed = Date.now() - loadStartTime;
    var remaining = Math.max(0, MIN_DISPLAY_TIME - elapsed);

    setTimeout(function () {
      sk.classList.add('is-loaded');
      setTimeout(function () {
        if (sk && sk.parentNode) {
          sk.remove();
        }
      }, 400);
    }, remaining);
  }

  function createSkeletonElement() {
    var div = document.createElement('div');
    div.id = SKELETON_ID;
    div.className = 'hes-skeleton-screen';
    div.setAttribute('aria-hidden', 'true');
    div.innerHTML = [
      '<div class="hes-sk-hero-stage">',
      '  <div class="hes-sk-nav-wrap">',
      '    <div class="hes-sk-nav">',
      '      <div class="hes-sk-brand">',
      '        <div class="hes-sk-circle"></div>',
      '        <div class="hes-sk-brand-text"></div>',
      '      </div>',
      '      <div class="hes-sk-nav-links">',
      '        <div class="hes-sk-pill"></div>',
      '        <div class="hes-sk-pill"></div>',
      '        <div class="hes-sk-pill is-active-pill"></div>',
      '        <div class="hes-sk-pill"></div>',
      '        <div class="hes-sk-pill"></div>',
      '        <div class="hes-sk-pill"></div>',
      '      </div>',
      '      <div class="hes-sk-nav-cta"></div>',
      '    </div>',
      '  </div>',
      '  <div class="hes-sk-backdrop"></div>',
      '  <div class="hes-sk-panel-wrap">',
      '    <div class="hes-sk-panel">',
      '      <div class="hes-sk-col-title">',
      '        <div class="hes-sk-eyebrow-dark"></div>',
      '        <div class="hes-sk-title-dark"></div>',
      '      </div>',
      '      <div class="hes-sk-col-summary">',
      '        <div class="hes-sk-line-dark hes-sk-line-full"></div>',
      '        <div class="hes-sk-line-dark hes-sk-line-sub"></div>',
      '      </div>',
      '      <div class="hes-sk-col-actions">',
      '        <div class="hes-sk-btn-white"></div>',
      '        <div class="hes-sk-btn-outline"></div>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n');
    return div;
  }

  window.__hesCreateSkeleton = createSkeletonElement;
  window.__hesHideSkeleton = hideSkeleton;

  if (document.readyState === 'complete') {
    hideSkeleton();
  } else {
    window.addEventListener('load', hideSkeleton);
    document.addEventListener('DOMContentLoaded', hideSkeleton);
  }
  setTimeout(hideSkeleton, MAX_SAFETY_TIMEOUT);

  // Link click page transition skeleton
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;
    if (link.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.defaultPrevented) return;

    var url;
    try {
      url = new URL(link.href, window.location.href);
    } catch (_) {
      return;
    }
    if (url.origin !== window.location.origin) return;
    if (url.pathname === window.location.pathname && url.hash) return;

    var sk = document.getElementById(SKELETON_ID);
    if (!sk) {
      sk = createSkeletonElement();
      document.body.appendChild(sk);
    }
    sk.classList.remove('is-loaded');
  });

  // Bind hero and reveal on DOMContentLoaded or immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setupHeroEntrance();
      setupScrollReveal();
      dispatchGatewayEvent('gateway:done');
    });
  } else {
    setupHeroEntrance();
    setupScrollReveal();
    dispatchGatewayEvent('gateway:done');
  }
})();
