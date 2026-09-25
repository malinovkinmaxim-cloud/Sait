/* ==========================================================================
   THE GOLD — interactions
   No dependencies. Each block is self-contained and safe to remove.
   ========================================================================== */
(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  const header = $('#header');
  const main = $('#main');
  const footer = $('.footer');

  /* ---------- Scroll lock shared by overlays ---------- */
  const locks = new Set();
  function lock(name, on) {
    if (on) locks.add(name); else locks.delete(name);
    root.classList.toggle('is-locked', locks.size > 0);
  }

  /* ---------- Intro curtain ---------- */
  const minDelay = reduceMotion ? 0 : 900;
  const started = performance.now();
  const reveal = () => {
    const wait = Math.max(0, minDelay - (performance.now() - started));
    setTimeout(() => requestAnimationFrame(() => root.classList.add('is-ready')), wait);
  };
  Promise.race([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise(resolve => setTimeout(resolve, 1600))
  ]).then(reveal);

  /* ---------- Images: graceful fallback if a photo fails to load ---------- */
  $$('.media img').forEach(img => {
    const fail = () => img.classList.add('is-missing');
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) fail();
    img.addEventListener('error', fail, { once: true });
  });

  /* ---------- Header state ---------- */
  const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 40);

  /* ---------- Mobile menu ---------- */
  const burger = $('.burger');
  const drawer = $('#menu-panel');
  let drawerOpen = false;

  function setDrawer(open) {
    drawerOpen = open;
    drawer.classList.toggle('is-open', open);
    drawer.inert = !open;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    main.inert = open;
    footer.inert = open;
    lock('drawer', open);
  }

  burger.addEventListener('click', () => setDrawer(!drawerOpen));
  window.matchMedia('(min-width: 1101px)').addEventListener('change', e => { if (e.matches && drawerOpen) setDrawer(false); });

  /* ---------- In-page navigation ---------- */
  function scrollToId(id) {
    const target = document.getElementById(id);
    if (!target) return false;
    const top = id === 'home' ? 0 : target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
    return true;
  }

  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.classList.contains('skip-link') || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const id = a.getAttribute('href').slice(1);
    if (!id || !document.getElementById(id)) return;
    e.preventDefault();
    if (drawerOpen) setDrawer(false);
    if (a.dataset.openTab) selectTab(a.dataset.openTab);
    scrollToId(id);
  });

  // Highlight the section in view
  const navLinks = $$('[data-nav]');
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id === 'intro' || entry.target.id === 'signature' ? null : entry.target.id;
        if (!id) return;
        navLinks.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === `#${id}`));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main > section[id]').forEach(s => spy.observe(s));
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    // Clipped images are fully hidden, so their parent is observed instead
    const targets = new Map();
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        targets.get(entry.target).forEach(el => el.classList.add('is-visible'));
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: .12 });
    revealEls.forEach(el => {
      const target = el.dataset.reveal === 'image' ? el.parentElement : el;
      if (!targets.has(target)) targets.set(target, []);
      targets.get(target).push(el);
      io.observe(target);
    });
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Parallax ---------- */
  const parallax = reduceMotion ? [] : $$('[data-parallax]').map(el => ({ el, speed: parseFloat(el.dataset.parallax) || .06 }));

  function updateParallax() {
    const vh = window.innerHeight;
    parallax.forEach(({ el, speed }) => {
      const box = el.parentElement.getBoundingClientRect();
      if (box.bottom < -100 || box.top > vh + 100) return;
      const progress = clamp((box.top + box.height / 2 - vh / 2) / (vh / 2 + box.height / 2), -1, 1);
      el.style.transform = `translate3d(0, ${(progress * speed * 100).toFixed(2)}%, 0)`;
    });
  }

  let ticking = false;
  const onScroll = () => { updateHeader(); updateParallax(); };
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; onScroll(); });
  }, { passive: true });
  window.addEventListener('resize', () => { onScroll(); moveIndicator(); }, { passive: true });
  onScroll();

  /* ---------- Menu tabs ---------- */
  const tabs = $$('.tabs__tab');
  const indicator = $('.tabs__indicator');

  function moveIndicator() {
    const active = tabs.find(t => t.getAttribute('aria-selected') === 'true');
    if (!active || !indicator) return;
    indicator.style.width = `${active.offsetWidth}px`;
    indicator.style.transform = `translateX(${active.offsetLeft}px)`;
  }

  function selectTab(name, focus = false) {
    const tab = $(`#tab-${name}`);
    if (!tab || tab.getAttribute('aria-selected') === 'true') { moveIndicator(); return; }

    tabs.forEach(t => {
      const selected = t === tab;
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      panel.hidden = !selected;
      panel.classList.toggle('is-active', selected);
      if (selected) {
        $$('.dish', panel).forEach((d, i) => d.style.setProperty('--n', i));
        panel.classList.remove('is-entering');
        void panel.offsetWidth; // restart the entrance animation
        panel.classList.add('is-entering');
      }
    });

    if (focus) tab.focus();
    // Keep the active tab in view inside the scrollable bar (mobile) without moving the page
    const list = tab.parentElement;
    list.scrollTo({ left: tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
    moveIndicator();
  }

  tabs.forEach((tab, i) => {
    const name = tab.id.replace('tab-', '');
    tab.addEventListener('click', () => selectTab(name));
    tab.addEventListener('keydown', e => {
      const keys = { ArrowRight: 1, ArrowLeft: -1, Home: -Infinity, End: Infinity };
      if (!(e.key in keys)) return;
      e.preventDefault();
      let next = i + keys[e.key];
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = tabs.length - 1;
      next = (next + tabs.length) % tabs.length;
      selectTab(tabs[next].id.replace('tab-', ''), true);
    });
  });

  moveIndicator();
  if (document.fonts) document.fonts.ready.then(moveIndicator);

  /* ---------- Gallery lightbox ---------- */
  const galleryButtons = $$('.gallery__btn');
  const lightbox = $('#lightbox');
  const lbImg = $('.lightbox__img', lightbox);
  const lbLabel = $('.lightbox__label', lightbox);
  const lbCount = $('.lightbox__count', lightbox);
  let lbIndex = -1;
  let lbReturnFocus = null;

  function showImage(index) {
    lbIndex = (index + galleryButtons.length) % galleryButtons.length;
    const btn = galleryButtons[lbIndex];
    const thumb = $('img', btn);
    lbImg.classList.remove('is-loaded');
    lbImg.onload = () => lbImg.classList.add('is-loaded');
    lbImg.onerror = () => { lbImg.src = thumb.currentSrc || thumb.src; };
    lbImg.src = btn.dataset.full;
    lbImg.alt = thumb.alt;
    lbLabel.textContent = btn.dataset.caption;
    lbCount.textContent = `${String(lbIndex + 1).padStart(2, '0')} / ${String(galleryButtons.length).padStart(2, '0')}`;
  }

  function openLightbox(index) {
    lbReturnFocus = document.activeElement;
    showImage(index);
    lightbox.inert = false;
    lightbox.classList.add('is-open');
    [header, main, footer].forEach(el => { el.inert = true; });
    lock('lightbox', true);
    $('.lightbox__close', lightbox).focus({ preventScroll: true });
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.inert = true;
    [header, main, footer].forEach(el => { el.inert = false; });
    lock('lightbox', false);
    lbIndex = -1;
    if (lbReturnFocus) lbReturnFocus.focus({ preventScroll: true });
  }

  galleryButtons.forEach((btn, i) => {
    btn.dataset.cursor = '';
    btn.setAttribute('aria-label', `Open image: ${btn.dataset.caption}`);
    btn.addEventListener('click', () => openLightbox(i));
  });

  $('.lightbox__close', lightbox).addEventListener('click', closeLightbox);
  $('.lightbox__nav--prev', lightbox).addEventListener('click', () => showImage(lbIndex - 1));
  $('.lightbox__nav--next', lightbox).addEventListener('click', () => showImage(lbIndex + 1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  // Swipe on touch screens
  let touchX = null;
  lightbox.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) showImage(lbIndex + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  document.addEventListener('keydown', e => {
    if (lbIndex > -1) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showImage(lbIndex + 1);
      if (e.key === 'ArrowLeft') showImage(lbIndex - 1);
      if (e.key === 'Tab') {
        // keep focus inside the lightbox
        const focusables = $$('button', lightbox);
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
      return;
    }
    if (e.key === 'Escape' && drawerOpen) { setDrawer(false); burger.focus(); }
  });

  /* ---------- Reservation form ---------- */
  const form = $('#reserve-form');
  const success = $('#reserve-success');
  const dateInput = $('#f-date');
  const timeSelect = $('#f-time');

  // Last seating per weekday (0 = Sunday), in minutes from midnight
  const LAST_SEATING = [21 * 60 + 30, 22 * 60 + 30, 22 * 60 + 30, 22 * 60 + 30, 22 * 60 + 30, 23 * 60 + 30, 23 * 60 + 30];
  const FIRST_SEATING = 18 * 60;
  const pad2 = n => String(n).padStart(2, '0');
  const toISO = d => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  const parseDate = value => {
    const [y, m, d] = value.split('-').map(Number);
    return value ? new Date(y, m - 1, d) : null;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 90);
  dateInput.min = toISO(today);
  dateInput.max = toISO(maxDate);

  function fillTimes() {
    const date = parseDate(dateInput.value);
    const previous = timeSelect.value;
    const last = LAST_SEATING[(date || today).getDay()];
    const now = new Date();
    const isToday = date && date.getTime() === today.getTime();
    const earliest = isToday ? Math.max(FIRST_SEATING, now.getHours() * 60 + now.getMinutes() + 60) : FIRST_SEATING;

    const options = ['<option value="">Select time</option>'];
    for (let m = FIRST_SEATING; m <= last; m += 30) {
      if (m < earliest) continue;
      const t = `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`;
      options.push(`<option value="${t}"${t === previous ? ' selected' : ''}>${t}</option>`);
    }
    timeSelect.innerHTML = options.join('');
    if (options.length === 1) timeSelect.options[0].textContent = 'Fully booked for today';
  }

  fillTimes();
  dateInput.addEventListener('change', fillTimes);

  const rules = {
    name: v => (v.trim().length >= 2 ? '' : 'Please enter your name.'),
    phone: v => {
      if (!v.trim()) return 'Please enter your phone number.';
      const digits = v.replace(/\D/g, '');
      return /^[+\d\s()\-]+$/.test(v) && digits.length >= 10 && digits.length <= 15 ? '' : 'Please enter a valid phone number.';
    },
    date: v => {
      if (!v) return 'Please choose a date.';
      const d = parseDate(v);
      if (d < today) return 'Please choose a future date.';
      if (d > maxDate) return 'We accept reservations up to 90 days ahead.';
      return '';
    },
    time: v => (v ? '' : 'Please choose a time.'),
    guests: v => (v ? '' : 'Please choose the number of guests.')
  };

  function validateField(input) {
    const rule = rules[input.name];
    if (!rule) return true;
    const message = rule(input.value);
    const error = document.getElementById(`${input.id}-error`);
    input.setAttribute('aria-invalid', String(Boolean(message)));
    if (error) error.textContent = message;
    return !message;
  }

  $$('.field__input', form).forEach(input => {
    input.addEventListener('blur', () => { if (input.value || input.getAttribute('aria-invalid')) validateField(input); });
    input.addEventListener('input', () => { if (input.getAttribute('aria-invalid') === 'true') validateField(input); });
    input.addEventListener('change', () => { if (input.getAttribute('aria-invalid') === 'true') validateField(input); });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (form.classList.contains('is-sending')) return;

    const fields = $$('[name]', form).filter(el => rules[el.name]);
    const invalid = fields.filter(el => !validateField(el));
    if (invalid.length) {
      invalid[0].focus();
      $('.form__status', form).textContent = 'Please check the highlighted fields.';
      return;
    }

    // No backend yet: simulate sending, then show the confirmation.
    const button = $('.form__submit', form);
    button.disabled = true;
    $('.form__submit-text', form).textContent = 'Sending';
    form.classList.add('is-sending');
    $('.form__status', form).textContent = 'Sending your request…';

    setTimeout(() => {
      form.classList.add('is-done');
      setTimeout(() => {
        form.hidden = true;
        success.hidden = false;
        success.focus();
      }, reduceMotion ? 0 : 550);
    }, reduceMotion ? 300 : 1900);
  });

  $('.success__again', success).addEventListener('click', () => {
    form.reset();
    form.classList.remove('is-sending', 'is-done');
    $$('[aria-invalid]', form).forEach(el => el.removeAttribute('aria-invalid'));
    $$('.field__error', form).forEach(el => { el.textContent = ''; });
    $('.form__submit', form).disabled = false;
    $('.form__submit-text', form).textContent = 'Request a reservation';
    $('.form__status', form).textContent = '';
    fillTimes();
    success.hidden = true;
    form.hidden = false;
    $('#f-name').focus();
  });

  /* ---------- Legal dialogs ---------- */
  $$('[data-dialog]').forEach(btn => {
    const dialog = document.getElementById(`dialog-${btn.dataset.dialog}`);
    if (!dialog || typeof dialog.showModal !== 'function') return;
    btn.addEventListener('click', () => dialog.showModal());
    dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  });

  /* ---------- "View" cursor over the gallery ---------- */
  const cursor = finePointer ? $('.cursor') : null;
  if (cursor) {
    let tx = 0, ty = 0, x = 0, y = 0, running = false, seen = false;
    const frame = () => {
      x += (tx - x) * .18;
      y += (ty - y) * .18;
      cursor.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      running = Math.abs(tx - x) > .1 || Math.abs(ty - y) > .1;
      if (running) requestAnimationFrame(frame);
    };
    window.addEventListener('pointermove', e => {
      tx = e.clientX; ty = e.clientY;
      if (!seen) { x = tx; y = ty; seen = true; }
      if (!running) { running = true; requestAnimationFrame(frame); }
    }, { passive: true });
    document.addEventListener('pointerover', e => {
      cursor.classList.toggle('is-active', !!e.target.closest('[data-cursor]') && lbIndex < 0);
    });
    root.addEventListener('pointerleave', () => cursor.classList.remove('is-active'));
  }

  /* ---------- "Tonight" hours in the hero ---------- */
  const CLOSING = ['23:00', '00:00', '00:00', '00:00', '00:00', '02:00', '02:00'];
  const tonight = $('#tonight');
  if (tonight) tonight.textContent = `Tonight · 18:00 – ${CLOSING[new Date().getDay()]}`;

  /* ---------- Footer year ---------- */
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
