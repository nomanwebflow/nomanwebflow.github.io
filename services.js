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
    const targetHeight = triggerElement?.offsetHeight || window.innerHeight;
  
    gsap.fromTo(
      "[hero-content]",
      { scale: 1, filter: "blur(0px)" },
      {
        scale: 0.9,
        filter: "blur(10px)",
        ease: "none",
        scrollTrigger: {
          trigger: "[service-hero-trigger]",
          start: `top ${targetHeight}px`,
          end: "top top",
          scrub: true,
          markers: true,
        },
      }
    );
  
    // Mobile scroll interactions
    mm.add("(max-width: 767px)", () => {
      if (!serviceSection || !tabsNav || !nav) return;
  
      // Initialize position and hide class
      gsap.set(tabsNav, { yPercent: 150 });
      tabsNav.classList.add("hide-chatbot");
  
      ScrollTrigger.create({
        trigger: serviceSection,
        start: "top 60",
        end: "bottom bottom",
        onEnter: () => {
          toggleY(tabsNav, 0);
          tabsNav.classList.add("hide-chatbot");
        },
        onLeave: () => {
          toggleY(tabsNav, 150);
          tabsNav.classList.remove("hide-chatbot");
        },
        onEnterBack: () => {
          toggleY(tabsNav, 0);
          tabsNav.classList.add("hide-chatbot");
        },
        onLeaveBack: () => {
          toggleY(tabsNav, 150);
          tabsNav.classList.remove("hide-chatbot");
        },
      });
    });
  
    // Pin service tab menu on scroll
    ScrollTrigger.create({
      trigger: tabsNav,
      start: "top 4rem",
      onEnter: () => tabsNav?.classList.add("is-fixed"),
      onLeaveBack: () => tabsNav?.classList.remove("is-fixed"),
    });
  
    // Desktop scroll interactions
    mm.add("(min-width: 768px)", () => {
      if (!serviceSection || !tabsNav || !nav) return;
  
      // FIXED: Changed to only trigger when at the bottom of service section
      ScrollTrigger.create({
        trigger: serviceSection,
        start: "bottom 70%",  // Triggers when the bottom of service section crosses 70% of viewport
        end: "bottom 20%",    // Ends when the bottom is at 20% of viewport
        onEnter: () => toggleY(tabsNav, -250),  // Hide when scrolling past bottom
        onEnterBack: () => toggleY(tabsNav, 0), // Show when scrolling back up
      });
  
      // FIXED: Removed unnecessary ScrollTriggers that were conflicting
      // Only keeping the one that handles nav visibility
      ScrollTrigger.create({
        trigger: serviceSection,
        start: "bottom 80%", // Changed to bottom instead of top
        end: "bottom 20%",
        onEnter: () => toggleY(nav, -150),
        onLeave: () => toggleY(nav, 0),
        onEnterBack: () => toggleY(nav, -150),
        onLeaveBack: () => toggleY(nav, 0),
      });
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