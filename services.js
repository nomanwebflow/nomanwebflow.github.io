const DOM={nav:null,tabsNav:null,serviceSection:null,buttons:null,heroContent:null,serviceTrigger:null},CONFIG={animation:{defaultDuration:1,defaultEase:"0.65, 0.01, 0.05, 0.99",blurAmount:10,scaleAmount:.9},breakpoints:{mobile:767}},utils={removeHash(){history&&history.replaceState&&history.replaceState("",document.title,window.location.pathname+window.location.search)},getRootFontSize:()=>parseFloat(getComputedStyle(document.documentElement).fontSize),throttle(t,e=100){let n;return function(...i){n||(t.apply(this,i),n=!0,setTimeout(()=>n=!1,e))}},toggleY(t,e,n=CONFIG.animation.defaultDuration){if(t)return gsap.to(t,{yPercent:e,duration:n})}},tabButtons={setButtonWidths(){if(!DOM.buttons||!DOM.buttons.length)return;let t=utils.getRootFontSize(),e=window.innerWidth<=CONFIG.breakpoints.mobile,n=Array.from(DOM.buttons).map(n=>e?"":`${n.offsetWidth/t}rem`);DOM.buttons.forEach((t,e)=>{t.style.width=n[e]})},initTabBackgroundAnimation(){let t=document.querySelectorAll(".service_section");t.length&&t.forEach(t=>{let e=t.querySelectorAll(".service_tab_button"),n=t.querySelector(".service_tab_bg");if(!n||!e.length)return;let i=t=>{if(!t||!n||t===n.parentNode)return;let e=Flip.getState(n);t.appendChild(n),Flip.from(e,{delay:.1,duration:.4,ease:"power1.inOut",absolute:!0})},s=new MutationObserver(t=>{for(let e of t)if("attributes"===e.type&&"class"===e.attributeName&&e.target.classList.contains("w--current")){i(e.target);break}});e.forEach(t=>{s.observe(t,{attributes:!0,attributeFilter:["class"]})});let a=t.querySelector(".service_tab_button.w--current");a&&i(a)})},setupClickEvents(){DOM.buttons&&DOM.buttons.forEach(t=>{t.addEventListener("click",()=>{setTimeout(utils.removeHash,0)})})}},scrollAnimations={instances:[],setupGSAP(){gsap.registerPlugin(ScrollTrigger,CustomEase,Flip),CustomEase.create("main",CONFIG.animation.defaultEase),gsap.defaults({ease:"main",duration:CONFIG.animation.defaultDuration})},setupMobileAnimations(){if(!DOM.serviceSection||!DOM.tabsNav)return;gsap.set(DOM.tabsNav,{yPercent:150}),DOM.tabsNav.classList.add("hide-chatbot");let t=ScrollTrigger.create({trigger:DOM.serviceSection,start:"top 60",end:"bottom bottom",onEnter(){utils.toggleY(DOM.tabsNav,0),DOM.tabsNav.classList.add("hide-chatbot")},onLeave(){utils.toggleY(DOM.tabsNav,150),DOM.tabsNav.classList.remove("hide-chatbot")},onEnterBack(){utils.toggleY(DOM.tabsNav,0),DOM.tabsNav.classList.add("hide-chatbot")},onLeaveBack(){utils.toggleY(DOM.tabsNav,150),DOM.tabsNav.classList.remove("hide-chatbot")}});this.instances.push(t)},setupDesktopAnimations(){if(!DOM.serviceSection||!DOM.tabsNav||!DOM.nav)return;let t=ScrollTrigger.create({trigger:DOM.serviceSection,start:"bottom 70%",end:"70% bottom",onLeave:()=>utils.toggleY(DOM.tabsNav,-250),onEnterBack:()=>utils.toggleY(DOM.tabsNav,0)}),e=ScrollTrigger.create({trigger:DOM.serviceSection,start:"top center",end:"bottom top",onEnter:()=>utils.toggleY(DOM.nav,-150),onLeave:()=>utils.toggleY(DOM.nav,0),onEnterBack:()=>utils.toggleY(DOM.nav,-150),onLeaveBack:()=>utils.toggleY(DOM.nav,0)});this.instances.push(t,e)},setupPinnedTabMenu(){if(!DOM.tabsNav)return;let t=ScrollTrigger.create({trigger:DOM.tabsNav,start:"top 4rem",onEnter:()=>DOM.tabsNav.classList.add("is-fixed"),onLeaveBack:()=>DOM.tabsNav.classList.remove("is-fixed")});this.instances.push(t)},setupHeroAnimation(){if(!DOM.heroContent||!DOM.serviceTrigger)return;let t=gsap.fromTo(DOM.heroContent,{scale:1,filter:"blur(0px)"},{scale:CONFIG.animation.scaleAmount,filter:`blur(${CONFIG.animation.blurAmount}px)`,ease:"none",scrollTrigger:{trigger:DOM.serviceTrigger,start:`top ${DOM.heroContent.offsetHeight||650}px`,end:"top top",scrub:!0}});this.instances.push(t.scrollTrigger)},init(){this.setupGSAP(),this.setupPinnedTabMenu();let t=gsap.matchMedia();t.add(`(max-width: ${CONFIG.breakpoints.mobile}px)`,()=>{this.setupMobileAnimations()}),t.add(`(min-width: ${CONFIG.breakpoints.mobile+1}px)`,()=>{this.setupDesktopAnimations()}),this.setupHeroAnimation()},refresh:utils.throttle(function(){this.instances.forEach(t=>{t&&"function"==typeof t.kill&&t.kill()}),this.instances=[],this.init(),ScrollTrigger.refresh()},250)};function init(){DOM.nav=document.querySelector(".nav_component"),DOM.tabsNav=document.querySelector(".service_tab_menu"),DOM.serviceSection=document.querySelector(".service_section"),DOM.buttons=document.querySelectorAll(".service_tab_button"),DOM.heroContent=document.querySelector("[hero-content]"),DOM.serviceTrigger=document.querySelector("[service-hero-trigger]"),tabButtons.setButtonWidths(),tabButtons.setupClickEvents(),tabButtons.initTabBackgroundAnimation(),scrollAnimations.init(),window.addEventListener("load",()=>{tabButtons.setButtonWidths(),ScrollTrigger.refresh()}),window.addEventListener("resize",utils.throttle(()=>{tabButtons.setButtonWidths(),scrollAnimations.refresh()},250))}document.addEventListener("DOMContentLoaded",init),window.addEventListener("load",function(){let t=document.querySelector(".service_hero_section");t&&t.offsetHeight>window.innerHeight&&(t.style.position="relative")});