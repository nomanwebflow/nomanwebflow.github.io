/**
 * Service Tabs and Animation Manager
 * Optimized for performance and maintainability
 */

// Cache DOM elements early to avoid repeated queries
const DOM = {
  // Elements are populated on DOMContentLoaded
  nav: null,
  tabsNav: null,
  serviceSection: null,
  buttons: null,
  heroContent: null,
  serviceTrigger: null,
};

// Configuration options
const CONFIG = {
  animation: {
    defaultDuration: 1,
    defaultEase: "0.65, 0.01, 0.05, 0.99",
    blurAmount: 10,
    scaleAmount: 0.9,
  },
  breakpoints: {
    mobile: 767,
  },
};

// Utility functions
const utils = {
  // Remove hash from URL with safe history API usage
  removeHash() {
    if (history && history.replaceState) {
      history.replaceState(
        "",
        document.title,
        window.location.pathname + window.location.search
      );
    }
  },

  // Cache rootFontSize to avoid recalculation
  getRootFontSize() {
    return parseFloat(getComputedStyle(document.documentElement).fontSize);
  },

  // Throttle function to limit execution frequency
  throttle(func, limit = 100) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // Efficient animation helper that caches GSAP instances
  toggleY(target, y, duration = CONFIG.animation.defaultDuration) {
    if (!target) return;
    return gsap.to(target, { yPercent: y, duration });
  },
};

// Button management module
const tabButtons = {
  // Set button widths efficiently with calculated values
  setButtonWidths() {
    if (!DOM.buttons || !DOM.buttons.length) return;

    const rootFontSize = utils.getRootFontSize();
    const isMobile = window.innerWidth <= CONFIG.breakpoints.mobile;

    // Batch read operations
    const widths = Array.from(DOM.buttons).map((btn) =>
      isMobile ? "" : `${btn.offsetWidth / rootFontSize}rem`
    );

    // Batch write operations
    DOM.buttons.forEach((btn, index) => {
      btn.style.width = widths[index];
    });
  },

  // Tab background animation with GSAP Flip
  initTabBackgroundAnimation() {
    const sections = document.querySelectorAll(".service_section");
    if (!sections.length) return;

    sections.forEach((section) => {
      const buttons = section.querySelectorAll(".service_tab_button");
      const bgElement = section.querySelector(".service_tab_bg");
      if (!bgElement || !buttons.length) return;

      // Pre-define the animation function
      const moveBgTo = (button) => {
        if (!button || !bgElement || button === bgElement.parentNode) return;

        const state = Flip.getState(bgElement);
        button.appendChild(bgElement);
        Flip.from(state, {
          delay: 0.1,
          duration: 0.4,
          ease: "power1.inOut",
          absolute: true,
        });
      };

      // Use one observer for all buttons in this section
      const tabObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "class" &&
            mutation.target.classList.contains("w--current")
          ) {
            moveBgTo(mutation.target);
            break; // Only need to process one match
          }
        }
      });

      // Set up observers efficiently
      buttons.forEach((btn) => {
        tabObserver.observe(btn, {
          attributes: true,
          attributeFilter: ["class"],
        });
      });

      // Initial setup for the current tab
      const current = section.querySelector(".service_tab_button.w--current");
      if (current) moveBgTo(current);
    });
  },

  // Initialize click events
  setupClickEvents() {
    if (!DOM.buttons) return;

    DOM.buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        setTimeout(utils.removeHash, 0);
      });
    });
  },
};

