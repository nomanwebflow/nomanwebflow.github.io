function removeHash() {
  history.replaceState(
    null,
    document.title,
    `${window.location.origin}${window.location.pathname}${window.location.search}`
  );
}

document.addEventListener("click", function (e) {
  // Contact Success
  (function () {
    let trigger = document.querySelector(
        '[data-form-end="contact-success-trigger"]'
      ),
      panel = document.querySelector('[data-form-end="contact-success"]');
    if (!trigger || !panel) return;
    let obs = new MutationObserver(() => {
      if (getComputedStyle(trigger).display === "block") {
        let btn = panel.querySelector(".lottie-trigger");
        btn && btn.click();
        trigger.style.display = "none";
        panel.classList.add("is-submitted");
      }
    });
    obs.observe(trigger, {
      attributes: true,
      attributeFilter: ["style"],
    });
  })();

  // Contact Error
  (function () {
    let trigger = document.querySelector(
        '[data-form-end="contact-error-trigger"]'
      ),
      panel = document.querySelector('[data-form-end="contact-error"]');
    if (!trigger || !panel) return;
    let obs = new MutationObserver(() => {
      if (getComputedStyle(trigger).display === "block") {
        let btn = panel.querySelector(".lottie-trigger");
        btn && btn.click();
        trigger.style.display = "none";
        panel.classList.add("is-not-submitted");
      }
    });
    obs.observe(trigger, {
      attributes: true,
      attributeFilter: ["style"],
    });
  })();

  // Newsletter Success
  (function () {
    let trigger = document.querySelector(
        '[data-form-end="newsletter-success-trigger"]'
      ),
      panel = document.querySelector('[data-form-end="newsletter-success"]');
    if (!trigger || !panel) return;
    let obs = new MutationObserver(() => {
      if (getComputedStyle(trigger).display === "block") {
        let btn = panel.querySelector(".lottie-trigger");
        btn && btn.click();
        trigger.style.display = "none";
        panel.classList.add("is-submitted");
      }
    });
    obs.observe(trigger, {
      attributes: true,
      attributeFilter: ["style"],
    });
  })();

  // Newsletter Error
  (function () {
    let trigger = document.querySelector(
        '[data-form-end="newsletter-error-trigger"]'
      ),
      panel = document.querySelector('[data-form-end="newsletter-error"]');
    if (!trigger || !panel) return;
    let obs = new MutationObserver(() => {
      if (getComputedStyle(trigger).display === "block") {
        let btn = panel.querySelector(".lottie-trigger");
        btn && btn.click();
        trigger.style.display = "none";
        panel.classList.add("is-not-submitted");
      }
    });
    obs.observe(trigger, {
      attributes: true,
      attributeFilter: ["style"],
    });
  })();

  // Close any form‑popup overlays or error panels
  $(".form_popup_overlay, [data-error-close]").on("click", function () {
    $(this).closest(".form_popup_component").removeClass("is-submitted");
    $(".form_popup_component").removeClass("is-not-submitted");
    $(".w-form-done").hide();
    $(".w-form-fail").hide();
  });

  // Copy‑link buttons
  let copyBtn = e.target.closest("[data-link-copy]");
  if (copyBtn && copyBtn._tippy) {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        copyBtn._tippy.setContent("Copied!");
        copyBtn._tippy.show();
        let reset = () => {
          copyBtn._tippy.setContent("Copy link");
          copyBtn.removeEventListener("mouseleave", reset);
        };
        copyBtn.addEventListener("mouseleave", reset);
      })
      .catch((err) => console.error("Failed to copy:", err));
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Service collapse buttons (URL‑hash removal)
  document.querySelectorAll("[data-service-collapse-button]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setTimeout(removeHash);
    });
  });
});

$("[data-service-expand-button]").on("click", function () {
  $(".home_services_bottom").addClass("is-expanded");
});

$("[data-service-collapse-button]").on("click", function () {
  $(".home_services_bottom").removeClass("is-expanded");
});

