/**
 * HADI EDUCATION SYSTEM (HES) — GLOBAL APPLICATION LOGIC
 * Manages the English/light presentation, sticky navbar, animated stats,
 * mobile drawer, interactive AI assistant, and form validation.
 */

// Purge any legacy animation toggle states
try {
  localStorage.removeItem("hes-perf-mode");
} catch (e) {}

// Global skeleton loader dismiss handler
function triggerSkeletonDismiss() {
  if (typeof window.__hesHideSkeleton === "function") {
    window.__hesHideSkeleton();
  } else {
    const sk = document.getElementById("hesSkeleton");
    if (sk && !sk.classList.contains("is-loaded")) {
      setTimeout(() => {
        sk.classList.add("is-loaded");
        setTimeout(() => {
          if (sk.parentNode) sk.remove();
        }, 400);
      }, 350);
    }
  }
}

window.addEventListener("load", triggerSkeletonDismiss);
setTimeout(triggerSkeletonDismiss, 1200);

document.addEventListener("DOMContentLoaded", () => {
  triggerSkeletonDismiss();
  initScrollReveal();
  initTheme();
  initLanguage();
  initNavbar();
  initNavigationHover();
  initCampusVideo();
  initMobileDrawer();
  initCounters();
  initAccordion();
  initTabs();
  initLightbox();
  initChatbot();
  initForms();
  initVisionMissionParallax();
  initMissionVisionSection();
  initAdmissionRoadmap();
  initFacultyMobileCarousel();
  initYearRail();
  initBalancedDayBar();
  initCampusLife();
  initTabVisibilityController();
  initMarqueeVisibilityObserver();
  initCampusSkylineFooter();
  initSpecimenSwitcher();
  initHeroContent();
  initReelTheatre();
});

function initHeroContent() {
  if (typeof window === "undefined" || !window.siteContent || !window.siteContent.hero) return;
  const path = window.location.pathname.toLowerCase();
  let pageKey = "";
  if (path.includes("about")) pageKey = "about";
  else if (path.includes("academic")) pageKey = "academics";
  else if (path.includes("campus") || path.includes("facilities")) pageKey = "campusLife";
  else if (path.includes("admission")) pageKey = "admission";
  else if (path.includes("contact")) pageKey = "contact";
  if (!pageKey || !window.siteContent.hero[pageKey]) return;

  const data = window.siteContent.hero[pageKey];
  const heroSection = document.querySelector(".hero-immersive");
  if (!heroSection) return;

  const eyebrow = heroSection.querySelector(".hero-panel__eyebrow");
  const title = heroSection.querySelector(".hero-panel__title");
  const summary = heroSection.querySelector(".hero-panel__summary");
  const primaryCta = heroSection.querySelector(".hero-btn--primary");
  const primaryCtaText = heroSection.querySelector(".hero-btn--primary .hero-btn__text");
  const secondaryCta = heroSection.querySelector(".hero-btn--secondary");
  const secondaryCtaText = heroSection.querySelector(".hero-btn--secondary .hero-btn__text");

  if (eyebrow) {
    eyebrow.setAttribute("data-en", data.eyebrowEn);
    eyebrow.setAttribute("data-ur", data.eyebrowUr);
  }
  if (title) {
    title.setAttribute("data-en", data.titleEn);
    title.setAttribute("data-ur", data.titleUr);
  }
  if (summary) {
    summary.setAttribute("data-en", data.summaryEn);
    summary.setAttribute("data-ur", data.summaryUr);
  }
  if (primaryCta && data.primaryCta) {
    if (data.primaryCta.href) primaryCta.setAttribute("href", data.primaryCta.href);
    if (primaryCtaText) {
      primaryCtaText.setAttribute("data-en", data.primaryCta.labelEn);
      primaryCtaText.setAttribute("data-ur", data.primaryCta.labelUr);
    }
  }
  if (secondaryCta && data.secondaryCta) {
    if (data.secondaryCta.href) secondaryCta.setAttribute("href", data.secondaryCta.href);
    if (secondaryCtaText) {
      secondaryCtaText.setAttribute("data-en", data.secondaryCta.labelEn);
      secondaryCtaText.setAttribute("data-ur", data.secondaryCta.labelUr);
    }
  }
}

/* ==========================================================================
   0. SCROLL-TRIGGERED REVEALS
   ========================================================================== */
function initScrollReveal() {
  const revealElements = Array.from(document.querySelectorAll(
    "main section, main h1, main h2, main h3, main h4, main h5, main h6, " +
    "main p, main ul, main ol, main li, main button, main img, main article, " +
    "main [class*='card'], main [class*='step'], main [class*='item'], " +
    "footer h1, footer h2, footer h3, footer h4, footer h5, footer h6, " +
    "footer p, footer ul, footer ol, footer li, footer img, footer article, " +
    "footer [class*='card'], footer [class*='item']"
  )).filter(element =>
    !element.closest(".hero") &&
    !element.closest(".hero-full") &&
    !element.closest(".hero-immersive") &&
    !element.closest(".cl-hero") &&
    !element.closest(".page-about-hero") &&
    !element.closest(".hero-unified") &&
    !element.closest(".mv-section") &&
    !element.closest(".admission-roadmap-section") &&
    !element.closest(".arches-section") &&
    !element.closest(".academic-journey-section") &&
    !element.closest(".faculty-carousel-wrapper") &&
    !element.closest(".yr-section") &&
    !element.closest(".bd-section") &&
    !element.closest(".footer-skyline") &&
    !element.closest(".brotherhood-hero-band") &&
    !element.closest(".principal-photo") && !element.matches(".footer-copyright, .vm-bg-img, .vm-bg-logo, .principal-bg-img, .principal-img")
  );
  if (!revealElements.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!("IntersectionObserver" in window) && !reducedMotion.matches) return;

  const cardElements = revealElements.filter(element =>
    element.matches("img, article, [class*='card'], [class*='step'], [class*='item']")
  );
  const cardPositions = new Map();

  cardElements.forEach(element => {
    const siblings = cardElements.filter(sibling => sibling.parentElement === element.parentElement);
    const position = siblings.indexOf(element);
    cardPositions.set(element, position);
  });

  const staggerCounts = new Map();
  revealElements.forEach(element => {
    const parent = element.parentElement;
    if (!parent) return;

    const count = staggerCounts.get(parent) || 0;
    const cappedCount = Math.min(count, 4);
    if (element.matches("p, ul, ol, li, button")) {
      if (!element.hasAttribute("data-delay")) {
        element.setAttribute("data-delay", String(cappedCount * 45));
      }
      staggerCounts.set(parent, count + 1);
    }

    if (element.hasAttribute("data-delay")) {
      const delay = Number.parseInt(element.getAttribute("data-delay"), 10);
      if (Number.isFinite(delay) && delay > 0) {
        element.style.setProperty("--reveal-delay", `${Math.min(delay, 180)}ms`);
      }
    }

    if (element.matches("img")) {
      element.classList.add("reveal-zoom");
    } else if (cardPositions.has(element)) {
      const index = cardPositions.get(element);
      element.classList.add(index % 2 === 0 ? "reveal-left" : "reveal-right");
    } else {
      element.classList.add("reveal");
    }
  });

  document.documentElement.classList.add("js", "reveal-pending");

  if (reducedMotion.matches) {
    revealElements.forEach(element => {
      element.classList.add("is-visible", "is-revealed");
      element.style.setProperty("--reveal-delay", "0ms");
    });
    document.documentElement.classList.remove("reveal-pending");
    return;
  }

  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible", "is-revealed");
      activeObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -20px 0px"
  });

  window.requestAnimationFrame(() => {
    document.documentElement.classList.remove("reveal-pending");
    revealElements.forEach(element => observer.observe(element));
  });
}

/* ==========================================================================
   1. DEFAULT PRESENTATION (English & Light Mode)
   ========================================================================== */
function initTheme() {
  document.documentElement.setAttribute("data-theme", "light");
}

/* ==========================================================================
   2. LANGUAGE SWITCHER & BILINGUAL SUPPORT (EN / UR)
   ========================================================================== */
function setLanguage(lang) {
  const isUrdu = lang === "ur";
  document.documentElement.setAttribute("lang", isUrdu ? "ur" : "en");
  document.documentElement.setAttribute("dir", isUrdu ? "rtl" : "ltr");

  try {
    localStorage.setItem("hes_lang", lang);
  } catch (e) {}

  const elements = document.querySelectorAll("[data-en][data-ur]");
  elements.forEach(el => {
    el.innerHTML = isUrdu ? el.getAttribute("data-ur") : el.getAttribute("data-en");
  });

  // Update footer lang toggle buttons
  const langBtns = document.querySelectorAll(".footer-lang-btn");
  langBtns.forEach(btn => {
    const btnLang = btn.getAttribute("data-lang");
    const active = btnLang === lang;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });

  const signOff = document.querySelector(".footer-sign-off");
  if (signOff) {
    if (isUrdu) {
      signOff.setAttribute("lang", "ur");
    } else {
      signOff.removeAttribute("lang");
    }
  }
}

function initLanguage() {
  let savedLang = "en";
  try {
    savedLang = localStorage.getItem("hes_lang") || "en";
  } catch (e) {}
  setLanguage(savedLang);
}

// Hero entrance is managed by the shared page-gateway module on 'gateway:done'

/* ==========================================================================
   3. STICKY NAVBAR ON SCROLL
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
}

function initNavigationHover() {
  const navContainer = document.querySelector(".navbar .nav-links");
  if (!navContainer) return;

  const links = Array.from(navContainer.querySelectorAll(".nav-link"));
  if (!links.length) return;

  // Clean up any legacy highlight spans if present
  links.forEach(link => {
    const legacy = link.querySelector("span[aria-hidden='true']");
    if (legacy && legacy.style && legacy.style.zIndex === "-1") {
      legacy.remove();
    }
  });

  // Create single gliding blue toggle overlay
  let toggleOverlay = navContainer.querySelector(".nav-toggle-overlay");
  if (!toggleOverlay) {
    toggleOverlay = document.createElement("div");
    toggleOverlay.className = "nav-toggle-overlay";
    toggleOverlay.setAttribute("aria-hidden", "true");
    navContainer.prepend(toggleOverlay);
  }

  navContainer.classList.add("has-slider");

  const isDesktop = () => window.innerWidth > 1040 && window.getComputedStyle(navContainer).display !== "none";
  let isHovered = false;

  const moveTo = (target) => {
    if (!isDesktop() || !target) return;

    const left = target.offsetLeft;
    const top = target.offsetTop;
    const width = target.offsetWidth;
    const height = target.offsetHeight;

    if (!isHovered) {
      // First hover onto nav: position immediately without an unwanted cross-nav sweep
      toggleOverlay.style.transition = "opacity 0.2s ease";
      toggleOverlay.style.transform = `translate3d(${left}px, ${top}px, 0)`;
      toggleOverlay.style.width = `${width}px`;
      toggleOverlay.style.height = `${height}px`;
      toggleOverlay.style.opacity = "1";
      isHovered = true;

      // Re-enable smooth gliding transition for subsequent link hovers
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          toggleOverlay.style.transition = "";
        });
      });
    } else {
      toggleOverlay.style.transform = `translate3d(${left}px, ${top}px, 0)`;
      toggleOverlay.style.width = `${width}px`;
      toggleOverlay.style.height = `${height}px`;
      toggleOverlay.style.opacity = "1";
    }

    links.forEach(l => l.classList.remove("is-hovered"));
    target.classList.add("is-hovered");
  };

  const leaveNav = () => {
    isHovered = false;
    toggleOverlay.style.opacity = "0";
    links.forEach(l => l.classList.remove("is-hovered"));
  };

  links.forEach(link => {
    link.addEventListener("mouseenter", () => {
      moveTo(link);
    });

    link.addEventListener("focus", () => {
      moveTo(link);
    });
  });

  navContainer.addEventListener("mouseleave", () => {
    leaveNav();
  });

  window.addEventListener("resize", () => {
    if (!isDesktop()) {
      leaveNav();
    }
  }, { passive: true });
}

function initCampusVideo() {
  const iframe = document.querySelector(".video-wrapper iframe");
  if (!iframe) return;

  if (!iframe.id) {
    iframe.id = "hes-campus-video";
  }

  const embedUrl = new URL(iframe.getAttribute("src"), window.location.href);
  embedUrl.searchParams.set("enablejsapi", "1");
  embedUrl.searchParams.set("origin", window.location.origin);
  iframe.setAttribute("src", embedUrl.toString());

  let player = null;

  const sendPlayerCommand = (func) => {
    if (!iframe.contentWindow) return;
    iframe.contentWindow.postMessage(JSON.stringify({
      event: "command",
      func,
      args: []
    }), "*");
  };

  const stopVideo = () => {
    if (player && typeof player.stopVideo === "function") {
      player.stopVideo();
      return;
    }
    sendPlayerCommand("pauseVideo");
    sendPlayerCommand("stopVideo");
  };

  const bindPlayer = () => {
    if (!window.YT || typeof window.YT.Player !== "function") return;
    player = new window.YT.Player(iframe.id);
  };

  if (window.YT && window.YT.Player) {
    bindPlayer();
  } else {
    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previousReady === "function") previousReady();
      bindPlayer();
    };
    if (!document.querySelector("script[src='https://www.youtube.com/iframe_api']")) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
    }
  }

  let lastScrollY = window.scrollY;
  let visibleRatio = 1;

  window.addEventListener("scroll", () => {
    const currentY = window.scrollY;
    const scrollingUp = currentY < lastScrollY - 4;
    lastScrollY = currentY;
    if (scrollingUp && visibleRatio < 0.7) {
      stopVideo();
    }
  }, { passive: true });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        visibleRatio = entry.intersectionRatio;
        if (!entry.isIntersecting || visibleRatio < 0.4) {
          stopVideo();
        }
      });
    }, { threshold: [0, 0.25, 0.4, 0.7, 1] });

    observer.observe(iframe);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopVideo();
    }
  });
}

/* ==========================================================================
   4. MOBILE BENTO SHEET MENU
   ========================================================================== */
function initMobileDrawer() {
  const openBtn = document.querySelector(".menu-toggle-btn");
  const closeBtn = document.querySelector(".m-menu-close, .drawer-close");
  const drawer = document.querySelector(".mobile-drawer");
  const overlay = document.querySelector(".drawer-overlay");
  const sheet = drawer ? drawer.querySelector(".m-menu-sheet") : null;
  const photoWrap = drawer ? drawer.querySelector(".m-menu-photo-wrap") : null;
  const photoImg = drawer ? drawer.querySelector(".m-menu-photo") : null;

  if (!drawer || !overlay) return;

  if (openBtn) {
    openBtn.setAttribute("aria-expanded", "false");
    openBtn.setAttribute("aria-label", "Open menu");
  }

  // Fallback if campus photo fails to load: hide broken img so solid Navy #14213D shows
  if (photoImg) {
    photoImg.addEventListener("error", () => {
      photoImg.classList.add("is-error");
    });
    if (photoImg.complete && photoImg.naturalWidth === 0) {
      photoImg.classList.add("is-error");
    }
  }

  // Highlight current page tile from location.pathname
  const syncCurrentPageTile = () => {
    const rawName = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    const currentPage = rawName === "" ? "index.html" : rawName;
    const tiles = drawer.querySelectorAll(".m-menu-tile");
    tiles.forEach((tile) => {
      const pageAttr = (tile.getAttribute("data-page") || "").toLowerCase();
      const hrefPage = (tile.getAttribute("href") || "").split("?")[0].split("#")[0].toLowerCase();
      const isMatch = pageAttr === currentPage || hrefPage === currentPage;
      if (isMatch) {
        tile.classList.add("is-current");
        tile.setAttribute("aria-current", "page");
      } else {
        tile.classList.remove("is-current");
        tile.removeAttribute("aria-current");
      }
    });
  };
  syncCurrentPageTile();

  // Populate WhatsApp & Email action buttons from siteContent.info (hide if missing)
  const syncContactLinks = () => {
    const waBtn = drawer.querySelector(".m-menu-wa");
    const emailBtn = drawer.querySelector(".m-menu-email");
    const info = typeof siteContent !== "undefined" && siteContent && siteContent.info ? siteContent.info : null;

    if (waBtn) {
      const waRaw = info ? (info.whatsapp !== undefined ? info.whatsapp : (info.contact ? info.contact.whatsappNumber : "")) : "";
      const waDigits = String(waRaw || "").replace(/\D/g, "");
      if (waDigits) {
        waBtn.setAttribute("href", `https://wa.me/${waDigits}`);
        waBtn.hidden = false;
      } else {
        waBtn.removeAttribute("href");
        waBtn.hidden = true;
      }
    }

    if (emailBtn) {
      const emailRaw = info ? (info.email !== undefined ? info.email : (info.contact ? info.contact.email : "")) : "";
      const emailVal = String(emailRaw || "").trim();
      if (emailVal) {
        emailBtn.setAttribute("href", `mailto:${emailVal}`);
        emailBtn.hidden = false;
      } else {
        emailBtn.removeAttribute("href");
        emailBtn.hidden = true;
      }
    }
  };
  syncContactLinks();

  let savedScrollY = 0;
  let openedAt = 0;
  let savedThemeColor = null;
  const themeColorMeta = document.querySelector("meta[name=\"theme-color\"]");

  const setBackgroundInert = (isInert) => {
    const regions = document.querySelectorAll("body > header, body > main, body > footer, #ai-chat-window, #open-ai-chat, .lightbox-modal, .cl-lightbox-modal");
    regions.forEach((el) => {
      if (isInert) {
        if ("inert" in el) el.inert = true;
        el.setAttribute("inert", "");
        el.setAttribute("aria-hidden", "true");
      } else {
        if ("inert" in el) el.inert = false;
        el.removeAttribute("inert");
        el.removeAttribute("aria-hidden");
      }
    });
  };

  const getFocusableElements = () => {
    const candidates = drawer.querySelectorAll(
      "button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex=\"-1\"])"
    );
    return Array.from(candidates).filter((el) => !el.hidden && el.offsetParent !== null);
  };

  const openDrawer = () => {
    if (drawer.classList.contains("open")) return;

    syncCurrentPageTile();
    syncContactLinks();

    openedAt = Date.now();
    savedScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;

    if (sheet) {
      sheet.classList.remove("is-dragging");
      sheet.style.transform = "";
    }

    drawer.classList.add("open");
    overlay.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    if (openBtn) {
      openBtn.setAttribute("aria-expanded", "true");
      openBtn.setAttribute("aria-label", "Close menu");
      openBtn.classList.add("is-active");
    }

    if (themeColorMeta) {
      savedThemeColor = themeColorMeta.getAttribute("content");
      themeColorMeta.setAttribute("content", "#FFFFFF");
    }

    setBackgroundInert(true);

    // Complete background scroll lock without jump
    document.documentElement.classList.add("drawer-open");
    document.body.classList.add("drawer-open");
    document.body.style.position = "fixed";
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    if (closeBtn) {
      window.requestAnimationFrame(() => {
        if (drawer.classList.contains("open")) {
          closeBtn.focus({ preventScroll: true });
        }
      });
    }
  };

  const closeDrawer = (skipFocusReturn = false) => {
    if (!drawer.classList.contains("open")) return;

    if (sheet) {
      sheet.classList.remove("is-dragging");
      sheet.style.transform = "";
    }

    drawer.classList.remove("open");
    overlay.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");

    setBackgroundInert(false);

    if (themeColorMeta && savedThemeColor !== null) {
      themeColorMeta.setAttribute("content", savedThemeColor);
      savedThemeColor = null;
    }

    if (openBtn) {
      openBtn.setAttribute("aria-expanded", "false");
      openBtn.setAttribute("aria-label", "Open menu");
      openBtn.classList.remove("is-active");
    }

    // Release scroll lock and cleanly restore exact scroll position
    document.documentElement.classList.remove("drawer-open");
    document.body.classList.remove("drawer-open");
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";

    const htmlEl = document.documentElement;
    const prevScrollBehavior = htmlEl.style.scrollBehavior;
    htmlEl.style.scrollBehavior = "auto";
    window.scrollTo(0, savedScrollY);
    htmlEl.style.scrollBehavior = prevScrollBehavior;

    if (!skipFocusReturn && openBtn && window.innerWidth <= 1040) {
      const navbarInner = document.querySelector("header.navbar .navbar-inner");
      if (navbarInner) navbarInner.style.setProperty("transition", "none", "important");
      void window.getComputedStyle(openBtn).visibility;
      openBtn.focus({ preventScroll: true });
      if (navbarInner) {
        window.requestAnimationFrame(() => {
          navbarInner.style.removeProperty("transition");
        });
      }
    }
  };

  if (openBtn) {
    openBtn.addEventListener("click", () => {
      if (drawer.classList.contains("open")) {
        closeDrawer(false);
      } else {
        openDrawer();
      }
    });
  }
  if (closeBtn) closeBtn.addEventListener("click", () => closeDrawer(false));
  overlay.addEventListener("click", () => {
    if (Date.now() - openedAt < 300) return;
    closeDrawer(false);
  });
  if (photoWrap) {
    photoWrap.addEventListener("click", () => {
      if (Date.now() - openedAt < 300) return;
      closeDrawer(false);
    });
  }

  // Prevent background touch scrolling on mobile when touching outside the sheet
  const preventBackgroundTouchScroll = (e) => {
    if (!drawer.classList.contains("open")) return;
    if (!sheet || !sheet.contains(e.target)) {
      e.preventDefault();
    }
  };
  document.addEventListener("touchmove", preventBackgroundTouchScroll, { passive: false });

  // Escape & Focus Trap
  document.addEventListener("keydown", (e) => {
    if (!drawer.classList.contains("open")) return;

    if (e.key === "Escape") {
      e.preventDefault();
      closeDrawer(false);
      return;
    }

    if (e.key === "Tab") {
      const focusables = getFocusableElements();
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first || !drawer.contains(document.activeElement)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last || !drawer.contains(document.activeElement)) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });

  // Automatically reset lock if resized to desktop (> 1040px)
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1040 && drawer.classList.contains("open")) {
      closeDrawer(true);
    }
  });

  // Swipe-down gesture on the sheet
  if (sheet) {
    let pointerId = null;
    let startY = 0;
    let startTime = 0;
    let currentDy = 0;
    let isDragging = false;

    const resetDrag = () => {
      pointerId = null;
      isDragging = false;
      currentDy = 0;
      sheet.classList.remove("is-dragging");
      sheet.style.transform = "";
    };

    sheet.addEventListener("pointerdown", (e) => {
      if (!drawer.classList.contains("open")) return;
      if (e.button !== undefined && e.button !== 0 && e.pointerType === "mouse") return;
      if (sheet.scrollTop > 0) return;

      pointerId = e.pointerId;
      startY = e.clientY;
      startTime = Date.now();
      currentDy = 0;
      isDragging = false;
    });

    sheet.addEventListener("pointermove", (e) => {
      if (pointerId === null || e.pointerId !== pointerId) return;
      if (!drawer.classList.contains("open")) {
        resetDrag();
        return;
      }

      const dy = e.clientY - startY;
      if (!isDragging) {
        if (sheet.scrollTop > 0 || dy <= 8) return;
        isDragging = true;
        sheet.classList.add("is-dragging");
      }

      currentDy = Math.max(0, dy);
      sheet.style.transform = `translateY(${currentDy}px)`;
    });

    const endDrag = (e) => {
      if (pointerId === null || e.pointerId !== pointerId) return;
      if (!isDragging) {
        pointerId = null;
        return;
      }

      const elapsed = Math.max(1, Date.now() - startTime);
      const velocity = currentDy / elapsed;
      const shouldClose = currentDy > 80 || (currentDy > 24 && velocity > 0.45);

      resetDrag();
      if (shouldClose) {
        closeDrawer(false);
      }
    };

    sheet.addEventListener("pointerup", endDrag);
    sheet.addEventListener("pointercancel", endDrag);
  }

  // Close when clicking any tile or action link (Page Gateway transition still runs)
  const navLinks = drawer.querySelectorAll(".m-menu-tile, .m-menu-cta");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeDrawer(true);
    });
  });
}

