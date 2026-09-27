/* ==========================================================================
   MANUL — interactions
   ========================================================================== */
(function () {
  'use strict';

  var D = window.MANUL;
  var UI = D.ui;
  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var L = function (v) { return window.i18n.pick(v); };
  var lang = function () { return window.i18n.lang; };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var fmtHour = function (h) { return pad(h % 24) + ':00'; };
  var fmtMin = function (m) { return pad(Math.floor(m / 60) % 24) + ':' + pad(m % 60); };
  var fill = function (s, o) { return s.replace(/\{(\w+)\}/g, function (_, k) { return o[k] != null ? o[k] : ''; }); };
  var money = function (n) { return n.toLocaleString(lang() === 'ru' ? 'ru-RU' : 'en-US').replace(/\s/g, ' ') + ' ₽'; };
  var plural = function (n, forms) {
    if (lang() === 'en') return n === 1 ? forms[0] : forms[1];
    var a = n % 10, b = n % 100;
    return a === 1 && b !== 11 ? forms[0] : a >= 2 && a <= 4 && (b < 12 || b > 14) ? forms[1] : forms[2];
  };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  // Moscow is UTC+3 all year round
  function moscow() {
    var d = new Date(Date.now() + 3 * 3600 * 1000);
    return { day: d.getUTCDay(), mins: d.getUTCHours() * 60 + d.getUTCMinutes(), iso: d.toISOString().slice(0, 10), date: d };
  }

  /* ---------- Intro ---------- */
  function loaded() { root.classList.add('is-loaded'); }
  if (document.fonts && document.fonts.ready) {
    Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 400); })]).then(function () { requestAnimationFrame(loaded); });
  } else { loaded(); }

  /* ---------- Header ---------- */
  var header = $('#header');
  var burger = $('.burger');
  var drawer = $('#drawer');
  var lastY = window.scrollY;

  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 24);
    var hide = y > lastY && y > window.innerHeight * .7 && !drawer.classList.contains('is-open');
    header.classList.toggle('is-hidden', hide);
    lastY = y;
    updateDock();
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  function setDrawer(open) {
    burger.setAttribute('aria-expanded', String(open));
    root.classList.toggle('is-locked', open);
    if (open) {
      drawer.hidden = false;
      requestAnimationFrame(function () { drawer.classList.add('is-open'); });
      header.classList.remove('is-hidden');
    } else {
      drawer.classList.remove('is-open');
      setTimeout(function () { if (!drawer.classList.contains('is-open')) drawer.hidden = true; }, 500);
    }
  }
  burger.addEventListener('click', function () { setDrawer(burger.getAttribute('aria-expanded') !== 'true'); });
  drawer.addEventListener('click', function (e) { if (e.target.closest('a')) setDrawer(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && drawer.classList.contains('is-open')) { setDrawer(false); burger.focus(); } });
  window.matchMedia('(min-width: 1101px)').addEventListener('change', function (m) { if (m.matches) setDrawer(false); });

  // Active nav link
  var navLinks = $$('.nav a');
  if ('IntersectionObserver' in window) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (s) { navIO.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = $$('[data-reveal], .route');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Count up ---------- */
  var counters = $$('[data-count]');
  function countUp(el) {
    var target = +el.getAttribute('data-count');
    var start = performance.now();
    var dur = 1600;
    (function tick(now) {
      var p = Math.min(1, (now - start) / dur);
      var e = 1 - Math.pow(2, -10 * p);
      el.textContent = Math.round(target * (p === 1 ? 1 : e));
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }
  if ('IntersectionObserver' in window && !reduceMotion) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); } });
    }, { threshold: .6 });
    counters.forEach(function (el) { el.textContent = '0'; cio.observe(el); });
  }

  /* ---------- Ticker ---------- */
  var track = $('[data-ticker]');
  function buildTicker() {
    $$('[data-clone]', track).forEach(function (c) { c.remove(); });
    var src = track.firstElementChild;
    for (var i = 0; i < 3; i++) {
      var c = src.cloneNode(true);
      c.removeAttribute('data-i18n');
      c.setAttribute('data-clone', '');
      track.appendChild(c);
    }
  }

  /* ---------- Eyes ---------- */
  var svg = $('.manul');
  var pupils = $$('.manul__pupil', svg);
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  function look(x, y) {
    pupils.forEach(function (p) { p.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)'; });
  }
  if (!reduceMotion) {
    if (fine) {
      var raf = 0;
      window.addEventListener('pointermove', function (e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = 0;
          var r = svg.getBoundingClientRect();
          if (r.bottom < 0) return;
          var cx = r.left + r.width / 2, cy = r.top + r.height * .53;
          var dx = e.clientX - cx, dy = e.clientY - cy;
          var dist = Math.hypot(dx, dy) || 1;
          var k = Math.min(1, dist / 500);
          look(dx / dist * 11 * k, dy / dist * 7 * k);
        });
      }, { passive: true });
    } else {
      setInterval(function () {
        var a = Math.random() * Math.PI * 2, k = Math.random();
        look(Math.cos(a) * 10 * k, Math.sin(a) * 6 * k);
      }, 2600);
    }
  }

  /* ---------- Signature dishes ---------- */
  var dishesEl = $('[data-dishes]');
  function renderDishes() {
    dishesEl.innerHTML = D.signature.map(function (d, i) {
      return '<li class="dish" data-reveal style="--d:' + (i % 3) + '">' +
        '<span class="dish__num">' + pad(i + 1) + '</span>' +
        '<h3 class="dish__name">' + esc(L(d.name)) + '</h3>' +
        '<span class="dish__region">' + esc(L(d.region)) + '</span>' +
        '<p class="dish__text">' + esc(L(d.text)) + '</p></li>';
    }).join('');
    $$('[data-reveal]', dishesEl).forEach(function (el) {
      if (io && !reduceMotion) io.observe(el); else el.classList.add('is-visible');
    });
  }

  /* ---------- Menu ---------- */
  var tabsEl = $('[data-menu-tabs]');
  var panelEl = $('[data-menu-panel]');
  var activeTab = 0;

  function renderTabs() {
    tabsEl.innerHTML = D.menu.map(function (c, i) {
      return '<button class="tab" type="button" role="tab" id="tab-' + c.id + '" aria-controls="menu-panel" aria-selected="' + (i === activeTab) + '" tabindex="' + (i === activeTab ? 0 : -1) + '">' + esc(L(c.title)) + '</button>';
    }).join('');
    panelEl.id = 'menu-panel';
  }
  function renderPanel() {
    var c = D.menu[activeTab];
    panelEl.setAttribute('aria-labelledby', 'tab-' + c.id);
    panelEl.innerHTML = '<p class="menu__intro">' + esc(L(c.intro)) + '</p><ul class="menu__list">' +
      c.items.map(function (it, i) {
        var price = it.price == null
          ? '<span class="menu__price menu__price--seasonal">' + esc(L(UI.seasonal)) + '</span>'
          : '<span class="menu__price">' + money(it.price) + '</span>';
        return '<li class="menu__item" style="--i:' + i + '"><div class="menu__row"><h3 class="menu__name">' + esc(L(it.name)) + '</h3><span class="menu__dots"></span>' + price + '</div>' +
          (it.note ? '<p class="menu__note-item">' + esc(L(it.note)) + '</p>' : '') + '</li>';
      }).join('') + '</ul>';
  }
  function selectTab(i, focus) {
    activeTab = (i + D.menu.length) % D.menu.length;
    $$('.tab', tabsEl).forEach(function (t, j) {
      t.setAttribute('aria-selected', String(j === activeTab));
      t.tabIndex = j === activeTab ? 0 : -1;
    });
    renderPanel();
    if (focus) $$('.tab', tabsEl)[activeTab].focus();
  }
  tabsEl.addEventListener('click', function (e) {
    var t = e.target.closest('.tab');
    if (t) selectTab($$('.tab', tabsEl).indexOf(t));
  });
  tabsEl.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); selectTab(activeTab + 1, true); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); selectTab(activeTab - 1, true); }
  });

  /* ---------- Hours & status ---------- */
  var statusEl = $('[data-status]');
  var statusText = $('[data-status-text]');
  var hoursEl = $('[data-hours]');

  function renderStatus() {
    var now = moscow();
    var h = D.hours[now.day];
    var open = now.mins >= h[0] * 60 && now.mins < h[1] * 60;
    statusEl.classList.toggle('is-open', open);
    if (open) {
      statusText.textContent = fill(L(UI.openUntil), { t: fmtHour(h[1]) });
    } else {
      var next = now.mins < h[0] * 60 ? h[0] : D.hours[(now.day + 1) % 7][0];
      statusText.textContent = fill(L(UI.closedOpens), { t: fmtHour(next) });
    }
  }
  function renderHours() {
    var day = moscow().day;
    var weekend = day === 0 || day === 6;
    var names = L(UI.daysShort);
    hoursEl.innerHTML =
      '<tr' + (!weekend ? ' class="is-today"' : '') + '><td>' + names[0] + '</td><td>' + fmtHour(D.hours[1][0]) + '–' + fmtHour(D.hours[1][1]) + '</td></tr>' +
      '<tr' + (weekend ? ' class="is-today"' : '') + '><td>' + names[1] + '</td><td>' + fmtHour(D.hours[6][0]) + '–' + fmtHour(D.hours[6][1]) + '</td></tr>';
  }
  setInterval(renderStatus, 30000);

  /* ---------- Photo slots ---------- */
  // Put a real photo into any slot: set data-photo="images/…" in index.html
  $$('[data-photo]').forEach(function (slot) {
    var src = (slot.getAttribute('data-photo') || '').trim();
    if (!src) return;
    var img = new Image();
    img.decoding = 'async';
    img.loading = 'lazy';
    img.alt = (slot.querySelector('figcaption b') || {}).textContent || '';
    img.src = src;
    slot.insertBefore(img, slot.firstChild);
    slot.hidden = false;
  });

  /* ---------- Reservation form ---------- */
  var form = $('#reserve-form');
  var f = form.elements;
  var guestsEl = $('[data-guests]');
  var done = $('.form__done', form);
  var submitBtn = form.querySelector('[type="submit"]');
  var lastBooking = null;

  function renderGuests() {
    var current = (form.querySelector('input[name="guests"]:checked') || {}).value || '2';
    var opts = ['1', '2', '3', '4', '5', '6', '7', '8', '9+'];
    guestsEl.innerHTML = opts.map(function (v) {
      var label = v === '9+' ? '9+' : v;
      var aria = v === '9+' ? '9+ · ' + L(UI.banquet) : v + ' ' + plural(+v, L(UI.guests));
      return '<label><input type="radio" name="guests" value="' + v + '"' + (v === current ? ' checked' : '') + ' aria-label="' + esc(aria) + '"><span>' + label + '</span></label>';
    }).join('');
  }

  function dateOf(iso) {
    var p = iso.split('-');
    return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]));
  }

  function slotsFor(iso) {
    var now = moscow();
    var day = dateOf(iso).getUTCDay();
    var h = D.hours[day];
    var slots = [];
    for (var m = h[0] * 60; m <= D.lastSeating * 60; m += 30) {
      if (iso === now.iso && m < now.mins + 30) continue;
      slots.push(m);
    }
    return slots;
  }

  function renderTimes() {
    var prev = f.time.value;
    var slots = f.date.value ? slotsFor(f.date.value) : [];
    var html = '<option value="">' + esc(slots.length || !f.date.value ? L(UI.chooseTime) : L(UI.noTimes)) + '</option>';
    html += slots.map(function (m) { var t = fmtMin(m); return '<option value="' + t + '"' + (t === prev ? ' selected' : '') + '>' + t + '</option>'; }).join('');
    f.time.innerHTML = html;
  }

  function initDate() {
    var now = moscow();
    var min = now.iso;
    var max = new Date(now.date.getTime() + 60 * 864e5).toISOString().slice(0, 10);
    f.date.min = min;
    f.date.max = max;
    if (!f.date.value) {
      f.date.value = slotsFor(min).length ? min : new Date(now.date.getTime() + 864e5).toISOString().slice(0, 10);
    }
    renderTimes();
  }
  f.date.addEventListener('change', function () { renderTimes(); validate(f.date); });

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
    if (el.name === 'name') return !v ? L(UI.errRequired) : v.replace(/[^A-Za-zА-Яа-яЁё]/g, '').length < 2 ? L(UI.errName) : '';
    if (el.name === 'phone') return !v ? L(UI.errRequired) : v.replace(/\D/g, '').length !== 11 ? L(UI.errPhone) : '';
    if (el.name === 'date') return !v || v < f.date.min ? L(UI.errDate) : '';
    if (el.name === 'time') return !v ? L(UI.errTime) : '';
    return '';
  }
  function validate(el) {
    var field = el.closest('.field');
    var msg = errorFor(el);
    field.classList.toggle('is-invalid', !!msg);
    el.setAttribute('aria-invalid', String(!!msg));
    field.querySelector('.field__error').textContent = msg;
    return !msg;
  }
  var checked = ['name', 'phone', 'date', 'time'];
  checked.forEach(function (n) {
    f[n].addEventListener('blur', function () { if (f[n].value) validate(f[n]); });
    f[n].addEventListener('input', function () { if (f[n].closest('.field').classList.contains('is-invalid')) validate(f[n]); });
  });

  function doneText(b) {
    var locale = lang() === 'ru' ? 'ru-RU' : 'en-GB';
    var dateStr = dateOf(b.date).toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
    var g = b.guests === '9+' ? '9+ ' + plural(9, L(UI.guests)) : b.guests + ' ' + plural(+b.guests, L(UI.guests));
    return fill(L(UI.done), { name: b.name, date: dateStr, time: b.time, guests: g, phone: b.phone });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = checked.map(function (n) { return validate(f[n]) ? null : f[n]; }).filter(Boolean);
    if (bad.length) { bad[0].focus(); return; }
    var label = submitBtn.querySelector('span');
    submitBtn.disabled = true;
    label.removeAttribute('data-i18n');
    label.textContent = L(UI.sending);
    setTimeout(function () {
      lastBooking = {
        name: f.name.value.trim(), phone: f.phone.value, date: f.date.value, time: f.time.value,
        guests: (form.querySelector('input[name="guests"]:checked') || {}).value || '2'
      };
      $('[data-done-text]', form).textContent = doneText(lastBooking);
      done.hidden = false;
      done.focus();
      submitBtn.disabled = false;
      label.setAttribute('data-i18n', 'form.submit');
      window.i18n.translate(submitBtn);
    }, 900);
  });
  $('[data-reset]', form).addEventListener('click', function () {
    form.reset();
    lastBooking = null;
    done.hidden = true;
    $$('.field', form).forEach(function (fl) { fl.classList.remove('is-invalid'); var er = fl.querySelector('.field__error'); if (er) er.textContent = ''; });
    renderGuests();
    initDate();
    f.name.focus();
  });

  /* ---------- Mobile dock ---------- */
  var dock = $('[data-dock]');
  var dockBlocked = false;
  if ('IntersectionObserver' in window) {
    var blockers = new Set();
    var dio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) blockers.add(en.target); else blockers.delete(en.target); });
      dockBlocked = blockers.size > 0;
      updateDock();
    });
    [$('#reserve'), $('.footer')].forEach(function (el) { dio.observe(el); });
  }
  function updateDock() {
    dock.classList.toggle('is-visible', window.scrollY > window.innerHeight * .8 && !dockBlocked);
  }

  /* ---------- Language ---------- */
  window.i18n.on(function () {
    buildTicker();
    renderDishes();
    renderTabs();
    renderPanel();
    renderStatus();
    renderHours();
    renderGuests();
    if (f.date.min) renderTimes(); else initDate();
    if (lastBooking && !done.hidden) $('[data-done-text]', form).textContent = doneText(lastBooking);
    $$('.field.is-invalid', form).forEach(function (fl) { var el = fl.querySelector('input, select'); if (el) validate(el); });
  });

  onScroll();
})();
