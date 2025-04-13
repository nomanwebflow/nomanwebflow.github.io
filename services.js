// Optional: Remove hash from URL
function removeHash() {
  history.replaceState(
    "",
    document.title,
    window.location.pathname + window.location.search
  );
}

// Set tab button widths
function setButtonWidths() {
  const rootFontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );
  const buttons = document.querySelectorAll(".service_tab_button");

  buttons.forEach((btn) => {
    btn.style.width =
      window.innerWidth > 768 ? `${btn.offsetWidth / rootFontSize}rem` : "";
  });
}

// Set button widths on load and resize
window.addEventListener("load", setButtonWidths);
window.addEventListener("resize", setButtonWidths);

document.addEventListener("DOMContentLoaded", () => {
  // Click event for service tab buttons
  document.querySelectorAll(".service_tab_button").forEach((btn) => {
    btn.addEventListener("click", () => {
      setTimeout(() => {
        if (typeof removeHash === "function") removeHash();
      });
    });
  });

  // GSAP setup
  gsap.registerPlugin(ScrollTrigger, CustomEase, Flip);
  CustomEase.create("main", "0.65, 0.01, 0.05, 0.99");
  gsap.defaults({ ease: "main", duration: 1 });

  const nav = document.querySelector(".nav_component");
  const tabsNav = document.querySelector(".service_tab_menu");
  const serviceSection = document.querySelector(".service_section");

  // Reusable animation helper
  const toggleY = (target, y) => gsap.to(target, { yPercent: y });

  const mm = gsap.matchMedia();

  const triggerElement = document.querySelector("[hero-content]");
  const scrollTriggerElement = document.querySelector("[service-hero-trigger]");

  function initHeroAnimation() {
    if (!triggerElement || !scrollTriggerElement) return;

    // Kill existing ScrollTrigger for this element, if any
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.trigger === scrollTriggerElement) {
        trigger.kill();
      }
    });

    const targetHeight = triggerElement.offsetHeight || window.innerHeight;

    gsap.fromTo(
      triggerElement,
      { scale: 1, filter: "blur(0px)" },
      {
        scale: 0.9,
        filter: "blur(10px)",
        ease: "none",
        scrollTrigger: {
          trigger: scrollTriggerElement,
          start: `top+=${targetHeight} top`,
          end: "top top",
          scrub: true,
          markers: true,
        },
      }
    );
  }

  // Initialize once
  initHeroAnimation();

  // Re-initialize on resize
  window.addEventListener("resize", initHeroAnimation);

  // Observe content height changes
  const resizeObserver = new ResizeObserver(initHeroAnimation);
  if (triggerElement) resizeObserver.observe(triggerElement);

  // Mobile scroll interactions
  mm.add("(max-width: 767px)", () => {
    if (!serviceSection || !tabsNav || !nav) return;

    // Clean up any existing animations
    gsap.killTweensOf(tabsNav);
    ScrollTrigger.getAll().forEach(t => t.trigger === tabsNav && t.kill());

    // Initialize position with more reasonable values
    gsap.set(tabsNav, { yPercent: 100 });
    tabsNav.classList.add("hide-chatbot");

    const scrollTrigger = ScrollTrigger.create({
      trigger: serviceSection,
      start: "top 60",
      end: "bottom bottom",
      onEnter: () => {
        gsap.to(tabsNav, {
          yPercent: 0,
          duration: 0.3,
          onComplete: () => tabsNav.classList.add("hide-chatbot")
        });
      },
      onLeave: () => {
        tabsNav.classList.remove("hide-chatbot");
        gsap.to(tabsNav, {
          yPercent: 100,
          duration: 0.3
        });
      },
      onEnterBack: () => {
        gsap.to(tabsNav, {
          yPercent: 0,
          duration: 0.3,
          onComplete: () => tabsNav.classList.add("hide-chatbot")
        });
      },
      onLeaveBack: () => {
        tabsNav.classList.remove("hide-chatbot");
        gsap.to(tabsNav, {
          yPercent: 100,
          duration: 0.3
        });
      },
    });

    return () => {
      // Cleanup function when breakpoint changes
      scrollTrigger.kill();
      gsap.set(tabsNav, { yPercent: 0 });
    };
  });

  // Pin service tab menu on scroll
  const pinTrigger = ScrollTrigger.create({
    trigger: tabsNav,
    start: "top 4rem",
    onEnter: () => {
      gsap.to(tabsNav, {
        y: 0,
        onComplete: () => tabsNav?.classList.add("is-fixed")
      });
    },
    onLeaveBack: () => {
      tabsNav?.classList.remove("is-fixed");
      // Reset position if not already handled by other triggers
      if (!ScrollTrigger.isInViewport(tabsNav)) {
        gsap.set(tabsNav, { y: 0 });
      }
    },
  });

  // Ensure pin trigger is killed when matchMedia changes
  mm.add("(min-width: 768px)", () => {
    return () => pinTrigger.kill();
  });

  // Desktop scroll interactions
  mm.add("(min-width: 768px)", () => {
    if (!serviceSection || !tabsNav || !nav) return;

    // Clean up any existing animations
    gsap.killTweensOf([tabsNav, nav]);
    ScrollTrigger.getAll().forEach(t => 
      [tabsNav, nav].includes(t.trigger) && t.kill()
    );

    const tabsScrollTrigger = ScrollTrigger.create({
      trigger: serviceSection,
      start: "bottom bottom",
      end: "bottom bottom",
      onLeave: () => gsap.to(tabsNav, { 
        y: "-100%",
        duration: 0.3
      }),
      onEnterBack: () => gsap.to(tabsNav, { 
        y: "0%",
        duration: 0.3
      }),
    });

    const navScrollTrigger = ScrollTrigger.create({
      trigger: serviceSection,
      start: "top center",
      end: "bottom top",
      onEnter: () => gsap.to(nav, { 
        yPercent: -100,
        duration: 0.3
      }),
      onLeave: () => gsap.to(nav, { 
        yPercent: 0,
        duration: 0.3
      }),
      onEnterBack: () => gsap.to(nav, { 
        yPercent: -100,
        duration: 0.3
      }),
      onLeaveBack: () => gsap.to(nav, { 
        yPercent: 0,
        duration: 0.3
      }),
    });

    return () => {
      // Cleanup function when breakpoint changes
      tabsScrollTrigger.kill();
      navScrollTrigger.kill();
      gsap.set([tabsNav, nav], { y: 0, yPercent: 0 });
    };
  });

  // Tab background animation using Flip
  document.querySelectorAll(".service_section").forEach((section) => {
    const buttons = section.querySelectorAll(".service_tab_button");
    const bgElement = section.querySelector(".service_tab_bg");

    // Set z-index of -1 on the background element
    if (bgElement) {
      bgElement.style.zIndex = "-1";
    }

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

    const tabObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class" &&
          mutation.target.classList.contains("w--current")
        ) {
          moveBgTo(mutation.target);
        }
      });
    });

    buttons.forEach((btn) => {
      tabObserver.observe(btn, {
        attributes: true,
        attributeFilter: ["class"],
      });
    });

    const current = section.querySelector(".service_tab_button.w--current");
    if (current) moveBgTo(current);
  });
});