/* ==========================================================================
   5. ANIMATED TRUST COUNTERS
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll(".counter-number");
  if (!counters.length) return;

  // Respect OS prefers-reduced-motion for accessibility
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    counters.forEach(c => {
      const target = c.getAttribute('data-target') || '';
      const suffix = c.getAttribute('data-suffix') || '';
      const num = parseInt(target, 10);
      c.textContent = (isNaN(num) ? target : num.toLocaleString()) + suffix;
    });
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetValue = parseInt(el.getAttribute("data-target"), 10) || 0;
        const suffix = el.getAttribute("data-suffix") || "";
        animateValue(el, 0, targetValue, 600, suffix);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(c => observer.observe(c));
}

function animateValue(obj, start, end, duration, suffix) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    // easeOutQuad
    const easeProgress = 1 - (1 - progress) * (1 - progress);
    const currentVal = Math.floor(easeProgress * (end - start) + start);
    obj.textContent = currentVal.toLocaleString() + suffix;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      obj.textContent = end.toLocaleString() + suffix;
    }
  };
  window.requestAnimationFrame(step);
}

/* ==========================================================================
   6. ACCORDION (FAQ)
   ========================================================================== */
function initAccordion() {
  const triggers = document.querySelectorAll(".accordion-trigger");
  triggers.forEach(trigger => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".accordion-item");
      const wasOpen = item.classList.contains("open");

      // Optional: close other items in the same accordion
      const parent = item.parentElement;
      if (parent) {
        parent.querySelectorAll(".accordion-item").forEach(other => other.classList.remove("open"));
      }

      if (!wasOpen) {
        item.classList.add("open");
      }
    });
  });
}

/* ==========================================================================
   7. TABBED INTERFACE (Academics by Grade Level)
   ========================================================================== */
function initTabs() {
  const tabContainers = document.querySelectorAll("[data-tabs]");
  tabContainers.forEach(container => {
    const btns = container.querySelectorAll(".tab-btn");
    const panels = container.querySelectorAll(".tab-content-panel");

    btns.forEach(btn => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-tab-target");

        btns.forEach(b => b.classList.remove("active"));
        panels.forEach(p => p.classList.remove("active"));

        btn.classList.add("active");
        const targetPanel = container.querySelector(targetId);
        if (targetPanel) targetPanel.classList.add("active");
      });
    });
  });
}

/* ==========================================================================
   8. LIGHTBOX MODAL (Facilities & Visual Highlights)
   ========================================================================== */
function initLightbox() {
  const lightboxModal = document.querySelector(".lightbox-modal");
  if (!lightboxModal) return;

  const closeBtn = lightboxModal.querySelector(".lightbox-close-btn");
  const lightboxTitle = lightboxModal.querySelector(".lightbox-title");
  const lightboxDesc = lightboxModal.querySelector(".lightbox-desc");
  const triggers = document.querySelectorAll("[data-lightbox-trigger]");

  triggers.forEach(trigger => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      const title = trigger.getAttribute("data-title") || "Facility Highlight";
      const desc = trigger.getAttribute("data-desc") || "Campus environment and facilities at Hadi Education System.";
      
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxDesc) lightboxDesc.textContent = desc;

      lightboxModal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  const closeModal = () => {
    lightboxModal.classList.remove("active");
    document.body.style.overflow = "";
  };

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  lightboxModal.addEventListener("click", (e) => {
    if (e.target === lightboxModal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightboxModal.classList.contains("active")) {
      closeModal();
    }
  });
}

/* ==========================================================================
   9. INTERACTIVE AI ASSISTANT WIDGET ("Hadi AI Advisor")
   ========================================================================== */
function initChatbot() {
  const openBtn = document.querySelector("#open-ai-chat");
  const closeBtn = document.querySelector("#close-ai-chat");
  const chatWindow = document.querySelector("#ai-chat-window");
  const messagesBox = document.querySelector("#ai-chat-messages");
  const chatInput = document.querySelector("#ai-chat-input");
  const sendBtn = document.querySelector("#ai-chat-send");
  const quickChips = document.querySelectorAll(".quick-reply-chip");

  if (!chatWindow) return;

  const toggleChat = () => {
    chatWindow.classList.toggle("open");
    if (chatWindow.classList.contains("open")) {
      setTimeout(() => chatInput && chatInput.focus(), 150);
    }
  };

  if (openBtn) openBtn.addEventListener("click", toggleChat);
  if (closeBtn) closeBtn.addEventListener("click", () => chatWindow.classList.remove("open"));

  const appendMessage = (text, sender = "bot") => {
    if (!messagesBox) return;
    const msgDiv = document.createElement("div");
    msgDiv.className = `chat-msg ${sender}`;
    msgDiv.textContent = text;
    messagesBox.appendChild(msgDiv);
    messagesBox.scrollTop = messagesBox.scrollHeight;
  };

  const processUserQuery = (query) => {
    const text = query.trim().toLowerCase();
    if (!text) return;

    appendMessage(query, "user");
    if (chatInput) chatInput.value = "";

    // Simulated Thinking Delay
    setTimeout(() => {
      let matchedResponse = null;
      if (window.siteContent && window.siteContent.chatbotQA) {
        for (const item of window.siteContent.chatbotQA) {
          const matched = item.triggerWords.some(keyword => text.includes(keyword));
          if (matched) {
            matchedResponse = document.documentElement.getAttribute("lang") === "ur" 
              ? item.responseUr 
              : item.responseEn;
            break;
          }
        }
      }

      if (!matchedResponse) {
        matchedResponse = document.documentElement.getAttribute("lang") === "ur"
          ? "آپ کے سوال کا شکریہ! برائے مہربانی مزید معلومات کے لیے ہمارے واٹس ایپ نمبر 0314-5075399 پر رابطہ کریں یا ہمارے کیمپس پپلی روڈ بلکسر تشریف لائیں۔"
          : "Thank you for reaching out! For detailed queries regarding this, please WhatsApp our admissions desk at +92 314 5075399 or visit our campus on Pipli Road, Balkasar.";
      }

      appendMessage(matchedResponse, "bot");
    }, 450);
  };

  if (sendBtn && chatInput) {
    sendBtn.addEventListener("click", () => processUserQuery(chatInput.value));
    chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") processUserQuery(chatInput.value);
    });
  }

  quickChips.forEach(chip => {
    chip.addEventListener("click", () => {
      const prompt = chip.getAttribute("data-prompt") || chip.textContent;
      processUserQuery(prompt);
    });
  });
}

/* ==========================================================================
   10. FORMS & CLIENT-SIDE VALIDATION (Admission & Contact) — HARDENED
   Full server-side & client-side validation, anti-spam, Turnstile, honeypot,
   minimum submit time, preserved inputs on error, accessible inline errors.
   ========================================================================== */
function initForms() {
  const pageLoadTime = Date.now();

  function setupFormHandler(formEl, formType) {
    if (!formEl) return;

    // Attach real-time input clearing for inline errors
    formEl.querySelectorAll("input, select, textarea").forEach(field => {
      field.addEventListener("input", () => {
        field.classList.remove("has-error");
        const errSpan = formEl.querySelector("#" + field.name + "-error") ||
                        formEl.querySelector("#" + field.id + "-error");
        if (errSpan) {
          errSpan.textContent = "";
          errSpan.classList.remove("is-visible");
        }
      });
    });

    formEl.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Clear any lingering error states
      formEl.querySelectorAll(".form-control").forEach(el => el.classList.remove("has-error"));
      formEl.querySelectorAll(".form-error").forEach(el => {
        el.textContent = "";
        el.classList.remove("is-visible");
      });

      const submitBtn = formEl.querySelector("button[type='submit']");
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : "Submit";

      // 1. Client-Side Validation
      const formData = new FormData(formEl);
      const payload = {};
      formData.forEach((val, key) => { payload[key] = typeof val === 'string' ? val.trim() : val; });

      // Add minimum-time token
      payload._timeLoaded = pageLoadTime;

      // Extract unified field mappings
      const parentName = payload.parentName || payload.name || "";
      const studentName = payload.studentName || "";
      const email = payload.email || payload.parentEmail || "";
      const phone = payload.phone || payload.parentPhone || "";
      const classApplying = payload.classApplying || payload.grade || payload.subject || "General Inquiry";
      const message = payload.message || payload.address || (studentName ? "Application for " + studentName : "Admission Inquiry");

      let clientErrors = {};
      if (!parentName || parentName.length < 2) {
        clientErrors.parentName = "Please enter parent / guardian name (at least 2 letters).";
      }
      if (!phone || phone.replace(/\D/g, "").length < 8) {
        clientErrors.phone = "Please enter a valid mobile / WhatsApp number.";
      }
      if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        clientErrors.email = "Please enter a valid email address.";
      }
      if (!message || message.length < 4) {
        clientErrors.message = "Please provide details or a brief message.";
      }

      // Display client-side errors if any
      if (Object.keys(clientErrors).length > 0) {
        for (const [fieldKey, errMsg] of Object.entries(clientErrors)) {
          const inputEl = formEl.querySelector(`[name="${fieldKey}"]`) || formEl.querySelector(`#${fieldKey}`);
          if (inputEl) inputEl.classList.add("has-error");
          const errEl = formEl.querySelector(`#${fieldKey}-error`);
          if (errEl) {
            errEl.textContent = errMsg;
            errEl.classList.add("is-visible");
          }
        }
        if (window.HESToast) {
          window.HESToast.error("Please fill in all required fields accurately.");
        }
        return;
      }

      // 2. Submit to Server
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.setAttribute("aria-busy", "true");
        submitBtn.innerHTML = "Sending Inquiry... <span class='spinner' aria-hidden='true'>⏳</span>";
      }

      // Read Turnstile token if widget exists
      const turnstileInput = formEl.querySelector('[name="cf-turnstile-response"]');
      if (turnstileInput) {
        payload["cf-turnstile-response"] = turnstileInput.value;
      }

      try {
        const endpoint = (window.SITE_URL || "") + "/api/inquiry";
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json().catch(() => ({}));

        if (response.ok && result.success) {
          // Success
          formEl.reset();

          if (window.HESToast) {
            window.HESToast.success(result.message || "Assalam-o-Alaikum! Your inquiry has been received. Our administration will contact you shortly.");
          } else {
            alert(result.message || "Thank you! Your inquiry has been received.");
          }

          if (window.HESAnalytics) {
            window.HESAnalytics.track("inquiry_submit", {
              form: formType,
              class: classApplying
            });
          }

          // Trigger success modal if present on admission page
          const successModal = document.querySelector("#admission-success-modal");
          if (successModal) successModal.classList.add("active");

          // Reset Turnstile widget if available
          if (window.turnstile && typeof window.turnstile.reset === 'function') {
            try { window.turnstile.reset(); } catch (e) {}
          }
        } else {
          // Server returned validation or rate limit error
          const errMsg = result.error || "Unable to send inquiry. Please try again.";
          if (window.HESToast) {
            window.HESToast.error(errMsg);
          } else {
            alert(errMsg);
          }

          // Display specific server validation errors if returned
          if (result.errors) {
            for (const [fieldKey, errText] of Object.entries(result.errors)) {
              const inputEl = formEl.querySelector(`[name="${fieldKey}"]`) || formEl.querySelector(`#${fieldKey}`);
              if (inputEl) inputEl.classList.add("has-error");
              const errEl = formEl.querySelector(`#${fieldKey}-error`);
              if (errEl) {
                errEl.textContent = errText;
                errEl.classList.add("is-visible");
              }
            }
          }
        }
      } catch (err) {
        // Network or fetch failure - preserve all input values!
        console.error("[HES Form Error]", err);
        const fallbackMsg = "Network error connecting to the server. Please check your connection or contact us directly at +92 314 5075399.";
        if (window.HESToast) {
          window.HESToast.error(fallbackMsg);
        } else {
          alert(fallbackMsg);
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.removeAttribute("aria-busy");
          submitBtn.innerHTML = originalBtnHtml;
        }
      }
    });
  }

  setupFormHandler(document.querySelector("#admissionForm"), "admission-form");
  setupFormHandler(document.querySelector("#contactForm"), "contact-form");

  // Success Modal Close Handlers
  const modalCloseBtns = document.querySelectorAll(".modal-close-trigger");
  modalCloseBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const modal = btn.closest(".lightbox-modal");
      if (modal) modal.classList.remove("active");
    });
  });
}

/* ==========================================================================
   11. VISION & MISSION PARALLAX (Obsolete — section is fully static)
   ========================================================================== */
function initVisionMissionParallax() {
  // Static: Learning Pathway section has zero JavaScript animations
}

/* ==========================================================================
   12. OUR MISSION & VISION (ARCH MOTIF & SCROLL TEXT FILL)
   ========================================================================== */
function initMissionVisionSection() {
  const mvSection = document.getElementById("mission-vision");
  if (!mvSection) return;

  const statementEl = document.getElementById("mvVisionStatement");
  const cardsWrapper = document.getElementById("mvCardsWrapper");
  const cards = Array.from(mvSection.querySelectorAll(".mv-card"));
  const dots = Array.from(mvSection.querySelectorAll(".mv-dot"));
  const words = statementEl ? Array.from(statementEl.querySelectorAll(".mv-word")) : [];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Reduced motion: show all words fully white and all cards visible immediately
  if (reducedMotion) {
    words.forEach(w => { w.style.opacity = "1"; });
    cards.forEach(c => c.classList.add("is-visible"));
    return;
  }

  // --- A. SCROLL TEXT FILL ANIMATION ---
  if (statementEl && words.length) {
    statementEl.classList.add("mv-text-fill-active");
    const numWords = words.length;
    let isIntersecting = false;
    let ticking = false;

    const updateScrollFill = () => {
      ticking = false;
      const rect = statementEl.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;

      // Start filling when statement enters comfortable view (bottom <= 90% vh)
      // Fully white when statement bottom reaches 40% of viewport height (bottom <= 40% vh)
      const startPoint = vh * 0.90;
      const endPoint = vh * 0.40;

      let progress = 0;
      if (rect.bottom <= endPoint) {
        progress = 1;
      } else if (rect.bottom >= startPoint) {
        progress = 0;
      } else {
        const totalDistance = startPoint - endPoint;
        const currentDistance = startPoint - rect.bottom;
        progress = Math.max(0, Math.min(1, currentDistance / totalDistance));
      }

      // Smoothly update opacity of words sequentially (works in both directions)
      for (let i = 0; i < numWords; i++) {
        const wordStart = i / numWords;
        const wordEnd = (i + 1) / numWords;
        let wordProgress = 0;
        if (progress >= wordEnd) {
          wordProgress = 1;
        } else if (progress <= wordStart) {
          wordProgress = 0;
        } else {
          wordProgress = (progress - wordStart) / (wordEnd - wordStart);
        }
        const opacity = (0.35 + 0.65 * wordProgress).toFixed(2);
        words[i].style.opacity = opacity;
      }
    };

    const onScroll = () => {
      if (!ticking && isIntersecting) {
        ticking = true;
        window.requestAnimationFrame(updateScrollFill);
      }
    };

    if ("IntersectionObserver" in window) {
      const fillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isIntersecting = entry.isIntersecting;
          if (isIntersecting) {
            updateScrollFill();
          }
        });
      }, {
        threshold: 0,
        rootMargin: "100px 0px 100px 0px"
      });
      fillObserver.observe(mvSection);
    } else {
      isIntersecting = true;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => {
      if (isIntersecting) updateScrollFill();
    }, { passive: true });

    // Initial calculation on page load
    updateScrollFill();
  }

  // --- B. ARCH CARDS FADE-UP STAGGER (120ms stagger) ---
  if (cards.length) {
    if ("IntersectionObserver" in window) {
      const cardsObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            cards.forEach((card, idx) => {
              window.setTimeout(() => {
                card.classList.add("is-visible");
              }, idx * 120);
            });
            obs.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px"
      });

      if (cardsWrapper) {
        cardsObserver.observe(cardsWrapper);
      } else {
        cards.forEach(c => cardsObserver.observe(c));
      }
    } else {
      cards.forEach(c => c.classList.add("is-visible"));
    }
  }

  // --- C. MOBILE SWIPE & PAGINATION DOTS ---
  if (cardsWrapper && dots.length && cards.length) {
    let scrollTicking = false;

    const updateActiveDot = () => {
      scrollTicking = false;
      const scrollLeft = cardsWrapper.scrollLeft;
      let closestIdx = 0;
      let minDiff = Infinity;

      cards.forEach((card, idx) => {
        const cardLeft = card.offsetLeft - cardsWrapper.offsetLeft - 24;
        const diff = Math.abs(scrollLeft - cardLeft);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
      });

      dots.forEach((dot, idx) => {
        const isActive = idx === closestIdx;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-selected", isActive ? "true" : "false");
      });
    };

    cardsWrapper.addEventListener("scroll", () => {
      if (!scrollTicking) {
        scrollTicking = true;
        window.requestAnimationFrame(updateActiveDot);
      }
    }, { passive: true });

    dots.forEach((dot, idx) => {
      dot.addEventListener("click", () => {
        const targetCard = cards[idx];
        if (targetCard) {
          const targetOffset = targetCard.offsetLeft - cardsWrapper.offsetLeft - 24;
          cardsWrapper.scrollTo({
            left: targetOffset,
            behavior: "smooth"
          });
        }
      });
    });
  }
}

/* ==========================================================================
   ADMISSION ROADMAP — ANIMATED WINDING PATH & STATIONS
   ========================================================================== */
