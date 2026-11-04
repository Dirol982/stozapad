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
  // Прайс stozapad.by: цены «от», руб. Источник — страницы услуг; где на странице цены нет — общий прайс /ceny/.
  // Элемент: [название, цена | {car, suv, bus}, флаги]. Флаг 'p' — элемент кузова (акция −20% на каждый второй).
  var CATS = [
    { id: 'to', name: 'ТО и диагностика', items: [
      ['Компьютерная диагностика всех блоков', 32],
      ['Сброс ошибок / сервисного интервала', 10],
      ['Комплексный осмотр автомобиля', 42],
      ['Осмотр автомобиля на подъёмнике', 20],
      ['Замена масла ДВС и масляного фильтра', 20],
      ['Замена воздушного фильтра', 15],
      ['Замена салонного фильтра', 10],
      ['Замена топливного фильтра', 20],
      ['Замена антифриза', 15],
      ['Замена тормозной жидкости', 15],
      ['Замена свечей зажигания', 65],
      ['Замена свечей накала', 70],
      ['Замена масла в МКПП', 25],
      ['Замена масла в АКПП частичная', 40],
      ['Замена масла в АКПП полная («проливом»)', 70],
      ['Проверка уровня масла в АКПП', 10],
      ['Замена масла ГУР', 15],
      ['Замена масла в редукторе моста', 15],
      ['Проверка уровня технических жидкостей', 9],
      ['Диагностика топливной системы', 32],
      ['Диагностика геометрии кузова на стапеле', 100]
    ]},
    { id: 'podveska', name: 'Подвеска', items: [
      ['Диагностика подвески', 20],
      ['Замена амортизатора', 40],
      ['Замена амортизаторной стойки передней (в сборе)', 50],
      ['Замена заднего амортизатора (комплекс работ)', 120],
      ['Замена опорного подшипника стойки', 50],
      ['Замена пружины', 50],
      ['Замена пружин передней подвески (2 шт.)', 120],
      ['Замена стоек стабилизатора', 15],
      ['Замена втулок стабилизатора', 25],
      ['Замена шаровой опоры', 40],
      ['Замена шаровой опоры (запрессованной)', 45],
      ['Восстановление шаровой опоры', 60],
      ['Замена рычага подвески', 50],
      ['Восстановление рычага', 60],
      ['Замена сайлентблоков', 20],
      ['Замена ступичного подшипника', 60],
      ['Ступица передняя — снять/установить', 35],
      ['Замена ШРУСа', 60],
      ['Замена пыльника ШРУСа', 40],
      ['Балка переднего моста — снять/установить', 90],
      ['Ремонт торсионной балки', 200],
      ['Замена задней балки', 100],
      ['Замена ремкомплекта задней балки (игольчатые подшипники)', 120],
      ['Замена торсионов задней балки (балка снята)', 80],
      ['Замена рычагов задней балки', 120],
      ['Восстановление рычага задней балки', 95],
      ['Ремонт задней балки Renault (19, Megane, Scenic, Clio…)', 120],
      ['Ремонт задней балки Peugeot 206 / 405 / Partner', 150],
      ['Ремонт задней балки Citroën Xsara Picasso / Berlingo', 150]
    ]},
    { id: 'rul', name: 'Рулевое управление', items: [
      ['Замена рулевой тяги', 30],
      ['Замена рулевого наконечника', 15],
      ['Рулевая рейка — снять/установить', 120],
      ['Рулевой редуктор — снять/установить', 120],
      ['Восстановление рулевой рейки', 220],
      ['Разборка и дефектовка рулевой рейки', 40],
      ['Шлифовка вала распределителя рулевого механизма', 40],
      ['Промывка системы ГУР', 80]
    ]},
    { id: 'tormoza', name: 'Тормоза', items: [
      ['Замена передних тормозных колодок', 30],
      ['Замена задних тормозных колодок (диск)', 30],
      ['Замена задних колодок (барабан)', 41],
      ['Замена колодок стояночного тормоза', 45],
      ['Замена троса стояночного тормоза', 28],
      ['Суппорт передний — снять/установить', 20],
      ['Замена тормозного шланга', 15],
      ['Прокачка тормозов механическая', 30],
      ['Прокачка тормозов с подключением компьютера', 50]
    ]},
    { id: 'razval', name: 'Развал и шины', items: [
      ['Проверка углов установки колёс', 25],
      ['Проверка геометрии', 35],
      ['Развал-схождение, 1 ось', { car: 35, suv: 45, bus: 45 }],
      ['Развал-схождение, 2 оси', { car: 50, suv: 70, bus: 45 }],
      ['Шиномонтаж 4 колёс R12–R13', { car: 50, suv: 50, bus: 50 }],
      ['Шиномонтаж 4 колёс R14–R16', { car: 60, suv: 60, bus: 75 }],
      ['Шиномонтаж 4 колёс R17–R19', { car: 70, suv: 70, bus: 85 }],
      ['Шиномонтаж 4 колёс R20–R21', { car: 85, suv: 85, bus: 95 }],
      ['Шиномонтаж 4 колёс больше R21', { car: 95, suv: 95, bus: 100 }],
      ['Шиномонтаж 1 колеса R14–R16', { car: 16, suv: 16, bus: 19 }],
      ['Балансировка колеса R14–R16', { car: 4.5, suv: 4.5, bus: 6 }],
      ['Снятие и установка колеса R14–R16', { car: 4.5, suv: 4.5, bus: 4 }],
      ['Замена вентиля', 4]
    ]},
    { id: 'dvs', name: 'Двигатель', items: [
      ['Компьютерная диагностика двигателя', 30],
      ['Замер компрессии', 40],
      ['Осмотр на предмет течи', 20],
      ['Замена ремня ГРМ', 250],
      ['Замена помпы (при снятом ГРМ)', 45],
      ['Замена радиатора охлаждения', 50],
      ['Регулировка клапанов', 100],
      ['Замена маслосъёмных колпачков', 80],
      ['Замена прокладки клапанной крышки', 60],
      ['Замена прокладки впускного коллектора', 40],
      ['Замена прокладки выпускного коллектора', 40],
      ['Замена прокладки ГБЦ', 200],
      ['Ремонт ГБЦ', 450],
      ['Замена распредвала', 200],
      ['Замена шкива коленвала', 60],
      ['Замена переднего сальника коленвала', 120],
      ['Замена заднего сальника коленвала', 200],
      ['Замена подушек двигателя', 15],
      ['Капитальный ремонт двигателя', 500],
      ['Снятие / установка двигателя', 400],
      ['Замена двигателя', 500],
      ['Диагностика турбины', 40],
      ['Турбина — снять/установить', 80],
      ['Ремонт турбины', 220],
      ['Замена ремкомплекта турбины', 120],
      ['Замена картриджа турбины', 140]
    ]},
    { id: 'kpp', name: 'Сцепление и КПП', items: [
      ['Замена сцепления', 200],
      ['Замена выжимного подшипника', 70],
      ['Замена троса сцепления', 30],
      ['Замена вилки сцепления', 40],
      ['Замена рабочего цилиндра сцепления', 60],
      ['Замена главного цилиндра сцепления', 60],
      ['Замена маховика', 200],
      ['Восстановление маховика', 150],
      ['Замена приводного вала', 70],
      ['Механическая КПП — снять/установить', 160],
      ['Карданный вал — снять/установить', 90],
      ['Замена эластичной муфты карданного вала', 45],
      ['Замена сальника приводного вала КПП', 45]
    ]},
    { id: 'vyhlop', name: 'Выхлоп', items: [
      ['Сварка глушителя', 30],
      ['Замена одной части глушителя', 40],
      ['Замена подвеса глушителя', 26],
      ['Замена прокладки', 12],
      ['Замена гофры глушителя', 45],
      ['Сварка трещин (трещина)', 50],
      ['Сварка трещин (круговой шов)', 60],
      ['Сварка прогоревшей трубы', 60],
      ['Замена на спортивную банку', 120],
      ['Замена или установка насадки', 30],
      ['Выпускной коллектор — снять/установить', 260],
      ['Замена катализатора', 40],
      ['Удаление катализатора (с пламегасителем)', 120],
      ['Удаление сажевого фильтра (вырезать)', 80],
      ['Программное отключение сажевого фильтра', 160],
      ['Диагностика катализатора, сажевого фильтра, лямбда-зонда', 40]
    ]},
    { id: 'klimat', name: 'Кондиционер', items: [
      ['Проверка на герметичность', 40],
      ['Заправка с вакуумированием', 80],
      ['Фреон, 100 г', 15],
      ['Поиск утечки', 30],
      ['Диагностика кондиционера (электрика)', 32],
      ['Ремонт кондиционера', 40],
      ['Дезинфекция системы', 80],
      ['Дезинфекция и чистка кондиционера', 45],
      ['Дезинфекция испарителя', 80],
      ['Испаритель — снять/установить', 150],
      ['Промывка системы (полная разборка)', 200],
      ['Ремонт трубок и шлангов', 35],
      ['Аргонная сварка', 15],
      ['Замена ниппеля', 10]
    ]},
    { id: 'elektro', name: 'Автоэлектрика', items: [
      ['Поиск неисправности электрики (час)', 35],
      ['Диагностика стартера', 15],
      ['Стартер — снять/установить', 40],
      ['Ремонт стартера', 60],
      ['Диагностика генератора', 30],
      ['Генератор — снять/установить', 50],
      ['Ремонт генератора', 50],
      ['Ремонт стеклоподъёмника (механизм снят)', 55],
      ['Регулировка света фар', 15],
      ['Ремонт иммобилайзера', 80]
    ]},
    { id: 'chip', name: 'Чип-тюнинг', items: [
      ['Прошивка ЭБУ (заводская)', 120],
      ['Прошивка ЭБУ с увеличением мощности', 150],
      ['Прошивка ЭБУ на Евро-2', 150],
      ['Программное отключение EGR', 160],
      ['Физическое отключение EGR', 50],
      ['Отключение вихревых заслонок', 160],
      ['Отключение дроссельных заслонок', 160],
      ['Отключение AdBlue', 200],
      ['Отключение сажевого фильтра DPF', 150],
      ['Отключение контроля катализатора', 160],
      ['Отключение системы EVAP', 150],
      ['Отключение MAF', 250],
      ['Отключение Start/Stop', 150],
      ['Отключение Speed Limit', 200],
      ['Отключение иммобилайзера', 120],
      ['Корректировка спидометра', 100]
    ]},
    { id: 'kuzov', name: 'Кузов и стёкла', items: [
      ['Удаление вмятины 1–3 см без покраски', { car: 10, suv: 20, bus: 25 }],
      ['Удаление вмятины 4–10 см без покраски', { car: 30, suv: 40, bus: 45 }],
      ['Удаление вмятины 11–20 см без покраски', { car: 50, suv: 60, bus: 65 }],
      ['Удаление вмятины 21–40 см без покраски', { car: 70, suv: 80, bus: 85 }],
      ['Удаление вмятины больше 40 см без покраски', { car: 90, suv: 120, bus: 140 }],
      ['Рихтовка одного элемента', 70],
      ['Снятие и установка элемента', 50],
      ['Сварочные работы (один шов)', 50],
      ['Замена арки или порога', 180],
      ['Замена порога', 250],
      ['Переварка днища', 120],
      ['Замена пола', 250],
      ['Переварка стакана', 240],
      ['Обработка стакана антикором', 70],
      ['Правка лонжерона', 280],
      ['Переварка лонжерона', 230],
      ['Переварка подрамника', 80],
      ['Ремонт креплений подрамника', 130],
      ['Стапельные работы', 300],
      ['Ремонт усилителя', 120],
      ['Антикоррозийная обработка (2 слоя)', { car: 600, suv: 760, bus: 890 }],
      ['Замена лобового стекла', { car: 72, suv: 72, bus: 84 }],
      ['Замена заднего стекла', { car: 60, suv: 60, bus: 60 }],
      ['Замена бокового стекла', { car: 48, suv: 48, bus: 48 }]
    ]},
    { id: 'pokraska', name: 'Покраска', items: [
      ['Покраска капота', 400, 'p'],
      ['Покраска двери', 300, 'p'],
      ['Покраска крыла', 300, 'p'],
      ['Покраска бампера', 450, 'p'],
      ['Покраска порога', 300, 'p'],
      ['Покраска крышки багажника', 350, 'p'],
      ['Покраска крыши', 500, 'p'],
      ['Покраска автомобиля полностью', 5000],
      ['Полировка кузова стандарт', 500],
      ['Полировка кузова глубокая (со снятием лака)', 500]
    ]},
    { id: 'fary', name: 'Фары', items: [
      ['Полировка фары', 60],
      ['Восстановление пластика передней фары', 100],
      ['Восстановление пластика задней фары', 50],
      ['Покраска передних фар защитным лаком', 160],
      ['Переделка английских фар в европейские', 200],
      ['Регулировка света фар', 15],
      ['Тонировка фонарей', 40]
    ]},
    { id: 'detail', name: 'Детейлинг', items: [
      ['Керамика в 1 слой (от 1,5 года)', { car: 300, suv: 350, bus: 350 }],
      ['Керамика в 2 слоя (от 2 лет)', 500],
      ['Антигравийная плёнка, комплекс Mini', 500],
      ['Оклейка капота винилом', 280],
      ['Оклейка крыши (имитация панорамы)', 260],
      ['Shadowline — оклейка молдингов', 240],
      ['Оклейка дверных стоек', 60],
      ['Полная оклейка автомобиля', 1800],
      ['Тонировка стёкол (клеевая)', 80],
      ['Атермальная плёнка', 400],
      ['Растонировка стёкол', 30],
      ['Полировка лобового стекла', 250],
      ['Полировка дисков (лицевая часть, комплект)', 300],
      ['Химчистка салона', { car: 200, suv: 300, bus: 400 }],
      ['Шумоизоляция полная (стандарт)', { car: 950, suv: 950, bus: 1150 }],
      ['Шумоизоляция полная (премиум)', { car: 1400, suv: 1400, bus: 1600 }],
      ['Шумоизоляция дверей (стандарт)', { car: 80, suv: 80, bus: 280 }],
      ['Шумоизоляция арок, 4 шт. (стандарт)', { car: 280, suv: 280, bus: 480 }],
      ['Антидождь на лобовое стекло', 50],
      ['Антидождь на все стёкла', 100],
      ['Автоматическая мойка', { car: 12, suv: 15, bus: 18 }],
      ['Ручная мойка «Стандарт»', { car: 20, suv: 25, bus: 30 }],
      ['Мойка «Комплекс №2» (кузов + салон)', { car: 50, suv: 55, bus: 65 }],
      ['Комплексная уборка салона', { car: 15, suv: 20, bus: 25 }],
      ['Мойка двигателя сверху', 30],
      ['Мойка днища', { car: 20, suv: 22, bus: 25 }]
    ]},
    { id: 'salon', name: 'Салон', items: [
      ['Перетяжка руля экокожей', 100],
      ['Перетяжка руля алькантарой', 120],
      ['Перетяжка руля натуральной кожей', 200],
      ['Перетяжка сиденья', 200],
      ['Полная перетяжка салона', 1000],
      ['Перетяжка потолка (седан, без люка)', 200],
      ['Перетяжка потолка (седан, с люком)', 240],
      ['Перетяжка потолка (универсал)', 220],
      ['Перетяжка потолка (минивэн)', 250],
      ['Перетяжка дверной карты', 80],
      ['Перетяжка подлокотника', 50],
      ['Перетяжка ручки КПП', 45],
      ['Чехол кулисы КПП', 25],
      ['Перетяжка торпеды частично', 200],
      ['Перетяжка торпеды экокожей', 800],
      ['Перетяжка торпеды кожей', 1200],
      ['Ремонт сиденья (ткань)', 50],
      ['Ремонт сиденья (кожа)', 60],
      ['Ремонт прожога на сиденье', 30],
      ['Ремонт пластика (дверь)', 60],
      ['Ремонт Airbag на руле', 140],
      ['Ремонт Airbag на торпеде (съёмная)', 100],
      ['Ремонт Airbag на сиденье', 125],
      ['Пошив ковриков из экокожи, комплект', 120],
      ['Пошив ковриков из ковролина', 20],
      ['Покраска руля', 40]
    ]}
  ];
  var BY_ID = {}, NAME_ID = {}, TOTAL = 0;
  CATS.forEach(function (c) { c.items.forEach(function (i, k) {
    var id = c.id + '-' + k;
    BY_ID[id] = { id: id, name: i[0], p: i[1], paint: i[2] === 'p', cat: c.name, catId: c.id };
    if (!NAME_ID[i[0]]) NAME_ID[i[0]] = id;
    TOTAL++;
  }); });
  var CAR_NAMES = { car: 'легковой', suv: 'кроссовер / джип', bus: 'микроавтобус' };

  var tabsEl = document.querySelector('.calc__tabs');
  var listEl = document.querySelector('.calc__items');
  var searchEl = document.querySelector('.calc__search input');
  var foundEl = document.querySelector('.calc__found');
  var segBtns = document.querySelectorAll('.seg [data-car]');
  var cartList = document.querySelector('.cart__list');
  var emptyEl = document.querySelector('.cart__empty');
  var metaEl = document.querySelector('.cart__meta');
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
  document.querySelectorAll('.calc__total-n').forEach(function (el) { el.textContent = TOTAL; });

  var slotText = function () { return ''; };
  var KEY = 'stozapad-calc-v2';
  var cart = [];          // [{id}]
  var car = 'car';
  var active = CATS[0].id;
  var ROWS = 4, expanded = {};
  var narrow = window.matchMedia('(max-width: 720px)');
  var uslug = function (n) { var m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? 'услуга' : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? 'услуги' : 'услуг'; };
  var lastRemoved = null;
  var toastTimer;

  try {
    var saved = JSON.parse(localStorage.getItem(KEY) || '{}');
    if (saved && Array.isArray(saved.cart)) cart = saved.cart.filter(function (x) { return BY_ID[x.id]; });
    if (saved && CAR_NAMES[saved.car]) car = saved.car;
  } catch (e) {}
  var save = function () { try { localStorage.setItem(KEY, JSON.stringify({ cart: cart, car: car })); } catch (e) {} };

  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var inCart = function (id) { for (var i = 0; i < cart.length; i++) if (cart[i].id === id) return i; return -1; };
  var plural = function (n) { var m10 = n % 10, m100 = n % 100; return n + ' ' + (m10 === 1 && m100 !== 11 ? 'работа' : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? 'работы' : 'работ'); };
  var price = function (it) { return typeof it.p === 'object' ? it.p[car] : it.p; };
  var money = function (v) { var r = Math.round(v * 10) / 10, i = Math.floor(r), d = Math.round((r - i) * 10); return String(i).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0') + (d ? ',' + d : ''); };
  var ICON_X = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  var ICON_PLUS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';

  function renderTabs() {
    var q = searchEl.value.trim();
    tabsEl.innerHTML = CATS.map(function (c) {
      var n = cart.filter(function (x) { return BY_ID[x.id].catId === c.id; }).length;
      var on = c.id === active && !q;
      return '<button class="tab" type="button" data-cat="' + c.id + '" aria-pressed="' + on + '">' + esc(c.name) +
        '<i' + (n ? ' class="is-picked"' : '') + '>' + (n || c.items.length) + '</i></button>';
    }).join('');
  }

  function stemsOf(q) {
    return q.toLowerCase().replace(/ё/g, 'е').split(/\s+/).filter(Boolean).map(function (w) { return w.length > 5 ? w.slice(0, w.length - 2) : w; });
  }

  function renderList() {
    var q = searchEl.value.trim(), list = [];
    if (q) {
      var st = stemsOf(q);
      Object.keys(BY_ID).forEach(function (id) {
        var n = (BY_ID[id].name + ' ' + BY_ID[id].cat).toLowerCase().replace(/ё/g, 'е');
        if (st.every(function (w) { return n.indexOf(w) > -1; })) list.push(BY_ID[id]);
      });
      foundEl.textContent = list.length ? 'Найдено: ' + list.length : 'Ничего не нашли';
    } else {
      foundEl.textContent = '';
      CATS.filter(function (c) { return c.id === active; })[0].items.forEach(function (i, k) { list.push(BY_ID[active + '-' + k]); });
    }
    if (!list.length) { listEl.innerHTML = '<p class="calc__none">Не нашли нужную работу? Позвоните — мастер подскажет: <a href="tel:+375293082020">+375 29 308-20-20</a></p>'; return; }
    // 4 ряда работ, остальные — под кнопкой «Ещё N услуг»
    var limit = ROWS * (narrow.matches ? 1 : 2), hiddenN = 0, more = '';
    var key = q ? '__search' : active;
    if (list.length > limit) {
      if (!expanded[key]) { hiddenN = list.length - limit; list = list.slice(0, limit); }
      more = '<button type="button" class="calc__more" data-more aria-expanded="' + !!expanded[key] + '">' +
        (hiddenN ? 'Ещё ' + hiddenN + ' ' + uslug(hiddenN) + (q ? ' по запросу' : ' в этой категории') : 'Свернуть') +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>';
    }
    listEl.innerHTML = list.map(function (it) {
      var on = inCart(it.id) > -1;
      return '<button type="button" class="item' + (on ? ' is-on' : '') + '" data-add="' + it.id + '" aria-pressed="' + on + '">' +
        '<span class="item__box" aria-hidden="true"></span>' +
        '<span class="item__nm">' + esc(it.name) + (q ? '<small>' + esc(it.cat) + '</small>' : '') + '</span>' +
        '<span class="item__pr"><small>от</small> ' + money(price(it)) + '</span></button>';
    }).join('') + more;
  }

  function gross() { return cart.reduce(function (s, x) { return s + price(BY_ID[x.id]); }, 0); }
  // Акция: −20% на каждый второй элемент кузова (скидку считаем с более дешёвых элементов)
  function paintDiscount() {
    var units = cart.filter(function (x) { return BY_ID[x.id].paint; }).map(function (x) { return price(BY_ID[x.id]); });
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
    if (reduce) { totalNum.textContent = money(to); return; }
    var step = function (t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / 500, 1);
      totalNum.textContent = money(Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step); else totalNum.textContent = money(to);
    };
    requestAnimationFrame(step);
  }

  function lineHTML(x) {
    var it = BY_ID[x.id];
    return '<li class="line" data-line="' + it.id + '"><span class="line__name">' + esc(it.name) + '</span>' +
      '<span class="line__pr">' + money(price(it)) + '</span>' +
      '<button class="del" type="button" data-del="' + it.id + '" aria-label="Удалить из расчёта: ' + esc(it.name) + '">' + ICON_X + '</button></li>';
  }

  function renderCart(opts) {
    opts = opts || {};
    if (!opts.keepLines) cartList.innerHTML = cart.map(lineHTML).join('');
    var has = cart.length > 0;
    emptyEl.hidden = has;
    clearBtn.hidden = !has;
    countEl.textContent = plural(cart.length);
    metaEl.textContent = 'ЗАПАД · ' + CAR_NAMES[car] + ' · работ: ' + cart.length;
    var disc = paintDiscount();
    discEl.hidden = !disc;
    discEl.querySelector('b').textContent = '−' + money(disc);
    var t = total();
    animateTotal(t);
    if (mbarSum) { mbarSum.hidden = !has; mbarSum.textContent = '· ' + money(t) + ' руб.'; }
    save();
  }

  function refresh() { renderTabs(); renderList(); }

  function add(id) {
    if (inCart(id) > -1) return;
    cart.push({ id: id });
    cartList.insertAdjacentHTML('beforeend', lineHTML(cart[cart.length - 1]));
    cartList.scrollTop = cartList.scrollHeight;
    renderCart({ keepLines: true });
    refresh();
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
    refresh();
    showToast(label || ('Удалено: ' + BY_ID[removed[0].item.id].name));
  }

  function showToast(text) {
    undoBtn.hidden = false;
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
    renderCart(); refresh();
  });

  segBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      car = b.dataset.car;
      segBtns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      renderCart(); renderList();
    });
  });
  segBtns.forEach(function (x) { x.setAttribute('aria-pressed', String(x.dataset.car === car)); });

  tabsEl.addEventListener('click', function (e) {
    var b = e.target.closest('[data-cat]'); if (!b) return;
    active = b.dataset.cat; searchEl.value = '';
    refresh();
    listEl.scrollTop = 0;
  });
  searchEl.addEventListener('input', function () { expanded.__search = false; refresh(); });
  if (narrow.addEventListener) narrow.addEventListener('change', renderList); else narrow.addListener(renderList);

  listEl.addEventListener('click', function (e) {
    if (e.target.closest('[data-more]')) {
      var key = searchEl.value.trim() ? '__search' : active;
      var wasOpen = !!expanded[key];
      expanded[key] = !wasOpen;
      var first = wasOpen ? null : listEl.querySelectorAll('.item').length;
      renderList();
      var m = listEl.querySelector('[data-more]');
      if (first !== null) { var nx = listEl.querySelectorAll('.item')[first]; if (nx) nx.focus(); }
      else { if (m) m.focus(); listEl.closest('.calc').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }
      return;
    }
    var b = e.target.closest('[data-add]'); if (!b) return;
    var id = b.dataset.add;
    if (inCart(id) > -1) removeIds([id]); else add(id);
    var again = listEl.querySelector('[data-add="' + id + '"]'); if (again) again.focus();
  });

  cartList.addEventListener('click', function (e) {
    var d = e.target.closest('[data-del]');
    if (d) removeIds([d.dataset.del]);
  });

  clearBtn.addEventListener('click', function () {
    var n = cart.length;
    removeIds(cart.map(function (x) { return x.id; }), 'Расчёт очищен (' + plural(n) + ')');
  });

  // ссылки «открыть направление» (data-open-cat) из других блоков
  document.querySelectorAll('[data-open-cat]').forEach(function (a) {
    a.addEventListener('click', function () { active = a.dataset.openCat; searchEl.value = ''; refresh(); });
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
    var lines = cart.map(function (x) { var it = BY_ID[x.id]; return '— ' + it.name + ': от ' + money(price(it)) + ' руб.'; });
    var disc = paintDiscount();
    var body = 'Телефон: ' + phone.value + '\nСТО: ' + form.station.value + '\nКогда: ' + slotText() + '\nАвто: ' + CAR_NAMES[car] +
      '\n\nПредварительный расчёт:\n' + (lines.join('\n') || '— (не выбрано)') +
      (disc ? '\nСкидка −20% на каждый второй элемент: −' + money(disc) + ' руб.' : '') + '\n\nИтого от ' + money(total()) + ' руб.';
    // TODO: подключить отправку на сервер / CRM / Telegram-бота. Пока — письмо администратору.
    window.location.href = 'mailto:mavra41@bk.ru?subject=' + encodeURIComponent('Запись с сайта — онлайн-расчёт') + '&body=' + encodeURIComponent(body);
    okEl.hidden = false;
  });

  /* ---------- «Где беспокоит?» ---------- */
  // x/y — положение точки на фото (%), svc — короткий список работ из прайса
  var ZONES = [
    { id: 'lights', x: 82.6, y: 55.2, name: 'Фары', svc: ['Полировка фары', 'Восстановление пластика передней фары', 'Покраска передних фар защитным лаком'] },
    { id: 'body', x: 62, y: 47, name: 'Кузов и покраска', svc: ['Покраска двери', 'Покраска крыла', 'Покраска бампера', 'Полировка кузова стандарт'] },
    { id: 'brakes', x: 35.5, y: 65, name: 'Тормоза и колёса', svc: ['Замена передних тормозных колодок', 'Замена задних тормозных колодок (диск)', 'Прокачка тормозов механическая', 'Шиномонтаж 4 колёс R14–R16'] },
    { id: 'suspension', x: 16.5, y: 63, name: 'Подвеска', svc: ['Диагностика подвески', 'Замена стоек стабилизатора', 'Замена амортизатора', 'Развал-схождение, 2 оси'] },
    { id: 'engine', x: 22.5, y: 52, name: 'Двигатель', svc: ['Компьютерная диагностика всех блоков', 'Замена масла ДВС и масляного фильтра', 'Замена ремня ГРМ'] },
    { id: 'climate', x: 68, y: 62, name: 'Кондиционер', svc: ['Проверка на герметичность', 'Заправка с вакуумированием', 'Дезинфекция системы', 'Замена салонного фильтра'] },
    { id: 'cabin', x: 55, y: 37, name: 'Салон', svc: ['Перетяжка руля экокожей', 'Перетяжка сиденья', 'Перетяжка потолка (седан, без люка)', 'Химчистка салона'] }
  ];
  ZONES.forEach(function (z) { z.svc = z.svc.map(function (n) { return NAME_ID[n]; }).filter(Boolean); });
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
        '<p class="doc__hint">Нажмите на оранжевую точку или на название ниже — покажем основные работы. Отмеченные попадут в ваш расчёт.</p>' + tabs;
      return;
    }
    var n = zone.svc.filter(function (id) { return inCart(id) > -1; }).length;
    panel.innerHTML = '<p class="doc__zone">' + esc(zone.name) + '</p><h3>Что нужно сделать?</h3>' +
      '<ul class="doc__list">' + zone.svc.map(function (id) {
        var it = BY_ID[id], on = inCart(id) > -1;
        return '<li class="svc"><span class="svc__name">' + esc(it.name) + '</span>' +
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

  refresh(); renderCart();
})();
