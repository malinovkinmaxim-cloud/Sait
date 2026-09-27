/* ==========================================================================
   i18n — RU / EN language switch without a build step.

   · Russian text lives in the HTML itself; English lives in window.I18N.en.
   · data-i18n="key"              → element innerHTML
   · data-i18n-attr="attr:key; …" → element attributes (placeholder, aria-label…)
   · [data-lang-set="en"]         → buttons that switch the language
   · a[data-lang-link]            → links that carry ?lang= to the next page
   · i18n.pick({ ru, en })        → pick a value for the current language
   · i18n.on(fn)                  → run fn(lang) now and after every switch

   Language priority: ?lang= in the URL → saved choice → <html lang>.
   ========================================================================== */
(function () {
  'use strict';

  var KEY = 'mandarin-lang';
  var LANGS = ['ru', 'en'];
  var root = document.documentElement;
  var listeners = [];
  var originals = new Map();
  var current = 'ru';

  function saved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function save(lang) {
    try { localStorage.setItem(KEY, lang); } catch (e) { /* private mode */ }
  }

  function initial() {
    var q = new URLSearchParams(location.search).get('lang');
    if (LANGS.indexOf(q) > -1) return q;
    var s = saved();
    if (LANGS.indexOf(s) > -1) return s;
    return LANGS.indexOf(root.lang) > -1 ? root.lang : 'ru';
  }

  function dict(lang) {
    return (window.I18N && window.I18N[lang]) || {};
  }

  // Remember the Russian original of every translatable node once.
  function snapshot(el) {
    if (originals.has(el)) return originals.get(el);
    var o = { html: el.innerHTML, attrs: {} };
    parseAttr(el).forEach(function (pair) { o.attrs[pair[0]] = el.getAttribute(pair[0]); });
    originals.set(el, o);
    return o;
  }

  function parseAttr(el) {
    var spec = el.getAttribute('data-i18n-attr');
    if (!spec) return [];
    return spec.split(';').map(function (p) {
      var i = p.indexOf(':');
      return [p.slice(0, i).trim(), p.slice(i + 1).trim()];
    }).filter(function (p) { return p[0] && p[1]; });
  }

  function translate(scope) {
    var d = dict(current);
    var ru = current === 'ru';
    (scope || document).querySelectorAll('[data-i18n], [data-i18n-attr]').forEach(function (el) {
      var o = snapshot(el);
      var key = el.getAttribute('data-i18n');
      if (key) {
        var html = ru ? o.html : d[key];
        if (html == null) {
          if (!ru && window.console) console.warn('[i18n] missing "' + key + '" for ' + current);
          html = o.html;
        }
        if (el.innerHTML !== html) el.innerHTML = html;
      }
      parseAttr(el).forEach(function (pair) {
        var v = ru ? o.attrs[pair[0]] : d[pair[1]];
        if (v == null) v = o.attrs[pair[0]];
        if (v == null) el.removeAttribute(pair[0]); else el.setAttribute(pair[0], v);
      });
    });
  }

  function syncUi() {
    document.querySelectorAll('[data-lang-set]').forEach(function (b) {
      var on = b.getAttribute('data-lang-set') === current;
      b.setAttribute('aria-pressed', String(on));
      b.classList.toggle('is-active', on);
    });
    document.querySelectorAll('[data-lang-switch]').forEach(function (s) {
      s.setAttribute('data-current', current);
    });
    document.querySelectorAll('a[data-lang-link]').forEach(function (a) {
      var raw = a.getAttribute('data-href') || a.getAttribute('href');
      if (!a.hasAttribute('data-href')) a.setAttribute('data-href', raw);
      var hash = '';
      var i = raw.indexOf('#');
      if (i > -1) { hash = raw.slice(i); raw = raw.slice(0, i); }
      var base = raw.replace(/([?&])lang=(ru|en)&?/, '$1').replace(/[?&]$/, '');
      a.setAttribute('href', base + (base.indexOf('?') > -1 ? '&' : '?') + 'lang=' + current + hash);
    });
  }

  function set(lang, opts) {
    if (LANGS.indexOf(lang) < 0) return;
    current = lang;
    root.lang = lang;
    translate();
    syncUi();
    if (!opts || opts.save !== false) save(lang);
    listeners.forEach(function (fn) { fn(lang); });
    root.classList.remove('i18n-pending');
  }

  window.i18n = {
    get lang() { return current; },
    set: set,
    translate: translate,
    pick: function (v) {
      if (v == null || typeof v !== 'object') return v;
      return v[current] != null ? v[current] : v.ru;
    },
    t: function (key) {
      var v = dict(current)[key];
      return v != null ? v : (dict('ru')[key] != null ? dict('ru')[key] : key);
    },
    on: function (fn) { listeners.push(fn); fn(current); }
  };

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-lang-set]');
    if (!b) return;
    e.preventDefault();
    set(b.getAttribute('data-lang-set'));
  });

  set(initial(), { save: false });
})();