function initAdmissionRoadmap() {
  const roadmapSection = document.getElementById("admission-roadmap");
  if (!roadmapSection) return;

  const stage = document.getElementById("ar-stage");
  const desktopSvg = document.getElementById("ar-desktop-svg");
  const trackPath = document.getElementById("ar-svg-track");
  const fillPath = document.getElementById("ar-svg-fill");
  const marker = document.getElementById("ar-svg-marker");
  const mobileFill = document.getElementById("ar-mobile-rail-fill");
  const mobileMarker = document.getElementById("ar-mobile-rail-marker");
  const stations = Array.from(roadmapSection.querySelectorAll(".ar-station"));
  const cards = Array.from(roadmapSection.querySelectorAll(".ar-card"));
  const ctaBlock = document.getElementById("ar-cta-block");
  const ctaBtn = document.getElementById("ar-cta-btn");

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Ensure all cards are visible immediately
  cards.forEach(card => card.classList.add("is-visible"));

  let pathTotalLength = 0;

  function updateDesktopPathGeometry() {
    if (window.innerWidth <= 768 || !stage || !trackPath || !fillPath || !desktopSvg) return;

    const stageRect = stage.getBoundingClientRect();
    if (stageRect.width <= 0 || stageRect.height <= 0) return;

    const nodeCoords = [];
    for (let i = 1; i <= 4; i++) {
      const nodeEl = document.getElementById(`ar-node-${i}`);
      if (nodeEl) {
        const nr = nodeEl.getBoundingClientRect();
        const cx = nr.left + nr.width / 2 - stageRect.left;
        const cy = nr.top + nr.height / 2 - stageRect.top;
        nodeCoords.push({ x: cx, y: cy });
      }
    }

    if (nodeCoords.length < 4) return;

    const w = stageRect.width;
    const h = stageRect.height;
    desktopSvg.setAttribute("viewBox", `0 0 ${w} ${h}`);

    const [n1, n2, n3, n4] = nodeCoords;

    const startY = Math.max(10, n1.y - 45);
    const endX = w * 0.5;
    const endY = h;

    const d = [
      `M ${n1.x} ${startY}`,
      `L ${n1.x} ${n1.y}`,
      `C ${n1.x} ${n1.y + (n2.y - n1.y) * 0.52}, ${n2.x} ${n2.y - (n2.y - n1.y) * 0.52}, ${n2.x} ${n2.y}`,
      `C ${n2.x} ${n2.y + (n3.y - n2.y) * 0.52}, ${n3.x} ${n3.y - (n3.y - n2.y) * 0.52}, ${n3.x} ${n3.y}`,
      `C ${n3.x} ${n3.y + (n4.y - n3.y) * 0.52}, ${n4.x} ${n4.y - (n4.y - n3.y) * 0.52}, ${n4.x} ${n4.y}`,
      `C ${n4.x} ${n4.y + Math.min(60, (endY - n4.y) * 0.4)}, ${endX} ${endY - 30}, ${endX} ${endY}`
    ].join(" ");

    trackPath.setAttribute("d", d);
    fillPath.setAttribute("d", d);

    pathTotalLength = fillPath.getTotalLength();
    fillPath.style.strokeDasharray = `${pathTotalLength} ${pathTotalLength}`;
  }

  // Initial calculation after layout render
  setTimeout(updateDesktopPathGeometry, 60);

  // Debounced ResizeObserver to keep path aligned with stations on resize
  let resizeTimer = null;
  if ("ResizeObserver" in window) {
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        updateDesktopPathGeometry();
      }, 75);
    });
    ro.observe(stage);
  }

  // Station thresholds along normalized progress (0.0 to 1.0)
  const thresholds = [
    { start: 0.05, done: 0.28 },
    { start: 0.28, done: 0.52 },
    { start: 0.52, done: 0.76 },
    { start: 0.76, done: 0.95 }
  ];

  function renderRoadmapState(progress) {
    const isMobile = window.innerWidth <= 768;

    if (!isMobile) {
      if (fillPath) {
        if (pathTotalLength <= 0) {
          pathTotalLength = fillPath.getTotalLength();
          fillPath.style.strokeDasharray = `${pathTotalLength} ${pathTotalLength}`;
        }
        if (pathTotalLength > 0) {
          const drawLen = pathTotalLength * progress;
          fillPath.style.strokeDashoffset = `${pathTotalLength - drawLen}`;

          if (marker) {
            if (progress > 0.005) {
              marker.style.display = "block";
              const pt = fillPath.getPointAtLength(Math.min(pathTotalLength, drawLen));
              const lookBehind = Math.max(0, drawLen - 2);
              const lookAhead = Math.min(pathTotalLength, drawLen + 2);
              let angle = 90;
              if (lookAhead > lookBehind) {
                const p1 = fillPath.getPointAtLength(lookBehind);
                const p2 = fillPath.getPointAtLength(lookAhead);
                angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
              }
              marker.setAttribute("transform", `translate(${pt.x.toFixed(1)}, ${pt.y.toFixed(1)}) rotate(${angle.toFixed(1)})`);
            } else {
              marker.style.display = "none";
            }
          }
        }
      }
    } else {
      if (mobileFill) {
        mobileFill.style.height = `${(progress * 100).toFixed(1)}%`;
      }
      if (mobileMarker) {
        if (progress > 0.005) {
          mobileMarker.style.display = "flex";
          mobileMarker.style.top = `${(progress * 100).toFixed(1)}%`;
        } else {
          mobileMarker.style.display = "none";
        }
      }
    }

    stations.forEach((st, idx) => {
      const th = thresholds[idx];
      if (progress < th.start) {
        st.classList.add("is-upcoming");
        st.classList.remove("is-active", "is-completed");
        st.removeAttribute("aria-current");
      } else if (progress >= th.start && progress < th.done) {
        st.classList.add("is-active");
        st.classList.remove("is-upcoming", "is-completed");
        st.setAttribute("aria-current", "step");
      } else {
        st.classList.add("is-completed");
        st.classList.remove("is-upcoming", "is-active");
        st.removeAttribute("aria-current");
      }
    });

    if (ctaBlock) {
      if (progress >= 0.92) {
        ctaBlock.classList.add("is-visible");
        if (ctaBtn) ctaBtn.classList.add("shine-triggered");
      } else {
        ctaBlock.classList.remove("is-visible");
        if (ctaBtn) ctaBtn.classList.remove("shine-triggered");
      }
    }
  }

  // Reduced motion: show full completed path immediately with no animation
  if (reducedMotion) {
    if (fillPath) fillPath.style.strokeDashoffset = "0";
    if (marker) marker.style.display = "none";
    if (mobileFill) mobileFill.style.height = "100%";
    if (mobileMarker) mobileMarker.style.display = "none";
    if (ctaBlock) ctaBlock.classList.add("is-visible");
    stations.forEach((st, idx) => {
      st.classList.remove("is-upcoming", "is-active");
      st.classList.add("is-completed");
      if (idx === stations.length - 1) st.setAttribute("aria-current", "step");
    });
    return;
  }

  // Scroll-Driven Lockstep Animation
  function updateScrollProgress() {
    if (!stage) return;
    const stageRect = stage.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;

    // Start progress when stage enters viewport (at 68% of viewport height)
    // Complete progress when stage bottom reaches 32% of viewport height
    const startY = vh * 0.68;
    const endY = vh * 0.32;
    const totalTravel = stageRect.height + (startY - endY);

    if (totalTravel <= 0) return;

    const currentTravel = startY - stageRect.top;
    let progress = currentTravel / totalTravel;
    progress = Math.max(0, Math.min(1, progress));

    renderRoadmapState(progress);
  }

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateScrollProgress();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    updateDesktopPathGeometry();
    onScroll();
  }, { passive: true });

  // Initial synchronization with current scroll position
  setTimeout(() => {
    updateDesktopPathGeometry();
    updateScrollProgress();
  }, 80);
}

/* ==========================================================================
   16. FACULTY MOBILE AUTO-SWIPING CAROUSEL
   ========================================================================== */
function initFacultyMobileCarousel() {
  const wrapper = document.getElementById("facultyCarouselWrapper");
  const grid = document.getElementById("facultyGrid");
  const dotsContainer = document.getElementById("facultyDots");
  if (!wrapper || !grid) return;

  const cards = Array.from(grid.querySelectorAll(".faculty-card"));
  const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll(".faculty-dot")) : [];
  if (!cards.length) return;

  const isMobile = () => window.innerWidth <= 768;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let autoSwipeTimer = null;
  let resumeTimer = null;
  let isInteracting = false;
  let isVisible = false;
  let activeIndex = 0;
  const SWIPE_INTERVAL = 3200; // 3.2s per card
  const RESUME_DELAY = 3800;   // 3.8s idle buffer before resuming

  function getCardScrollLeft(index) {
    const card = cards[index];
    if (!card) return 0;
    const containerWidth = grid.clientWidth;
    const cardWidth = card.offsetWidth;
    const cardLeft = card.offsetLeft - grid.offsetLeft;
    const target = cardLeft - (containerWidth - cardWidth) / 2;
    const maxScroll = grid.scrollWidth - grid.clientWidth;
    return Math.max(0, Math.min(target, maxScroll));
  }

  function updateActiveState(newIndex) {
    activeIndex = newIndex;
    cards.forEach((card, idx) => {
      const isActive = idx === activeIndex;
      card.classList.toggle("is-card-active", isActive);
      card.setAttribute("aria-current", isActive ? "true" : "false");
    });
    dots.forEach((dot, idx) => {
      const isActive = idx === activeIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  }

  function getClosestCardIndex() {
    const containerCenter = grid.scrollLeft + grid.clientWidth / 2;
    let closestIdx = 0;
    let minDiff = Infinity;
    cards.forEach((card, idx) => {
      const cardCenter = (card.offsetLeft - grid.offsetLeft) + card.offsetWidth / 2;
      const diff = Math.abs(containerCenter - cardCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });
    return closestIdx;
  }

  function advanceNext() {
    if (!isMobile() || reducedMotion.matches || isInteracting || !isVisible) return;
    let nextIndex = activeIndex + 1;
    if (nextIndex >= cards.length) {
      nextIndex = 0;
    }
    scrollToCard(nextIndex);
  }

  function scrollToCard(index) {
    if (!cards[index]) return;
    updateActiveState(index);
    const targetLeft = getCardScrollLeft(index);
    grid.scrollTo({
      left: targetLeft,
      behavior: "smooth"
    });
  }

  function startAutoSwipe() {
    stopAutoSwipe();
    if (!isMobile() || reducedMotion.matches || !isVisible) return;
    autoSwipeTimer = window.setInterval(advanceNext, SWIPE_INTERVAL);
  }

  function stopAutoSwipe() {
    if (autoSwipeTimer) {
      window.clearInterval(autoSwipeTimer);
      autoSwipeTimer = null;
    }
  }

  function pauseAndScheduleResume() {
    stopAutoSwipe();
    if (resumeTimer) {
      window.clearTimeout(resumeTimer);
      resumeTimer = null;
    }
    if (!isMobile() || reducedMotion.matches) return;
    resumeTimer = window.setTimeout(() => {
      isInteracting = false;
      if (isVisible) startAutoSwipe();
    }, RESUME_DELAY);
  }

  // Pointer & Touch interactions (pause on touch, resume on release)
  const onInteractionStart = () => {
    isInteracting = true;
    stopAutoSwipe();
  };

  const onInteractionEnd = () => {
    pauseAndScheduleResume();
  };

  grid.addEventListener("touchstart", onInteractionStart, { passive: true });
  grid.addEventListener("touchend", onInteractionEnd, { passive: true });
  grid.addEventListener("touchcancel", onInteractionEnd, { passive: true });
  grid.addEventListener("pointerdown", onInteractionStart, { passive: true });
  grid.addEventListener("pointerup", onInteractionEnd, { passive: true });
  grid.addEventListener("pointercancel", onInteractionEnd, { passive: true });
  grid.addEventListener("focusin", onInteractionStart);
  grid.addEventListener("focusout", onInteractionEnd);

  // Manual scroll sync for dots & card active highlighting
  let scrollTicking = false;
  grid.addEventListener("scroll", () => {
    if (!isMobile()) return;
    if (!scrollTicking) {
      scrollTicking = true;
      window.requestAnimationFrame(() => {
        scrollTicking = false;
        const currentIdx = getClosestCardIndex();
        if (currentIdx !== activeIndex) {
          updateActiveState(currentIdx);
        }
      });
    }
  }, { passive: true });

  // Pagination dots click handler
  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      isInteracting = true;
      scrollToCard(idx);
      pauseAndScheduleResume();
    });
  });

  // Keyboard navigation when grid focused
  grid.addEventListener("keydown", (e) => {
    if (!isMobile()) return;
    if (e.key === "ArrowRight") {
      isInteracting = true;
      let nextIdx = Math.min(cards.length - 1, activeIndex + 1);
      scrollToCard(nextIdx);
      pauseAndScheduleResume();
    } else if (e.key === "ArrowLeft") {
      isInteracting = true;
      let prevIdx = Math.max(0, activeIndex - 1);
      scrollToCard(prevIdx);
      pauseAndScheduleResume();
    }
  });

  // IntersectionObserver: auto-swipe runs only when faculty section is in viewport
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          if (isMobile() && !reducedMotion.matches && !isInteracting) {
            startAutoSwipe();
          }
        } else {
          stopAutoSwipe();
        }
      });
    }, { threshold: 0.15 });
    observer.observe(wrapper);
  } else {
    isVisible = true;
    if (isMobile()) startAutoSwipe();
  }

  // Handle visibility changes (browser tab switched away / back)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoSwipe();
    } else if (isMobile() && !reducedMotion.matches && isVisible && !isInteracting) {
      startAutoSwipe();
    }
  });

  // Viewport resize breakpoint handling
  const mql = window.matchMedia("(max-width: 768px)");
  const handleBreakpointChange = (e) => {
    if (e.matches) {
      updateActiveState(0);
      if (isVisible && !reducedMotion.matches) startAutoSwipe();
    } else {
      stopAutoSwipe();
      if (resumeTimer) window.clearTimeout(resumeTimer);
      grid.scrollLeft = 0;
      cards.forEach(c => {
        c.classList.remove("is-card-active");
        c.removeAttribute("aria-current");
      });
    }
  };
  mql.addEventListener("change", handleBreakpointChange);

  // Reduced motion preference changes
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) {
      stopAutoSwipe();
    } else if (isMobile() && isVisible && !isInteracting) {
      startAutoSwipe();
    }
  });

  // Initial setup
  if (isMobile()) {
    updateActiveState(0);
  }
}

/* ==========================================================================
   16. OUR JOURNEY SINCE 2017 (THE YEAR RAIL)
   ========================================================================== */