document.addEventListener("DOMContentLoaded", () => {
  // FAQ accordion
  document.querySelectorAll('[faq-element="list"]').forEach((list) => {
    let headers = list.querySelectorAll('[faq-element="header"]'),
      accordions = list.querySelectorAll('[faq-element="accordion"]');

    // Numbering & initial open
    accordions.forEach((section, i) => {
      section.classList.remove("is-open");
      let num = section.querySelector("[data-faq-number]");
      if (num) num.textContent = String(i + 1).padStart(2, "0");
    });
    if (headers[0]) {
      let first = headers[0].closest('[faq-element="accordion"]');
      first && first.classList.add("is-open");
    }

    // Toggle logic
    headers.forEach((hdr) => {
      hdr.addEventListener("click", () => {
        let parent = hdr.closest('[faq-element="accordion"]');
        if (parent.classList.contains("is-open")) {
          parent.classList.remove("is-open");
        } else {
          accordions.forEach((sec) => sec.classList.remove("is-open"));
          parent.classList.add("is-open");
        }
      });
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Main nav open/close + GSAP intro animations
  function initNav() {
    let nav = document.querySelector(".nav"),
      overlay = nav.querySelector(".overlay"),
      menu = nav.querySelector(".menu"),
      panels = nav.querySelectorAll(".bg-panel"),
      toggles = document.querySelectorAll("[data-menu-toggle]"),
      links = nav.querySelectorAll(".menu-link"),
      fades = nav.querySelectorAll("[data-menu-fade]"),
      btn = document.querySelector(".menu-button"),
      paragraphs = btn.querySelectorAll("p"),
      icon = btn.querySelector(".menu-button-icon"),
      tl = gsap.timeline(),
      lockScroll = () => (document.body.style.overflow = "clip"),
      unlockScroll = () => (document.body.style.overflow = "");

    function openNav() {
      lockScroll();
      nav.setAttribute("data-nav", "open");
      tl.clear()
        .set(nav, { display: "block" })
        .set(menu, { xPercent: 0 }, "<")
        .fromTo(paragraphs, { yPercent: 0 }, { yPercent: -100, stagger: 0.2 })
        .fromTo(icon, { rotate: 0 }, { rotate: 315 }, "<")
        .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1 }, "<")
        .fromTo(
          panels,
          { xPercent: 101 },
          { xPercent: 0, stagger: 0.12, duration: 0.575 },
          "<"
        )
        .fromTo(
          links,
          { yPercent: 140, rotate: 10 },
          { yPercent: 0, rotate: 0, stagger: 0.05 },
          "<+=0.35"
        )
        .fromTo(
          fades,
          { autoAlpha: 0, yPercent: 50 },
          { autoAlpha: 1, yPercent: 0, stagger: 0.04 },
          "<+=0.2"
        );
    }

    function closeNav() {
      unlockScroll();
      nav.setAttribute("data-nav", "closed");
      tl.clear()
        .to(overlay, { autoAlpha: 0 })
        .to(menu, { xPercent: 120 }, "<")
        .to(paragraphs, { yPercent: 0 }, "<")
        .to(icon, { rotate: 0 }, "<")
        .set(nav, { display: "none" });
    }

    toggles.forEach((t) =>
      t.addEventListener("click", () => {
        nav.getAttribute("data-nav") === "open" ? closeNav() : openNav();
      })
    );
    document.addEventListener("keydown", (evt) => {
      if (evt.key === "Escape" && nav.getAttribute("data-nav") === "open") {
        closeNav();
      }
    });
  }

  // GSAP + ScrollTrigger + CustomEase setup
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  CustomEase.create("main", "0.65, 0.01, 0.05, 0.99");
  gsap.defaults({ ease: "main", duration: 1 });

  // Scale‑up elements
  gsap.fromTo(
    "[data-scale-up]",
    { scale: 0.5, rotate: 10, autoAlpha: 0 },
    {
      scale: 1,
      autoAlpha: 1,
      rotate: 0,
      duration: 1.5,
      scrollTrigger: {
        trigger: "[data-scale-up]",
        start: "top 65%",
        toggleActions: "play none none none",
      },
    }
  );

  // Service process animations
  gsap.utils.toArray(".service_process_item").forEach((el) => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 45%",
        toggleClass: "is-active",
      },
    });
  });
  gsap.utils.toArray(".service_process_item").forEach((el) => {
    let circ = el.querySelector(".service_process_circ");
    gsap.fromTo(
      circ,
      { scale: 1, backgroundColor: "#505050" },
      {
        scale: 1.6667,
        backgroundColor: "#FFC5B1",
        transformOrigin: "center center",
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top 35%",
          end: "top 25%",
          scrub: true,
        },
      }
    );
  });

  // Staggered text and lines
  gsap.set("[data-words-stagger] .word", { visibility: "visible" });
  document.querySelectorAll("[data-standard-stagger]").forEach((section) => {
    gsap.fromTo(
      section.querySelectorAll(":scope > *"),
      { autoAlpha: 0, y: "5rem" },
      {
        autoAlpha: 1,
        y: "0rem",
        stagger: 0.06,
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  });
  document.querySelectorAll("[data-words-stagger]").forEach((section) => {
    gsap.fromTo(
      section.querySelectorAll(".word"),
      { yPercent: 140, autoAlpha: 0, rotate: 10 },
      {
        yPercent: 0,
        autoAlpha: 1,
        rotate: 0,
        stagger: 0.04,
        scrollTrigger: {
          trigger: section,
          start: "top 95%",
          toggleActions: "play none none none",
        },
      }
    );
  });
  document.querySelectorAll("[data-lines-stagger]").forEach((section) => {
    gsap.fromTo(
      section.querySelectorAll(":scope > *"),
      { autoAlpha: 0, y: "5rem" },
      {
        autoAlpha: 1,
        y: "0rem",
        stagger: 0.06,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );
  });

  // Footer parallax tweaks
  gsap.matchMedia().add("(min-width: 1248px)", () => {
    gsap.fromTo(
      ".footer_component",
      { y: "50%" },
      {
        y: "0%",
        ease: "none",
        scrollTrigger: {
          trigger: ".main-wrapper",
          start: "bottom bottom",
          end: "bottom 10%",
          scrub: true,
        },
      }
    );
  });
  gsap.matchMedia().add("(min-width: 767px)", () => {
    gsap.fromTo(
      ".main-wrapper",
      { borderBottomRightRadius: "3rem", borderBottomLeftRadius: "3rem" },
      {
        borderBottomRightRadius: "1rem",
        borderBottomLeftRadius: "1rem",
        scrollTrigger: {
          trigger: ".main-wrapper",
          start: "bottom bottom",
          end: "bottom 10%",
          scrub: true,
        },
      }
    );
  });

  // Initialize the nav and other triggers
  initNav();
  ScrollTrigger.create({
    trigger: ".page-wrapper",
    start: "top top",
    end: "80px top",
    onEnterBack() {
      let cmp = document.querySelector(".nav_container"),
        navCmp = document.querySelector(".nav_component"),
        variant = navCmp.getAttribute("data-wf--nav--variant");
      gsap.fromTo(
        cmp,
        { maxWidth: "83rem", marginTop: "1.5rem" },
        { maxWidth: "100%", marginTop: "0rem" }
      );
      navCmp.classList.remove("floating");
      variant
        ? navCmp.setAttribute("data-wf--nav--variant", variant)
        : navCmp.removeAttribute("data-wf--nav--variant");
    },
    onLeave() {
      let cmp = document.querySelector(".nav_container"),
        navCmp = document.querySelector(".nav_component");
      gsap.fromTo(
        cmp,
        { maxWidth: "100%", marginTop: "0rem" },
        { maxWidth: "83rem", marginTop: "1.5rem" }
      );
      navCmp.classList.add("floating");
      navCmp.setAttribute("data-wf--nav--variant", "light-mode");
    },
  });

  if (document.documentElement.scrollHeight >= 2 * window.innerHeight) {
    let navCmp = document.querySelector(".nav_component");
    ScrollTrigger.create({
      trigger: ".main-wrapper",
      start: "bottom 70%",
      end: "70% bottom",
      onLeave: () => gsap.to(navCmp, { y: "-150%" }),
      onEnterBack: () => gsap.to(navCmp, { y: "0%" }),
    });
  }

  // Refresh on resize
  let refreshDebounce = (() => {
    let timeout;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => ScrollTrigger.refresh(), 100);
    };
  })();
  new ResizeObserver(refreshDebounce).observe(document.documentElement);
  new ResizeObserver(refreshDebounce).observe(document.body);

  // Footer year
  document.querySelectorAll("[footer-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
});

