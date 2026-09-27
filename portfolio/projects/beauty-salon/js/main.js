/* ==========================================================================
   A&Ю — interactions
   ========================================================================== */
(function () {
  'use strict';

  var D = window.AYU;
  var UI = D.ui;
  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var L = function (v) { return window.i18n.pick(v); };
  var lang = function () { return window.i18n.lang; };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var hhmm = function (m) { return pad(Math.floor(m / 60)) + ':' + pad(m % 60); };
  var fill = function (s, o) { return s.replace(/\{(\w+)\}/g, function (_, k) { return o[k] != null ? o[k] : ''; }); };
  var num = function (n) { return n.toLocaleString(lang() === 'ru' ? 'ru-RU' : 'en-US').replace(/\s/g, ' '); };
  var money = function (n) { return num(n) + ' ₽'; };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var norm = function (s) { return String(s).toLowerCase().replace(/ё/g, 'е'); };
  var plural = function (n, forms) {
    if (lang() === 'en') return n === 1 ? forms[0] : forms[1];
    var a = n % 10, b = n % 100;
    return a === 1 && b !== 11 ? forms[0] : a >= 2 && a <= 4 && (b < 12 || b > 14) ? forms[1] : forms[2];
  };
  var ARROW = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4"/></svg>';

  var ICONS = {
    scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4L8.1 15.9M14.5 14.5L20 20M8.1 8.1L12 12"/>',
    drop: '<path d="M12 2.7s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M9 15a3 3 0 0 0 3 3"/>',
    leaf: '<path d="M5 19C5 11 10 5 20 5c0 10-6 15-14 15M5 19l7-7"/>',
    wave: '<path d="M3 8c3-3 6 3 9 0s6-3 9 0M3 14c3-3 6 3 9 0s6-3 9 0M3 20c3-3 6 3 9 0s6-3 9 0"/>',
    hand: '<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12M11 11V4.5a1.5 1.5 0 0 1 3 0V12M14 11.5V6a1.5 1.5 0 0 1 3 0v7c0 4.5-2.5 8-7 8-3.5 0-5-2-6.5-4.5L2 13.8a1.5 1.5 0 0 1 2.6-1.5L8 16"/>',
    foot: '<path d="M7 21c-2 0-3-2-3-4 0-3 2-4 2-7s1-6 4-6 3 3 3 5-1 4-1 6 1 3 1 4-2 2-6 2z"/><circle cx="16" cy="5" r="1.4"/><circle cx="19" cy="8.5" r="1.2"/><circle cx="20" cy="12.5" r="1"/>',
    sparkle: '<path d="M12 3v3M12 18v3M3 12h3M18 12h3M12 7l1.8 3.2L17 12l-3.2 1.8L12 17l-1.8-3.2L7 12l3.2-1.8z"/>',
    lotus: '<path d="M12 20c-4 0-8-2-9-6 3-1 6 0 9 2 3-2 6-3 9-2-1 4-5 6-9 6zM12 16c-2-2-3-5-2-9 1 1 2 2 2 2s1-1 2-2c1 4 0 7-2 9z"/>',
    cross: '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>',
    brow: '<path d="M3 13c4-5 11-6 18-3"/><path d="M6 17.5c3 1.6 9 1.6 12 0"/>',
    eye: '<path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="2.5"/>',
    pen: '<path d="M4 20l4-1L19 8l-3-3L5 16l-1 4zM14 7l3 3"/>'
  };
  var icon = function (k) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[k] || '') + '</svg>'; };

  // Flatten the price list: every item gets a stable key "cat:group:item"
  var ITEMS = [];
  D.services.forEach(function (c) {
    c._groups = c.groups || [{ title: null, items: c.items }];
    c._groups.forEach(function (g, gi) {
      g.items.forEach(function (it, ii) {
        ITEMS.push({ key: c.id + ':' + gi + ':' + ii, cat: c, group: g, ru: it[0], en: it[1], mins: it[2], price: it[3] });
      });
    });
  });
  var itemByKey = function (k) { return ITEMS.filter(function (i) { return i.key === k; })[0]; };
  var catById = function (id) { return D.services.filter(function (c) { return c.id === id; })[0]; };
  var itemsOf = function (id) { return ITEMS.filter(function (i) { return i.cat.id === id; }); };

  function fmtDur(m) {
    var h = Math.floor(m / 60), r = m % 60;
    return (h ? h + ' ' + L(UI.hour) : '') + (h && r ? ' ' : '') + (r ? r + ' ' + L(UI.min) : '');
  }
  function durOf(it) {
    if (Array.isArray(it.mins)) return fmtDur(it.mins[0]) + ' – ' + fmtDur(it.mins[1]);
    if (typeof it.mins === 'number') return fmtDur(it.mins);
    if (Array.isArray(it.price) && Array.isArray(it.price[0])) {
      var ms = it.price.map(function (v) { return v[2]; }).filter(Boolean);
      if (ms.length) { var a = Math.min.apply(null, ms), b = Math.max.apply(null, ms); return a === b ? fmtDur(a) : fmtDur(a) + ' – ' + fmtDur(b); }
    }
    return '';
  }
  function isVariants(p) { return Array.isArray(p) && Array.isArray(p[0]); }
  function priceOf(it) {
    var p = it.price;
    if (typeof p === 'number') return money(p);
    if (isVariants(p)) return L(UI.from) + ' ' + money(Math.min.apply(null, p.map(function (v) { return v[1]; })));
    return num(p[0]) + ' – ' + money(p[1]);
  }

  // Moscow is UTC+3 all year round
  function moscow() {
    var d = new Date(Date.now() + 3 * 3600 * 1000);
    return { mins: d.getUTCHours() * 60 + d.getUTCMinutes(), iso: d.toISOString().slice(0, 10), date: d };
  }

  /* ---------- Intro ---------- */
  var ready = document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 400); })]) : Promise.resolve();
  ready.then(function () { requestAnimationFrame(function () { root.classList.add('is-loaded'); }); });

  /* ---------- Header & drawer ---------- */
  var header = $('#header');
  var burger = $('.burger');
  var drawer = $('#drawer');
  var lastY = window.scrollY;
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 20);
    header.classList.toggle('is-hidden', y > lastY && y > 500 && !drawer.classList.contains('is-open'));
    lastY = y;
  }, { passive: true });

  function setDrawer(open) {
    burger.setAttribute('aria-expanded', String(open));
    root.classList.toggle('is-locked', open);
    if (open) { drawer.hidden = false; requestAnimationFrame(function () { drawer.classList.add('is-open'); }); }
    else { drawer.classList.remove('is-open'); setTimeout(function () { if (!drawer.classList.contains('is-open')) drawer.hidden = true; }, 450); }
  }
  burger.addEventListener('click', function () { setDrawer(burger.getAttribute('aria-expanded') !== 'true'); });
  drawer.addEventListener('click', function (e) { if (e.target.closest('a')) setDrawer(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && drawer.classList.contains('is-open')) { setDrawer(false); burger.focus(); } });
  window.matchMedia('(min-width: 1101px)').addEventListener('change', function (m) { if (m.matches) setDrawer(false); });

  var io = null;
  if ('IntersectionObserver' in window) {
    var navLinks = $$('.nav a');
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id); }); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (s) { navIO.observe(s); });
    if (!reduceMotion) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
      }, { rootMargin: '0px 0px -8% 0px', threshold: .1 });
    }
  }
  function reveal(scope) { $$('[data-reveal]', scope).forEach(function (el) { if (io) io.observe(el); else el.classList.add('is-visible'); }); }
  reveal(document);

  /* ---------- Directions strip ---------- */
  var dirEl = $('[data-directions]');
  function renderDirections() {
    dirEl.innerHTML = D.services.map(function (c) {
      var n = itemsOf(c.id).length;
      return '<li><button class="dir" type="button" data-goto-cat="' + c.id + '">' + icon(c.icon) + '<span>' + esc(L(c.name)) + '</span><small>' + n + ' ' + plural(n, L(UI.services)) + '</small></button></li>';
    }).join('');
  }
  dirEl.addEventListener('click', function (e) {
    var b = e.target.closest('[data-goto-cat]');
    if (!b) return;
    board.chip = b.getAttribute('data-goto-cat');
    board.query = '';
    searchEl.value = '';
    board.open = [board.chip];
    renderChips(); renderBoard();
    $('#prices').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ---------- Price board ---------- */
  var chipsEl = $('[data-price-chips]');
  var boardEl = $('[data-price-board]');
  var searchEl = $('[data-price-search]');
  var board = { chip: 'all', query: '', open: [D.services[0].id] };

  function renderChips() {
    var chips = [{ id: 'all', name: UI.all, n: ITEMS.length }].concat(D.services.map(function (c) { return { id: c.id, name: c.name, n: itemsOf(c.id).length }; }));
    chipsEl.innerHTML = chips.map(function (c) {
      return '<button class="chip" type="button" role="tab" aria-selected="' + (c.id === board.chip && !board.query) + '" data-chip="' + c.id + '">' + esc(L(c.name)) + '<small>' + c.n + '</small></button>';
    }).join('');
  }
  function highlight(text, q) {
    if (!q) return esc(text);
    var i = norm(text).indexOf(q);
    if (i < 0) return esc(text);
    return esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + q.length)) + '</mark>' + esc(text.slice(i + q.length));
  }
  function rowHtml(it, q) {
    var name = lang() === 'ru' ? it.ru : it.en;
    var variants = isVariants(it.price) ? '<span class="prow__variants">' + it.price.map(function (v) { return esc(L(D.lengths[v[0]])) + ' <b>' + money(v[1]) + '</b>'; }).join('') + '</span>' : '';
    return '<li class="prow"><div><span class="prow__name">' + highlight(name, q) + '</span>' + variants + '</div>' +
      '<span class="prow__time">' + durOf(it) + '</span><span class="prow__price">' + priceOf(it) + '</span>' +
      '<button class="prow__book" type="button" data-book-item="' + it.key + '" aria-label="' + esc(L(UI.book) + ': ' + name) + '">' + ARROW + '</button></li>';
  }
  function renderBoard() {
    var q = norm(board.query.trim());
    var cats = board.chip === 'all' || q ? D.services : [catById(board.chip)];
    var html = '';
    var shown = 0;
    cats.forEach(function (c, ci) {
      var groups = c._groups.map(function (g, gi) {
        var rows = itemsOf(c.id).filter(function (it) {
          return it.group === g && (!q || norm(it.ru).indexOf(q) > -1 || norm(it.en).indexOf(q) > -1);
        });
        return { g: g, rows: rows };
      }).filter(function (x) { return x.rows.length; });
      if (!groups.length) return;
      var count = groups.reduce(function (s, x) { return s + x.rows.length; }, 0);
      shown += count;
      var open = q || board.chip !== 'all' || board.open.indexOf(c.id) > -1;
      html += '<article class="pcat' + (open ? ' is-open' : '') + '" style="--i:' + ci + '" data-cat="' + c.id + '">' +
        '<button class="pcat__head" type="button" aria-expanded="' + !!open + '" aria-controls="pcat-' + c.id + '">' +
        '<span class="pcat__icon">' + icon(c.icon) + '</span>' +
        '<span><span class="pcat__title">' + esc(L(c.name)) + '</span><span class="pcat__desc">' + esc(L(c.desc)) + '</span></span>' +
        '<span class="pcat__count">' + count + ' ' + plural(count, L(UI.services)) + '</span><span class="pcat__toggle" aria-hidden="true"></span></button>' +
        '<div class="pcat__body" id="pcat-' + c.id + '"><div class="pcat__inner"><div class="pcat__groups">' +
        groups.map(function (x) {
          return '<section class="pgroup">' + (x.g.title ? '<h4>' + esc(L(x.g.title)) + '</h4>' : '') + '<ul>' + x.rows.map(function (it) { return rowHtml(it, lang() === 'ru' ? q : q); }).join('') + '</ul></section>';
        }).join('') + '</div></div></div></article>';
    });
    boardEl.innerHTML = shown ? html : '<p class="price-empty">' + esc(L(UI.nothing)) + '</p>';
  }
  chipsEl.addEventListener('click', function (e) {
    var b = e.target.closest('[data-chip]');
    if (!b) return;
    board.chip = b.getAttribute('data-chip');
    board.query = '';
    searchEl.value = '';
    board.open = board.chip === 'all' ? [D.services[0].id] : [board.chip];
    renderChips(); renderBoard();
  });
  boardEl.addEventListener('click', function (e) {
    var head = e.target.closest('.pcat__head');
    if (head && !board.query) {
      var cat = head.closest('.pcat');
      var id = cat.getAttribute('data-cat');
      var open = !cat.classList.contains('is-open');
      cat.classList.toggle('is-open', open);
      head.setAttribute('aria-expanded', String(open));
      board.open = open ? board.open.concat(id) : board.open.filter(function (x) { return x !== id; });
    }
  });
  var searchTimer = 0;
  searchEl.addEventListener('input', function () {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () {
      board.query = searchEl.value;
      renderChips(); renderBoard();
    }, 120);
  });

  /* ---------- Team ---------- */
  var teamEl = $('[data-team]');
  function renderTeam() {
    teamEl.innerHTML = D.team.map(function (m, i) {
      return '<li class="master" data-reveal style="--d:' + i + '">' +
        '<div class="master__photo"><img src="' + m.photo + '" width="176" height="176" loading="lazy" alt="' + esc(L(m.name)) + '"></div>' +
        '<h3 class="master__name">' + esc(L(m.name)) + '</h3>' +
        '<p class="master__level">' + esc(L(m.level)) + '</p>' +
        '<p class="master__role">' + esc(L(m.role)) + '</p>' +
        '<p class="master__rating"><span class="stars" aria-hidden="true">★★★★★</span> <b>' + (lang() === 'ru' ? '5,0' : '5.0') + '</b> · ' + m.votes + ' ' + plural(m.votes, L(UI.votes)) + '</p>' +
        '<button class="btn btn--line btn--sm" type="button" data-book-master="' + i + '">' + esc(L(UI.book)) + '</button></li>';
    }).join('');
    reveal(teamEl);
  }

  /* ---------- Booking ---------- */
  var form = $('#booking-form');
  var f = form.elements;
  var dirSel = $('[data-direction-select]');
  var svcSel = $('[data-service-select]');
  var masterSel = $('[data-master-select]');
  var totalEl = $('[data-total]');
  var done = $('.form__done', form);
  var submitBtn = form.querySelector('[type="submit"]');
  var bk = { dir: D.services[0].id, service: '', master: 'any' };
  var lastBooking = null;

  function renderDirSelect() {
    dirSel.innerHTML = D.services.map(function (c) { return '<option value="' + c.id + '"' + (c.id === bk.dir ? ' selected' : '') + '>' + esc(L(c.name)) + '</option>'; }).join('');
  }
  function renderSvcSelect() {
    var c = catById(bk.dir);
    var html = '<option value="">' + esc(L(UI.chooseService)) + '</option>';
    c._groups.forEach(function (g) {
      var opts = itemsOf(c.id).filter(function (it) { return it.group === g; }).map(function (it) {
        return '<option value="' + it.key + '"' + (it.key === bk.service ? ' selected' : '') + '>' + esc(lang() === 'ru' ? it.ru : it.en) + ' — ' + priceOf(it) + '</option>';
      }).join('');
      html += g.title ? '<optgroup label="' + esc(L(g.title)) + '">' + opts + '</optgroup>' : opts;
    });
    svcSel.innerHTML = html;
  }
  function renderMasterSelect() {
    var list = D.team.map(function (m, i) { return { m: m, i: i }; }).filter(function (x) { return x.m.services.indexOf(bk.dir) > -1; });
    if (!list.some(function (x) { return String(x.i) === bk.master; })) bk.master = 'any';
    masterSel.innerHTML = '<option value="any">' + esc(L(UI.anyMaster)) + '</option>' + list.map(function (x) {
      return '<option value="' + x.i + '"' + (String(x.i) === bk.master ? ' selected' : '') + '>' + esc(L(x.m.name)) + ' · ' + esc(L(x.m.level)) + '</option>';
    }).join('');
  }
  function renderTotal() {
    var it = itemByKey(bk.service);
    totalEl.hidden = !it;
    if (it) $('[data-total-value]', totalEl).textContent = priceOf(it);
  }
  function slots(iso) {
    var now = moscow(), out = [];
    for (var m = D.hours.open; m <= D.hours.lastStart; m += 30) if (!(iso === now.iso && m < now.mins + 30)) out.push(m);
    return out;
  }
  function renderTimes() {
    var prev = f.time.value;
    var list = f.date.value ? slots(f.date.value) : [];
    f.time.innerHTML = '<option value="">' + esc(list.length || !f.date.value ? L(UI.chooseTime) : L(UI.noTimes)) + '</option>' +
      list.map(function (m) { var t = hhmm(m); return '<option value="' + t + '"' + (t === prev ? ' selected' : '') + '>' + t + '</option>'; }).join('');
  }
  function initDate() {
    var now = moscow();
    f.date.min = now.iso;
    f.date.max = new Date(now.date.getTime() + 60 * 864e5).toISOString().slice(0, 10);
    if (!f.date.value) f.date.value = slots(now.iso).length ? now.iso : new Date(now.date.getTime() + 864e5).toISOString().slice(0, 10);
    renderTimes();
  }
  function renderBookingSelects() { renderDirSelect(); renderSvcSelect(); renderMasterSelect(); renderTotal(); }

  dirSel.addEventListener('change', function () { bk.dir = dirSel.value; bk.service = ''; renderSvcSelect(); renderMasterSelect(); renderTotal(); });
  svcSel.addEventListener('change', function () { bk.service = svcSel.value; renderTotal(); validate(svcSel); });
  masterSel.addEventListener('change', function () { bk.master = masterSel.value; });
  f.date.addEventListener('change', function () { renderTimes(); validate(f.date); });

  function goBooking(focusEl) {
    $('#booking').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    setTimeout(function () { focusEl.focus({ preventScroll: true }); }, 700);
  }
  document.addEventListener('click', function (e) {
    var item = e.target.closest('[data-book-item]');
    var master = e.target.closest('[data-book-master]');
    if (item) {
      var it = itemByKey(item.getAttribute('data-book-item'));
      bk.dir = it.cat.id; bk.service = it.key;
      renderBookingSelects();
      validate(svcSel);
      goBooking(masterSel);
    } else if (master) {
      var m = D.team[+master.getAttribute('data-book-master')];
      bk.dir = m.services[0]; bk.service = ''; bk.master = master.getAttribute('data-book-master');
      renderBookingSelects();
      goBooking(svcSel);
    }
  });

  // Phone mask: +7 (999) 123-45-67
  f.phone.addEventListener('input', function () {
    var raw = f.phone.value;
    var digits = raw.replace(/\D/g, '');
    if (/^\s*\+7/.test(raw)) digits = digits.slice(1);
    else if (digits[0] === '8' || digits[0] === '7') digits = digits.slice(1);
    if (digits.length > 10 && (digits[0] === '8' || digits[0] === '7')) digits = digits.slice(1);
    digits = digits.slice(0, 10);
    if (!digits) { f.phone.value = raw.replace(/\D/g, '') ? '+7 (' : ''; return; }
    var out = '+7 (' + digits.slice(0, 3);
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
    if (el.name === 'date') return !v || v < f.date.min ? L(UI.errDate) : '';
    if (el.name === 'time') return v ? '' : L(UI.errTime);
    return '';
  }
  function validate(el) {
    var field = el.closest('.field');
    var msg = errorFor(el);
    field.classList.toggle('is-invalid', !!msg);
    el.setAttribute('aria-invalid', String(!!msg));
    var er = field.querySelector('.field__error');
    if (er) er.textContent = msg;
    return !msg;
  }
  ['name', 'phone'].forEach(function (n) {
    f[n].addEventListener('blur', function () { if (f[n].value) validate(f[n]); });
    f[n].addEventListener('input', function () { if (f[n].closest('.field').classList.contains('is-invalid')) validate(f[n]); });
  });
  f.time.addEventListener('change', function () { validate(f.time); });

  function doneText(b) {
    var it = itemByKey(b.service);
    var m = b.master === 'any' ? null : D.team[+b.master];
    var p = b.date.split('-');
    var date = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])).toLocaleDateString(lang() === 'ru' ? 'ru-RU' : 'en-GB', { day: 'numeric', month: 'long', timeZone: 'UTC' });
    return fill(L(UI.done), {
      name: b.name, service: (lang() === 'ru' ? it.ru : it.en), date: date, time: b.time,
      master: m ? fill(L(UI.withMaster), { m: L(m.name) }) : ''
    });
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = [svcSel, f.date, f.time, f.name, f.phone].filter(function (el) { return !validate(el); });
    if (bad.length) { bad[0].focus(); return; }
    var label = submitBtn.querySelector('span');
    submitBtn.disabled = true;
    label.removeAttribute('data-i18n');
    label.textContent = L(UI.sending);
    setTimeout(function () {
      lastBooking = { service: bk.service, master: bk.master, date: f.date.value, time: f.time.value, name: f.name.value.trim() };
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
    bk = { dir: D.services[0].id, service: '', master: 'any' };
    lastBooking = null;
    done.hidden = true;
    $$('.field', form).forEach(function (fl) { fl.classList.remove('is-invalid'); var er = fl.querySelector('.field__error'); if (er) er.textContent = ''; });
    renderBookingSelects();
    initDate();
    dirSel.focus();
  });

  /* ---------- Status ---------- */
  var statusEl = $('[data-status]');
  function renderStatus() {
    var now = moscow();
    var open = now.mins >= D.hours.open && now.mins < D.hours.close;
    statusEl.classList.toggle('is-open', open);
    $('[data-status-text]', statusEl).textContent = L(open ? UI.open : UI.closed);
  }
  setInterval(renderStatus, 30000);

  /* ---------- Language ---------- */
  window.i18n.on(function () {
    renderDirections();
    renderChips();
    renderBoard();
    renderTeam();
    renderBookingSelects();
    if (f.date.min) renderTimes(); else initDate();
    renderStatus();
    if (lastBooking && !done.hidden) $('[data-done-text]', form).textContent = doneText(lastBooking);
    $$('.field.is-invalid', form).forEach(function (fl) { validate(fl.querySelector('input, select')); });
  });
})();