function initYearRail() {
  const section = document.getElementById("journey-section");
  if (!section) return;

  // 1. Dynamic Year Calculation: [N] years of Quran and modern education
  const calcYearsEl = document.getElementById("journeyYearsCalc");
  if (calcYearsEl) {
    const currentYear = new Date().getFullYear();
    calcYearsEl.textContent = String(Math.max(1, currentYear - 2017));
  }

  // 2. Elements & References
  const header = section.querySelector(".yr-header");
  const railFill = document.getElementById("yrRailFill");
  const markers = Array.from(section.querySelectorAll(".yr-marker"));
  const chips = Array.from(section.querySelectorAll(".yr-chip"));
  const dots = Array.from(section.querySelectorAll(".yr-dot"));
  const prevBtn = document.getElementById("yrPrevBtn");
  const nextBtn = document.getElementById("yrNextBtn");
  const mobPrevBtn = document.getElementById("yrMobPrevBtn");
  const mobNextBtn = document.getElementById("yrMobNextBtn");
  const counterEl = document.getElementById("yrCounter");
  const giantYearEl = document.getElementById("yrGiantYear");
  const titleEl = document.getElementById("yrSlideTitle");
  const descEl = document.getElementById("yrSlideDesc");
  const shapeWrap = document.getElementById("yrShapeWrap");
  const panel = document.getElementById("yrStoryPanel");

  // Inline SVG line-art shapes conforming to strict rules (viewBox 0 0 360 380, baseline at y=370)
  const SHAPES = {
    foundation: `
      <svg viewBox="0 0 360 380" class="yr-shape-svg" aria-hidden="true" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
        <line class="yr-draw-elem" x1="0" y1="370" x2="360" y2="370" stroke="rgba(255, 255, 255, 0.35)" vector-effect="non-scaling-stroke" pathLength="1" />
        <rect class="yr-draw-elem" x="30" y="330" width="300" height="40" stroke="rgba(255, 255, 255, 0.45)" vector-effect="non-scaling-stroke" pathLength="1" />
        <rect class="yr-draw-elem" x="70" y="282" width="220" height="48" stroke="rgba(255, 255, 255, 0.32)" vector-effect="non-scaling-stroke" pathLength="1" />
        <rect class="yr-draw-elem" x="110" y="240" width="140" height="42" stroke="rgba(255, 255, 255, 0.22)" vector-effect="non-scaling-stroke" pathLength="1" />
        <path class="yr-draw-elem yr-faint-fill" d="M150 240 V200 A30 30 0 0 1 210 200 V240" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255, 255, 255, 0.65)" vector-effect="non-scaling-stroke" pathLength="1" />
      </svg>`,
    growth: `
      <svg viewBox="0 0 360 380" class="yr-shape-svg" aria-hidden="true" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
        <line class="yr-draw-elem" x1="0" y1="370" x2="360" y2="370" stroke="rgba(255, 255, 255, 0.35)" vector-effect="non-scaling-stroke" pathLength="1" />
        <path class="yr-draw-elem" d="M30 370 V280 A50 50 0 0 1 130 280 V370" stroke="rgba(255, 255, 255, 0.30)" vector-effect="non-scaling-stroke" pathLength="1" />
        <path class="yr-draw-elem" d="M114 370 V198 A58 58 0 0 1 230 198 V370" stroke="rgba(255, 255, 255, 0.45)" vector-effect="non-scaling-stroke" pathLength="1" />
        <path class="yr-draw-elem yr-faint-fill" d="M214 370 V98 A58 58 0 0 1 330 98 V370" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255, 255, 255, 0.65)" vector-effect="non-scaling-stroke" pathLength="1" />
      </svg>`,
    care: `
      <svg viewBox="0 0 360 380" class="yr-shape-svg" aria-hidden="true" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
        <line class="yr-draw-elem" x1="0" y1="370" x2="360" y2="370" stroke="rgba(255, 255, 255, 0.35)" vector-effect="non-scaling-stroke" pathLength="1" />
        <path class="yr-draw-elem yr-faint-fill" d="M144 370 V318 A36 36 0 0 1 216 318 V370" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255, 255, 255, 0.80)" vector-effect="non-scaling-stroke" pathLength="1" />
        <circle class="yr-draw-elem yr-faint-fill" cx="180" cy="250" r="22" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255, 255, 255, 0.80)" vector-effect="non-scaling-stroke" pathLength="1" />
        <path class="yr-draw-elem" d="M70 370 V150 A110 110 0 0 1 290 150 V370" stroke="rgba(255, 255, 255, 0.18)" vector-effect="non-scaling-stroke" pathLength="1" />
        <path class="yr-draw-elem" d="M30 370 V150 A150 150 0 0 1 330 150 V370" stroke="rgba(255, 255, 255, 0.28)" vector-effect="non-scaling-stroke" pathLength="1" />
      </svg>`,
    ahead: `
      <svg viewBox="0 0 360 380" class="yr-shape-svg" aria-hidden="true" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
        <line class="yr-draw-elem" x1="0" y1="370" x2="360" y2="370" stroke="rgba(255, 255, 255, 0.35)" vector-effect="non-scaling-stroke" pathLength="1" />
        <line class="yr-draw-elem" x1="120" y1="340" x2="240" y2="340" stroke="rgba(255, 255, 255, 0.12)" vector-effect="non-scaling-stroke" pathLength="1" />
        <line class="yr-draw-elem" x1="80" y1="320" x2="280" y2="320" stroke="rgba(255, 255, 255, 0.20)" vector-effect="non-scaling-stroke" pathLength="1" />
        <line class="yr-draw-elem" x1="30" y1="300" x2="330" y2="300" stroke="rgba(255, 255, 255, 0.35)" vector-effect="non-scaling-stroke" pathLength="1" />
        <path class="yr-draw-elem yr-faint-fill" d="M100 300 A80 80 0 0 1 260 300" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.65)" vector-effect="non-scaling-stroke" pathLength="1" />
        <line class="yr-draw-elem" x1="96.9" y1="252" x2="70.9" y2="237" stroke="rgba(255, 255, 255, 0.45)" vector-effect="non-scaling-stroke" pathLength="1" />
        <line class="yr-draw-elem" x1="132" y1="216.9" x2="117" y2="190.9" stroke="rgba(255, 255, 255, 0.45)" vector-effect="non-scaling-stroke" pathLength="1" />
        <line class="yr-draw-elem" x1="180" y1="204" x2="180" y2="174" stroke="rgba(255, 255, 255, 0.45)" vector-effect="non-scaling-stroke" pathLength="1" />
        <line class="yr-draw-elem" x1="228" y1="216.9" x2="243" y2="190.9" stroke="rgba(255, 255, 255, 0.45)" vector-effect="non-scaling-stroke" pathLength="1" />
        <line class="yr-draw-elem" x1="263.1" y1="252" x2="289.1" y2="237" stroke="rgba(255, 255, 255, 0.45)" vector-effect="non-scaling-stroke" pathLength="1" />
        <path class="yr-draw-elem" d="M30 370 V150 A150 150 0 0 1 330 150 V370" stroke="rgba(255, 255, 255, 0.28)" vector-effect="non-scaling-stroke" pathLength="1" />
      </svg>`,
    default: `
      <svg viewBox="0 0 360 380" class="yr-shape-svg" aria-hidden="true" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
        <line class="yr-draw-elem" x1="0" y1="370" x2="360" y2="370" stroke="rgba(255, 255, 255, 0.35)" vector-effect="non-scaling-stroke" pathLength="1" />
        <path class="yr-draw-elem" d="M110 370 V170 A70 70 0 0 1 250 170 V370" stroke="rgba(255, 255, 255, 0.50)" vector-effect="non-scaling-stroke" pathLength="1" />
        <path class="yr-draw-elem" d="M80 370 V160 A100 100 0 0 1 280 160 V370" stroke="rgba(255, 255, 255, 0.38)" vector-effect="non-scaling-stroke" pathLength="1" />
        <path class="yr-draw-elem" d="M50 370 V150 A130 130 0 0 1 310 150 V370" stroke="rgba(255, 255, 255, 0.28)" vector-effect="non-scaling-stroke" pathLength="1" />
      </svg>`
  };

  function renderShape(shapeKey, photoUrl) {
    if (!shapeWrap) return;
    if (photoUrl) {
      shapeWrap.innerHTML = `
        <div class="yr-arch-photo-frame" style="width:100%;height:100%;border-radius:180px 180px 0 0;overflow:hidden;border:1px solid rgba(255,255,255,0.35);">
          <img src="${photoUrl}" alt="" style="width:100%;height:100%;object-fit:cover;" />
        </div>
      `;
      return;
    }

    const svgHtml = SHAPES[shapeKey] || SHAPES["default"];
    shapeWrap.innerHTML = svgHtml;

    const svg = shapeWrap.querySelector(".yr-shape-svg");
    if (svg) {
      if (reducedMotion.matches) {
        svg.classList.remove("is-drawing");
      } else {
        svg.classList.add("is-drawing");
      }
    }
  }

  // 3. Exact Milestones Content (Strict preservation of dates and facts)
  const milestones = [
    {
      year: "2017",
      giantYear: "2017",
      titleEn: "Foundation",
      titleUr: "قیام",
      descEn: "Founded in Balkasar, Chakwal with the vision to integrate Quranic education with modern schooling.",
      descUr: "بلکسر چکوال میں قرآنی و جدید تعلیم کے ویژن کے ساتھ اسکول کا آغاز۔",
      shape: "foundation"
    },
    {
      year: "Growth",
      giantYear: "Growth",
      titleEn: "Learning Together",
      titleUr: "مل کر سیکھنا",
      descEn: "Building a supportive learning environment that brings Quranic education and modern academics together.",
      descUr: "ایک معاون تعلیمی ماحول کا قیام جو قرآنی تعلیم اور جدید علوم کو یکجا کرے۔",
      shape: "growth"
    },
    {
      year: "Care",
      giantYear: "Care",
      titleEn: "Whole-Student Growth",
      titleUr: "طلبہ کی ہمہ جہت نشوونما",
      descEn: "Encouraging students to grow through character building, active participation, and supportive guidance.",
      descUr: "کردار سازی، سرگرمیوں میں شمولیت اور رہنمائی کے ذریعے طلبہ کی جامع نشوونما۔",
      shape: "care"
    },
    {
      year: "Today",
      giantYear: "Today",
      titleEn: "Looking Ahead",
      titleUr: "روشن مستقبل کی جانب",
      descEn: "Continuing our commitment to meaningful learning, strong values, and preparing students for the future.",
      descUr: "بامقصد تعلیم، مضبوط اقدار اور طلبہ کو روشن مستقبل کے لیے تیار رکھنے کا غیر متزلزل عزم۔",
      shape: "ahead"
    }
  ];

  let currentIndex = 0;
  let isTransitioning = false;
  let autoAdvanceTimer = null;
  let userHasInteracted = false;
  let isSectionInView = false;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // 4. Update the rail fill line (using transform: scaleX)
  function updateRailFill(index) {
    if (!railFill) return;
    const total = milestones.length;
    if (total <= 1) {
      railFill.style.transform = "scaleX(0)";
      return;
    }

    const activeMarker = markers[index];
    const railLine = railFill.parentElement;
    if (activeMarker && railLine) {
      const circle = activeMarker.querySelector(".yr-marker-circle");
      const circleRect = circle ? circle.getBoundingClientRect() : activeMarker.getBoundingClientRect();
      const lineRect = railLine.getBoundingClientRect();
      if (lineRect.width > 0) {
        const centerOffset = (circleRect.left + circleRect.width / 2) - lineRect.left;
        const progress = Math.max(0, Math.min(1, centerOffset / lineRect.width));
        railFill.style.transform = `scaleX(${progress})`;
        return;
      }
    }
    const ratio = index / (total - 1);
    railFill.style.transform = `scaleX(${ratio})`;
  }

  // 5. Update marker, chip, dot and tab states
  function updateTabsAndControls(index) {
    // Markers
    markers.forEach((marker, i) => {
      const isActive = i === index;
      marker.classList.toggle("is-active", isActive);
      marker.setAttribute("aria-selected", isActive ? "true" : "false");
      marker.tabIndex = isActive ? 0 : -1;
    });

    // Mobile Chips
    chips.forEach((chip, i) => {
      const isActive = i === index;
      chip.classList.toggle("is-active", isActive);
      chip.setAttribute("aria-selected", isActive ? "true" : "false");
      chip.tabIndex = isActive ? 0 : -1;
    });

    // Mobile Dots
    dots.forEach((dot, i) => {
      const isActive = i === index;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    // Counter "01 / 04"
    if (counterEl) {
      const curStr = String(index + 1).padStart(2, "0");
      const totStr = String(milestones.length).padStart(2, "0");
      counterEl.textContent = `${curStr} / ${totStr}`;
    }

    // Story Panel ARIA
    if (panel) {
      panel.setAttribute("aria-labelledby", `yr-tab-${index}`);
    }

    // Rail line fill animation
    updateRailFill(index);
  }

  // 6. Change slide with purposeful animations
  function goToSlide(newIndex, isUserAction = false) {
    if (newIndex === currentIndex && !isTransitioning) return;
    if (isTransitioning) return;

    if (isUserAction) {
      stopAutoAdvancePermanently();
    }

    const data = milestones[newIndex];
    if (!data) return;

    currentIndex = newIndex;
    updateTabsAndControls(newIndex);

    const isUrdu = document.documentElement.getAttribute("lang") === "ur";
    const targetShape = data.shape || (markers[newIndex] ? markers[newIndex].getAttribute("data-shape") : "") || "default";

    if (reducedMotion.matches) {
      // Instant change for prefers-reduced-motion
      if (giantYearEl) giantYearEl.textContent = data.giantYear;
      if (titleEl) {
        titleEl.setAttribute("data-en", data.titleEn);
        titleEl.setAttribute("data-ur", data.titleUr);
        titleEl.textContent = isUrdu ? data.titleUr : data.titleEn;
      }
      if (descEl) {
        descEl.setAttribute("data-en", data.descEn);
        descEl.setAttribute("data-ur", data.descUr);
        descEl.textContent = isUrdu ? data.descUr : data.descEn;
      }
      renderShape(targetShape, data.photo);
      return;
    }

    isTransitioning = true;

    // Outgoing animation: 150ms quick fade out
    if (giantYearEl) giantYearEl.classList.add("yr-fade-out");
    if (titleEl) titleEl.classList.add("yr-fade-out");
    if (descEl) descEl.classList.add("yr-fade-out");
    if (shapeWrap) shapeWrap.classList.add("yr-shape-fade-out");

    window.setTimeout(() => {
      // Update DOM content
      if (giantYearEl) giantYearEl.textContent = data.giantYear;
      if (titleEl) {
        titleEl.setAttribute("data-en", data.titleEn);
        titleEl.setAttribute("data-ur", data.titleUr);
        titleEl.textContent = isUrdu ? data.titleUr : data.titleEn;
      }
      if (descEl) {
        descEl.setAttribute("data-en", data.descEn);
        descEl.setAttribute("data-ur", data.descUr);
        descEl.textContent = isUrdu ? data.descUr : data.descEn;
      }

      // Render new shape and trigger stroke drawing animation
      renderShape(targetShape, data.photo);

      // Remove fade-out classes
      if (giantYearEl) giantYearEl.classList.remove("yr-fade-out");
      if (titleEl) titleEl.classList.remove("yr-fade-out");
      if (descEl) descEl.classList.remove("yr-fade-out");
      if (shapeWrap) {
        shapeWrap.classList.remove("yr-shape-fade-out");
        shapeWrap.classList.add("yr-shape-fade-in");
      }

      // Staggered slide and fade up: 60ms stagger
      if (giantYearEl) {
        giantYearEl.style.animationDelay = "0ms";
        giantYearEl.classList.add("yr-fade-in");
      }
      if (titleEl) {
        titleEl.style.animationDelay = "60ms";
        titleEl.classList.add("yr-fade-in");
      }
      if (descEl) {
        descEl.style.animationDelay = "120ms";
        descEl.classList.add("yr-fade-in");
      }

      window.setTimeout(() => {
        if (giantYearEl) {
          giantYearEl.classList.remove("yr-fade-in");
          giantYearEl.style.animationDelay = "";
        }
        if (titleEl) {
          titleEl.classList.remove("yr-fade-in");
          titleEl.style.animationDelay = "";
        }
        if (descEl) {
          descEl.classList.remove("yr-fade-in");
          descEl.style.animationDelay = "";
        }
        if (shapeWrap) {
          shapeWrap.classList.remove("yr-shape-fade-in");
        }
        isTransitioning = false;
      }, 380);
    }, 150);
  }

  // 7. Auto-advance every 7 seconds
  function startAutoAdvance() {
    if (userHasInteracted || reducedMotion.matches || autoAdvanceTimer) return;
    autoAdvanceTimer = window.setInterval(() => {
      if (!userHasInteracted && isSectionInView) {
        const nextIndex = (currentIndex + 1) % milestones.length;
        goToSlide(nextIndex, false);
      }
    }, 7000);
  }

  function pauseAutoAdvance() {
    if (autoAdvanceTimer) {
      window.clearInterval(autoAdvanceTimer);
      autoAdvanceTimer = null;
    }
  }

  function resumeAutoAdvance() {
    if (!userHasInteracted && !reducedMotion.matches && isSectionInView) {
      startAutoAdvance();
    }
  }

  function stopAutoAdvancePermanently() {
    userHasInteracted = true;
    pauseAutoAdvance();
  }

  // 8. Event Listeners
  // Rail markers
  markers.forEach((marker) => {
    marker.addEventListener("click", () => {
      stopAutoAdvancePermanently();
      const idx = Number.parseInt(marker.getAttribute("data-index"), 10);
      if (!Number.isNaN(idx)) goToSlide(idx, false);
    });
  });

  // Mobile chips
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      stopAutoAdvancePermanently();
      const idx = Number.parseInt(chip.getAttribute("data-index"), 10);
      if (!Number.isNaN(idx)) goToSlide(idx, false);
    });
  });

  // Mobile dots
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      stopAutoAdvancePermanently();
      const idx = Number.parseInt(dot.getAttribute("data-index"), 10);
      if (!Number.isNaN(idx)) goToSlide(idx, false);
    });
  });

  // Arrow buttons
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      stopAutoAdvancePermanently();
      const prevIdx = (currentIndex - 1 + milestones.length) % milestones.length;
      goToSlide(prevIdx, false);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      stopAutoAdvancePermanently();
      const nextIdx = (currentIndex + 1) % milestones.length;
      goToSlide(nextIdx, false);
    });
  }

  // Mobile navigation buttons
  if (mobPrevBtn) {
    mobPrevBtn.addEventListener("click", () => {
      stopAutoAdvancePermanently();
      const prevIdx = (currentIndex - 1 + milestones.length) % milestones.length;
      goToSlide(prevIdx, false);
    });
  }

  if (mobNextBtn) {
    mobNextBtn.addEventListener("click", () => {
      stopAutoAdvancePermanently();
      const nextIdx = (currentIndex + 1) % milestones.length;
      goToSlide(nextIdx, false);
    });
  }

  // Keyboard left/right arrow keys
  section.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      stopAutoAdvancePermanently();
      const isRtl = document.documentElement.getAttribute("dir") === "rtl";
      const targetIdx = isRtl
        ? (currentIndex + 1) % milestones.length
        : (currentIndex - 1 + milestones.length) % milestones.length;
      goToSlide(targetIdx, false);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      stopAutoAdvancePermanently();
      const isRtl = document.documentElement.getAttribute("dir") === "rtl";
      const targetIdx = isRtl
        ? (currentIndex - 1 + milestones.length) % milestones.length
        : (currentIndex + 1) % milestones.length;
      goToSlide(targetIdx, false);
    }
  });

  // Pause on hover / focus, resume on leave (unless user interacted)
  if (panel) {
    panel.addEventListener("pointerenter", pauseAutoAdvance);
    panel.addEventListener("pointerleave", resumeAutoAdvance);
    panel.addEventListener("focusin", pauseAutoAdvance);
    panel.addEventListener("focusout", resumeAutoAdvance);
  }

  // Touch swipe support
  let touchStartX = 0;
  let touchStartY = 0;
  if (panel) {
    panel.addEventListener("touchstart", (e) => {
      if (!e.touches.length) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      pauseAutoAdvance();
    }, { passive: true });

    panel.addEventListener("touchend", (e) => {
      if (!e.changedTouches.length) return;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        stopAutoAdvancePermanently();
        if (diffX < 0) {
          // Swiped left -> next
          const nextIdx = (currentIndex + 1) % milestones.length;
          goToSlide(nextIdx, false);
        } else {
          // Swiped right -> prev
          const prevIdx = (currentIndex - 1 + milestones.length) % milestones.length;
          goToSlide(prevIdx, false);
        }
      } else {
        resumeAutoAdvance();
      }
    }, { passive: true });
  }

  // Window resize: re-align rail fill
  window.addEventListener("resize", () => {
    updateRailFill(currentIndex);
  }, { passive: true });

  // 9. IntersectionObserver: Reveal on first scroll into view & start auto-advance
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isSectionInView = true;
          if (header) header.classList.add("is-visible");
          if (panel) panel.classList.add("is-visible");
          startAutoAdvance();
        } else {
          isSectionInView = false;
          pauseAutoAdvance();
        }
      });
    }, { threshold: 0.15 });

    observer.observe(section);
  } else {
    isSectionInView = true;
    if (header) header.classList.add("is-visible");
    if (panel) panel.classList.add("is-visible");
    startAutoAdvance();
  }

  // Initial layout sync
  updateTabsAndControls(0);
}

/* ==========================================================================
   17. A DAY IN THE LIFE (THE BALANCED DAY BAR)
   ========================================================================== */