// Scroll animation module
const scrollAnimations = {
  instances: [],

  // Initialize GSAP and register plugins
  setupGSAP() {
    gsap.registerPlugin(ScrollTrigger, CustomEase, Flip);
    CustomEase.create("main", CONFIG.animation.defaultEase);
    gsap.defaults({ ease: "main", duration: CONFIG.animation.defaultDuration });
  },

  // Setup mobile-specific animations
  setupMobileAnimations() {
    if (!DOM.serviceSection || !DOM.tabsNav) return;

    // Set initial state
    gsap.set(DOM.tabsNav, { yPercent: 150 });
    DOM.tabsNav.classList.add("hide-chatbot");

    // Create and store the trigger instance
    const trigger = ScrollTrigger.create({
      trigger: DOM.serviceSection,
      start: "top 60",
      end: "bottom bottom",
      onEnter: () => {
        utils.toggleY(DOM.tabsNav, 0);
        DOM.tabsNav.classList.add("hide-chatbot");
      },
      onLeave: () => {
        utils.toggleY(DOM.tabsNav, 150);
        DOM.tabsNav.classList.remove("hide-chatbot");
      },
      onEnterBack: () => {
        utils.toggleY(DOM.tabsNav, 0);
        DOM.tabsNav.classList.add("hide-chatbot");
      },
      onLeaveBack: () => {
        utils.toggleY(DOM.tabsNav, 150);
        DOM.tabsNav.classList.remove("hide-chatbot");
      },
    });

    this.instances.push(trigger);
  },

  // Setup desktop-specific animations
  setupDesktopAnimations() {
    if (!DOM.serviceSection || !DOM.tabsNav || !DOM.nav) return;

    // Create and store scroll trigger instances
    const trigger1 = ScrollTrigger.create({
      trigger: DOM.serviceSection,
      start: "bottom 70%",
      end: "70% bottom",
      onLeave: () => utils.toggleY(DOM.tabsNav, -250),
      onEnterBack: () => utils.toggleY(DOM.tabsNav, 0),
    });

    const trigger2 = ScrollTrigger.create({
      trigger: DOM.serviceSection,
      start: "top center",
      end: "bottom top",
      onEnter: () => utils.toggleY(DOM.nav, -150),
      onLeave: () => utils.toggleY(DOM.nav, 0),
      onEnterBack: () => utils.toggleY(DOM.nav, -150),
      onLeaveBack: () => utils.toggleY(DOM.nav, 0),
    });

    this.instances.push(trigger1, trigger2);
  },

  // Pin the tab menu
  setupPinnedTabMenu() {
    if (!DOM.tabsNav) return;

    const trigger = ScrollTrigger.create({
      trigger: DOM.tabsNav,
      start: "top 4rem",
      onEnter: () => DOM.tabsNav.classList.add("is-fixed"),
      onLeaveBack: () => DOM.tabsNav.classList.remove("is-fixed"),
    });

    this.instances.push(trigger);
  },

  // Set up hero content animation
  setupHeroAnimation() {
    if (!DOM.heroContent || !DOM.serviceTrigger) return;

    const getTargetHeight = () => DOM.heroContent.offsetHeight || 650;

    const trigger = gsap.fromTo(
      DOM.heroContent,
      { scale: 1, filter: "blur(0px)" },
      {
        scale: CONFIG.animation.scaleAmount,
        filter: `blur(${CONFIG.animation.blurAmount}px)`,
        ease: "none",
        scrollTrigger: {
          trigger: DOM.serviceTrigger,
          start: `top ${getTargetHeight()}px`,
          end: "top top",
          scrub: true,
        },
      }
    );

    // Store the ScrollTrigger instance for cleanup
    this.instances.push(trigger.scrollTrigger);
  },

  // Initialize all scroll animations based on viewport
  init() {
    this.setupGSAP();
    this.setupPinnedTabMenu();

    // Use GSAP's built-in matchMedia for responsive behavior
    const mm = gsap.matchMedia();

    mm.add(`(max-width: ${CONFIG.breakpoints.mobile}px)`, () => {
      this.setupMobileAnimations();
    });

    mm.add(`(min-width: ${CONFIG.breakpoints.mobile + 1}px)`, () => {
      this.setupDesktopAnimations();
    });

    this.setupHeroAnimation();
  },

  // Refresh animations on resize (throttled)
  refresh: utils.throttle(function () {
    this.instances.forEach((trigger) => {
      if (trigger && typeof trigger.kill === "function") {
        trigger.kill();
      }
    });

    this.instances = [];
    this.init();
    ScrollTrigger.refresh();
  }, 250),
};

// Main initialization function
function init() {
  // Cache DOM elements
  DOM.nav = document.querySelector(".nav_component");
  DOM.tabsNav = document.querySelector(".service_tab_menu");
  DOM.serviceSection = document.querySelector(".service_section");
  DOM.buttons = document.querySelectorAll(".service_tab_button");
  DOM.heroContent = document.querySelector("[hero-content]");
  DOM.serviceTrigger = document.querySelector("[service-hero-trigger]");

  // Initialize modules
  tabButtons.setButtonWidths();
  tabButtons.setupClickEvents();
  tabButtons.initTabBackgroundAnimation();
  scrollAnimations.init();

  // Set up event listeners (consolidated)
  window.addEventListener("load", () => {
    tabButtons.setButtonWidths();
    ScrollTrigger.refresh();
  });

  window.addEventListener(
    "resize",
    utils.throttle(() => {
      tabButtons.setButtonWidths();
      scrollAnimations.refresh();
    }, 250)
  );
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", init);
