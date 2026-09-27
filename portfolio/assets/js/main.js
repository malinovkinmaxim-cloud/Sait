/* ==========================================================================
   Mandarin — portfolio interactions
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var t = function (k) { return window.i18n.t(k); };

  /* ---------- Intro ---------- */
  var ready = document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 400); })]) : Promise.resolve();
  ready.then(function () { requestAnimationFrame(function () { root.classList.add('is-loaded'); }); });

  /* ---------- Header, progress & drawer ---------- */
  var header = $('#header');
  var burger = $('.burger');
  var drawer = $('#drawer');
  var bar = $('[data-progress]');
  var lastY = window.scrollY;

  function onScroll() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle('is-scrolled', y > 20);
    header.classList.toggle('is-hidden', y > lastY && y > 600 && !drawer.classList.contains('is-open'));
    lastY = y;
    bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0).toFixed(4) + ')';
    lightWords();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  function setDrawer(open) {
    burger.setAttribute('aria-expanded', String(open));
    root.classList.toggle('is-locked', open);
    if (open) { drawer.hidden = false; requestAnimationFrame(function () { drawer.classList.add('is-open'); }); }
    else { drawer.classList.remove('is-open'); setTimeout(function () { if (!drawer.classList.contains('is-open')) drawer.hidden = true; }, 800); }
  }
  burger.addEventListener('click', function () { setDrawer(burger.getAttribute('aria-expanded') !== 'true'); });
  drawer.addEventListener('click', function (e) { if (e.target.closest('a')) setDrawer(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && drawer.classList.contains('is-open')) { setDrawer(false); burger.focus(); } });
  window.matchMedia('(min-width: 901px)').addEventListener('change', function (m) { if (m.matches) setDrawer(false); });

  /* ---------- Active nav & reveal ---------- */
  if ('IntersectionObserver' in window) {
    var navLinks = $$('.nav a');
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id); }); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (s) { navIO.observe(s); });
  }
  var revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Statement: words light up while scrolling ---------- */
  var statement = $('[data-split]');
  var words = [];
  function splitWords() {
    var text = statement.textContent.trim();
    statement.innerHTML = text.split(/\s+/).map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
    words = $$('.w', statement);
    lightWords();
  }
  function lightWords() {
    if (!words.length) return;
    if (reduceMotion) { words.forEach(function (w) { w.classList.add('is-lit'); }); return; }
    var r = statement.getBoundingClientRect();
    var vh = window.innerHeight;
    var p = (vh * .85 - r.top) / (r.height + vh * .35);
    var n = Math.round(Math.max(0, Math.min(1, p)) * words.length);
    words.forEach(function (w, i) { w.classList.toggle('is-lit', i < n); });
  }

  /* ---------- Ticker ---------- */
  var track = $('[data-ticker]');
  function buildTicker() {
    $$('[data-clone]', track).forEach(function (c) { c.remove(); });
    for (var i = 0; i < 3; i++) {
      var c = track.firstElementChild.cloneNode(true);
      c.removeAttribute('data-i18n');
      c.setAttribute('data-clone', '');
      track.appendChild(c);
    }
  }

  /* ---------- Clock (Moscow, UTC+3) ---------- */
  var clock = $('[data-clock]');
  function tick() {
    var d = new Date(Date.now() + 3 * 3600 * 1000);
    var hm = String(d.getUTCHours()).padStart(2, '0') + ':' + String(d.getUTCMinutes()).padStart(2, '0');
    clock.textContent = (window.i18n.lang === 'ru' ? 'Москва, ' : 'Moscow, ') + hm;
  }
  setInterval(tick, 15000);

  /* ---------- Fruit tilt ---------- */
  var art = $('.hero__art');
  if (finePointer && !reduceMotion) {
    var tiltRaf = 0;
    window.addEventListener('pointermove', function (e) {
      if (tiltRaf || window.scrollY > window.innerHeight) return;
      tiltRaf = requestAnimationFrame(function () {
        tiltRaf = 0;
        var x = e.clientX / window.innerWidth - .5;
        var y = e.clientY / window.innerHeight - .5;
        art.style.transform = 'perspective(900px) rotateY(' + (x * 14).toFixed(2) + 'deg) rotateX(' + (-y * 10).toFixed(2) + 'deg) translate(' + (x * 14).toFixed(1) + 'px,' + (y * 10).toFixed(1) + 'px)';
      });
    }, { passive: true });
    art.style.transition = 'transform 1.2s cubic-bezier(.19, 1, .22, 1)';
  }

  /* ---------- Custom cursor ---------- */
  var cursor = $('[data-cursor]');
  var cursorLabel = $('[data-cursor-label]');
  if (finePointer && !reduceMotion) {
    root.classList.add('has-cursor');
    var cx = -100, cy = -100, tx = -100, ty = -100;
    window.addEventListener('pointermove', function (e) { tx = e.clientX; ty = e.clientY; cursor.classList.remove('is-hidden'); }, { passive: true });
    document.addEventListener('pointerleave', function () { cursor.classList.add('is-hidden'); });
    (function loop() {
      cx += (tx - cx) * .2;
      cy += (ty - cy) * .2;
      cursor.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px)';
      requestAnimationFrame(loop);
    })();
    document.addEventListener('pointerover', function (e) {
      var el = e.target.closest('[data-cursor-text]');
      if (el) { cursorLabel.textContent = t(el.getAttribute('data-cursor-text')); cursor.classList.add('is-big'); }
    });
    document.addEventListener('pointerout', function (e) {
      var el = e.target.closest('[data-cursor-text]');
      if (el && !el.contains(e.relatedTarget)) cursor.classList.remove('is-big');
    });
  }

  /* ---------- Language-aware previews ---------- */
  function swapPreviews(lang) {
    $$('img[data-src-' + lang + ']').forEach(function (img) {
      var src = img.getAttribute('data-src-' + lang);
      if (img.getAttribute('src') !== src) img.setAttribute('src', src);
    });
  }

  /* ---------- Copy email ---------- */
  var toast = $('[data-toast]');
  var toastTimer = 0;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('is-shown');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-shown'); }, 2200);
  }
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) { /* ignore */ }
    ta.remove();
  }
  $$('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var text = b.getAttribute('data-copy');
      var done = function () { showToast(t('contact.copied') + ' · ' + text); };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
      else { fallbackCopy(text); done(); }
    });
  });

  /* ---------- Misc ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Language ---------- */
  window.i18n.on(function (lang) {
    buildTicker();
    splitWords();
    tick();
    swapPreviews(lang);
  });

  onScroll();
})();
