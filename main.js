(function () {
  "use strict";

  function safe(fn, name) { try { fn(); } catch (error) { console.warn("[Augusto Aguirre] " + name, error); } }

  function initContact() {
    var link = window.__BRAND__ && window.__BRAND__.contact.whatsapp;
    if (!link) return;
    document.querySelectorAll("[data-whatsapp]").forEach(function (el) { el.href = link; });
  }

  function initSplash() {
    var splash = document.querySelector(".splash");
    if (!splash) return;
    window.setTimeout(function () { splash.classList.add("is-gone"); }, 900);
    window.setTimeout(function () { splash.remove(); }, 1700);
  }

  function initNavigation() {
    var nav = document.querySelector("[data-nav]");
    if (!nav) return;
    window.addEventListener("scroll", function () { nav.classList.toggle("is-scrolled", window.scrollY > 40); }, { passive: true });
  }

  function splitText(el) {
    if (el.dataset.splitReady) return;
    el.dataset.splitReady = "1";
    var html = el.innerHTML.split(/(<br\s*\/?>|<em>.*?<\/em>)/gi).map(function (part) {
      if (!part) return "";
      if (/^<br/i.test(part)) return part;
      if (/^<em>/i.test(part)) return "<em>" + part.replace(/<\/?em>/gi, "").split(/(\s+)/).map(word).join("") + "</em>";
      return part.split(/(\s+)/).map(word).join("");
    }).join("");
    function word(value) { return /^\s+$/.test(value) ? value : "<span class=\"word\">" + value + "</span>"; }
    el.setAttribute("aria-label", el.textContent.trim().replace(/\s+/g, " "));
    el.innerHTML = html;
  }

  function initMotion() {
    var revealItems = document.querySelectorAll(".reveal:not([data-split])");
    document.querySelectorAll("[data-split]").forEach(splitText);
    if (!window.gsap || !window.ScrollTrigger) {
      revealItems.forEach(function (item) { item.classList.add("is-visible"); });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll("[data-split]").forEach(function (el) {
      gsap.fromTo(el.querySelectorAll(".word"), { yPercent: 115, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: "power4.out", stagger: 0.045, scrollTrigger: { trigger: el, start: "top 88%", once: true, threshold: 0.05 } });
    });
    revealItems.forEach(function (item) {
      gsap.fromTo(item, { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: item, start: "top 90%", once: true, threshold: 0.05 } });
    });
    var heroPhoto = document.querySelector(".hero-photo");
    if (heroPhoto) gsap.to(heroPhoto, { yPercent: 9, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.7 } });
    document.querySelectorAll(".image-reveal img").forEach(function (image) {
      gsap.fromTo(image, { scale: 1.14 }, { scale: 1, duration: 1.25, ease: "power3.out", scrollTrigger: { trigger: image, start: "top 88%", once: true, threshold: 0.05 } });
    });
    ScrollTrigger.refresh();
  }

  function initSafetyReveal() {
    window.setTimeout(function () {
      document.querySelectorAll(".reveal").forEach(function (item) { item.style.opacity = "1"; item.style.transform = "none"; });
    }, 6000);
  }

  function initCounters() {
    document.querySelectorAll("[data-count]").forEach(function (el) {
      var hasStarted = false;
      var start = function () {
        if (hasStarted) return;
        hasStarted = true;
        var end = Number(el.dataset.count); var suffix = el.dataset.suffix || ""; var decimals = (String(el.dataset.count).split(".")[1] || "").length; var began = performance.now();
        function tick(now) { var progress = Math.min((now - began) / 1500, 1); var value = end * (1 - Math.pow(1 - progress, 3)); el.textContent = (decimals ? value.toFixed(decimals) : Math.round(value)) + suffix; if (progress < 1) requestAnimationFrame(tick); }
        requestAnimationFrame(tick);
      };
      if (window.IntersectionObserver) new IntersectionObserver(function (entries, observer) { entries.forEach(function (entry) { if (entry.isIntersecting) { start(); observer.unobserve(el); } }); }, { threshold: 0.05 }).observe(el); else start();
    });
  }

  function initMagnetic() {
    if (!window.matchMedia("(hover: hover)").matches) return;
    document.querySelectorAll(".magnetic").forEach(function (button) {
      button.addEventListener("mousemove", function (event) { var r = button.getBoundingClientRect(); var x = (event.clientX - r.left - r.width / 2) * 0.12; var y = (event.clientY - r.top - r.height / 2) * 0.12; button.style.transform = "translate(" + x + "px," + y + "px)"; });
      button.addEventListener("mouseleave", function () { button.style.transform = "translate(0,0)"; });
    });
  }

  function initMarqueeGallery() {
    var gallery = document.querySelector(".marquee-gallery");
    var track = gallery && gallery.querySelector(".marquee-track");
    var set = gallery && gallery.querySelector(".marquee-set");
    if (!gallery || !track || !set || gallery.dataset.marqueeBound) return;
    gallery.dataset.marqueeBound = "1";
    var position = 0;
    var speed = 34;
    var targetSpeed = 34;
    var lastFrame = performance.now();
    var setWidth = 0;

    function measure() { setWidth = set.getBoundingClientRect().width; }
    function frame(now) {
      var elapsed = Math.min((now - lastFrame) / 1000, 0.05);
      lastFrame = now;
      speed += (targetSpeed - speed) * Math.min(elapsed * 7, 1);
      position -= speed * elapsed;
      if (setWidth && position <= -setWidth) position += setWidth;
      track.style.transform = "translate3d(" + position.toFixed(2) + "px,0,0)";
      requestAnimationFrame(frame);
    }
    gallery.addEventListener("mouseenter", function () { targetSpeed = 0; });
    gallery.addEventListener("mouseleave", function () { targetSpeed = 34; });
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("load", measure, { once: true });
    measure();
    requestAnimationFrame(frame);
  }

  function initGalleryLinks() {
    var instagram = "https://www.instagram.com/augustoaguirre_/";
    document.querySelectorAll(".marquee-card").forEach(function (card) {
      var isClone = Boolean(card.closest('[aria-hidden="true"]'));
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", isClone ? "-1" : "0");
      card.setAttribute("aria-label", "Ver más fotos de Augusto Aguirre en Instagram");
      card.addEventListener("click", function () { window.open(instagram, "_blank", "noopener"); });
      card.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          window.open(instagram, "_blank", "noopener");
        }
      });
    });
  }

  function initYear() { document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); }); }

  function boot() {
    safe(initContact, "contact"); safe(initSplash, "splash"); safe(initNavigation, "navigation"); safe(initMotion, "motion"); safe(initSafetyReveal, "safety reveal"); safe(initCounters, "counters"); safe(initMagnetic, "magnetic"); safe(initMarqueeGallery, "marquee gallery"); safe(initGalleryLinks, "gallery links"); safe(initYear, "year");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
