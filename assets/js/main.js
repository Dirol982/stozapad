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
  var CATS = [
  // Цены «от», руб. Источник: страницы услуг stozapad.by, где цены нет — общий прайс stozapad.by/ceny.
  // [id, название, цена, пометка, можно указать количество, элемент кузова (скидка −20% на каждый второй)]
    { id: 'to', name: 'ТО и диагностика', items: [
      ['diag', 'Компьютерная диагностика', 32],
      ['osm', 'Комплексный осмотр автомобиля', 42],
      ['lift', 'Осмотр на подъёмнике', 20],
      ['oil', 'Замена масла двигателя и фильтра', 27],
      ['air', 'Замена воздушного фильтра', 10],
      ['cabin', 'Замена салонного фильтра', 10],
      ['fuel', 'Замена топливного фильтра', 10],
      ['cool', 'Замена антифриза', 15],
      ['brf', 'Замена тормозной жидкости', 15],
      ['plugs', 'Замена свечей зажигания', 15],
      ['glow', 'Замена свечей накала', 25],
      ['mkpp', 'Замена масла в МКПП', 25],
      ['akpp', 'Замена масла в АКПП', 35],
      ['reset', 'Сброс ошибки / сервисного интервала', 10]
    ]},
    { id: 'chassis', name: 'Ходовая и руль', items: [
      ['susp', 'Диагностика подвески', 20],
      ['geoCheck', 'Проверка углов установки колёс', 25],
      ['geo', 'Проверка геометрии', 35],
      ['align1', 'Развал-схождение, 1 ось', 35, 'легковой'],
      ['align2', 'Развал-схождение, 2 оси', 50, 'легковой'],
      ['alignJ1', 'Развал-схождение, 1 ось', 45, 'джип / кроссовер'],
      ['alignJ2', 'Развал-схождение, 2 оси', 70, 'джип / кроссовер'],
      ['alignBus', 'Развал-схождение', 45, 'микроавтобус'],
      ['link', 'Замена стойки стабилизатора', 15, 'за шт.', true],
      ['bush', 'Замена втулок стабилизатора', 25],
      ['shock', 'Замена амортизатора', 40, 'за шт.', true],
      ['spring', 'Замена пружины', 50, 'за шт.', true],
      ['ball', 'Замена шаровой опоры', 40, 'за шт.', true],
      ['ballR', 'Восстановление шаровой опоры', 60, 'за шт.', true],
      ['arm', 'Замена рычага подвески', 50, 'за шт.', true],
      ['silent', 'Замена сайлентблоков', 20],
      ['hub', 'Замена ступичного подшипника', 60, 'за шт.', true],
      ['cv', 'Замена ШРУСа', 60, 'за шт.', true],
      ['boot', 'Замена пыльника ШРУСа', 40, 'за шт.', true],
      ['tie', 'Замена рулевой тяги', 30, 'за шт.', true],
      ['tieend', 'Замена рулевого наконечника', 15, 'за шт.', true],
      ['rack', 'Рулевая рейка — снять/установить', 120]
    ]},
    { id: 'brakes', name: 'Тормоза', items: [
      ['brDiag', 'Диагностика тормозной системы', 15],
      ['padsF', 'Замена передних колодок', 30],
      ['padsR', 'Замена задних колодок (диск)', 30],
      ['drum', 'Замена задних колодок (барабан)', 41],
      ['caliper', 'Суппорт передний — снять/установить', 20, 'за шт.', true],
      ['bleed', 'Прокачка тормозной системы', 15],
      ['hose', 'Замена тормозного шланга', 15, 'за шт.', true],
      ['park', 'Замена колодок стояночного тормоза', 45]
    ]},
    { id: 'tires', name: 'Шиномонтаж', items: [
      ['tire13', 'Шиномонтаж 4 колёс R12–R13', 50, 'с балансировкой'],
      ['tire16', 'Шиномонтаж 4 колёс R14–R16', 60, 'с балансировкой'],
      ['tire19', 'Шиномонтаж 4 колёс R17–R19', 70, 'с балансировкой'],
      ['tire21', 'Шиномонтаж 4 колёс R20–R21', 85, 'с балансировкой'],
      ['tire1', 'Шиномонтаж 1 колеса R14–R16', 16, 'за колесо', true]
    ]},
    { id: 'paint', name: 'Покраска', items: [
      ['pHood', 'Покраска капота', 400, '', false, true],
      ['pDoor', 'Покраска двери', 300, 'за шт.', true, true],
      ['pWing', 'Покраска крыла', 300, 'за шт.', true, true],
      ['pBumper', 'Покраска бампера', 450, 'за шт.', true, true],
      ['pSill', 'Покраска порога', 300, 'за шт.', true, true],
      ['pTrunk', 'Покраска крышки багажника', 350, '', false, true],
      ['pRoof', 'Покраска крыши', 500, '', false, true],
      ['polish', 'Полировка кузова', 500],
      ['pFull', 'Покраска автомобиля полностью', 5000]
    ]},
    { id: 'engine', name: 'Двигатель', items: [
      ['timing', 'Замена комплекта ремня ГРМ', 120],
      ['pump', 'Замена помпы (при снятом ГРМ)', 45],
      ['rad', 'Замена радиатора охлаждения', 50],
      ['turbo', 'Турбина — снять/установить (бензин)', 200],
      ['cat', 'Катализатор — снять/установить', 80],
      ['muffler', 'Замена глушителя', 25]
    ]},
    { id: 'climate', name: 'Кондиционер и электрика', items: [
      ['acLeak', 'Проверка кондиционера на герметичность', 40],
      ['acFill', 'Заправка кондиционера с вакуумированием', 80],
      ['freon', 'Фреон', 15, 'за 100 г', true],
      ['acDis', 'Дезинфекция системы кондиционирования', 80],
      ['acFind', 'Поиск утечки', 30],
      ['elec', 'Поиск неисправности электрики', 35, 'за час', true]
    ]},
    { id: 'lights', name: 'Фары', items: [
      ['hpol', 'Полировка фар', 60, 'за фару', true],
      ['hrest', 'Восстановление пластика передних фар', 100, 'за фару', true],
      ['hrestR', 'Восстановление задних фонарей', 50, 'за фонарь', true],
      ['hlak', 'Покраска передних фар защитным лаком', 160]
    ]},
    { id: 'detail', name: 'Детейлинг', items: [
      ['ceramic', 'Керамика в 1 слой, седан', 300],
      ['ceramicJ', 'Керамика в 1 слой, джип / минивэн', 350],
      ['dry', 'Химчистка салона, седан', 200],
      ['tint', 'Тонировка стёкол', 80],
      ['rain', 'Антидождь на лобовое стекло', 50],
      ['wheels', 'Полировка дисков, комплект', 300]
    ]},
    { id: 'interior', name: 'Салон', items: [
      ['wEco', 'Перетяжка руля экокожей', 100],
      ['wAlc', 'Перетяжка руля алькантарой', 120],
      ['wLeather', 'Перетяжка руля натуральной кожей', 200],
      ['seat', 'Перетяжка сиденья', 200, 'за шт.', true],
      ['ceiling', 'Перетяжка потолка (седан, без люка)', 200],
      ['armrest', 'Перетяжка подлокотника', 50],
      ['shift', 'Перетяжка ручки КПП', 45],
      ['mats', 'Пошив ковриков из экокожи, комплект', 120]
    ]},
    { id: 'chip', name: 'Чип-тюнинг', items: [
      ['ecu', 'Прошивка ЭБУ (заводская)', 120],
      ['ecuPlus', 'Прошивка ЭБУ с увеличением мощности', 150],
      ['egr', 'Программное отключение EGR', 160],
      ['ss', 'Отключение Start/Stop', 150],
      ['adblue', 'Программное отключение AdBlue', 200],
      ['speedo', 'Корректировка спидометра', 100]
    ]}
  ];
  var BY_ID = {};
  CATS.forEach(function (c) { c.items.forEach(function (i) {
    BY_ID[i[0]] = { id: i[0], name: i[1], price: i[2], note: i[3] || '', qty: !!i[4], paint: !!i[5], cat: c.name };
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
  var discEl = document.querySelector('.cart__disc');
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

  function gross() { return cart.reduce(function (s, x) { return s + BY_ID[x.id].price * x.n; }, 0); }
  // Акция: −20% на каждый второй элемент кузова (скидку считаем с более дешёвых элементов)
  function paintDiscount() {
    var units = [];
    cart.forEach(function (x) { var it = BY_ID[x.id]; if (it.paint) for (var k = 0; k < x.n; k++) units.push(it.price); });
    units.sort(function (a, b) { return b - a; });
    var d = 0;
    for (var i = 1; i < units.length; i += 2) d += units[i] * 0.2;
    return Math.round(d);
  }
  function total() { return gross() - paintDiscount(); }

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
    var disc = paintDiscount();
    discEl.hidden = !disc;
    discEl.querySelector('b').textContent = '−' + fmt(disc) + ' руб.';
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
    var body = 'Телефон: ' + phone.value + '\nКогда: ' + slotText() + '\n\nПредварительный расчёт:\n' + (lines.join('\n') || '— (не выбрано)') + (paintDiscount() ? '\nСкидка −20% на каждый второй элемент: −' + fmt(paintDiscount()) + ' руб.' : '') + '\n\nИтого от ' + fmt(total()) + ' руб.';
    // TODO: подключить отправку на сервер / CRM / Telegram-бота. Пока — письмо администратору.
    window.location.href = 'mailto:mavra41@bk.ru?subject=' + encodeURIComponent('Запись с сайта — онлайн-расчёт') + '&body=' + encodeURIComponent(body);
    okEl.hidden = false;
  });

  /* ---------- «Где беспокоит?» ---------- */
  // x/y — положение точки на фото (%), svc — короткий список работ из калькулятора
  var ZONES = [
    { id: 'lights', x: 82.6, y: 55.2, name: 'Фары', svc: ['hpol', 'hrest', 'hlak'] },
    { id: 'body', x: 62, y: 47, name: 'Кузов и покраска', svc: ['pDoor', 'pWing', 'pBumper', 'polish'] },
    { id: 'brakes', x: 35.5, y: 65, name: 'Тормоза и колёса', svc: ['brDiag', 'padsF', 'padsR', 'tire16'] },
    { id: 'suspension', x: 16.5, y: 63, name: 'Подвеска', svc: ['susp', 'link', 'shock', 'align2'] },
    { id: 'engine', x: 22.5, y: 52, name: 'Двигатель', svc: ['diag', 'oil', 'timing'] },
    { id: 'climate', x: 68, y: 62, name: 'Кондиционер', svc: ['acLeak', 'acFill', 'acDis', 'cabin'] },
    { id: 'cabin', x: 55, y: 37, name: 'Салон', svc: ['wEco', 'seat', 'ceiling', 'dry'] }
  ];
  var spotsEl = document.querySelector('.doc__spots');
  var panel = document.querySelector('.doc__panel');
  var zone = null;

  spotsEl.innerHTML = ZONES.map(function (z) {
    return '<button class="hs" type="button" data-zone="' + z.id + '" style="left:' + z.x + '%;top:' + z.y + '%" aria-pressed="false" aria-label="' + esc(z.name) + '"><span class="hs__label">' + esc(z.name) + '</span></button>';
  }).join('');

  function renderPanel() {
    spotsEl.querySelectorAll('.hs').forEach(function (b) { b.setAttribute('aria-pressed', String(!!zone && b.dataset.zone === zone.id)); });
    var tabs = '<div class="doc__tabs" role="group" aria-label="Зоны автомобиля">' + ZONES.map(function (z) {
      return '<button type="button" data-zone="' + z.id + '" aria-pressed="' + (!!zone && zone.id === z.id) + '">' + esc(z.name) + '</button>';
    }).join('') + '</div>';
    if (!zone) {
      panel.innerHTML = '<p class="doc__zone">Подсказка</p><h3>Выберите зону на автомобиле</h3>' +
        '<p class="doc__hint">Нажмите на оранжевую точку или на название ниже — покажем основные работы. Отметьте нужные, и они попадут в ваш расчёт.</p>' + tabs;
      return;
    }
    var n = zone.svc.filter(function (id) { return inCart(id) > -1; }).length;
    panel.innerHTML = '<p class="doc__zone">' + esc(zone.name) + '</p><h3>Что нужно сделать?</h3>' +
      '<ul class="doc__list">' + zone.svc.map(function (id) {
        var it = BY_ID[id], on = inCart(id) > -1;
        return '<li class="svc"><span class="svc__name">' + esc(it.name) + (it.note ? '<small>' + esc(it.note) + '</small>' : '') + '</span>' +
          '<button class="add" type="button" data-pick="' + id + '" aria-pressed="' + on + '" aria-label="' + (on ? 'Убрать из расчёта: ' : 'Добавить в расчёт: ') + esc(it.name) + '">' + ICON_PLUS + '</button></li>';
      }).join('') + '</ul>' +
      '<div class="doc__actions"><a class="btn' + (n ? '' : ' btn--ghost') + '" href="#calc">' + (n ? 'Перейти к расчёту · ' + plural(n) : 'Перейти к расчёту') + '</a></div>' + tabs;
  }

  function pickZone(id) { zone = ZONES.filter(function (z) { return z.id === id; })[0] || null; renderPanel(); }
  spotsEl.addEventListener('click', function (e) { var b = e.target.closest('[data-zone]'); if (b) pickZone(zone && zone.id === b.dataset.zone ? null : b.dataset.zone); });
  panel.addEventListener('click', function (e) {
    var z = e.target.closest('[data-zone]'); if (z) { pickZone(z.dataset.zone); var t = panel.querySelector('.doc__tabs [data-zone="' + z.dataset.zone + '"]'); if (t) t.focus(); return; }
    var p = e.target.closest('[data-pick]');
    if (p) {
      var id = p.dataset.pick;
      if (inCart(id) > -1) removeIds([id]); else add(id);
      renderPanel();
      var again = panel.querySelector('[data-pick="' + id + '"]'); if (again) again.focus();
    }
  });
  var _renderCart = renderCart;
  renderCart = function (o) { _renderCart(o); if (zone) renderPanel(); };
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