let typeSplit;
function runSplit() {
  typeSplit = new SplitType("[data-lines-stagger], [data-words-stagger]", {
    types: "lines, words",
  });
  createAnimation();
}
runSplit();

let windowWidth = $(window).innerWidth();
function createAnimation() {
  $(".line").each(function () {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: $(this),
          start: "top 40%",
          end: "bottom center",
          scrub: 1,
        },
      })
      .from($(this), { "--line-width": "0%" });
  });
}
window.addEventListener("resize", function () {
  if (windowWidth !== $(window).innerWidth()) {
    windowWidth = $(window).innerWidth();
    typeSplit.revert();
    runSplit();
  }
});

const createScroll01 = () => {
  let cards = Array.from(document.querySelectorAll(".about_why_card-wrap"));
  cards.forEach((card, idx) => {
    if (idx === cards.length - 1) return;
    let inner = card.querySelector("div");
    inner &&
      gsap
        .timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 25%",
            end: "bottom 10%",
            scrub: true,
          },
        })
        .to(inner, { backgroundColor: "#282828", scale: 0.95, ease: "none" });
  });
};
document.addEventListener("DOMContentLoaded", () => {
  createScroll01();
});

$("[data-accordion-trigger]").on("click", function () {
  let idx = $(this).index("[data-accordion-trigger]");
  $(".about_aproach_img-wrap").removeClass("is-active");
  $(".about_aproach_img-wrap").eq(idx).addClass("is-active");
});

$(".menu-inner a").on("click", function () {
  $(".menu-button").click();
});

document.addEventListener("DOMContentLoaded", () => {
  tippy("[data-tippy-content]", { content: "Tooltip" });
});

window.addEventListener("load", function () {
  let footer = document.querySelector(".footer_component");
  if (footer && footer.offsetHeight > window.innerHeight) {
    footer.style.position = "relative";
  }
});