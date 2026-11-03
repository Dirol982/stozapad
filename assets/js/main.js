(function () {
  'use strict';

  /* ---------- nav ---------- */
  var nav = document.querySelector('.nav');
  var onScroll = function () { nav.classList.toggle('is-scrolled', window.scrollY > 20); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var burger = document.querySelector('.burger');
  var mnav = document.getElementById('mnav');
  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!open));
    burger.setAttribute('aria-label', open ? 'Открыть меню' : 'Закрыть меню');
    mnav.hidden = open;
  });
  mnav.addEventListener('click', function (e) {
    if (e.target.closest('a')) { mnav.hidden = true; burger.setAttribute('aria-expanded', 'false'); }
  });

  /* ---------- reveal + counters ---------- */
  var fmt = function (n) { return Math.round(n).toLocaleString('ru-RU').replace(/,/g, ' '); };
  var countUp = function (el) {
    var to = +el.dataset.count, t0 = null, dur = 1600;
    var step = function (t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      el.textContent = fmt(to * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        var c = en.target.querySelector('[data-count]');
        if (c && !reduce) countUp(c);
        io.unobserve(en.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) {
      if (!el.closest('.hero')) io.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- calculator ---------- */
  // Цены «от», руб. — из прайса stozapad.by/ceny
  var CATS = [
    { id: 'to', name: 'ТО и диагностика', items: [
      ['diag', 'Компьютерная диагностика ЭБУ', 32],
      ['osm', 'Комплексный осмотр автомобиля', 42],
      ['lift', 'Осмотр на подъёмнике', 20],
      ['oil', 'Замена масла двигателя и фильтра', 27],
      ['air', 'Замена воздушного фильтра', 90],
      ['cabin', 'Замена салонного фильтра', 10],
      ['cool', 'Замена охлаждающей жидкости', 48],
      ['brf', 'Замена тормозной жидкости', 15],
      ['plugs', 'Замена свечей зажигания', 65],
      ['mkpp', 'Замена масла МКПП', 27],
      ['reset', 'Сброс сервисного интервала', 9]
    ]},
    { id: 'chassis', name: 'Ходовая и руль', items: [
      ['geo', 'Проверка геометрии', 29],
      ['align1', 'Развал-схождение, 1 ось', 29, 'легковой'],
      ['align2', 'Развал-схождение, 2 оси', 39, 'легковой'],
      ['align4x4', 'Развал-схождение, 2 оси', 49, 'джип / кроссовер'],
      ['strut', 'Замена передней амортизаторной стойки', 50, 'за шт.', true],
      ['link', 'Замена стойки стабилизатора', 15, 'за шт.', true],
      ['ball', 'Замена шаровой опоры', 45, 'за шт.', true],
      ['hub', 'Замена переднего подшипника ступицы', 36, 'за шт.', true],
      ['tie', 'Замена рулевой тяги', 30, 'за шт.', true],
      ['tieend', 'Замена рулевого наконечника', 15, 'за шт.', true],
      ['rack', 'Рулевая рейка — снять/установить', 120]
    ]},
    { id: 'brakes', name: 'Тормоза', items: [
      ['padsF', 'Замена передних колодок', 30],
      ['padsR', 'Замена задних колодок (диск)', 30],
      ['drum', 'Замена задних колодок (барабан)', 41],
      ['bleed', 'Прокачка тормозной системы', 15],
      ['hose', 'Замена тормозного шланга', 15, 'за шт.', true],
      ['park', 'Замена колодок стояночного тормоза', 45]
    ]},
    { id: 'engine', name: 'Двигатель', items: [
      ['timing', 'Замена комплекта ремня ГРМ', 120],
      ['pump', 'Замена помпы (при снятом ГРМ)', 45],
      ['rad', 'Замена радиатора охлаждения', 50],
      ['turbo', 'Турбина — снять/установить (бензин)', 200],
      ['muffler', 'Замена глушителя', 25]
    ]},
    { id: 'climate', name: 'Климат и электрика', items: [
      ['ac', 'Диагностика и заправка кондиционера', 40],
      ['freon', 'Фреон', 10, 'за 100 г', true],
      ['elec', 'Поиск неисправности электрики', 35, 'за час', true]
    ]},
    { id: 'lights', name: 'Фары', items: [
      ['hpol', 'Полировка фар', 60, 'за фару', true],
      ['hrest', 'Восстановление пластика передних фар', 100, 'за фару', true],
      ['hrestR', 'Восстановление задних фонарей', 50, 'за фонарь', true]
    ]},
    { id: 'chip', name: 'Чип-тюнинг', items: [
      ['ecu', 'Прошивка ЭБУ (заводская)', 120],
      ['ecuPlus', 'Прошивка ЭБУ с увеличением мощности', 150],
      ['egr', 'Программное отключение EGR', 160],
      ['ss', 'Отключение Start/Stop', 150],
      ['adblue', 'Программное отключение AdBlue', 200]
    ]}
  ];
  var BY_ID = {};
  CATS.forEach(function (c) { c.items.forEach(function (i) {
    BY_ID[i[0]] = { id: i[0], name: i[1], price: i[2], note: i[3] || '', qty: !!i[4], cat: c.name };
  }); });

  var tabsEl = document.querySelector('.calc__tabs');
  var listEl = document.querySelector('.calc__list');
  var searchEl = document.querySelector('.calc__search input');
  var cartList = document.querySelector('.cart__list');
  var emptyEl = document.querySelector('.cart__empty');
  var clearBtn = document.querySelector('.cart__clear');
  var totalWrap = document.querySelector('.cart__total b');
  var totalNum = document.querySelector('.total-num');
  var countEl = document.querySelector('.cart__count');
  var mbarSum = document.querySelector('.mbar__sum');
  var toast = document.querySelector('.toast');
  var toastTxt = document.querySelector('.toast__txt');
  var undoBtn = document.querySelector('.toast__undo');
  var form = document.querySelector('.cart__form');
  var okEl = document.querySelector('.cart__ok');

  var slotText = function () { return ''; };
  var KEY = 'stozapad-calc';
  var cart = [];          // [{id, n}]
  var active = 'to';
  var lastRemoved = null; // {items:[...], index}
  var toastTimer;

  try { var saved = JSON.parse(localStorage.getItem(KEY) || '[]'); if (Array.isArray(saved)) cart = saved.filter(function (x) { return BY_ID[x.id]; }); } catch (e) {}
  var save = function () { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} };

  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var inCart = function (id) { for (var i = 0; i < cart.length; i++) if (cart[i].id === id) return i; return -1; };
  var plural = function (n) { var m10 = n % 10, m100 = n % 100; return n + ' ' + (m10 === 1 && m100 !== 11 ? 'работа' : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? 'работы' : 'работ'); };

  var ICON_PLUS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';
  var ICON_DEL = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function renderTabs() {
    tabsEl.innerHTML = CATS.map(function (c) {
      return '<button class="tab" role="tab" type="button" data-cat="' + c.id + '" aria-selected="' + (c.id === active && !searchEl.value ? 'true' : 'false') + '">' + esc(c.name) + '</button>';
    }).join('');
  }

  function renderList() {
    var q = searchEl.value.trim().toLowerCase();
    var items = [];
    CATS.forEach(function (c) {
      if (!q && c.id !== active) return;
      c.items.forEach(function (i) {
        var it = BY_ID[i[0]];
        if (q && (it.name + ' ' + it.note + ' ' + it.cat).toLowerCase().indexOf(q) === -1) return;
        items.push(it);
      });
    });
    if (!items.length) { listEl.innerHTML = '<li class="svc svc--empty">Ничего не нашли — позвоните, мастер подскажет: +375 29 308-20-20</li>'; return; }
    listEl.innerHTML = items.map(function (it, k) {
      var on = inCart(it.id) > -1;
      return '<li class="svc" style="animation-delay:' + (k * 25) + 'ms">' +
        '<span class="svc__name">' + esc(it.name) + (it.note || q ? '<small>' + esc([it.note, q ? it.cat : ''].filter(Boolean).join(' · ')) + '</small>' : '') + '</span>' +
        '<span class="svc__price">от ' + it.price + ' руб.</span>' +
        '<button class="add" type="button" data-add="' + it.id + '" aria-pressed="' + on + '" aria-label="' + (on ? 'Убрать из расчёта: ' : 'Добавить в расчёт: ') + esc(it.name) + '">' + ICON_PLUS + '</button></li>';
    }).join('');
  }

  function total() { return cart.reduce(function (s, x) { return s + BY_ID[x.id].price * x.n; }, 0); }

  var shown = 0;
  function animateTotal(to) {
    var from = shown, t0 = null;
    shown = to;
    totalWrap.classList.remove('bump'); void totalWrap.offsetWidth; totalWrap.classList.add('bump');
    if (reduce) { totalNum.textContent = fmt(to); return; }
    var step = function (t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / 500, 1);
      totalNum.textContent = fmt(from + (to - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function lineHTML(x) {
    var it = BY_ID[x.id];
    return '<li class="line" data-line="' + it.id + '">' +
      '<span class="line__name">' + esc(it.name) + '<small>' + (it.qty ? x.n + ' × ' : '') + 'от ' + it.price + ' руб.' + (it.note && !it.qty ? ' · ' + esc(it.note) : '') + '</small></span>' +
      (it.qty ? '<span class="qty"><button type="button" data-dec="' + it.id + '" aria-label="Меньше">−</button><output aria-live="polite">' + x.n + '</output><button type="button" data-inc="' + it.id + '" aria-label="Больше">+</button></span>' : '<span></span>') +
      '<button class="del" type="button" data-del="' + it.id + '" aria-label="Удалить из расчёта: ' + esc(it.name) + '">' + ICON_DEL + '</button></li>';
  }

  function renderCart(opts) {
    opts = opts || {};
    if (!opts.keepLines) cartList.innerHTML = cart.map(lineHTML).join('');
    var has = cart.length > 0;
    emptyEl.hidden = has;
    clearBtn.hidden = !has;
    countEl.textContent = plural(cart.length);
    var t = total();
    animateTotal(t);
    if (mbarSum) { mbarSum.hidden = !has; mbarSum.textContent = '· ' + fmt(t) + ' руб.'; }
    save();
  }

  function add(id) {
    cart.push({ id: id, n: 1 });
    cartList.insertAdjacentHTML('beforeend', lineHTML(cart[cart.length - 1]));
    renderCart({ keepLines: true });
    renderList();
  }

  function removeIds(ids, label) {
    var removed = [];
    ids.forEach(function (id) {
      var i = inCart(id); if (i < 0) return;
      removed.push({ item: cart[i], index: i });
      cart.splice(i, 1);
      var li = cartList.querySelector('[data-line="' + id + '"]');
      if (li) { li.classList.add('is-out'); setTimeout(function () { li.remove(); }, 340); }
    });
    if (!removed.length) return;
    lastRemoved = removed;
    renderCart({ keepLines: true });
    renderList();
    showToast(label || ('Удалено: ' + BY_ID[removed[0].item.id].name));
  }

  function showToast(text) {
    toastTxt.textContent = text.length > 46 ? text.slice(0, 44) + '…' : text;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.hidden = true; lastRemoved = null; }, 5000);
  }

  undoBtn.addEventListener('click', function () {
    if (!lastRemoved) return;
    lastRemoved.slice().reverse().forEach(function (r) { cart.splice(Math.min(r.index, cart.length), 0, r.item); });
    lastRemoved = null;
    toast.hidden = true;
    renderCart(); renderList();
  });

  tabsEl.addEventListener('click', function (e) {
    var b = e.target.closest('[data-cat]'); if (!b) return;
    active = b.dataset.cat; searchEl.value = '';
    renderTabs(); renderList();
  });
  searchEl.addEventListener('input', function () { renderTabs(); renderList(); });

  listEl.addEventListener('click', function (e) {
    var b = e.target.closest('[data-add]'); if (!b) return;
    var id = b.dataset.add;
    if (inCart(id) > -1) removeIds([id]); else add(id);
  });

  cartList.addEventListener('click', function (e) {
    var d = e.target.closest('[data-del]');
    if (d) { removeIds([d.dataset.del]); return; }
    var inc = e.target.closest('[data-inc]'), dec = e.target.closest('[data-dec]');
    var id = (inc || dec) && (inc || dec).dataset[inc ? 'inc' : 'dec'];
    if (!id) return;
    var i = inCart(id);
    if (dec && cart[i].n === 1) { removeIds([id]); return; }
    cart[i].n = Math.min(cart[i].n + (inc ? 1 : -1), 20);
    var li = cartList.querySelector('[data-line="' + id + '"]');
    li.outerHTML = lineHTML(cart[i]);
    var fresh = cartList.querySelector('[data-line="' + id + '"]');
    fresh.style.animation = 'none';
    fresh.querySelector(inc ? '[data-inc]' : '[data-dec]').focus();
    renderCart({ keepLines: true });
  });

  clearBtn.addEventListener('click', function () {
    var n = cart.length;
    removeIds(cart.map(function (x) { return x.id; }), 'Расчёт очищен (' + plural(n) + ')');
  });

  /* phone mask */
  var phone = form.querySelector('input[name="phone"]');
  phone.addEventListener('input', function () {
    var d = phone.value.replace(/\D/g, '');
    if (d.indexOf('375') !== 0) d = '375' + d.replace(/^80?/, '');
    d = d.slice(0, 12);
    var r = '+375';
    if (d.length > 3) r += ' (' + d.slice(3, 5);
    if (d.length >= 5) r += ')';
    if (d.length > 5) r += ' ' + d.slice(5, 8);
    if (d.length > 8) r += '-' + d.slice(8, 10);
    if (d.length > 10) r += '-' + d.slice(10, 12);
    phone.value = r;
    phone.classList.remove('is-bad');
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var digits = phone.value.replace(/\D/g, '');
    if (digits.length !== 12) { phone.classList.add('is-bad'); phone.focus(); return; }
    var lines = cart.map(function (x) { var it = BY_ID[x.id]; return '— ' + it.name + (it.qty ? ' × ' + x.n : '') + ': от ' + it.price * x.n + ' руб.'; });
    var body = 'Телефон: ' + phone.value + '\nКогда: ' + slotText() + '\n\nПредварительный расчёт:\n' + (lines.join('\n') || '— (не выбрано)') + '\n\nИтого от ' + fmt(total()) + ' руб.';
    // TODO: подключить отправку на сервер / CRM / Telegram-бота. Пока — письмо администратору.
    window.location.href = 'mailto:mavra41@bk.ru?subject=' + encodeURIComponent('Запись с сайта — онлайн-расчёт') + '&body=' + encodeURIComponent(body);
    okEl.hidden = false;
  });

  function addMany(ids) {
    var added = 0;
    ids.forEach(function (id) { if (BY_ID[id] && inCart(id) < 0) { cart.push({ id: id, n: 1 }); added++; } });
    renderCart(); renderList();
    return added;
  }

  /* ---------- «Где беспокоит?» ---------- */
  // x/y — положение точки на фото (%), svc — работы из калькулятора
  var ZONES = [
    { id: 'lights', x: 82.6, y: 55.2, name: 'Фары и оптика', title: 'Свет стал тусклым?',
      sym: [['Фары помутнели или пожелтели', ['hpol', 'hrest']], ['Плохо светят ночью', ['hpol']], ['Трещины или сколы на стекле фары', ['hrest']]] },
    { id: 'body', x: 62, y: 47, name: 'Кузов и покраска', title: 'Царапины, сколы, вмятины',
      sym: [['Царапины и сколы на ЛКП', []], ['Вмятина после ДТП или парковки', []], ['Ржавчина на порогах или арках', []]],
      note: 'Кузовные работы считаем после осмотра — пришлите фото или приезжайте. На покраску каждого второго элемента −20%.', call: '+375291020707' },
    { id: 'brakes', x: 35.5, y: 65, name: 'Тормоза и колёса', title: 'Скрип, вибрация, увод',
      sym: [['Скрип или свист при торможении', ['padsF', 'padsR']], ['Педаль тормоза «мягкая»', ['bleed', 'brf']], ['Руль бьёт при торможении', ['padsF']], ['Машину уводит в сторону', ['geo', 'align2']]] },
    { id: 'suspension', x: 16.5, y: 63, name: 'Подвеска', title: 'Стуки на неровностях?',
      sym: [['Стук на кочках спереди', ['link', 'strut']], ['Люфт и скрип при повороте руля', ['ball', 'tieend']], ['Неровный износ шин', ['geo', 'align2']], ['Гул при движении', ['hub']]] },
    { id: 'engine', x: 22.5, y: 52, name: 'Двигатель', title: 'Мотор ведёт себя странно',
      sym: [['Горит «Check Engine»', ['diag']], ['Пора делать ТО', ['oil', 'air', 'cabin']], ['Пробег 60–90 тыс. без замены ГРМ', ['timing', 'pump']], ['Перегрев или уходит антифриз', ['cool', 'rad']]] },
    { id: 'climate', x: 68, y: 62, name: 'Климат', title: 'Кондиционер не холодит',
      sym: [['Дует тёплым воздухом', ['ac', 'freon']], ['Неприятный запах из дефлекторов', ['cabin']], ['Запотевают стёкла', ['cabin', 'ac']]] },
    { id: 'cabin', x: 55, y: 37, name: 'Салон', title: 'Салон потерял вид?',
      sym: [['Потёртый руль или сиденья', []], ['Провис потолок', []], ['Хочется сменить материал или цвет', []]],
      note: 'Перетяжку руля, сидений, потолка и дверных карт делает наше тюнинг-ателье. Гарантия 1 год — стоимость назовём по фото.', call: '+375292637352' }
  ];
  var spotsEl = document.querySelector('.doc__spots');
  var panel = document.querySelector('.doc__panel');
  var zone = null, picked = [];

  spotsEl.innerHTML = ZONES.map(function (z) {
    return '<button class="hs" type="button" data-zone="' + z.id + '" style="left:' + z.x + '%;top:' + z.y + '%" aria-pressed="false" aria-label="' + esc(z.name) + '"><span class="hs__label">' + esc(z.name) + '</span></button>';
  }).join('');

  function zoneServices() {
    var ids = [];
    zone.sym.forEach(function (s, i) {
      if (picked.length && picked.indexOf(i) < 0) return;
      s[1].forEach(function (id) { if (ids.indexOf(id) < 0) ids.push(id); });
    });
    return ids;
  }

  function renderPanel() {
    spotsEl.querySelectorAll('.hs').forEach(function (b) { b.setAttribute('aria-pressed', String(!!zone && b.dataset.zone === zone.id)); });
    if (!zone) {
      panel.innerHTML = '<p class="doc__zone">Подсказка</p><h3>Выберите зону на автомобиле</h3>' +
        '<p class="doc__hint">Оранжевые точки — фары, кузов, тормоза, подвеска, двигатель, климат и салон. Отметьте симптомы, а мы подберём работы и посчитаем ориентировочную стоимость.</p>' +
        '<div class="sym">' + ZONES.map(function (z) { return '<button type="button" data-zone="' + z.id + '" aria-pressed="false">' + esc(z.name) + '</button>'; }).join('') + '</div>';
      return;
    }
    var ids = zoneServices();
    var sum = ids.reduce(function (s, id) { return s + BY_ID[id].price; }, 0);
    var html = '<p class="doc__zone">' + esc(zone.name) + '</p><h3>' + esc(zone.title) + '</h3>' +
      '<div class="sym" role="group" aria-label="Что вы замечаете?">' + zone.sym.map(function (s, i) {
        return '<button type="button" data-sym="' + i + '" aria-pressed="' + (picked.indexOf(i) > -1) + '">' + esc(s[0]) + '</button>';
      }).join('') + '</div>';
    if (ids.length) {
      html += '<ul class="rec">' + ids.map(function (id) {
        return '<li class="' + (inCart(id) > -1 ? 'in-cart' : '') + '"><span>' + esc(BY_ID[id].name) + '</span><b>от ' + BY_ID[id].price + ' руб.</b></li>';
      }).join('') + '</ul>' +
      '<div class="doc__actions"><button class="btn" type="button" data-addzone>Добавить в расчёт · от ' + fmt(sum) + ' руб.</button></div>';
    } else {
      html += '<p class="doc__hint">' + esc(zone.note || '') + '</p><div class="doc__actions"><a class="btn" href="tel:' + zone.call + '">Позвонить мастеру</a></div>';
    }
    panel.innerHTML = html;
  }

  function pickZone(id) { zone = ZONES.filter(function (z) { return z.id === id; })[0] || null; picked = []; renderPanel(); }
  spotsEl.addEventListener('click', function (e) { var b = e.target.closest('[data-zone]'); if (b) pickZone(zone && zone.id === b.dataset.zone ? null : b.dataset.zone); });
  panel.addEventListener('click', function (e) {
    var z = e.target.closest('[data-zone]'); if (z) { pickZone(z.dataset.zone); return; }
    var s = e.target.closest('[data-sym]');
    if (s) {
      var i = +s.dataset.sym, k = picked.indexOf(i);
      if (k > -1) picked.splice(k, 1); else picked.push(i);
      renderPanel();
      var again = panel.querySelector('[data-sym="' + i + '"]'); if (again) again.focus();
      return;
    }
    if (e.target.closest('[data-addzone]')) {
      var n = addMany(zoneServices());
      renderPanel();
      showToastInfo(n ? 'Добавлено в расчёт: ' + plural(n) : 'Эти работы уже в расчёте');
      document.getElementById('calc').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    }
  });
  function showToastInfo(text) {
    lastRemoved = null;
    toastTxt.textContent = text;
    undoBtn.hidden = true;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.hidden = true; undoBtn.hidden = false; }, 3000);
  }
  var _showToast = showToast;
  showToast = function (t) { undoBtn.hidden = false; _showToast(t); };
  renderPanel();

  /* ---------- слоты записи ---------- */
  var daysEl = document.querySelector('.slots__days');
  var timesEl = document.querySelector('.slots__times');
  var WD = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
  var MON = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  var TIMES = ['9:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00'];
  var days = [], selDay = 0, selTime = null;
  for (var d = 0; d < 7; d++) { var dt = new Date(); dt.setDate(dt.getDate() + d); days.push(dt); }
  function renderSlots() {
    daysEl.innerHTML = days.map(function (dt, i) {
      var top = i === 0 ? 'Сегодня' : i === 1 ? 'Завтра' : WD[dt.getDay()];
      return '<button class="slot" type="button" data-day="' + i + '" aria-pressed="' + (i === selDay) + '">' + top + '<small>' + dt.getDate() + ' ' + MON[dt.getMonth()] + '</small></button>';
    }).join('');
    var now = new Date();
    timesEl.innerHTML = TIMES.map(function (t) {
      var hm = t.split(':'), past = selDay === 0 && (+hm[0] * 60 + +hm[1]) <= now.getHours() * 60 + now.getMinutes() + 60;
      return '<button class="slot" type="button" data-time="' + t + '" aria-pressed="' + (t === selTime) + '"' + (past ? ' disabled' : '') + '>' + t + '</button>';
    }).join('');
  }
  daysEl.addEventListener('click', function (e) { var b = e.target.closest('[data-day]'); if (!b) return; selDay = +b.dataset.day; selTime = null; renderSlots(); daysEl.querySelector('[data-day="' + selDay + '"]').focus(); });
  timesEl.addEventListener('click', function (e) { var b = e.target.closest('[data-time]'); if (!b || b.disabled) return; selTime = b.dataset.time; renderSlots(); timesEl.querySelector('[data-time="' + selTime + '"]').focus(); });
  renderSlots();
  slotText = function () { var dt = days[selDay]; return dt.getDate() + ' ' + MON[dt.getMonth()] + (selTime ? ', ' + selTime : ', время — по договорённости'); };

  /* ---------- эффекты ---------- */
  var progress = document.querySelector('.progress');
  var hero = document.querySelector('.hero');
  var frame = document.querySelector('.hero__frame');
  var spot = document.querySelector('.hero__spot');
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      var h = document.documentElement.scrollHeight - innerHeight;
      progress.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')';
      if (!reduce && scrollY < innerHeight * 1.2) frame.style.setProperty('--sc', 1 + scrollY / innerHeight * 0.08);
      ticking = false;
    });
  }, { passive: true });

  if (fine && !reduce) {
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      frame.style.setProperty('--px', ((0.5 - x) * 24).toFixed(1) + 'px');
      frame.style.setProperty('--py', ((0.5 - y) * 16).toFixed(1) + 'px');
      spot.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
      spot.style.setProperty('--my', (y * 100).toFixed(1) + '%');
    });
    document.querySelectorAll('.tilt').forEach(function (c) {
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.setProperty('--ry', ((x - 0.5) * 8).toFixed(2) + 'deg');
        c.style.setProperty('--rx', ((0.5 - y) * 8).toFixed(2) + 'deg');
        c.style.setProperty('--cx', (x * 100) + '%');
        c.style.setProperty('--cy', (y * 100) + '%');
      });
      c.addEventListener('pointerleave', function () { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); });
    });
    document.querySelectorAll('.magnet').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.2) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.3) + 'px)';
      });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
  }

  renderTabs(); renderList(); renderCart();
})();