function initBalancedDayBar() {
  const section = document.getElementById("day-in-life-section");
  if (!section) return;

  // 1. Periods Data (Existing verbatim content with categories & calculated durations)
  const periods = (window.siteContent && window.siteContent.schedule && window.siteContent.schedule.periods) || [
    {
      time: "07:45 AM",
      title: "Morning Assembly & Quran Recitation",
      titleUr: "صبح کی اسمبلی اور تلاوتِ قرآن",
      desc: "National Anthem, collective Tilawat-e-Quran with Tajweed, and character thought for the day.",
      descUr: "قومی ترانہ، تجوید کے ساتھ اجتماعی تلاوت اور دن کا اخلاقی پیغام۔",
      location: "Assembly Hall",
      locationUr: "اسمبلی ہال",
      category: "Faith & Quran",
      categoryBadge: "FAITH & QURAN",
      categoryBadgeUr: "دینی و قرآنی تعلیم",
      durationMinutes: 30,
      durationText: "30 min",
      durationTextUr: "30 منٹ"
    },
    {
      time: "08:15 AM",
      title: "Quranic Immersion & Hifz Period",
      titleUr: "قرآنی تعلیم و حفظ کا پیریڈ",
      desc: "Fresh morning minds focus on Nazra mastery, memorization circles, and individual Tajweed drills.",
      descUr: "صبح کے تازہ ذہنوں کے ساتھ ناظرہ، حفظ کے حلقہ جات اور انفرادی تجوید کی مشق۔",
      location: "Hifz Sanctuary",
      locationUr: "حفظ ہال",
      category: "Faith & Quran",
      categoryBadge: "FAITH & QURAN",
      categoryBadgeUr: "دینی و قرآنی تعلیم",
      durationMinutes: 90,
      durationText: "1 hr 30 min",
      durationTextUr: "1 گھنٹہ 30 منٹ"
    },
    {
      time: "09:45 AM",
      title: "Mathematics & Science Labs",
      titleUr: "ریاضی اور سائنسی لیبز",
      desc: "Core academic periods: quantitative problem-solving, laboratory demonstrations, and theory.",
      descUr: "بنیادی تعلیمی پیریڈز: ریاضی کے سوالات، لیبارٹری کے عملی مظاہرے اور تھیوری۔",
      location: "Science Lab",
      locationUr: "سائنس لیب",
      category: "Academics",
      categoryBadge: "ACADEMICS",
      categoryBadgeUr: "جدید تعلیمی علوم",
      durationMinutes: 90,
      durationText: "1 hr 30 min",
      durationTextUr: "1 گھنٹہ 30 منٹ"
    },
    {
      time: "11:15 AM",
      title: "Nutritional Break & Outdoor Social Play",
      titleUr: "غذائی وقفہ اور ہم جماعتوں کے ساتھ کھیل",
      desc: "Hygienic snacks, peer bonding, and refreshing outdoor break in secure campus grounds.",
      descUr: "صحت بخش ناشتہ، ساتھیوں کے ساتھ میل جول اور محفوظ گراؤنڈز میں تازہ دم وقفہ۔",
      location: "Campus Grounds",
      locationUr: "کیمپس گراؤنڈ",
      category: "Break",
      categoryBadge: "BREAK",
      categoryBadgeUr: "وقفہ",
      durationMinutes: 30,
      durationText: "30 min",
      durationTextUr: "30 منٹ"
    },
    {
      time: "11:45 AM",
      title: "English, Computer Science & Arts",
      titleUr: "انگریزی، کمپیوٹر سائنس اور خطاطی",
      desc: "Language speaking workshops, computer programming drills, Islamic calligraphy, and social studies.",
      descUr: "انگریزی بول چال کی ورکشاپس، کمپیوٹر پروگرامنگ، اسلامی خطاطی اور سماجی علوم۔",
      location: "Computer Lab",
      locationUr: "کمپیوٹر لیب",
      category: "Academics",
      categoryBadge: "ACADEMICS",
      categoryBadgeUr: "جدید تعلیمی علوم",
      durationMinutes: 105,
      durationText: "1 hr 45 min",
      durationTextUr: "1 گھنٹہ 45 منٹ"
    },
    {
      time: "01:30 PM",
      title: "Congregational Zuhr Prayer & Dismissal",
      titleUr: "نمازِ ظہر باجماعت اور چھٹی",
      desc: "Collective Zuhr prayer in the school mosque followed by orderly transport dispatch.",
      descUr: "اسکول کی مسجد میں باجماعت نمازِ ظہر اور اس کے بعد ٹرانسپورٹ کی منظم روانگی۔",
      location: "School Mosque",
      locationUr: "اسکول مسجد",
      category: "Faith & Quran",
      categoryBadge: "FAITH & QURAN",
      categoryBadgeUr: "دینی و قرآنی تعلیم",
      durationMinutes: 30,
      durationText: "30 min",
      durationTextUr: "30 منٹ"
    }
  ];

  // 2. Elements & References
  const desktopBar = document.getElementById("bdDayBar");
  const desktopSegments = Array.from(section.querySelectorAll(".bd-segment"));
  const notch = document.getElementById("bdNotch");
  const panel = document.getElementById("bdDetailPanel");
  const giantTimeEl = document.getElementById("bdGiantTime");
  const titleEl = document.getElementById("bdPanelTitle");
  const descEl = document.getElementById("bdPanelDesc");
  const catBadgeEl = document.getElementById("bdCatBadge");
  const locationEl = document.getElementById("bdLocationText");
  const durationEl = section.querySelector(".bd-duration-num");
  const prevBtn = document.getElementById("bdPrevBtn");
  const nextBtn = document.getElementById("bdNextBtn");
  const counterEl = document.getElementById("bdCounter");
  const playBtn = document.getElementById("bdPlayBtn");

  let currentPeriodIndex = 0;
  let isTransitioning = false;
  let isPlaying = false;
  let playTimer = null;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // 3. Proportional Width Calculation (Responsive across Mobile & Desktop)
  function calculateSegmentWidths() {
    if (!desktopBar) return;
    const containerWidth = desktopBar.clientWidth;
    if (!containerWidth) return;

    const isMobile = window.innerWidth <= 768;
    const gap = 3;
    const totalGaps = (periods.length - 1) * gap;
    const availableWidth = containerWidth - totalGaps;
    const totalMinutes = periods.reduce((sum, p) => sum + p.durationMinutes, 0);

    // Minimum width per segment: on mobile screens 36-44px, on desktop 88px
    const minWidth = isMobile ? (containerWidth < 380 ? 36 : 44) : 88;

    let assigned = periods.map(p => Math.floor((p.durationMinutes / totalMinutes) * availableWidth));
    let fixedTotal = 0;
    let flexMinutes = 0;

    periods.forEach((p, i) => {
      if (assigned[i] < minWidth) {
        assigned[i] = minWidth;
        fixedTotal += minWidth;
      } else {
        flexMinutes += p.durationMinutes;
      }
    });

    if (flexMinutes > 0 && availableWidth > fixedTotal) {
      const remaining = availableWidth - fixedTotal;
      periods.forEach((p, i) => {
        if (assigned[i] > minWidth) {
          assigned[i] = Math.floor((p.durationMinutes / flexMinutes) * remaining);
        }
      });
    }

    desktopSegments.forEach((seg, i) => {
      seg.style.flex = `0 0 ${assigned[i]}px`;
      seg.style.width = `${assigned[i]}px`;
    });

    updateNotchPosition(currentPeriodIndex);
  }

  // 4. Sliding Notch Positioning
  function updateNotchPosition(index) {
    if (!notch || !panel || !desktopSegments[index]) return;
    const activeSeg = desktopSegments[index];
    const segRect = activeSeg.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    if (panelRect.width <= 0) return;

    const segCenter = segRect.left + segRect.width / 2;
    const notchOffset = segCenter - panelRect.left - 9; // 9px = half notch width (border 9px)
    notch.style.transform = `translateX(${Math.max(8, Math.min(panelRect.width - 24, notchOffset))}px)`;
  }

  // 5. Change Active Period
  function goToPeriod(newIndex, isUserAction = false) {
    if (newIndex === currentPeriodIndex && !isTransitioning) return;
    if (isTransitioning) return;

    if (isUserAction) {
      stopAutoPlay();
    }

    const p = periods[newIndex];
    if (!p) return;

    currentPeriodIndex = newIndex;

    // Update segments tab state
    desktopSegments.forEach((seg, i) => {
      const isActive = i === newIndex;
      seg.classList.toggle("is-active", isActive);
      seg.setAttribute("aria-selected", isActive ? "true" : "false");
      seg.tabIndex = isActive ? 0 : -1;
    });

    // Update counter
    if (counterEl) {
      counterEl.textContent = `${String(newIndex + 1).padStart(2, "0")} / ${String(periods.length).padStart(2, "0")}`;
    }

    // Update notch position smoothly
    updateNotchPosition(newIndex);

    // Text updates with Urdu/English awareness
    const isUrdu = document.documentElement.getAttribute("lang") === "ur";
    const title = isUrdu ? p.titleUr : p.title;
    const desc = isUrdu ? p.descUr : p.desc;
    const loc = isUrdu ? p.locationUr : p.location;
    const cat = isUrdu ? p.categoryBadgeUr : p.categoryBadge;
    const dur = isUrdu ? p.durationTextUr : p.durationText;

    if (reducedMotion.matches) {
      if (giantTimeEl) giantTimeEl.textContent = p.time;
      if (titleEl) titleEl.textContent = title;
      if (descEl) descEl.textContent = desc;
      if (catBadgeEl) catBadgeEl.textContent = cat;
      if (locationEl) locationEl.textContent = loc;
      if (durationEl) durationEl.textContent = dur;
      return;
    }

    isTransitioning = true;
    if (giantTimeEl) giantTimeEl.classList.add("bd-fade-out");
    if (titleEl) titleEl.classList.add("bd-fade-out");
    if (descEl) descEl.classList.add("bd-fade-out");

    window.setTimeout(() => {
      if (giantTimeEl) giantTimeEl.textContent = p.time;
      if (titleEl) titleEl.textContent = title;
      if (descEl) descEl.textContent = desc;
      if (catBadgeEl) catBadgeEl.textContent = cat;
      if (locationEl) locationEl.textContent = loc;
      if (durationEl) durationEl.textContent = dur;

      if (giantTimeEl) giantTimeEl.classList.remove("bd-fade-out");
      if (titleEl) titleEl.classList.remove("bd-fade-out");
      if (descEl) descEl.classList.remove("bd-fade-out");

      // Staggered slide and fade up: 60ms stagger
      if (giantTimeEl) {
        giantTimeEl.style.animationDelay = "0ms";
        giantTimeEl.classList.add("bd-fade-in");
      }
      if (titleEl) {
        titleEl.style.animationDelay = "60ms";
        titleEl.classList.add("bd-fade-in");
      }
      if (descEl) {
        descEl.style.animationDelay = "120ms";
        descEl.classList.add("bd-fade-in");
      }

      window.setTimeout(() => {
        if (giantTimeEl) {
          giantTimeEl.classList.remove("bd-fade-in");
          giantTimeEl.style.animationDelay = "";
        }
        if (titleEl) {
          titleEl.classList.remove("bd-fade-in");
          titleEl.style.animationDelay = "";
        }
        if (descEl) {
          descEl.classList.remove("bd-fade-in");
          descEl.style.animationDelay = "";
        }
        isTransitioning = false;
      }, 380);
    }, 150);
  }

  // 6. Play the Day Auto-Advance Logic
  function startAutoPlay() {
    if (reducedMotion.matches) return;
    isPlaying = true;
    if (playBtn) {
      playBtn.classList.add("is-playing");
      playBtn.setAttribute("aria-label", "Pause schedule auto-advance");
      const icon = playBtn.querySelector(".bd-play-icon");
      if (icon) {
        icon.innerHTML = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
      }
      const text = playBtn.querySelector(".bd-play-text");
      if (text) text.textContent = "Pause";
    }

    playTimer = window.setInterval(() => {
      const nextIndex = (currentPeriodIndex + 1) % periods.length;
      goToPeriod(nextIndex, false);
    }, 3000);
  }

  function stopAutoPlay() {
    if (playTimer) {
      window.clearInterval(playTimer);
      playTimer = null;
    }
    isPlaying = false;
    if (playBtn) {
      playBtn.classList.remove("is-playing");
      playBtn.setAttribute("aria-label", "Play the day - advance through school schedule");
      const icon = playBtn.querySelector(".bd-play-icon");
      if (icon) {
        icon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
      }
      const text = playBtn.querySelector(".bd-play-text");
      if (text) text.textContent = "Play the day";
    }
  }

  function togglePlay() {
    if (isPlaying) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  }

  // 7. Event Listeners
  // Play button
  if (playBtn) {
    if (reducedMotion.matches) {
      playBtn.style.display = "none";
    } else {
      playBtn.addEventListener("click", togglePlay);
    }
  }

  // Desktop segments
  desktopSegments.forEach((seg) => {
    seg.addEventListener("click", () => {
      const idx = Number.parseInt(seg.getAttribute("data-index"), 10);
      if (!Number.isNaN(idx)) goToPeriod(idx, true);
    });
  });

  // Touch Swipe navigation on mobile
  if (panel) {
    let touchStartX = 0;
    let touchStartY = 0;
    panel.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    panel.addEventListener("touchend", (e) => {
      if (e.changedTouches.length === 1) {
        const diffX = e.changedTouches[0].clientX - touchStartX;
        const diffY = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX < 0) {
            // Swiped left -> Next period
            const nextIdx = (currentPeriodIndex + 1) % periods.length;
            goToPeriod(nextIdx, true);
          } else {
            // Swiped right -> Previous period
            const prevIdx = (currentPeriodIndex - 1 + periods.length) % periods.length;
            goToPeriod(prevIdx, true);
          }
        }
      }
    }, { passive: true });
  }

  // Arrow buttons
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      const prevIdx = (currentPeriodIndex - 1 + periods.length) % periods.length;
      goToPeriod(prevIdx, true);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const nextIdx = (currentPeriodIndex + 1) % periods.length;
      goToPeriod(nextIdx, true);
    });
  }

  // Keyboard navigation
  section.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      const isRtl = document.documentElement.getAttribute("dir") === "rtl";
      const targetIdx = isRtl
        ? (currentPeriodIndex + 1) % periods.length
        : (currentPeriodIndex - 1 + periods.length) % periods.length;
      goToPeriod(targetIdx, true);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      const isRtl = document.documentElement.getAttribute("dir") === "rtl";
      const targetIdx = isRtl
        ? (currentPeriodIndex - 1 + periods.length) % periods.length
        : (currentPeriodIndex + 1) % periods.length;
      goToPeriod(targetIdx, true);
    }
  });

  // 9. Entrance Grow Animation
  if ("IntersectionObserver" in window) {
    const entranceObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (desktopBar) desktopBar.classList.add("is-animated");
          const header = section.querySelector(".bd-header");
          if (header) header.classList.add("is-visible");
          const legend = section.querySelector(".bd-legend-wrap");
          if (legend) legend.classList.add("is-visible");
          const panelWrap = section.querySelector(".bd-panel-container");
          if (panelWrap) panelWrap.classList.add("is-visible");
          const barWrap = section.querySelector(".bd-bar-wrap");
          if (barWrap) barWrap.classList.add("is-visible");
          entranceObserver.disconnect();
        }
      });
    }, { threshold: 0.12 });

    entranceObserver.observe(section);
  } else {
    if (desktopBar) desktopBar.classList.add("is-animated");
    const header = section.querySelector(".bd-header");
    if (header) header.classList.add("is-visible");
    const legend = section.querySelector(".bd-legend-wrap");
    if (legend) legend.classList.add("is-visible");
    const panelWrap = section.querySelector(".bd-panel-container");
    if (panelWrap) panelWrap.classList.add("is-visible");
  }

  // 10. Window Resize Handling
  window.addEventListener("resize", () => {
    calculateSegmentWidths();
  }, { passive: true });

  // Initial calculation & sync
  calculateSegmentWidths();
  goToPeriod(0);
}

/* ==========================================================================
   18. CAMPUS LIFE PAGE LOGIC
   ========================================================================== */
function initCampusLife() {
  const page = document.querySelector(".page-campus-life, .cl-hero");
  if (!page) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // 1. Hero Text & Visual Reveal - immediately visible in final static state
  const fadeElements = document.querySelectorAll(".cl-fade-elem");
  if (fadeElements.length) {
    fadeElements.forEach(el => el.classList.add("is-visible"));
  }


  // 2. Video Hero Controls (Pause/Play, Viewport Observation, Connection Check)
  const heroVideo = document.getElementById("clHeroVideo");
  const videoToggleBtn = document.getElementById("clVideoToggle");
  let isVideoManuallyPaused = false;

  if (heroVideo) {
    const isSaveData = navigator.connection && (navigator.connection.saveData || navigator.connection.effectiveType === "2g" || navigator.connection.effectiveType === "slow-2g");
    if (reducedMotion.matches || isSaveData) {
      heroVideo.pause();
      if (videoToggleBtn) videoToggleBtn.style.display = "none";
    } else {
      if ("IntersectionObserver" in window) {
        const videoObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              if (!isVideoManuallyPaused) {
                heroVideo.play().catch(() => {});
              }
            } else {
              heroVideo.pause();
            }
          });
        }, { threshold: 0.1 });
        videoObserver.observe(heroVideo);
      }

      if (videoToggleBtn) {
        const iconPause = videoToggleBtn.querySelector(".cl-icon-pause");
        const iconPlay = videoToggleBtn.querySelector(".cl-icon-play");

        videoToggleBtn.addEventListener("click", () => {
          if (heroVideo.paused) {
            heroVideo.play().then(() => {
              isVideoManuallyPaused = false;
              videoToggleBtn.setAttribute("aria-label", "Pause background video");
              if (iconPause) iconPause.style.display = "";
              if (iconPlay) iconPlay.style.display = "none";
            }).catch(() => {});
          } else {
            heroVideo.pause();
            isVideoManuallyPaused = true;
            videoToggleBtn.setAttribute("aria-label", "Play background video");
            if (iconPause) iconPause.style.display = "none";
            if (iconPlay) iconPlay.style.display = "";
          }
        });
      }
    }
  }

  // 3. Fullscreen Film Lightbox (Watch the film)
  const filmLightbox = document.getElementById("clFilmLightbox");
  const filmVideoPlayer = document.getElementById("clLightboxVideoPlayer");
  const filmIframe = document.getElementById("clFilmIframe");
  const filmCloseBtn = document.getElementById("clFilmClose");
  const filmBackdrop = document.getElementById("clFilmBackdrop");
  const watchFilmBtn = document.getElementById("clWatchFilmBtn");
  const heroPlayCircle = document.getElementById("clHeroPlayCircle");
  let lastActiveElement = null;

  function openFilmLightbox(triggerEl) {
    if (!filmLightbox) return;
    lastActiveElement = triggerEl || document.activeElement;
    filmLightbox.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
    if (filmVideoPlayer) {
      filmVideoPlayer.currentTime = 0;
      filmVideoPlayer.play().catch(() => {});
    } else if (filmIframe && filmIframe.getAttribute("data-src")) {
      filmIframe.src = filmIframe.getAttribute("data-src");
    }
    if (filmCloseBtn) filmCloseBtn.focus();
  }

  function closeFilmLightbox() {
    if (!filmLightbox || filmLightbox.hasAttribute("hidden")) return;
    filmLightbox.setAttribute("hidden", "");
    document.body.style.overflow = "";
    if (filmVideoPlayer) {
      filmVideoPlayer.pause();
    }
    if (filmIframe) {
      filmIframe.src = "";
    }
    if (lastActiveElement && typeof lastActiveElement.focus === "function") {
      lastActiveElement.focus();
    }
  }

  if (watchFilmBtn) {
    watchFilmBtn.addEventListener("click", () => openFilmLightbox(watchFilmBtn));
  }
  if (heroPlayCircle) {
    heroPlayCircle.addEventListener("click", () => openFilmLightbox(heroPlayCircle));
  }
  if (filmCloseBtn) {
    filmCloseBtn.addEventListener("click", closeFilmLightbox);
  }
  if (filmBackdrop) {
    filmBackdrop.addEventListener("click", closeFilmLightbox);
  }

  // 3b. Interactive Campus Video Playlist
  const mainVideoPlayer = document.getElementById("clMainVideoPlayer");
  const mainVideoBadge = document.getElementById("clMainVideoBadge");
  const mainVideoTitle = document.getElementById("clMainVideoTitle");
  const mainVideoDesc = document.getElementById("clMainVideoDesc");
  const playlistItems = document.querySelectorAll(".cl-playlist-item");

  if (mainVideoPlayer && playlistItems.length > 0) {
    playlistItems.forEach((item) => {
      item.addEventListener("click", () => {
        const videoSrc = item.getAttribute("data-video-src");
        const posterSrc = item.getAttribute("data-poster");
        const isUrdu = document.documentElement.getAttribute("dir") === "rtl";
        const badge = isUrdu ? (item.getAttribute("data-badge-ur") || item.getAttribute("data-badge-en")) : item.getAttribute("data-badge-en");
        const title = isUrdu ? (item.getAttribute("data-title-ur") || item.getAttribute("data-title-en")) : item.getAttribute("data-title-en");
        const desc = isUrdu ? (item.getAttribute("data-desc-ur") || item.getAttribute("data-desc-en")) : item.getAttribute("data-desc-en");

        playlistItems.forEach((btn) => btn.classList.remove("is-active"));
        item.classList.add("is-active");

        if (videoSrc) {
          mainVideoPlayer.src = videoSrc;
          if (posterSrc) mainVideoPlayer.poster = posterSrc;
          mainVideoPlayer.load();
          mainVideoPlayer.play().catch(() => {});
        }
        if (mainVideoBadge && badge) mainVideoBadge.textContent = badge;
        if (mainVideoTitle && title) mainVideoTitle.textContent = title;
        if (mainVideoDesc && desc) mainVideoDesc.textContent = desc;
      });
    });
  }

  // 4. Statement Word Fade-in
  const statementEl = document.getElementById("clStatementText");
  if (statementEl) {
    const rawText = statementEl.textContent.trim();
    if (rawText && !statementEl.querySelector(".cl-word")) {
      const words = rawText.split(/\s+/);
      statementEl.innerHTML = words.map(w => `<span class="cl-word">${w}</span>`).join(" ");
    }

    const wordSpans = statementEl.querySelectorAll(".cl-word");
    if (reducedMotion.matches) {
      wordSpans.forEach(w => w.classList.add("is-active"));
    } else if ("IntersectionObserver" in window) {
      let animated = false;
      const statementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !animated) {
            animated = true;
            wordSpans.forEach((w, i) => {
              window.setTimeout(() => {
                w.classList.add("is-active");
              }, i * 35);
            });
            statementObserver.disconnect();
          }
        });
      }, { threshold: 0.25 });
      statementObserver.observe(statementEl);
    } else {
      wordSpans.forEach(w => w.classList.add("is-active"));
    }
  }

  // 5. Section 3: Our Spaces (Horizontal Gallery Slider on Desktop, Swipe on Mobile)
  const spacesStickyWrap = document.getElementById("clSpacesStickyWrap");
  const spacesTrack = document.getElementById("clSpacesTrack");
  const spacesViewport = document.getElementById("clSpacesViewport");
  const spacesProgress = document.getElementById("clSpacesProgress");
  const spacesCounter = document.getElementById("clSpacesCounter");
  const spacesPrev = document.getElementById("clSpacesPrev");
  const spacesNext = document.getElementById("clSpacesNext");
  const spacesDots = Array.from(page.querySelectorAll(".cl-spaces-dot"));
  const archCards = Array.from(page.querySelectorAll(".cl-arch-card"));
  const totalSpaces = archCards.length || 6;
  let currentSpaceIndex = 0;

  if ("IntersectionObserver" in window) {
    const cardRevealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
        }
      });
    }, { threshold: 0.15 });
    archCards.forEach(c => cardRevealObserver.observe(c));
  } else {
    archCards.forEach(c => c.classList.add("is-revealed"));
  }

  function updateSpacesGallery(index) {
    currentSpaceIndex = Math.max(0, Math.min(totalSpaces - 1, index));

    // Update Counter & Progress Bar
    if (spacesCounter) {
      spacesCounter.textContent = `${String(currentSpaceIndex + 1).padStart(2, "0")} / ${String(totalSpaces).padStart(2, "0")}`;
    }
    if (spacesProgress) {
      const progressRatio = totalSpaces > 1 ? (currentSpaceIndex / (totalSpaces - 1)) : 1;
      spacesProgress.style.transform = `scaleX(${Math.max(0.16, progressRatio)})`;
    }

    // Update Dots (for mobile or indicator dots if present)
    spacesDots.forEach((dot, idx) => {
      dot.classList.toggle("is-active", idx === currentSpaceIndex);
    });

    if (window.innerWidth <= 768) {
      // Mobile: Scroll viewport directly to target card
      if (spacesViewport && archCards[currentSpaceIndex]) {
        const targetCard = archCards[currentSpaceIndex];
        spacesViewport.scrollTo({
          left: targetCard.offsetLeft - 24,
          behavior: reducedMotion.matches ? "auto" : "smooth"
        });
      }
    } else {
      // Desktop: Translate track horizontally
      if (spacesTrack && spacesViewport) {
        if (reducedMotion.matches) {
          spacesTrack.style.transition = "none";
        }
        const cardStep = 282; // 250px card width + 32px gap
        const maxTranslate = Math.max(0, spacesTrack.scrollWidth - spacesViewport.clientWidth);
        const targetOffset = Math.min(maxTranslate, currentSpaceIndex * cardStep);
        spacesTrack.style.transform = `translateX(-${targetOffset}px)`;
      }
    }
  }

  if (spacesPrev) {
    spacesPrev.addEventListener("click", (e) => {
      e.preventDefault();
      const newIndex = currentSpaceIndex > 0 ? currentSpaceIndex - 1 : totalSpaces - 1;
      updateSpacesGallery(newIndex);
    });
  }

  if (spacesNext) {
    spacesNext.addEventListener("click", (e) => {
      e.preventDefault();
      const newIndex = currentSpaceIndex < totalSpaces - 1 ? currentSpaceIndex + 1 : 0;
      updateSpacesGallery(newIndex);
    });
  }

  // Keyboard accessibility
  if (spacesStickyWrap) {
    spacesStickyWrap.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        const newIndex = currentSpaceIndex > 0 ? currentSpaceIndex - 1 : totalSpaces - 1;
        updateSpacesGallery(newIndex);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        const newIndex = currentSpaceIndex < totalSpaces - 1 ? currentSpaceIndex + 1 : 0;
        updateSpacesGallery(newIndex);
      }
    });
  }

  // Mouse Drag / Touch Swipe on Desktop & Tablet
  if (spacesViewport) {
    let isPointerDown = false;
    let pointerStartX = 0;
    let hasMoved = false;

    spacesViewport.addEventListener("mousedown", (e) => {
      if (window.innerWidth <= 768 || e.button !== 0) return;
      isPointerDown = true;
      pointerStartX = e.pageX;
      hasMoved = false;
      spacesViewport.style.cursor = "grabbing";
      spacesViewport.style.userSelect = "none";
    });

    window.addEventListener("mousemove", (e) => {
      if (!isPointerDown) return;
      const diffX = e.pageX - pointerStartX;
      if (Math.abs(diffX) > 10) {
        hasMoved = true;
      }
    });

    window.addEventListener("mouseup", (e) => {
      if (!isPointerDown) return;
      isPointerDown = false;
      if (spacesViewport) {
        spacesViewport.style.cursor = "";
        spacesViewport.style.userSelect = "";
      }
      if (hasMoved) {
        const diffX = e.pageX - pointerStartX;
        if (diffX < -50) {
          // Swiped left -> next
          const newIndex = Math.min(totalSpaces - 1, currentSpaceIndex + 1);
          updateSpacesGallery(newIndex);
        } else if (diffX > 50) {
          // Swiped right -> prev
          const newIndex = Math.max(0, currentSpaceIndex - 1);
          updateSpacesGallery(newIndex);
        }
      }
    });

    // Mobile scroll listener to update dots and counter
    spacesViewport.addEventListener("scroll", () => {
      if (window.innerWidth > 768) return;
      const scrollLeft = spacesViewport.scrollLeft;
      const cardWidth = 268;
      const activeIdx = Math.min(totalSpaces - 1, Math.round(scrollLeft / cardWidth));
      currentSpaceIndex = activeIdx;
      spacesDots.forEach((dot, idx) => {
        dot.classList.toggle("is-active", idx === activeIdx);
      });
      if (spacesCounter) {
        spacesCounter.textContent = `${String(activeIdx + 1).padStart(2, "0")} / ${String(totalSpaces).padStart(2, "0")}`;
      }
    }, { passive: true });
  }

  // Initial update
  updateSpacesGallery(0);

  // 6. Section 4: Moments from Past Events Filter & Lightbox
  const filterChips = Array.from(page.querySelectorAll(".cl-filter-chip"));
  const bentoTiles = Array.from(page.querySelectorAll(".cl-bento-tile"));
  const viewMoreBtn = document.getElementById("clViewMoreBtn");

  filterChips.forEach(chip => {
    chip.addEventListener("click", () => {
      const filter = chip.getAttribute("data-filter") || "all";
      filterChips.forEach(c => {
        const isActive = c === chip;
        c.classList.toggle("is-active", isActive);
        c.setAttribute("aria-pressed", isActive ? "true" : "false");
      });

      bentoTiles.forEach(tile => {
        const category = tile.getAttribute("data-category") || "";
        const matches = (filter === "all" || category === filter);
        const isExtra = tile.classList.contains("cl-tile-extra");

        if (isExtra && !tile.hasAttribute("data-expanded")) {
          tile.style.display = "none";
          return;
        }

        if (matches) {
          tile.style.display = "";
          tile.style.opacity = "0";
          tile.style.transform = "scale(0.96)";
          window.setTimeout(() => {
            tile.style.opacity = "1";
            tile.style.transform = "scale(1)";
          }, 30);
        } else {
          tile.style.display = "none";
        }
      });
    });
  });

  if (viewMoreBtn) {
    let isExpanded = false;
    viewMoreBtn.addEventListener("click", () => {
      isExpanded = !isExpanded;
      const extraTiles = page.querySelectorAll(".cl-tile-extra");
      extraTiles.forEach(tile => {
        if (isExpanded) {
          tile.setAttribute("data-expanded", "true");
          tile.style.display = "";
        } else {
          tile.removeAttribute("data-expanded");
          tile.style.display = "none";
        }
      });
      viewMoreBtn.textContent = isExpanded ? "Show fewer moments" : "View more moments";
    });
  }

  const momentsLightbox = document.getElementById("clMomentsLightbox");
  const momentsCloseBtn = document.getElementById("clMomentsClose");
  const momentsBackdrop = document.getElementById("clMomentsBackdrop");
  const momentsImg = document.getElementById("clMomentsImg");
  const momentsMediaBox = document.getElementById("clMomentsMediaBox");
  const momentsTitle = document.getElementById("clMomentsTitle");
  const momentsDate = document.getElementById("clMomentsDate");
  const momentsCategory = document.getElementById("clMomentsCategory");
  const momentsCounter = document.getElementById("clMomentsCounter");
  const momentsPrev = document.getElementById("clMomentsPrev");
  const momentsNext = document.getElementById("clMomentsNext");
  let currentMomentIndex = 0;
  let activeTilesList = [];
  let lastMomentTrigger = null;

  function getVisibleTiles() {
    return bentoTiles.filter(t => t.style.display !== "none" && window.getComputedStyle(t).display !== "none");
  }

  function showMomentAtIndex(idx) {
    if (!activeTilesList.length) return;
    currentMomentIndex = (idx + activeTilesList.length) % activeTilesList.length;
    const tile = activeTilesList[currentMomentIndex];
    if (!tile) return;

    const imgEl = tile.querySelector(".cl-tile-img");
    const src = tile.getAttribute("data-img") || (imgEl ? imgEl.src : "");
    const title = tile.getAttribute("data-title") || "Event Highlight";
    const date = tile.getAttribute("data-date") || "";
    const cat = tile.getAttribute("data-category") || "Event";

    if (momentsTitle) momentsTitle.textContent = title;
    if (momentsDate) momentsDate.textContent = date;
    if (momentsCategory) momentsCategory.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    if (momentsCounter) {
      momentsCounter.textContent = `${String(currentMomentIndex + 1).padStart(2, "0")} / ${String(activeTilesList.length).padStart(2, "0")}`;
    }

    if (momentsImg && momentsMediaBox) {
      if (src) {
        momentsImg.src = src;
        momentsImg.alt = title;
        momentsImg.style.display = "";
        const ph = momentsMediaBox.querySelector(".cl-photo-placeholder");
        if (ph) ph.remove();
      } else {
        momentsImg.style.display = "none";
        let ph = momentsMediaBox.querySelector(".cl-photo-placeholder");
        if (!ph) {
          momentsMediaBox.insertAdjacentHTML("beforeend", `
            <div class="cl-photo-placeholder" aria-label="Photo coming soon" style="width:100%;height:100%;background:#0d1526;display:flex;align-items:center;justify-content:center;">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
            </div>
          `);
        }
      }
    }

    const nextIdx = (currentMomentIndex + 1) % activeTilesList.length;
    const nextTile = activeTilesList[nextIdx];
    if (nextTile) {
      const nextSrc = nextTile.getAttribute("data-img");
      if (nextSrc) {
        const pre = new Image();
        pre.src = nextSrc;
      }
    }
  }

  function openMomentsLightbox(tile) {
    if (!momentsLightbox) return;
    activeTilesList = getVisibleTiles();
    if (!activeTilesList.length) return;
    currentMomentIndex = Math.max(0, activeTilesList.indexOf(tile));
    lastMomentTrigger = tile;

    showMomentAtIndex(currentMomentIndex);
    momentsLightbox.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
    if (momentsCloseBtn) momentsCloseBtn.focus();
  }

  function closeMomentsLightbox() {
    if (!momentsLightbox || momentsLightbox.hasAttribute("hidden")) return;
    momentsLightbox.setAttribute("hidden", "");
    document.body.style.overflow = "";
    if (lastMomentTrigger && typeof lastMomentTrigger.focus === "function") {
      lastMomentTrigger.focus();
    }
  }

  bentoTiles.forEach(tile => {
    tile.addEventListener("click", () => openMomentsLightbox(tile));
    tile.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openMomentsLightbox(tile);
      }
    });
  });

  if (momentsCloseBtn) momentsCloseBtn.addEventListener("click", closeMomentsLightbox);
  if (momentsBackdrop) momentsBackdrop.addEventListener("click", closeMomentsLightbox);
  if (momentsPrev) {
    momentsPrev.addEventListener("click", (e) => {
      e.stopPropagation();
      showMomentAtIndex(currentMomentIndex - 1);
    });
  }
  if (momentsNext) {
    momentsNext.addEventListener("click", (e) => {
      e.stopPropagation();
      showMomentAtIndex(currentMomentIndex + 1);
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeFilmLightbox();
      closeMomentsLightbox();
    } else if (momentsLightbox && !momentsLightbox.hasAttribute("hidden")) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        showMomentAtIndex(currentMomentIndex - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        showMomentAtIndex(currentMomentIndex + 1);
      }
    }
  });

  if (momentsLightbox) {
    let touchStartX = 0;
    let touchStartY = 0;
    momentsLightbox.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    momentsLightbox.addEventListener("touchend", (e) => {
      if (e.changedTouches.length === 1) {
        const diffX = e.changedTouches[0].clientX - touchStartX;
        const diffY = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX < 0) {
            showMomentAtIndex(currentMomentIndex + 1);
          } else {
            showMomentAtIndex(currentMomentIndex - 1);
          }
        }
      }
    }, { passive: true });
  }



  // Campus Life is initialized; Gateway intro is handled by page-gateway.js
}

