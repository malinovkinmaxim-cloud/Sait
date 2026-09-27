/* ==========================================================================
   MATTO — interactions
   ========================================================================== */
(function () {
  'use strict';

  var D = window.MATTO;
  var UI = D.ui;
  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var L = function (v) { return window.i18n.pick(v); };
  var lang = function () { return window.i18n.lang; };
  var locale = function () { return lang() === 'ru' ? 'ru-RU' : 'en-GB'; };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var hhmm = function (m) { return pad(Math.floor(m / 60)) + ':' + pad(m % 60); };
  var fill = function (s, o) { return s.replace(/\{(\w+)\}/g, function (_, k) { return o[k] != null ? o[k] : ''; }); };
  var money = function (n) { return n.toLocaleString(lang() === 'ru' ? 'ru-RU' : 'en-US').replace(/\s/g, ' ') + ' ₽'; };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var plural = function (n, forms) {
    if (lang() === 'en') return n === 1 ? forms[0] : forms[1];
    var a = n % 10, b = n % 100;
    return a === 1 && b !== 11 ? forms[0] : a >= 2 && a <= 4 && (b < 12 || b > 14) ? forms[1] : forms[2];
  };
  var ARROW = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4"/></svg>';
  var STAR = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z"/></svg>';

  // Moscow is UTC+3 all year round
  function moscow() {
    var d = new Date(Date.now() + 3 * 3600 * 1000);
    return { mins: d.getUTCHours() * 60 + d.getUTCMinutes(), iso: d.toISOString().slice(0, 10), date: d };
  }
  function isoAdd(iso, days) {
    var p = iso.split('-');
    return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2] + days)).toISOString().slice(0, 10);
  }
  function utcDate(iso) { var p = iso.split('-'); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); }

  var allServices = [];
  D.services.forEach(function (g) { g.items.forEach(function (it) { allServices.push(it); }); });
  var serviceById = function (id) { return allServices.filter(function (s) { return s.id === id; })[0]; };
  var barberById = function (id) { return D.team.filter(function (b) { return b.id === id; })[0]; };

  /* ---------- Intro ---------- */
  var ready = document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 400); })]) : Promise.resolve();
  ready.then(function () { requestAnimationFrame(function () { root.classList.add('is-loaded'); }); });

  /* ---------- Header & drawer ---------- */
  var header = $('#header');
  var burger = $('.burger');
  var drawer = $('#drawer');
  var fab = $('[data-fab]');
  var lastY = window.scrollY;
  var fabBlocked = false;

  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 20);
    header.classList.toggle('is-hidden', y > lastY && y > 500 && !drawer.classList.contains('is-open'));
    lastY = y;
    fab.classList.toggle('is-visible', y > window.innerHeight * .7 && !fabBlocked);
    parallax();
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  function setDrawer(open) {
    burger.setAttribute('aria-expanded', String(open));
    root.classList.toggle('is-locked', open);
    if (open) { drawer.hidden = false; requestAnimationFrame(function () { drawer.classList.add('is-open'); }); }
    else { drawer.classList.remove('is-open'); setTimeout(function () { if (!drawer.classList.contains('is-open')) drawer.hidden = true; }, 600); }
  }
  burger.addEventListener('click', function () { setDrawer(burger.getAttribute('aria-expanded') !== 'true'); });
  drawer.addEventListener('click', function (e) { if (e.target.closest('a')) setDrawer(false); });
  window.matchMedia('(min-width: 1021px)').addEventListener('change', function (m) { if (m.matches) setDrawer(false); });

  var io = null;
  if ('IntersectionObserver' in window) {
    var navLinks = $$('.nav a');
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (s) { navIO.observe(s); });

    if (!reduceMotion) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
      }, { rootMargin: '0px 0px -8% 0px', threshold: .1 });
    }

    var blockers = new Set();
    var fio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) blockers.add(en.target); else blockers.delete(en.target); });
      fabBlocked = blockers.size > 0;
      onScroll();
    });
    [$('#booking'), $('.footer')].forEach(function (el) { fio.observe(el); });
  }
  function reveal(scope) {
    $$('[data-reveal]', scope).forEach(function (el) { if (io) io.observe(el); else el.classList.add('is-visible'); });
  }
  reveal(document);

  /* ---------- Parallax ---------- */
  var parallaxEls = $$('[data-parallax]');
  var desktop = window.matchMedia('(min-width: 901px)');
  function parallax() {
    if (reduceMotion || !desktop.matches) return;
    var y = window.scrollY;
    if (y > window.innerHeight * 1.2) return;
    parallaxEls.forEach(function (el) {
      el.querySelector('img').style.transform = 'translateY(' + (y * +el.getAttribute('data-parallax')).toFixed(1) + 'px) scale(1.12)';
    });
  }

  /* ---------- Marquee ---------- */
  var track = $('[data-marquee]');
  function buildMarquee() {
    $$('[data-clone]', track).forEach(function (c) { c.remove(); });
    for (var i = 0; i < 3; i++) {
      var c = track.firstElementChild.cloneNode(true);
      c.removeAttribute('data-i18n');
      c.setAttribute('data-clone', '');
      track.appendChild(c);
    }
  }

  /* ---------- Status ---------- */
  var statusEl = $('[data-status]');
  function renderStatus() {
    var now = moscow();
    var open = now.mins >= D.hours.open && now.mins < D.hours.close;
    statusEl.classList.toggle('is-open', open);
    $('[data-status-text]', statusEl).textContent = open ? fill(L(UI.openUntil), { t: hhmm(D.hours.close) }) : fill(L(UI.closedOpens), { t: hhmm(D.hours.open) });
  }
  setInterval(renderStatus, 30000);

  /* ---------- Services ---------- */
  var tabsEl = $('[data-svc-tabs]');
  var panelEl = $('[data-svc-panel]');
  var activeGroup = 0;

  function renderServiceTabs() {
    tabsEl.innerHTML = D.services.map(function (g, i) {
      return '<button class="svc-tab" type="button" role="tab" id="svc-tab-' + g.id + '" aria-controls="svc-panel" aria-selected="' + (i === activeGroup) + '" tabindex="' + (i === activeGroup ? 0 : -1) + '">' +
        '<span>' + esc(L(g.title)) + '</span><small>' + g.items.length + '</small></button>';
    }).join('');
    panelEl.id = 'svc-panel';
  }
  function renderServicePanel() {
    var g = D.services[activeGroup];
    panelEl.setAttribute('aria-labelledby', 'svc-tab-' + g.id);
    panelEl.innerHTML = '<div class="svc-list">' + g.items.map(function (it, i) {
      return '<button class="svc" type="button" style="--i:' + i + '" data-book-service="' + it.id + '">' +
        '<span><span class="svc__name">' + esc(L(it.name)) + (it.hit ? '<em>' + (lang() === 'ru' ? 'хит' : 'hit') + '</em>' : '') + '</span>' +
        (it.note ? '<span class="svc__note">' + esc(L(it.note)) + '</span>' : '') + '</span>' +
        '<span class="svc__price">' + money(it.price) + '</span>' +
        '<span class="svc__go" aria-hidden="true">' + ARROW + '</span></button>';
    }).join('') + '</div>';
  }
  function selectGroup(i, focus) {
    activeGroup = (i + D.services.length) % D.services.length;
    $$('.svc-tab', tabsEl).forEach(function (t, j) { t.setAttribute('aria-selected', String(j === activeGroup)); t.tabIndex = j === activeGroup ? 0 : -1; });
    renderServicePanel();
    if (focus) $$('.svc-tab', tabsEl)[activeGroup].focus();
  }
  tabsEl.addEventListener('click', function (e) { var t = e.target.closest('.svc-tab'); if (t) selectGroup($$('.svc-tab', tabsEl).indexOf(t)); });
  tabsEl.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); selectGroup(activeGroup + 1, true); }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); selectGroup(activeGroup - 1, true); }
  });

  /* ---------- Team ---------- */
  var teamEl = $('[data-team]');
  function renderTeam() {
    teamEl.innerHTML = D.team.map(function (b, i) {
      var stars = '<span class="stars" aria-hidden="true">' + STAR + STAR + STAR + STAR + STAR + '</span>';
      var rating = b.rating.toFixed(1).replace('.', lang() === 'ru' ? ',' : '.');
      return '<li class="barber' + (b.away ? ' barber--away' : '') + '" data-reveal style="--d:' + i + '">' +
        (b.away ? '<span class="barber__away">' + esc(L(UI.away)) + '</span>' : '') +
        '<div class="barber__photo"><img src="' + b.photo + '" width="240" height="240" loading="lazy" alt="' + esc(L(b.name)) + '"></div>' +
        '<h3 class="barber__name">' + esc(L(b.name)) + '</h3>' +
        '<p class="barber__role">' + esc(L(UI.barber)) + '</p>' +
        '<p class="barber__rating">' + stars + '<b>' + rating + '</b> · ' + b.votes + ' ' + plural(b.votes, L(UI.votes)) + '</p>' +
        '<button class="btn btn--ghost btn--sm" type="button" data-book-barber="' + b.id + '"' + (b.away ? ' disabled' : '') + '>' + esc(b.away ? L(UI.away) : L(UI.bookWith)) + '</button></li>';
    }).join('');
    reveal(teamEl);
  }

  /* ---------- Gallery & lightbox ---------- */
  var galleryEl = $('[data-gallery]');
  var lb = $('[data-lightbox]');
  var lbImg = $('[data-lb-img]');
  var lbCap = $('[data-lb-cap]');
  var lbIndex = 0;
  var lbReturn = null;

  function renderGallery() {
    galleryEl.innerHTML = D.gallery.map(function (g, i) {
      return '<li data-reveal style="--d:' + (i % 3) + '"><button class="shot" type="button" data-shot="' + i + '" data-caption="' + esc(L(g.alt)) + '">' +
        '<img src="' + g.thumb + '" width="480" height="640" loading="lazy" alt="' + esc(L(g.alt)) + '"></button></li>';
    }).join('');
    reveal(galleryEl);
  }
  function showShot(i) {
    lbIndex = (i + D.gallery.length) % D.gallery.length;
    var g = D.gallery[lbIndex];
    lbImg.src = g.src;
    lbImg.alt = L(g.alt);
    lbCap.textContent = (lbIndex + 1) + ' / ' + D.gallery.length + ' — ' + L(g.alt);
  }
  function openLb(i) {
    lbReturn = document.activeElement;
    showShot(i);
    lb.hidden = false;
    root.classList.add('is-locked');
    $('[data-lb-close]', lb).focus();
  }
  function closeLb() {
    lb.hidden = true;
    root.classList.remove('is-locked');
    if (lbReturn) lbReturn.focus();
  }
  galleryEl.addEventListener('click', function (e) { var s = e.target.closest('[data-shot]'); if (s) openLb(+s.getAttribute('data-shot')); });
  $('[data-lb-close]', lb).addEventListener('click', closeLb);
  $('[data-lb-prev]', lb).addEventListener('click', function () { showShot(lbIndex - 1); });
  $('[data-lb-next]', lb).addEventListener('click', function () { showShot(lbIndex + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.hidden) {
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') showShot(lbIndex - 1);
      if (e.key === 'ArrowRight') showShot(lbIndex + 1);
      if (e.key === 'Tab') {
        var f = $$('button', lb);
        var idx = f.indexOf(document.activeElement);
        if (e.shiftKey && idx <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && idx === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    } else if (e.key === 'Escape' && drawer.classList.contains('is-open')) { setDrawer(false); burger.focus(); }
  });
  var touchX = null;
  lb.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (touchX == null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) showShot(lbIndex + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  /* ---------- Booking ---------- */
  var form = $('#booking-form');
  var f = form.elements;
  var serviceSel = $('[data-service-select]');
  var barberSel = $('[data-barber-select]');
  var datesEl = $('[data-dates]');
  var slotsEl = $('[data-slots]');
  var slotError = $('[data-slot-error]');
  var summary = $('.summary');
  var done = $('.summary__done');
  var submitBtn = $('[type="submit"][form="booking-form"]');
  var state = { service: '', barber: 'any', date: '', time: '' };
  var lastBooking = null;

  function renderServiceSelect() {
    serviceSel.innerHTML = '<option value="">' + esc(L(UI.chooseService)) + '</option>' + D.services.map(function (g) {
      return '<optgroup label="' + esc(L(g.title)) + '">' + g.items.map(function (it) {
        return '<option value="' + it.id + '"' + (it.id === state.service ? ' selected' : '') + '>' + esc(L(it.name)) + ' — ' + money(it.price) + '</option>';
      }).join('') + '</optgroup>';
    }).join('');
  }
  function renderBarberSelect() {
    barberSel.innerHTML = '<option value="any">' + esc(L(UI.anyBarber)) + '</option>' + D.team.map(function (b) {
      return '<option value="' + b.id + '"' + (b.away ? ' disabled' : '') + (b.id === state.barber ? ' selected' : '') + '>' + esc(L(b.name)) + (b.away ? ' — ' + esc(L(UI.away)).toLowerCase() : '') + '</option>';
    }).join('');
  }
  function slotsFor(iso) {
    var now = moscow();
    var out = [];
    for (var m = D.hours.open; m <= D.hours.lastStart; m += 30) {
      out.push({ m: m, off: iso === now.iso && m < now.mins + 30 });
    }
    return out;
  }
  function renderDates() {
    var now = moscow();
    if (!state.date) {
      var today = slotsFor(now.iso).some(function (s) { return !s.off; });
      state.date = today ? now.iso : isoAdd(now.iso, 1);
    }
    var html = '';
    for (var i = 0; i < D.bookingDays; i++) {
      var iso = isoAdd(now.iso, i);
      var d = utcDate(iso);
      var label = i === 0 ? L(UI.today) : i === 1 ? L(UI.tomorrow) : d.toLocaleDateString(locale(), { weekday: 'short', timeZone: 'UTC' });
      var month = d.toLocaleDateString(locale(), { month: 'short', timeZone: 'UTC' }).replace('.', '');
      html += '<button class="date" type="button" role="radio" aria-checked="' + (iso === state.date) + '" data-date="' + iso + '" tabindex="' + (iso === state.date ? 0 : -1) + '">' +
        '<small>' + esc(label) + '</small><b>' + d.getUTCDate() + '</b><span>' + esc(month) + '</span></button>';
    }
    datesEl.innerHTML = html;
  }
  function renderSlots() {
    var slots = slotsFor(state.date);
    var any = slots.some(function (s) { return !s.off; });
    if (state.time && slots.some(function (s) { return s.off && hhmm(s.m) === state.time; })) state.time = '';
    slotsEl.innerHTML = any ? slots.map(function (s) {
      var t = hhmm(s.m);
      return '<button class="slot" type="button" role="radio" aria-checked="' + (t === state.time) + '" data-time="' + t + '"' + (s.off ? ' disabled' : '') + '>' + t + '</button>';
    }).join('') : '<p class="slots__empty">' + esc(L(UI.noSlots)) + '</p>';
  }
  function whenText(dateIso, time) {
    var d = utcDate(dateIso).toLocaleDateString(locale(), { weekday: 'short', day: 'numeric', month: 'long', timeZone: 'UTC' });
    return time ? d + ' · ' + time : d;
  }
  function renderSummary() {
    var s = serviceById(state.service);
    var b = barberById(state.barber);
    var set = function (k, v) { var el = $('[data-sum="' + k + '"]', summary); el.textContent = v || '—'; el.classList.toggle('is-empty', !v); };
    set('service', s ? L(s.name) : '');
    set('barber', b ? L(b.name) : L(UI.anyBarber));
    set('when', state.date ? whenText(state.date, state.time) : '');
    set('price', s ? money(s.price) : '');
  }

  function setService(id) {
    state.service = id;
    serviceSel.value = id;
    validateField(serviceSel);
    renderSummary();
  }
  document.addEventListener('click', function (e) {
    var sBtn = e.target.closest('[data-book-service]');
    var bBtn = e.target.closest('[data-book-barber]');
    if (!sBtn && !bBtn) return;
    if (sBtn) setService(sBtn.getAttribute('data-book-service'));
    if (bBtn) { state.barber = bBtn.getAttribute('data-book-barber'); barberSel.value = state.barber; renderSummary(); }
    $('#booking').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    setTimeout(function () { (sBtn ? barberSel : serviceSel).focus({ preventScroll: true }); }, 700);
  });
  serviceSel.addEventListener('change', function () { setService(serviceSel.value); });
  barberSel.addEventListener('change', function () { state.barber = barberSel.value; renderSummary(); });
  datesEl.addEventListener('click', function (e) {
    var b = e.target.closest('[data-date]');
    if (!b) return;
    state.date = b.getAttribute('data-date');
    renderDates(); renderSlots(); renderSummary();
    datesEl.querySelector('[aria-checked="true"]').focus();
  });
  datesEl.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    var btns = $$('.date', datesEl);
    var i = btns.findIndex(function (b) { return b.getAttribute('aria-checked') === 'true'; });
    var n = btns[Math.max(0, Math.min(btns.length - 1, i + (e.key === 'ArrowRight' ? 1 : -1)))];
    n.click();
  });
  slotsEl.addEventListener('click', function (e) {
    var b = e.target.closest('[data-time]');
    if (!b || b.disabled) return;
    state.time = b.getAttribute('data-time');
    $$('.slot', slotsEl).forEach(function (s) { s.setAttribute('aria-checked', String(s === b)); });
    slotError.textContent = '';
    renderSummary();
  });

  // Phone mask: +7 (999) 123-45-67
  f.phone.addEventListener('input', function () {
    var raw = f.phone.value;
    var digits = raw.replace(/\D/g, '');
    if (/^\s*\+7/.test(raw)) digits = digits.slice(1); // country code already typed
    else if (digits[0] === '8' || digits[0] === '7') digits = digits.slice(1);
    if (digits.length > 10 && (digits[0] === '8' || digits[0] === '7')) digits = digits.slice(1); // pasted 8XXXXXXXXXX
    digits = digits.slice(0, 10);
    if (!digits) { f.phone.value = raw.replace(/\D/g, '') ? '+7 (' : ''; return; }
    var out = '+7';
    if (digits.length) out += ' (' + digits.slice(0, 3);
    if (digits.length >= 3) out += ')';
    if (digits.length > 3) out += ' ' + digits.slice(3, 6);
    if (digits.length > 6) out += '-' + digits.slice(6, 8);
    if (digits.length > 8) out += '-' + digits.slice(8, 10);
    f.phone.value = out;
  });
  f.phone.addEventListener('focus', function () { if (!f.phone.value) f.phone.value = '+7 ('; });
  f.phone.addEventListener('blur', function () { if (f.phone.value.replace(/\D/g, '').length <= 1) f.phone.value = ''; });

  function errorFor(el) {
    var v = el.value.trim();
    if (el.name === 'service') return v ? '' : L(UI.errService);
    if (el.name === 'name') return !v ? L(UI.errRequired) : v.replace(/[^A-Za-zА-Яа-яЁё]/g, '').length < 2 ? L(UI.errName) : '';
    if (el.name === 'phone') return !v ? L(UI.errRequired) : v.replace(/\D/g, '').length !== 11 ? L(UI.errPhone) : '';
    return '';
  }
  function validateField(el) {
    var field = el.closest('.field');
    var msg = errorFor(el);
    field.classList.toggle('is-invalid', !!msg);
    el.setAttribute('aria-invalid', String(!!msg));
    field.querySelector('.field__error').textContent = msg;
    return !msg;
  }
  ['name', 'phone'].forEach(function (n) {
    f[n].addEventListener('blur', function () { if (f[n].value) validateField(f[n]); });
    f[n].addEventListener('input', function () { if (f[n].closest('.field').classList.contains('is-invalid')) validateField(f[n]); });
  });

  function doneText(b) {
    var s = serviceById(b.service), br = barberById(b.barber);
    return fill(L(UI.done), {
      name: b.name,
      date: utcDate(b.date).toLocaleDateString(locale(), { day: 'numeric', month: 'long', timeZone: 'UTC' }),
      time: b.time,
      service: L(s.name),
      barber: br ? L(br.name) : L(UI.anyBarber).toLowerCase()
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = [serviceSel, f.name, f.phone].filter(function (el) { return !validateField(el); });
    var slotOk = !!state.time;
    slotError.textContent = slotOk ? '' : L(UI.errSlot);
    if (!slotOk) bad.splice(1, 0, slotsEl.querySelector('.slot:not(:disabled)') || slotsEl);
    if (bad.length) { bad[0].focus(); return; }
    var label = submitBtn.querySelector('span');
    submitBtn.disabled = true;
    label.removeAttribute('data-i18n');
    label.textContent = L(UI.sending);
    setTimeout(function () {
      lastBooking = { service: state.service, barber: state.barber, date: state.date, time: state.time, name: f.name.value.trim() };
      $('[data-done-text]').textContent = doneText(lastBooking);
      done.hidden = false;
      done.focus();
      submitBtn.disabled = false;
      label.setAttribute('data-i18n', 'form.submit');
      window.i18n.translate(submitBtn);
    }, 900);
  });
  $('[data-reset]').addEventListener('click', function () {
    form.reset();
    state = { service: '', barber: 'any', date: '', time: '' };
    lastBooking = null;
    done.hidden = true;
    $$('.field', form).forEach(function (fl) { fl.classList.remove('is-invalid'); var er = fl.querySelector('.field__error'); if (er) er.textContent = ''; });
    slotError.textContent = '';
    renderBooking();
    serviceSel.focus();
  });

  function renderBooking() {
    renderServiceSelect();
    renderBarberSelect();
    renderDates();
    renderSlots();
    renderSummary();
  }

  /* ---------- Language ---------- */
  window.i18n.on(function () {
    buildMarquee();
    renderStatus();
    renderServiceTabs();
    renderServicePanel();
    renderTeam();
    renderGallery();
    renderBooking();
    if (lastBooking && !done.hidden) $('[data-done-text]').textContent = doneText(lastBooking);
    $$('.field.is-invalid', form).forEach(function (fl) { validateField(fl.querySelector('input, select')); });
    if (slotError.textContent) slotError.textContent = L(UI.errSlot);
    if (!lb.hidden) showShot(lbIndex);
  });

  onScroll();
})();