/* ==========================================================================
   TAB VISIBILITY & LOW-END RESOURCE CONTROLLER
   ========================================================================== */
function initTabVisibilityController() {
  document.addEventListener("visibilitychange", () => {
    const isHidden = document.hidden;
    document.documentElement.classList.toggle("is-tab-hidden", isHidden);

    const heroVideo = document.getElementById("clHeroVideo");
    if (heroVideo) {
      if (isHidden) {
        heroVideo.pause();
      } else {
        heroVideo.play().catch(() => {});
      }
    }
  });
}

/* ==========================================================================
   OFF-SCREEN ANIMATION PAUSING (IntersectionObserver)
   ========================================================================== */
function initMarqueeVisibilityObserver() {
  const animatedTracks = document.querySelectorAll(
    ".quote-marquee-track, .cl-marquee-track, .cl-reel-stream"
  );
  if (!animatedTracks.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove("is-anim-paused");
      } else {
        entry.target.classList.add("is-anim-paused");
      }
    });
  }, { threshold: 0.05 });

  animatedTracks.forEach(track => observer.observe(track));
}

/* ==========================================================================
   THE CAMPUS SKYLINE — GLOBAL SHARED FOOTER CONTROLLER
   ========================================================================== */
function initCampusSkylineFooter() {
  const footer = document.querySelector(".footer-skyline");
  if (!footer) return;

  // 1. Populate dynamic links/info from siteContent.info if available
  if (window.siteContent && window.siteContent.info) {
    const info = window.siteContent.info;
    const whatsappBtn = footer.querySelector("#footerWhatsappCta");
    if (whatsappBtn && info.contact && info.contact.whatsappNumber) {
      whatsappBtn.href = `https://wa.me/${info.contact.whatsappNumber}?text=Assalam-o-Alaikum,%20I%20would%20like%20to%20inquire%20about%20admissions%20at%20Hadi%20Education%20System.`;
    }

    if (info.socialLinks) {
      const fbLink = footer.querySelector(".footer-social-fb");
      if (fbLink && info.socialLinks.facebook) fbLink.href = info.socialLinks.facebook;
      const ytLink = footer.querySelector(".footer-social-yt");
      if (ytLink && info.socialLinks.youtube) ytLink.href = info.socialLinks.youtube;
      const waLink = footer.querySelector(".footer-social-wa");
      if (waLink && info.socialLinks.whatsapp) waLink.href = info.socialLinks.whatsapp;
    }

    const roadLink = footer.querySelector("#footerAddressRoad");
    if (roadLink && info.campus && info.campus.addressEn) {
      roadLink.setAttribute("title", info.campus.addressEn);
    }
    const hoursLink = footer.querySelector("#footerHoursLink");
    if (hoursLink && info.contact && info.contact.officeHoursEn) {
      hoursLink.setAttribute("title", info.contact.officeHoursEn);
    }
  }

  // 2. Language toggle button click handlers
  const langBtns = footer.querySelectorAll(".footer-lang-btn");
  langBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      if (lang) {
        setLanguage(lang);
      }
    });
  });

  // 3. Responsive native details/summary exclusive accordions on mobile (closed by default on mobile) with smooth fluid animation
    const linkGroups = footer.querySelectorAll(".footer-link-group");
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function applyAccordionState(e) {
      const isMobile = e.matches;
      linkGroups.forEach(group => {
        const summary = group.querySelector("summary");
        if (isMobile) {
          group.removeAttribute("open");
          group.classList.remove("is-closing", "is-opening");
          group.style.height = "";
          group.style.overflow = "";
          group.setAttribute("name", "hes-footer-accordion");
          if (summary) summary.setAttribute("aria-expanded", "false");
        } else {
          group.removeAttribute("name");
          group.classList.remove("is-closing", "is-opening");
          group.style.height = "";
          group.style.overflow = "";
          group.setAttribute("open", "");
          if (summary) summary.setAttribute("aria-expanded", "true");
        }
      });
    }

    function closeGroup(group, animate = true) {
      const summary = group.querySelector("summary");
      const list = group.querySelector(".footer-links-list");
      if (!group.hasAttribute("open")) return;

      if (!animate || prefersReducedMotion.matches) {
        group.removeAttribute("open");
        group.classList.remove("is-closing", "is-opening");
        group.style.height = "";
        group.style.overflow = "";
        if (summary) summary.setAttribute("aria-expanded", "false");
        return;
      }

      group.classList.add("is-closing");
      group.classList.remove("is-opening");
      if (summary) summary.setAttribute("aria-expanded", "false");

      const startHeight = group.offsetHeight;
      const endHeight = summary ? summary.offsetHeight : 52;
      group.style.overflow = "hidden";

      if (group._currentAnim) group._currentAnim.cancel();

      if (list) {
        list.animate([
          { opacity: 1, transform: "translateY(0)" },
          { opacity: 0, transform: "translateY(-6px)" }
        ], {
          duration: 200,
          easing: "ease-out"
        });
      }

      const anim = group.animate([
        { height: `${startHeight}px` },
        { height: `${endHeight}px` }
      ], {
        duration: 220,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)"
      });

      group._currentAnim = anim;

      anim.onfinish = () => {
        group.removeAttribute("open");
        group.classList.remove("is-closing");
        group.style.height = "";
        group.style.overflow = "";
        group._currentAnim = null;
      };

      anim.oncancel = () => {
        group.classList.remove("is-closing");
        group.style.height = "";
        group.style.overflow = "";
        group._currentAnim = null;
      };
    }

    function openGroup(group, animate = true) {
      const summary = group.querySelector("summary");
      const list = group.querySelector(".footer-links-list");

      // Close any other open group smoothly
      linkGroups.forEach(other => {
        if (other !== group && other.hasAttribute("open")) {
          closeGroup(other, animate);
        }
      });

      if (!animate || prefersReducedMotion.matches) {
        group.setAttribute("open", "");
        group.classList.remove("is-closing", "is-opening");
        group.style.height = "";
        group.style.overflow = "";
        if (summary) summary.setAttribute("aria-expanded", "true");
        return;
      }

      const startHeight = summary ? summary.offsetHeight : 52;
      group.setAttribute("open", "");
      group.classList.add("is-opening");
      group.classList.remove("is-closing");
      if (summary) summary.setAttribute("aria-expanded", "true");

      group.style.overflow = "hidden";
      const endHeight = group.scrollHeight;

      if (group._currentAnim) group._currentAnim.cancel();

      if (list) {
        list.animate([
          { opacity: 0, transform: "translateY(-8px)" },
          { opacity: 1, transform: "translateY(0)" }
        ], {
          duration: 260,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)"
        });
      }

      const anim = group.animate([
        { height: `${startHeight}px` },
        { height: `${endHeight}px` }
      ], {
        duration: 260,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)"
      });

      group._currentAnim = anim;

      anim.onfinish = () => {
        group.classList.remove("is-opening");
        group.style.height = "";
        group.style.overflow = "";
        group._currentAnim = null;
      };

      anim.oncancel = () => {
        group.classList.remove("is-opening");
        group.style.height = "";
        group.style.overflow = "";
        group._currentAnim = null;
      };
    }

    linkGroups.forEach(group => {
      const summary = group.querySelector("summary");
      if (!summary) return;

      summary.addEventListener("click", e => {
        if (!mediaQuery.matches) return; // Desktop uses native open list
        e.preventDefault();

        if (group.hasAttribute("open") && !group.classList.contains("is-closing")) {
          closeGroup(group, true);
        } else {
          openGroup(group, true);
        }
      });
    });

    applyAccordionState(mediaQuery);
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", applyAccordionState);
    } else if (typeof mediaQuery.addListener === "function") {
      mediaQuery.addListener(applyAccordionState);
    }


  // 4. Motion & Scroll reveal (triggered once when footer is about 20% visible)
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion || !("IntersectionObserver" in window)) {
    footer.classList.add("is-revealed");
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting || entry.intersectionRatio >= 0.2) {
        footer.classList.add("is-revealed");
        obs.unobserve(footer);
      }
    });
  }, { threshold: [0, 0.2] });

  observer.observe(footer);
}

/* ==========================================================================
   INTERACTIVE SPECIMEN SWITCHER (Curriculum Master-Detail & Mobile Accordion)
   ========================================================================== */
function initSpecimenSwitcher() {
  const container = document.getElementById("specimenContainer");
  if (!container) return;

  const trackItems = Array.from(container.querySelectorAll(".specimen-track-item"));
  if (!trackItems.length) return;

  const desktopCard = document.getElementById("specimenDetailCard");
  const eyebrowEl = document.getElementById("specimenEyebrow");
  const titleEl = document.getElementById("specimenTitle");
  const descEl = document.getElementById("specimenDesc");
  const cadenceEl = document.getElementById("specimenCadence");
  const focusEl = document.getElementById("specimenFocus");

  const TRACKS_DATA = [
    {
      index: 0,
      eyebrowEn: "SPIRITUAL PILLAR • TRACK 01",
      eyebrowUr: "روحانی ستون • ٹریک 01",
      titleEn: "Nazra-e-Quran & Tajweed",
      titleUr: "ناظرہ قرآن و تجوید",
      specEn: "Flawless Makharij pronunciation, rules of Noon Sakinah and Meem Sakinah, and rhythmic recitation with proper phonetics.",
      specUr: "مخارج کی درست ادائیگی، نون ساکنہ اور میم ساکنہ کے قواعد اور ترتیل کے ساتھ تلاوت۔",
      cadenceLabelEn: "CADENCE",
      cadenceLabelUr: "اوقات",
      cadenceEn: "Daily 45-Min Session",
      cadenceUr: "روزانہ 45 منٹ کی کلاس",
      focusEn: "Makharij & Tajweed Rules",
      focusUr: "مخارج اور تجوید کے قواعد"
    },
    {
      index: 1,
      eyebrowEn: "SPIRITUAL PILLAR • TRACK 02",
      eyebrowUr: "روحانی ستون • ٹریک 02",
      titleEn: "Quranic Education & Islamic Jurisprudence",
      titleUr: "قرآنی تعلیم و فقہ اسلامی",
      specEn: "Practical understanding of Islamic jurisprudence, biographies of the Masoomeen (AS), and daily life ethics.",
      specUr: "فقہ اسلامی کے احکام کی عملی سمجھ، سیرتِ معصومینؑ اور روزمرہ اخلاقیات۔",
      cadenceLabelEn: "CADENCE",
      cadenceLabelUr: "اوقات",
      cadenceEn: "Daily Session",
      cadenceUr: "روزانہ پیریڈ",
      focusEn: "Ethics & Jurisprudence",
      focusUr: "اخلاقیات اور فقہی احکام"
    },
    {
      index: 2,
      eyebrowEn: "ACADEMIC PILLAR • TRACK 03",
      eyebrowUr: "تعلیمی ستون • ٹریک 03",
      titleEn: "Matric (Biology & Computer Science)",
      titleUr: "میٹرک (بائیولوجی و کمپیوٹر سائنس)",
      specEn: "Comprehensive SSC Part-I & II preparation under the Federal Board (FBISE), offering dedicated pathways in both Biology and Computer Science alongside Physics, Chemistry, and Mathematics.",
      specUr: "فیڈرل بورڈ (ایف بی آئی ایس ای) کے تحت ایس ایس سی پارٹ اول و دوم کی جامع تیاری، جس میں فزکس، کیمسٹری اور ریاضی کے ساتھ بائیولوجی اور کمپیوٹر سائنس دونوں کے مخصوص شعبے شامل ہیں۔",
      cadenceLabelEn: "CADENCE / AFFILIATION",
      cadenceLabelUr: "الحاق و اوقات",
      cadenceEn: "FBISE Affiliated (SSC)",
      cadenceUr: "ایف بی آئی ایس ای ملحقہ (ایس ایس سی)",
      focusEn: "Biology, Computer Science, Physics & Chemistry",
      focusUr: "بائیولوجی، کمپیوٹر سائنس، فزکس و کیمسٹری"
    },
    {
      index: 3,
      eyebrowEn: "ACADEMIC PILLAR • TRACK 04",
      eyebrowUr: "تعلیمی ستون • ٹریک 04",
      titleEn: "FSc Pre-Medical",
      titleUr: "ایف ایس سی پری میڈیکل",
      specEn: "Rigorous HSSC Part-I & II Federal Board curriculum designed for aspiring medical and life-sciences students, combining theoretical depth with practical laboratory training.",
      specUr: "طبی اور لائف سائنسز کے طلبہ کے لیے فیڈرل بورڈ کا جامع ایچ ایس ایس سی پارٹ اول و دوم کا نصاب، جو نظریاتی گہرائی اور عملی لیبارٹری تربیت کا امتزاج ہے۔",
      cadenceLabelEn: "CADENCE / AFFILIATION",
      cadenceLabelUr: "الحاق و اوقات",
      cadenceEn: "FBISE Affiliated (HSSC)",
      cadenceUr: "ایف بی آئی ایس ای ملحقہ (ایچ ایس ایس سی)",
      focusEn: "Biology, Physics & Chemistry",
      focusUr: "بائیولوجی، فزکس و کیمسٹری"
    },
    {
      index: 4,
      eyebrowEn: "ACADEMIC PILLAR • TRACK 05",
      eyebrowUr: "تعلیمی ستون • ٹریک 05",
      titleEn: "FSc Pre-Engineering",
      titleUr: "ایف ایس سی پری انجینئرنگ",
      specEn: "Focused HSSC Part-I & II Federal Board engineering track emphasizing analytical problem-solving, advanced mathematics, and applied physical sciences.",
      specUr: "فیڈرل بورڈ کے تحت انجینئرنگ کے طلبہ کے لیے ایچ ایس ایس سی پارٹ اول و دوم کا مخصوص نصاب، جو تجزیاتی مسائل کے حل، ایڈوانس ریاضی اور طبعی علوم پر مرکوز ہے۔",
      cadenceLabelEn: "CADENCE / AFFILIATION",
      cadenceLabelUr: "الحاق و اوقات",
      cadenceEn: "FBISE Affiliated (HSSC)",
      cadenceUr: "ایف بی آئی ایس ای ملحقہ (ایچ ایس ایس سی)",
      focusEn: "Mathematics, Physics & Chemistry",
      focusUr: "ریاضی، فزکس و کیمسٹری"
    },
    {
      index: 5,
      eyebrowEn: "ACADEMIC PILLAR • TRACK 06",
      eyebrowUr: "تعلیمی ستون • ٹریک 06",
      titleEn: "FA (Arts & Information Technology)",
      titleUr: "ایف اے (آرٹس و انفارمیشن ٹیکنالوجی)",
      specEn: "Flexible HSSC Part-I & II Federal Board humanities and computing program offering specialized subject combinations in General Arts and Information Technology (FA-IT).",
      specUr: "فیڈرل بورڈ کے تحت ہیومینیٹیز اور کمپیوٹنگ کا لچکدار ایچ ایس ایس سی پروگرام، جو جنرل آرٹس اور انفارمیشن ٹیکنالوجی (FA-IT) کے مضامین فراہم کرتا ہے۔",
      cadenceLabelEn: "CADENCE / AFFILIATION",
      cadenceLabelUr: "الحاق و اوقات",
      cadenceEn: "FBISE Affiliated (HSSC)",
      cadenceUr: "ایف بی آئی ایس ای ملحقہ (ایچ ایس ایس سی)",
      focusEn: "Humanities, Social Sciences & IT",
      focusUr: "ہیومینیٹیز، سوشل سائنسز و آئی ٹی"
    },
    {
      index: 6,
      eyebrowEn: "ACADEMIC PILLAR • TRACK 07",
      eyebrowUr: "تعلیمی ستون • ٹریک 07",
      titleEn: "ICS (Intermediate in Computer Science)",
      titleUr: "آئی سی ایس (انٹرمیڈیٹ ان کمپیوٹر سائنس)",
      specEn: "Specialized HSSC Part-I & II Federal Board computing track combining core computer science and programming fundamentals with Mathematics and Physics or Statistics.",
      specUr: "فیڈرل بورڈ کے تحت کمپیوٹر سائنس اور پروگرامنگ کے بنیادی اصولوں، ریاضی، اور فزکس یا شماریات پر مشتمل ایچ ایس ایس سی کا مخصوص نصاب۔",
      cadenceLabelEn: "CADENCE / AFFILIATION",
      cadenceLabelUr: "الحاق و اوقات",
      cadenceEn: "FBISE Affiliated (HSSC)",
      cadenceUr: "ایف بی آئی ایس ای ملحقہ (ایچ ایس ایس سی)",
      focusEn: "Computer Science, Mathematics & Physics / Statistics",
      focusUr: "کمپیوٹر سائنس، ریاضی اور فزکس / شماریات"
    }
  ];

  let activeIndex = 0;
  const isMobile = () => window.innerWidth <= 768;

  function updateDesktopCard(index) {
    if (!desktopCard || index < 0 || index >= TRACKS_DATA.length) return;
    const data = TRACKS_DATA[index];
    const isUrdu = document.documentElement.getAttribute("lang") === "ur";

    desktopCard.classList.add("is-switching");

    setTimeout(() => {
      if (eyebrowEl) {
        eyebrowEl.setAttribute("data-en", data.eyebrowEn);
        eyebrowEl.setAttribute("data-ur", data.eyebrowUr);
        eyebrowEl.textContent = isUrdu ? data.eyebrowUr : data.eyebrowEn;
      }
      if (titleEl) {
        titleEl.setAttribute("data-en", data.titleEn);
        titleEl.setAttribute("data-ur", data.titleUr);
        titleEl.textContent = isUrdu ? data.titleUr : data.titleEn;
      }
      if (descEl) {
        descEl.setAttribute("data-en", data.specEn);
        descEl.setAttribute("data-ur", data.specUr);
        descEl.textContent = isUrdu ? data.specUr : data.specEn;
      }
      const cadenceLabelEl = document.getElementById("specimenCadenceLabel");
      if (cadenceLabelEl && data.cadenceLabelEn) {
        cadenceLabelEl.setAttribute("data-en", data.cadenceLabelEn);
        cadenceLabelEl.setAttribute("data-ur", data.cadenceLabelUr);
        cadenceLabelEl.textContent = isUrdu ? data.cadenceLabelUr : data.cadenceLabelEn;
      }
      if (cadenceEl) {
        cadenceEl.setAttribute("data-en", data.cadenceEn);
        cadenceEl.setAttribute("data-ur", data.cadenceUr);
        cadenceEl.textContent = isUrdu ? data.cadenceUr : data.cadenceEn;
      }
      if (focusEl) {
        focusEl.setAttribute("data-en", data.focusEn);
        focusEl.setAttribute("data-ur", data.focusUr);
        focusEl.textContent = isUrdu ? data.focusUr : data.focusEn;
      }

      desktopCard.classList.remove("is-switching");
    }, 120);
  }

  trackItems.forEach((item, index) => {
    const trigger = item.querySelector(".specimen-track-trigger");
    if (!trigger) return;

    trigger.addEventListener("click", () => {
      if (isMobile()) {
        // Mobile mutually-exclusive accordion logic
        const currentlyOpen = item.classList.contains("is-open");

        if (currentlyOpen) {
          // Collapse clicked item
          item.classList.remove("is-open");
          trigger.setAttribute("aria-expanded", "false");
        } else {
          // Close all other items
          trackItems.forEach(otherItem => {
            otherItem.classList.remove("is-open");
            const otherTrigger = otherItem.querySelector(".specimen-track-trigger");
            if (otherTrigger) {
              otherTrigger.setAttribute("aria-expanded", "false");
            }
          });

          // Open clicked item
          item.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");
        }

        // Keep selection state synced
        trackItems.forEach(t => t.classList.remove("is-selected"));
        item.classList.add("is-selected");
        activeIndex = index;
      } else {
        // Desktop master-detail logic
        if (activeIndex === index && item.classList.contains("is-selected")) return;

        trackItems.forEach((t, i) => {
          t.classList.toggle("is-selected", i === index);
          const tTrigger = t.querySelector(".specimen-track-trigger");
          if (tTrigger) {
            tTrigger.setAttribute("aria-selected", i === index ? "true" : "false");
          }
        });

        activeIndex = index;
        updateDesktopCard(index);
      }
    });
  });

  // Handle responsive viewport change
  window.addEventListener("resize", () => {
    if (!isMobile()) {
      trackItems.forEach((t, i) => {
        t.classList.toggle("is-selected", i === activeIndex);
        const tTrigger = t.querySelector(".specimen-track-trigger");
        if (tTrigger) {
          tTrigger.setAttribute("aria-selected", i === activeIndex ? "true" : "false");
        }
      });
    }
  }, { passive: true });
}

/* ==========================================================================
   Campus Life reels — "Reel Theatre" Hardened Interactive Engine
   ========================================================================== */
function initReelTheatre() {
  const root = document.querySelector(".cl-reels");
  if (!root) return;

  const content = (window.siteContent && window.siteContent.campusLifeReels) || {};
  const rawFilms = content.films || [];

  const isUrdu = () => document.documentElement.getAttribute("dir") === "rtl" || document.documentElement.lang === "ur" || document.body.classList.contains("lang-ur");

  function t(keyEn, keyUr, fallback) {
    const urdu = isUrdu();
    if (urdu && content[keyUr]) return content[keyUr];
    if (content[keyEn]) return content[keyEn];
    return fallback || "";
  }

  // Handle zero films
  const panel = document.getElementById("clPanel");
  const emptyState = document.getElementById("clEmptyState");
  if (!rawFilms || rawFilms.length === 0) {
    if (panel) panel.style.display = "none";
    if (emptyState) {
      emptyState.style.display = "block";
      emptyState.textContent = t("filmsComingSoonEn", "filmsComingSoonUr", "Films are coming soon.");
    }
    return;
  }
  if (emptyState) emptyState.style.display = "none";
  if (panel) panel.style.display = "";

  // Normalize films data
  const filmsData = rawFilms.map((f, i) => {
    let dur = f.duration || "";
    if (!dur || dur === "NaN:NaN" || dur === "Infinity") dur = "--:--";
    return {
      id: f.id || "film-" + i,
      category: f.category || "all",
      categoryLabelEn: f.categoryLabelEn || "Film",
      categoryLabelUr: f.categoryLabelUr || "ویڈیو",
      badgeEn: f.badgeEn || (dur !== "--:--" ? "OFFICIAL FILM · " + dur + " MIN" : "OFFICIAL FILM"),
      badgeUr: f.badgeUr || (dur !== "--:--" ? "آفیشل فلم · " + dur + " منٹ" : "آفیشل فلم"),
      titleEn: f.titleEn || "Featured Film",
      titleUr: f.titleUr || "منتخب ویڈیو",
      duration: dur,
      durationSeconds: f.durationSeconds || 0,
      descriptionEn: f.descriptionEn || "",
      descriptionUr: f.descriptionUr || "",
      videoSrc: f.videoSrc || "",
      posterSrc: f.posterSrc || f.poster916 || ""
    };
  });

  // State
  let currentFilter = "all";
  let activeIndexInFilter = 0;
  let isMuted = true;
  let isPlaying = false;
  let activeReelId = filmsData[0].id;
  let lastTapTime = 0;
  let stallTimeout = null;
  let widthCheckTimeout = null;
  let loadSpinnerTimeout = null;
  let isViewerOpen = false;
  let lastFocusedElement = null;
  let feedObserver = null;
  let isSeeking = false;

  const isSaveData = Boolean(navigator.connection && navigator.connection.saveData);
  const isReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Announcer & Filter
  const announcer = document.getElementById("clAnnouncer");
  const filterChips = root.querySelectorAll(".cl-chip");

  // Desktop Stage Elements
  const stage = document.getElementById("clStage");
  const stageVideo = document.getElementById("clStageVideo");
  const stageSource = document.getElementById("clStageSource");
  const stageTap = document.getElementById("clStageTap");
  const stageTapBtn = document.getElementById("clStageTapBtn");
  const stageMute = document.getElementById("clStageMute");
  const stageSpinner = document.getElementById("clStageSpinner");
  const stageStateOverlay = document.getElementById("clStageStateOverlay");
  const stageStateText = document.getElementById("clStageStateText");
  const stageStateRetry = document.getElementById("clStageStateRetry");
  const stageStateOpenLink = document.getElementById("clStageStateOpenLink");
  const stageTag = document.getElementById("clStageTag");
  const stageCaption = document.getElementById("clStageCaption");
  const stageTime = document.getElementById("clStageTime");
  const stageSeek = document.getElementById("clStageSeek");
  const stageSeekFill = document.getElementById("clStageSeekFill");
  const stageSeekThumb = document.getElementById("clStageSeekThumb");
  const storyBarsContainer = document.getElementById("clStoryBars");

  // Desktop Navigation
  const desktopNav = document.getElementById("clDesktopNav");
  const btnPrev = document.getElementById("clNavPrev");
  const btnNext = document.getElementById("clNavNext");

  // Info Column Elements
  const infoBadge = document.getElementById("clInfoBadge");
  const infoTitle = document.getElementById("clInfoTitle");
  const infoDesc = document.getElementById("clInfoDesc");
  const btnShare = document.getElementById("clBtnShare");
  const btnFullscreen = document.getElementById("clBtnFullscreen");
  const shareFallback = document.getElementById("clShareFallback");
  const shareInput = document.getElementById("clShareInput");
  const moreHead = root.querySelector(".cl-more-head");
  const moreCount = document.getElementById("clMoreCount");
  const cardsRow = document.getElementById("clCardsRow");

  // Phone Grid & Viewer Elements
  const phoneGrid = document.getElementById("clPhoneGrid");
  const phoneViewer = document.getElementById("clPhoneViewer");
  const viewerBars = document.getElementById("clViewerBars");
  const viewerClose = document.getElementById("clViewerClose");
  const viewerMute = document.getElementById("clViewerMute");
  const viewerFeed = document.getElementById("clViewerFeed");

  // Move viewer modal directly to body
  if (phoneViewer && phoneViewer.parentElement !== document.body) {
    document.body.appendChild(phoneViewer);
  }

  // 1 film edge case
  if (filmsData.length === 1) {
    if (desktopNav) desktopNav.style.display = "none";
    if (moreHead) moreHead.style.display = "none";
    if (cardsRow) cardsRow.style.display = "none";
  }

  // Initial Hash routing
  const initialHash = window.location.hash.replace("#reel-", "").replace("#", "");
  if (initialHash) {
    const foundFilm = filmsData.find(f => f.id === initialHash);
    if (foundFilm) {
      activeReelId = foundFilm.id;
      if (currentFilter !== "all" && foundFilm.category !== currentFilter) {
        currentFilter = "all";
      }
    }
  }

  function getFilteredFilms() {
    if (currentFilter === "all") return filmsData;
    return filmsData.filter(f => f.category === currentFilter);
  }

  function formatTime(sec) {
    if (isNaN(sec) || !isFinite(sec) || sec < 0) return "--:--";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  function announceReel(film, idx, total) {
    if (!announcer) return;
    const urdu = isUrdu();
    const template = t("reelOfTotalEn", "reelOfTotalUr", "Reel {current} of {total}: {title}");
    const msg = template
      .replace("{current}", (idx + 1).toString())
      .replace("{total}", total.toString())
      .replace("{title}", urdu ? film.titleUr : film.titleEn);
    announcer.textContent = msg;
  }

  function pauseEveryOtherVideo(exceptVideo) {
    document.querySelectorAll("video").forEach(v => {
      if (v !== exceptVideo && !v.paused) {
        v.pause();
      }
    });
  }

  function setMuteState(muted) {
    isMuted = muted;
    if (stageVideo) stageVideo.muted = isMuted;

    if (viewerFeed) {
      viewerFeed.querySelectorAll("video").forEach(v => {
        v.muted = isMuted;
      });
    }

    const label = isMuted ? t("unmuteEn", "unmuteUr", "Unmute") : t("muteEn", "muteUr", "Mute");

    if (stageMute) {
      stageMute.setAttribute("aria-label", label);
      const iconMuted = stageMute.querySelector(".cl-icon-muted");
      const iconUnmuted = stageMute.querySelector(".cl-icon-unmuted");
      if (iconMuted) iconMuted.style.display = isMuted ? "" : "none";
      if (iconUnmuted) iconUnmuted.style.display = isMuted ? "none" : "";
    }

    if (viewerMute) {
      viewerMute.setAttribute("aria-label", label);
      const iconMuted = viewerMute.querySelector(".cl-icon-muted");
      const iconUnmuted = viewerMute.querySelector(".cl-icon-unmuted");
      if (iconMuted) iconMuted.style.display = isMuted ? "" : "none";
      if (iconUnmuted) iconUnmuted.style.display = isMuted ? "none" : "";
    }

    if (viewerFeed) {
      viewerFeed.querySelectorAll(".cl-rail-mute").forEach(btn => {
        btn.setAttribute("aria-label", label);
        const iconMuted = btn.querySelector(".cl-icon-muted");
        const iconUnmuted = btn.querySelector(".cl-icon-unmuted");
        if (iconMuted) iconMuted.style.display = isMuted ? "" : "none";
        if (iconUnmuted) iconUnmuted.style.display = isMuted ? "none" : "";
      });
    }
  }

  function setStageState(state) {
    if (!stage) return;
    stage.dataset.state = state;
    root.dataset.state = state;

    if (state === "playing") {
      isPlaying = true;
      if (stageTap) stageTap.setAttribute("aria-label", t("pauseEn", "pauseUr", "Pause"));
      if (stageSpinner) stageSpinner.style.opacity = "0";
      if (stageStateOverlay) stageStateOverlay.style.display = "none";
    } else if (state === "paused") {
      isPlaying = false;
      if (stageTap) stageTap.setAttribute("aria-label", t("playEn", "playUr", "Play"));
      if (stageSpinner) stageSpinner.style.opacity = "0";
    } else if (state === "loading") {
      clearTimeout(loadSpinnerTimeout);
      loadSpinnerTimeout = setTimeout(() => {
        if (stage.dataset.state === "loading" && stageSpinner) {
          stageSpinner.style.opacity = "1";
        }
      }, 300);
    } else if (state === "ended") {
      isPlaying = false;
      if (stageTap) stageTap.setAttribute("aria-label", t("replayEn", "replayUr", "Replay"));
      if (stageTapBtn) {
        stageTapBtn.innerHTML = `<svg class="cl-tap-icon" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#14213D" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`;
      }
    }
  }

  function showStageOverlay(type, customText) {
    if (!stageStateOverlay) return;
    stageStateOverlay.style.display = "flex";
    if (stageSpinner) stageSpinner.style.opacity = "0";

    const list = getFilteredFilms();
    const film = list[activeIndexInFilter] || filmsData[0];

    if (type === "stalled") {
      stageStateText.textContent = customText || t("stalledMessageEn", "stalledMessageUr", "Still loading. Check your connection.");
      if (stageStateOpenLink) stageStateOpenLink.style.display = "none";
    } else if (type === "offline") {
      stageStateText.textContent = customText || t("offlineMessageEn", "offlineMessageUr", "You are offline.");
      if (stageStateOpenLink) stageStateOpenLink.style.display = "none";
    } else if (type === "error") {
      stageStateText.textContent = customText || t("errorMessageEn", "errorMessageUr", "This film cannot play on your device.");
      if (stageStateOpenLink) {
        stageStateOpenLink.style.display = "inline-flex";
        stageStateOpenLink.href = film.videoSrc;
      }
    }
  }

  function playVideoSafely(video, onBlocked) {
    if (!video) return;
    pauseEveryOtherVideo(video);

    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "true");
    video.muted = isMuted;

    clearTimeout(stallTimeout);
    stallTimeout = setTimeout(() => {
      if (video.readyState < 3 && !video.paused) {
        setStageState("stalled");
        showStageOverlay("stalled");
      }
    }, 8000);

    const promise = video.play();
    if (promise !== undefined) {
      promise.then(() => {
        clearTimeout(stallTimeout);
        clearTimeout(widthCheckTimeout);
        widthCheckTimeout = setTimeout(() => {
          if (!video.paused && video.videoWidth === 0) {
            setStageState("error");
            showStageOverlay("error");
          }
        }, 3000);
      }).catch(err => {
        clearTimeout(stallTimeout);
        if (err.name === "AbortError") return;
        if (err.name === "NotAllowedError") {
          setMuteState(true);
          video.muted = true;
          video.play().catch(() => {
            if (onBlocked) onBlocked();
          });
          return;
        }
        setStageState("error");
        showStageOverlay("error");
        if (onBlocked) onBlocked();
      });
    }
  }

  function renderStoryBars() {
    const list = getFilteredFilms();
    const renderBarsInContainer = (container) => {
      if (!container) return;
      container.innerHTML = "";
      list.forEach((_, idx) => {
        const bar = document.createElement("div");
        bar.className = "cl-bar";
        bar.setAttribute("role", "progressbar");
        bar.setAttribute("aria-valuemin", "0");
        bar.setAttribute("aria-valuemax", "100");
        const fill = document.createElement("div");
        fill.className = "cl-bar-fill";
        if (idx < activeIndexInFilter) {
          fill.style.width = "100%";
          bar.setAttribute("aria-valuenow", "100");
        } else {
          fill.style.width = "0%";
          bar.setAttribute("aria-valuenow", "0");
        }
        bar.appendChild(fill);
        container.appendChild(bar);
      });
    };

    renderBarsInContainer(storyBarsContainer);
    renderBarsInContainer(viewerBars);
  }

  function updateStoryBarsProgress(currentTime, duration) {
    if (!duration || isNaN(duration)) return;
    const pct = Math.min(100, Math.max(0, (currentTime / duration) * 100));

    const updateInContainer = (container) => {
      if (!container) return;
      const bars = container.querySelectorAll(".cl-bar");
      bars.forEach((bar, idx) => {
        const fill = bar.querySelector(".cl-bar-fill");
        if (!fill) return;
        if (idx < activeIndexInFilter) {
          fill.style.width = "100%";
          bar.setAttribute("aria-valuenow", "100");
        } else if (idx === activeIndexInFilter) {
          fill.style.width = pct + "%";
          bar.setAttribute("aria-valuenow", Math.round(pct).toString());
        } else {
          fill.style.width = "0%";
          bar.setAttribute("aria-valuenow", "0");
        }
      });
    };

    updateInContainer(storyBarsContainer);
    updateInContainer(viewerBars);
  }

  function updateDesktopNavButtons() {
    const list = getFilteredFilms();
    if (!btnPrev || !btnNext) return;
    const isFirst = activeIndexInFilter <= 0;
    const isLast = activeIndexInFilter >= list.length - 1;

    btnPrev.setAttribute("aria-disabled", isFirst ? "true" : "false");
    btnNext.setAttribute("aria-disabled", isLast ? "true" : "false");
    btnPrev.classList.toggle("is-disabled", isFirst);
    btnNext.classList.toggle("is-disabled", isLast);
  }

  function renderDesktopCards() {
    if (!cardsRow) return;
    cardsRow.innerHTML = "";
    const urdu = isUrdu();
    filmsData.forEach(film => {
      const isMatch = currentFilter === "all" || film.category === currentFilter;
      const card = document.createElement("button");
      card.type = "button";
      card.className = "cl-card" + (film.id === activeReelId ? " is-active" : "") + (!isMatch ? " is-dimmed" : "");
      card.setAttribute("role", "listitem");
      card.setAttribute("aria-label", urdu ? film.titleUr : film.titleEn);
      card.dataset.id = film.id;

      card.innerHTML = `
        <div class="cl-card-thumb">
          <img src="${film.posterSrc}" alt="" loading="lazy">
          <span class="cl-card-play" aria-hidden="true">▶</span>
          <span class="cl-card-dur">${film.duration}</span>
        </div>
        <span class="cl-card-title">${urdu ? film.titleUr : film.titleEn}</span>
      `;

      card.addEventListener("click", () => {
        selectReelById(film.id, true);
      });

      cardsRow.appendChild(card);
    });

    if (moreCount) {
      const list = getFilteredFilms();
      moreCount.textContent = list.length + (urdu ? " ویڈیوز" : " films");
    }
  }

  function renderPhoneGrid() {
    if (!phoneGrid) return;
    phoneGrid.innerHTML = "";
    const urdu = isUrdu();
    const list = getFilteredFilms();
    list.forEach(film => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "cl-phone-card" + (film.id === activeReelId ? " is-active" : "");
      item.setAttribute("role", "listitem");
      item.setAttribute("aria-label", urdu ? film.titleUr : film.titleEn);
      item.dataset.id = film.id;

      item.innerHTML = `
        <div class="cl-phone-card-media">
          <img src="${film.posterSrc}" alt="" loading="lazy">
          <span class="cl-phone-card-play" aria-hidden="true">▶</span>
          <span class="cl-phone-card-tag">${urdu ? film.categoryLabelUr : film.categoryLabelEn}</span>
          <span class="cl-phone-card-dur">${film.duration}</span>
        </div>
        <div class="cl-phone-card-meta">
          <h4 class="cl-phone-card-title">${urdu ? film.titleUr : film.titleEn}</h4>
        </div>
      `;

      item.addEventListener("click", () => {
        lastFocusedElement = item;
        selectReelById(film.id, false);
        openPhoneViewer();
      });

      phoneGrid.appendChild(item);
    });
  }

  function selectReelById(id, shouldPlay) {
    const list = getFilteredFilms();
    let idx = list.findIndex(f => f.id === id);
    if (idx === -1) {
      if (list.length > 0) {
        idx = 0;
        id = list[0].id;
      } else {
        return;
      }
    }

    activeReelId = id;
    activeIndexInFilter = idx;
    const film = list[idx];
    const urdu = isUrdu();

    try {
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", "#reel-" + film.id);
      }
    } catch (e) {}

    announceReel(film, idx, list.length);

    // Update Desktop Info
    if (stageTag) stageTag.textContent = (urdu ? film.categoryLabelUr : film.categoryLabelEn).toUpperCase();
    if (stageCaption) stageCaption.textContent = urdu ? film.titleUr : film.titleEn;
    if (stageTime) stageTime.textContent = `0:00 / ${film.duration}`;
    if (infoBadge) infoBadge.textContent = urdu ? film.badgeUr : film.badgeEn;
    if (infoTitle) infoTitle.textContent = urdu ? film.titleUr : film.titleEn;
    if (infoDesc) infoDesc.textContent = urdu ? film.descriptionUr : film.descriptionEn;

    if (stageTapBtn) {
      stageTapBtn.innerHTML = `<svg class="cl-tap-icon" viewBox="0 0 24 24" width="32" height="32" fill="#14213D" aria-hidden="true"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>`;
    }

    // Update Desktop Stage Video
    if (stageVideo && !isViewerOpen) {
      stageVideo.poster = film.posterSrc;
      if (stageSource) {
        stageSource.src = film.videoSrc;
      } else {
        stageVideo.src = film.videoSrc;
      }
      stageVideo.load();
      if (shouldPlay) {
        setStageState("loading");
        playVideoSafely(stageVideo, () => setStageState("paused"));
      } else {
        setStageState("paused");
      }
    }

    renderStoryBars();
    updateDesktopNavButtons();
    renderDesktopCards();
    renderPhoneGrid();

    // If phone viewer is open, scroll feed to active slide
    if (isViewerOpen && viewerFeed) {
      const slides = viewerFeed.querySelectorAll(".cl-viewer-slide");
      if (slides[idx]) {
        slides[idx].scrollIntoView({ behavior: isReducedMotion() ? "auto" : "smooth", block: "start" });
      }
    }
  }

  function prevReel() {
    const list = getFilteredFilms();
    if (activeIndexInFilter <= 0) return;
    selectReelById(list[activeIndexInFilter - 1].id, isPlaying);
  }

  function nextReel() {
    const list = getFilteredFilms();
    if (activeIndexInFilter >= list.length - 1) return;
    selectReelById(list[activeIndexInFilter + 1].id, isPlaying);
  }

  function toggleStagePlay() {
    const now = Date.now();
    if (now - lastTapTime < 150) return;
    lastTapTime = now;

    if (!stageVideo) return;
    if (stage.dataset.state === "ended") {
      stageVideo.currentTime = 0;
      setStageState("loading");
      playVideoSafely(stageVideo);
      return;
    }

    if (stageVideo.paused) {
      setStageState("loading");
      playVideoSafely(stageVideo, () => setStageState("paused"));
    } else {
      stageVideo.pause();
      setStageState("paused");
    }

    if (!isReducedMotion() && stageTapBtn) {
      stageTapBtn.classList.remove("is-flashing");
      void stageTapBtn.offsetWidth;
      stageTapBtn.classList.add("is-flashing");
    }
  }

  function shareCurrentReel() {
    const list = getFilteredFilms();
    const film = list[activeIndexInFilter] || filmsData[0];
    const urdu = isUrdu();
    const title = urdu ? film.titleUr : film.titleEn;
    const shareUrl = window.location.origin + window.location.pathname + "#reel-" + film.id;

    if (navigator.share) {
      navigator.share({
        title: title,
        text: (urdu ? film.descriptionUr : film.descriptionEn),
        url: shareUrl
      }).catch(() => {});
    } else {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl).then(() => {
          if (window.HESToast && window.HESToast.success) {
            window.HESToast.success(t("linkCopiedEn", "linkCopiedUr", "Link copied to clipboard!"));
          } else {
            alert(t("linkCopiedEn", "linkCopiedUr", "Link copied to clipboard!"));
          }
        }).catch(() => {
          openWhatsAppOrFallback();
        });
      } else {
        openWhatsAppOrFallback();
      }
    }

    function openWhatsAppOrFallback() {
      const waUrl = "https://wa.me/?text=" + encodeURIComponent(title + ": " + shareUrl);
      const opened = window.open(waUrl, "_blank");
      if (!opened) {
        if (shareFallback && shareInput) {
          shareFallback.style.display = "block";
          shareInput.value = shareUrl;
          shareInput.focus();
          shareInput.select();
        }
      }
    }
  }

  function openFullscreen(el) {
    const target = el || stageVideo || stage;
    if (!target) return;
    if (target.requestFullscreen) {
      target.requestFullscreen().catch(() => {});
    } else if (target.webkitRequestFullscreen) {
      target.webkitRequestFullscreen();
    } else if (target.webkitEnterFullscreen) {
      target.webkitEnterFullscreen();
    }
  }

  /* --------------------------------------------------------------------------
     INSTAGRAM-STYLE PHONE REEL VIEWER
     -------------------------------------------------------------------------- */
  function buildViewerSlides() {
    if (!viewerFeed) return;
    viewerFeed.innerHTML = "";
    const list = getFilteredFilms();
    const urdu = isUrdu();

    list.forEach((film, idx) => {
      const slide = document.createElement("div");
      slide.className = "cl-viewer-slide";
      slide.dataset.id = film.id;
      slide.dataset.index = idx.toString();

      slide.innerHTML = `
        <video class="cl-slide-video" playsinline webkit-playsinline="true" loop muted preload="none" poster="${film.posterSrc}"></video>

        <div class="cl-tap" role="button" tabindex="0" aria-label="${t("playEn", "playUr", "Play")}">
          <div class="cl-tap-btn" aria-hidden="true">
            <svg class="cl-tap-icon" viewBox="0 0 24 24" width="28" height="28" fill="#14213D" aria-hidden="true"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>
          </div>
        </div>

        <div class="cl-spinner" aria-hidden="true">
          <div class="cl-spinner-ring"></div>
        </div>

        <div class="cl-state-overlay" style="display:none;">
          <p class="cl-state-text"></p>
          <div class="cl-state-actions">
            <button type="button" class="cl-state-retry">${t("retryEn", "retryUr", "Retry")}</button>
            <a href="${film.videoSrc}" target="_blank" rel="noopener noreferrer" class="cl-state-openlink" style="display:none;">${t("openVideoEn", "openVideoUr", "Open video")}</a>
          </div>
        </div>

        <div class="cl-rail">
          <button type="button" class="cl-rail-btn cl-rail-mute" aria-label="${isMuted ? t("unmuteEn", "unmuteUr", "Unmute") : t("muteEn", "muteUr", "Mute")}">
            <svg class="cl-icon-muted" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="${isMuted ? "" : "display:none;"}"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></svg>
            <svg class="cl-icon-unmuted" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="${isMuted ? "display:none;" : ""}"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
          </button>
          <button type="button" class="cl-rail-btn cl-rail-share" aria-label="${t("shareEn", "shareUr", "Share")}">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
          </button>
          <button type="button" class="cl-rail-btn cl-rail-fs" aria-label="${t("fullScreenEn", "fullScreenUr", "Full screen")}">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
          </button>
        </div>

        <div class="cl-viewer-bottom">
          <span class="cl-tag">${(urdu ? film.categoryLabelUr : film.categoryLabelEn).toUpperCase()}</span>
          <h4 class="cl-viewer-title">${urdu ? film.titleUr : film.titleEn}</h4>
          <p class="cl-viewer-desc">${urdu ? film.descriptionUr : film.descriptionEn}</p>
          <div class="cl-viewer-progress">
            <div class="cl-viewer-progress-fill"></div>
          </div>
          <div class="cl-viewer-hint">
            <span>↑</span> <span>${t("swipeUpHintEn", "swipeUpHintUr", "Swipe up for next reel")}</span>
          </div>
        </div>
      `;

      // Tap handling on slide
      const tapLayer = slide.querySelector(".cl-tap");
      const video = slide.querySelector("video");
      const tapBtn = slide.querySelector(".cl-tap-btn");

      tapLayer.addEventListener("click", () => {
        const now = Date.now();
        if (now - lastTapTime < 150) return;
        lastTapTime = now;

        if (video.paused) {
          playVideoSafely(video);
          tapLayer.setAttribute("aria-label", t("pauseEn", "pauseUr", "Pause"));
        } else {
          video.pause();
          tapLayer.setAttribute("aria-label", t("playEn", "playUr", "Play"));
        }

        if (!isReducedMotion() && tapBtn) {
          tapBtn.classList.remove("is-flashing");
          void tapBtn.offsetWidth;
          tapBtn.classList.add("is-flashing");
        }
      });

      // Rail listeners
      const railMuteBtn = slide.querySelector(".cl-rail-mute");
      const railShareBtn = slide.querySelector(".cl-rail-share");
      const railFsBtn = slide.querySelector(".cl-rail-fs");

      railMuteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        setMuteState(!isMuted);
      });
      railShareBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        shareCurrentReel();
      });
      railFsBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openFullscreen(video);
      });

      // Video event listeners
      video.addEventListener("timeupdate", () => {
        if (!video.duration || isNaN(video.duration)) return;
        const fill = slide.querySelector(".cl-viewer-progress-fill");
        const pct = (video.currentTime / video.duration) * 100;
        if (fill) fill.style.width = pct + "%";
        if (idx === activeIndexInFilter) {
          updateStoryBarsProgress(video.currentTime, video.duration);
        }
      });

      video.addEventListener("playing", () => {
        slide.dataset.state = "playing";
        const spinner = slide.querySelector(".cl-spinner");
        const overlay = slide.querySelector(".cl-state-overlay");
        if (spinner) spinner.style.opacity = "0";
        if (overlay) overlay.style.display = "none";
      });

      video.addEventListener("pause", () => {
        slide.dataset.state = "paused";
      });

      video.addEventListener("waiting", () => {
        slide.dataset.state = "loading";
        const spinner = slide.querySelector(".cl-spinner");
        setTimeout(() => {
          if (slide.dataset.state === "loading" && spinner) spinner.style.opacity = "1";
        }, 300);
      });

      video.addEventListener("error", () => {
        slide.dataset.state = "error";
        const overlay = slide.querySelector(".cl-state-overlay");
        const text = slide.querySelector(".cl-state-text");
        const link = slide.querySelector(".cl-state-openlink");
        if (overlay && text) {
          overlay.style.display = "flex";
          text.textContent = t("errorMessageEn", "errorMessageUr", "This film cannot play on your device.");
          if (link) {
            link.style.display = "inline-flex";
            link.href = film.videoSrc;
          }
        }
      });

      const retryBtn = slide.querySelector(".cl-state-retry");
      if (retryBtn) {
        retryBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          video.load();
          playVideoSafely(video);
        });
      }

      viewerFeed.appendChild(slide);
    });

    setupFeedObserver();
  }

  function setupFeedObserver() {
    if (feedObserver) feedObserver.disconnect();
    if (!("IntersectionObserver" in window) || !viewerFeed) return;

    feedObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          const slide = entry.target;
          const idx = parseInt(slide.dataset.index, 10);
          onSlideBecomeActive(idx);
        }
      });
    }, {
      root: viewerFeed,
      threshold: 0.6
    });

    viewerFeed.querySelectorAll(".cl-viewer-slide").forEach(s => feedObserver.observe(s));
  }

  function onSlideBecomeActive(idx) {
    const list = getFilteredFilms();
    if (idx < 0 || idx >= list.length) return;

    activeIndexInFilter = idx;
    const film = list[idx];
    activeReelId = film.id;

    try {
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", "#reel-" + film.id);
      }
    } catch (e) {}

    announceReel(film, idx, list.length);
    renderStoryBars();

    const slides = viewerFeed.querySelectorAll(".cl-viewer-slide");
    slides.forEach((slide, i) => {
      const video = slide.querySelector("video");
      if (!video) return;

      if (i === idx) {
        if (!video.src || !video.src.includes(film.videoSrc)) {
          video.src = film.videoSrc;
          video.load();
        }
        playVideoSafely(video);

        if (!isSaveData && i + 1 < list.length) {
          const nextVideo = slides[i + 1].querySelector("video");
          if (nextVideo && (!nextVideo.src || !nextVideo.src.includes(list[i + 1].videoSrc))) {
            nextVideo.src = list[i + 1].videoSrc;
            nextVideo.preload = "metadata";
          }
        }
      } else if (Math.abs(i - idx) > 1) {
        video.pause();
        video.currentTime = 0;
        video.removeAttribute("src");
        video.load();
      } else {
        video.pause();
      }
    });
  }

  function openPhoneViewer() {
    if (!phoneViewer || isViewerOpen) return;
    isViewerOpen = true;

    if (stageVideo) {
      stageVideo.pause();
      stageVideo.currentTime = 0;
    }
    pauseEveryOtherVideo(null);

    document.body.classList.add("reel-viewer-open");
    phoneViewer.removeAttribute("hidden");

    try {
      window.history.pushState({ clReelViewer: true }, "");
    } catch (e) {}

    buildViewerSlides();

    const slides = viewerFeed.querySelectorAll(".cl-viewer-slide");
    if (slides[activeIndexInFilter]) {
      slides[activeIndexInFilter].scrollIntoView({ behavior: "auto", block: "start" });
      onSlideBecomeActive(activeIndexInFilter);
    }

    if (viewerClose) viewerClose.focus();
  }

  function closePhoneViewer() {
    if (!phoneViewer || !isViewerOpen) return;
    isViewerOpen = false;

    if (viewerFeed) {
      viewerFeed.querySelectorAll("video").forEach(v => {
        v.pause();
        v.currentTime = 0;
        v.removeAttribute("src");
        v.load();
      });
    }

    phoneViewer.setAttribute("hidden", "");
    document.body.classList.remove("reel-viewer-open");

    const list = getFilteredFilms();
    const film = list[activeIndexInFilter] || filmsData[0];
    if (stageVideo) {
      stageVideo.poster = film.posterSrc;
      if (stageSource) stageSource.src = film.videoSrc;
      else stageVideo.src = film.videoSrc;
      stageVideo.load();
      setStageState("paused");
    }

    if (lastFocusedElement && lastFocusedElement.focus) {
      lastFocusedElement.focus();
    }
  }

  window.addEventListener("popstate", () => {
    if (isViewerOpen) {
      closePhoneViewer();
    }
  });

  if (stageTap) stageTap.addEventListener("click", toggleStagePlay);
  if (stageVideo) stageVideo.addEventListener("click", toggleStagePlay);

  if (stageMute) {
    stageMute.addEventListener("click", (e) => {
      e.stopPropagation();
      setMuteState(!isMuted);
    });
  }

  if (viewerMute) {
    viewerMute.addEventListener("click", (e) => {
      e.stopPropagation();
      setMuteState(!isMuted);
    });
  }

  if (viewerClose) {
    viewerClose.addEventListener("click", () => {
      if (window.history.state && window.history.state.clReelViewer) {
        window.history.back();
      } else {
        closePhoneViewer();
      }
    });
  }

  if (btnPrev) btnPrev.addEventListener("click", prevReel);
  if (btnNext) btnNext.addEventListener("click", nextReel);

  if (btnShare) btnShare.addEventListener("click", shareCurrentReel);
  if (btnFullscreen) btnFullscreen.addEventListener("click", () => openFullscreen(stage));

  if (stageVideo) {
    stageVideo.addEventListener("timeupdate", () => {
      if (!stageVideo.duration || isNaN(stageVideo.duration)) return;
      const cur = stageVideo.currentTime;
      const dur = stageVideo.duration;
      const pct = (cur / dur) * 100;

      if (stageTime) stageTime.textContent = `${formatTime(cur)} / ${formatTime(dur)}`;
      if (stageSeekFill) stageSeekFill.style.width = pct + "%";
      if (stageSeekThumb) stageSeekThumb.style.left = pct + "%";
      if (stageSeek) stageSeek.setAttribute("aria-valuenow", Math.round(pct).toString());

      updateStoryBarsProgress(cur, dur);
    });

    stageVideo.addEventListener("playing", () => setStageState("playing"));
    stageVideo.addEventListener("pause", () => setStageState("paused"));
    stageVideo.addEventListener("waiting", () => setStageState("loading"));

    stageVideo.addEventListener("ended", () => {
      const list = getFilteredFilms();
      if (activeIndexInFilter < list.length - 1) {
        nextReel();
      } else {
        setStageState("ended");
      }
    });

    stageVideo.addEventListener("error", () => {
      setStageState("error");
      showStageOverlay("error");
    });
    if (stageSource) {
      stageSource.addEventListener("error", () => {
        setStageState("error");
        showStageOverlay("error");
      });
    }
  }

  if (stageStateRetry) {
    stageStateRetry.addEventListener("click", () => {
      if (!stageVideo) return;
      stageVideo.load();
      playVideoSafely(stageVideo);
    });
  }

  if (stageSeek) {
    const seekToPosition = (e) => {
      if (!stageVideo || !stageVideo.duration) return;
      const rect = stageSeek.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clickPos = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const ratio = clickPos / rect.width;
      stageVideo.currentTime = ratio * stageVideo.duration;
    };

    stageSeek.addEventListener("mousedown", (e) => {
      isSeeking = true;
      seekToPosition(e);
    });
    window.addEventListener("mousemove", (e) => {
      if (isSeeking) seekToPosition(e);
    });
    window.addEventListener("mouseup", () => {
      isSeeking = false;
    });

    stageSeek.addEventListener("touchstart", (e) => {
      isSeeking = true;
      seekToPosition(e);
    }, { passive: true });
    window.addEventListener("touchmove", (e) => {
      if (isSeeking) seekToPosition(e);
    }, { passive: true });
    window.addEventListener("touchend", () => {
      isSeeking = false;
    });

    stageSeek.addEventListener("keydown", (e) => {
      if (!stageVideo || !stageVideo.duration) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        stageVideo.currentTime = Math.max(0, stageVideo.currentTime - 5);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        stageVideo.currentTime = Math.min(stageVideo.duration, stageVideo.currentTime + 5);
      } else if (e.key === "Home") {
        e.preventDefault();
        stageVideo.currentTime = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        stageVideo.currentTime = stageVideo.duration;
      }
    });
  }

  if (stage) {
    stage.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        prevReel();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        nextReel();
      } else if (e.key === " " || e.key === "Enter" || e.key === "k") {
        e.preventDefault();
        toggleStagePlay();
      } else if (e.key === "m") {
        e.preventDefault();
        setMuteState(!isMuted);
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (isViewerOpen) {
        closePhoneViewer();
      }
    }
  });

  filterChips.forEach(chip => {
    chip.addEventListener("click", () => {
      const filter = chip.dataset.filter || "all";
      if (currentFilter === filter) return;

      currentFilter = filter;
      filterChips.forEach(c => {
        const isActive = c === chip;
        c.classList.toggle("is-active", isActive);
        c.setAttribute("aria-selected", isActive ? "true" : "false");
      });

      const list = getFilteredFilms();
      const exists = list.some(f => f.id === activeReelId);
      if (!exists && list.length > 0) {
        selectReelById(list[0].id, isPlaying);
      } else {
        renderStoryBars();
        updateDesktopNavButtons();
        renderDesktopCards();
        renderPhoneGrid();
        if (isViewerOpen) buildViewerSlides();
      }
    });
  });

  window.addEventListener("offline", () => {
    pauseEveryOtherVideo(null);
    showStageOverlay("offline");
  });
  window.addEventListener("online", () => {
    if (stageStateOverlay) stageStateOverlay.style.display = "none";
    setStageState("paused");
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      pauseEveryOtherVideo(null);
    }
  });
  window.addEventListener("pagehide", () => {
    pauseEveryOtherVideo(null);
  });
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      pauseEveryOtherVideo(null);
      setStageState("paused");
    }
  });

  window.addEventListener("hes-language-changed", () => {
    selectReelById(activeReelId, isPlaying);
  });
  if (window.MutationObserver) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        if (m.attributeName === "dir" || m.attributeName === "lang") {
          selectReelById(activeReelId, isPlaying);
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
  }

  setMuteState(true);
  selectReelById(activeReelId, false);
}
