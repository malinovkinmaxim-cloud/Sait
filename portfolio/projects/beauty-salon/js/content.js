/* ==========================================================================
   A&Ю — content.
   Russian copy lives in index.html; English copy and all data are here.

   Price row: [ru, en, minutes, price]
     minutes — number, [from, to] or null (not specified)
     price   — number, [from, to] or length variants [[lengthKey, price, minutes?], …]
   ========================================================================== */

(function () {
  var S = 'S', M = 'M', L = 'L', XL = 'XL';

  window.AYU = {
    hours: { open: 10 * 60, close: 22 * 60, lastStart: 21 * 60 }, // daily, Moscow time
    lengths: {
      S: { ru: 'Короткие', en: 'Short' },
      M: { ru: 'Средние', en: 'Medium' },
      L: { ru: 'Длинные', en: 'Long' },
      XL: { ru: 'Очень длинные', en: 'Extra long' }
    },

    services: [
      {
        id: 'hair', icon: 'scissors',
        name: { ru: 'Стрижки и укладки', en: 'Haircuts & styling' },
        desc: { ru: 'Женские, мужские и детские стрижки, укладки на каждый день и на праздник.', en: 'Women’s, men’s and kids’ haircuts; everyday and occasion styling.' },
        groups: [
          { title: { ru: 'Стрижки', en: 'Haircuts' }, items: [
            ['Женская стрижка', 'Women’s haircut', 60, [[S, 2400], [M, 2700], [L, 3200]]],
            ['Мужская стрижка', 'Men’s haircut', 60, 1900],
            ['Детская стрижка (до 9 лет)', 'Kids’ haircut (under 9)', 60, 1500],
            ['Стрижка одним срезом (на чистые волосы)', 'One-length cut (on clean hair)', 45, 1500],
            ['Первичная стрижка чёлки', 'First fringe cut', 30, 1000],
            ['Коррекция чёлки', 'Fringe trim', 30, 600]
          ] },
          { title: { ru: 'Укладки', en: 'Styling' }, items: [
            ['Укладка феном', 'Blow-dry styling', null, [[S, 1900, 30], [M, 2300, 60], [L, 2600, 60]]],
            ['Лёгкая укладка (сушка феном)', 'Light styling (blow-dry)', 60, [[S, 1900], [L, 2600]]],
            ['Укладка: плойка, утюжок, гофре, локоны, кудри', 'Styling: curling iron, straightener, crimping, waves, curls', null, [[S, 2000, 60], [M, 2800, 90], [L, 3200, 120]]],
            ['Коктейльная укладка', 'Cocktail styling', 120, 7000],
            ['Укладка «Афрокудри»', 'Afro curls styling', 270, 7000],
            ['Мытьё головы и сушка феном', 'Wash & blow-dry', 45, 1500]
          ] }
        ]
      },
      {
        id: 'colour', icon: 'drop',
        name: { ru: 'Окрашивание', en: 'Colouring' },
        desc: { ru: 'Корни и окрашивание в один тон, блонд, шатуш, омбре, AirTouch и выход из тёмного.', en: 'Roots and single-tone colour, blonde, shatush, ombré, AirTouch and colour correction from dark.' },
        groups: [
          { title: { ru: 'Окрашивание', en: 'Colouring' }, items: [
            ['Окрашивание корней', 'Root colour', null, [[S, 4100, 105], [M, 5200, 120], [L, 6500, 135]]],
            ['Окрашивание в один тон или тонирование', 'Single-tone colour or toning', null, [[S, 4500, 105], [M, 5800, 120], [L, 8400, 135]]],
            ['Контурное окрашивание', 'Contour colouring', null, [[S, 6700, 120], [M, 8700, 150], [L, 10700, 180]]]
          ] },
          { title: { ru: 'Блонд и сложные техники', en: 'Blonde & complex techniques' }, items: [
            ['Тотальное обесцвечивание + тонирование', 'Full bleach + toning', null, [[S, 8900, 180], [M, 12900, 180], [L, 16900, 300]]],
            ['Шатуш, омбре, AirTouch (техника + тонирование)', 'Shatush, ombré, AirTouch (technique + toning)', null, [[M, 17800, 240], [L, 20800, 360]]],
            ['Выход из чёрного или тёмного (всё включено)', 'Correction from black or dark (all-inclusive)', 480, 35200],
            ['Хелатное мытьё и кислотная смывка', 'Chelating wash & acid colour remover', 90, 7200]
          ] },
          { title: { ru: 'Окрашивание + уход', en: 'Colour + care' }, items: [
            ['Окрашивание + ампульный уход', 'Colour + ampoule treatment', [135, 165], [6200, 11200]],
            ['Окрашивание + аминокислотный уход', 'Colour + amino acid treatment', [195, 225], [8100, 10100]]
          ] }
        ]
      },
      {
        id: 'care', icon: 'leaf',
        name: { ru: 'Уход и восстановление', en: 'Hair care & repair' },
        desc: { ru: 'Ампульный и аминокислотный уход, холодное восстановление, ботокс, кератин и нанопластика.', en: 'Ampoule and amino acid treatments, cold repair, hair botox, keratin and nanoplasty.' },
        groups: [
          { title: { ru: 'Уход', en: 'Care' }, items: [
            ['Уход для волос', 'Hair treatment', null, [[M, 3400, 75], [L, 3700, 90], [XL, 3900, 105]]],
            ['Аминокислотный уход', 'Amino acid treatment', 120, 6100],
            ['Пилинг кожи головы', 'Scalp peel', 60, 2500]
          ] },
          { title: { ru: 'Восстановление и выпрямление', en: 'Repair & straightening' }, items: [
            ['Холодное восстановление', 'Cold repair treatment', null, [[M, 4900, 120], [L, 6900, 150], [XL, 8900, 165]]],
            ['Холодный ботокс', 'Cold hair botox', null, [[M, 3400, 120], [L, 4400, 135], [XL, 5400, 150]]],
            ['Кератин, ботокс или нанопластика', 'Keratin, hair botox or nanoplasty', null, [[M, 8900, 240], [L, 12900, 285], [XL, 17400, 315]]]
          ] },
          { title: { ru: 'Уход + стрижка', en: 'Care + haircut' }, items: [
            ['Аминокислотный уход + стрижка', 'Amino acid treatment + haircut', null, [[M, 5700, 180], [L, 6100, 180], [XL, 6400, 240]]],
            ['Ампульный уход + стрижка', 'Ampoule treatment + haircut', null, [[M, 5700, 75], [L, 5600, 90], [XL, 6000, 105]]]
          ] }
        ]
      },
      {
        id: 'perm', icon: 'wave',
        name: { ru: 'Завивка и объём', en: 'Perms & volume' },
        desc: { ru: 'Биозавивка и спиральная завивка, прикорневой объём и антизавивка.', en: 'Bio and spiral perms, root volume and perm relaxing.' },
        items: [
          ['Биозавивка', 'Bio perm', 360, 20500],
          ['Спиральная завивка', 'Spiral perm', 480, 25500],
          ['Коррекция химической завивки', 'Perm correction', 360, 20500],
          ['Антизавивка', 'Perm relaxing', 180, 7500],
          ['Прикорневой объём', 'Root volume', 180, 6500],
          ['Снятие прикорневого объёма (Boost Up)', 'Root volume removal (Boost Up)', 180, 4000]
        ]
      },
      {
        id: 'manicure', icon: 'hand',
        name: { ru: 'Маникюр', en: 'Manicure' },
        desc: { ru: 'Гигиенический, европейский и японский маникюр, мужской и детский, покрытие и укрепление.', en: 'Hygienic, European and Japanese manicure, men’s and kids’, polish and strengthening.' },
        groups: [
          { title: { ru: 'Маникюр', en: 'Manicure' }, items: [
            ['Гигиенический маникюр', 'Hygienic manicure', 60, 1900],
            ['Европейский маникюр (кутикула удаляется ремувером)', 'European manicure (cuticle remover)', 60, 1500],
            ['Японский маникюр без обработки кутикулы', 'Japanese manicure without cuticle work', 60, 2200],
            ['Японский маникюр с обработкой кутикулы', 'Japanese manicure with cuticle work', 90, 2700],
            ['Экспресс-маникюр: форма и обработка', 'Express manicure: shape & tidy', 60, 1100],
            ['Мужской маникюр', 'Men’s manicure', 60, 2000],
            ['Детский маникюр (до 10 лет)', 'Kids’ manicure (under 10)', 60, 900]
          ] },
          { title: { ru: 'Маникюр с покрытием', en: 'Manicure with polish' }, items: [
            ['Гигиенический маникюр + лак', 'Hygienic manicure + polish', 120, 2900],
            ['Гигиенический маникюр + гель-лак', 'Hygienic manicure + gel polish', 120, 3900],
            ['Гигиенический маникюр + дип-система', 'Hygienic manicure + dip powder', null, 3500],
            ['Снятие + гигиенический маникюр', 'Removal + hygienic manicure', 90, 2400],
            ['Снятие + маникюр + база и топ', 'Removal + manicure + base & top coat', 150, 3000],
            ['Снятие + маникюр + лак', 'Removal + manicure + polish', 120, 3100],
            ['Комплекс MINI: снятие, маникюр, гель-лак', 'MINI set: removal, manicure, gel polish', 120, 3600],
            ['Комплекс MAX: снятие гель-лака, маникюр, покрытие', 'MAX set: gel removal, manicure, coating', 120, 4300],
            ['Снятие + маникюр + гель-лак и френч', 'Removal + manicure + gel polish & French', null, 4900],
            ['Снятие дип-системы + маникюр + дип-система', 'Dip removal + manicure + dip powder', 120, 3800]
          ] },
          { title: { ru: 'Покрытие и укрепление', en: 'Coating & strengthening' }, items: [
            ['Покрытие гель-лаком (руки или ноги)', 'Gel polish (hands or feet)', 60, 1600],
            ['Покрытие лаком (руки или ноги)', 'Regular polish (hands or feet)', 60, 1000],
            ['Покрытие база + топ', 'Base + top coat', null, 750],
            ['Прозрачный или лечебный лак', 'Clear or treatment polish', 30, 700],
            ['Детское покрытие лаком (до 10 лет)', 'Kids’ polish (under 10)', 60, 600],
            ['Гель-лак, 1 палец', 'Gel polish, 1 nail', 15, 150],
            ['Укрепление ногтей гелем', 'Gel strengthening', 30, 700],
            ['Архитектура и укрепление гелем', 'Nail architecture & gel strengthening', 30, 900],
            ['Акриловая пудра: кончики', 'Acrylic powder: tips', 10, 375],
            ['Акриловая пудра: все пальцы', 'Acrylic powder: all nails', 10, 650],
            ['Придание формы ногтям', 'Nail shaping', 30, 300],
            ['Полировка пилкой', 'Buffing', 15, 400]
          ] },
          { title: { ru: 'Снятие', en: 'Removal' }, items: [
            ['Снятие гель-лака', 'Gel polish removal', 30, 500],
            ['Снятие лака', 'Polish removal', 15, 500],
            ['Снятие гель-лака, 1 палец', 'Gel polish removal, 1 nail', 10, 150],
            ['Снятие нарощенных ногтей', 'Nail extension removal', 30, 800],
            ['Снятие акрила, все пальцы', 'Acrylic removal, all nails', 30, 1000]
          ] }
        ]
      },
      {
        id: 'pedicure', icon: 'foot',
        name: { ru: 'Педикюр', en: 'Pedicure' },
        desc: { ru: 'Гигиенический и смарт-педикюр, обработка стоп и пальчиков, сложная стопа, покрытие.', en: 'Hygienic and smart-disc pedicure, feet and toes, problem feet, polish.' },
        groups: [
          { title: { ru: 'Педикюр', en: 'Pedicure' }, items: [
            ['Педикюр', 'Pedicure', null, 3200],
            ['Педикюр: только пальчики', 'Pedicure: toes only', 60, 2100],
            ['Педикюр: только стопы', 'Pedicure: feet only', 60, 1700],
            ['Мужской педикюр', 'Men’s pedicure', 60, 3800],
            ['Сложная стопа: трещины, мозоли, натоптыши', 'Problem feet: cracks, corns, calluses', 60, 3600],
            ['Сложная стопа, мужской педикюр', 'Problem feet, men’s pedicure', 60, 4200],
            ['Детский педикюр, пальчики (до 10 лет)', 'Kids’ pedicure, toes (under 10)', 60, 1000]
          ] },
          { title: { ru: 'Снятие и педикюр', en: 'Removal & pedicure' }, items: [
            ['Снятие + педикюр с обработкой пальчиков', 'Removal + pedicure (toes)', 120, 2600],
            ['Снятие + педикюр смарт-дисками', 'Removal + smart-disc pedicure', null, 3700],
            ['Снятие + педикюр «Смарт-ревитализация»', 'Removal + “Smart revitalisation” pedicure', null, 4500],
            ['Снятие лака', 'Polish removal', 15, 500],
            ['Снятие гель-лака', 'Gel polish removal', 15, 500]
          ] },
          { title: { ru: 'Педикюр с покрытием', en: 'Pedicure with polish' }, items: [
            ['Педикюр с обработкой пальчиков + гель-лак', 'Pedicure (toes) + gel polish', null, 3500],
            ['Снятие + педикюр с обработкой пальчиков + гель-лак', 'Removal + pedicure (toes) + gel polish', 120, 3700],
            ['Педикюр смарт-дисками + лак', 'Smart-disc pedicure + polish', null, 4100],
            ['Педикюр смарт-дисками + гель-лак', 'Smart-disc pedicure + gel polish', 120, 4700],
            ['Снятие + педикюр + лак', 'Removal + pedicure + polish', 90, 4400],
            ['Снятие + педикюр + гель-лак', 'Removal + pedicure + gel polish', null, 4900],
            ['«Смарт-ревитализация»: снятие, педикюр, лак', '“Smart revitalisation”: removal, pedicure, polish', null, 5000],
            ['«Смарт-ревитализация»: снятие, педикюр, гель-лак', '“Smart revitalisation”: removal, pedicure, gel polish', null, 5500]
          ] }
        ]
      },
      {
        id: 'nails', icon: 'sparkle',
        name: { ru: 'Наращивание и дизайн', en: 'Extensions & nail art' },
        desc: { ru: 'Наращивание и коррекция, ремонт ногтей, френч, дизайн и роспись.', en: 'Extensions and infills, nail repair, French, nail art and hand painting.' },
        groups: [
          { title: { ru: 'Наращивание', en: 'Extensions' }, items: [
            ['Наращивание ногтей, длина 1–2', 'Nail extensions, length 1–2', 180, 6500],
            ['Наращивание ногтей, длина 2–4', 'Nail extensions, length 2–4', 180, 7500],
            ['Экстремальная длина (свободный край от 2,5 см)', 'Extreme length (free edge from 2.5 cm)', 240, 5800],
            ['Коррекция наращивания', 'Extension infill', 180, 7500],
            ['Коррекция нарощенного ногтя, 1 шт.', 'Single extension repair', 15, 500]
          ] },
          { title: { ru: 'Ремонт', en: 'Repair' }, items: [
            ['Ремонт натурального ногтя', 'Natural nail repair', 30, 300],
            ['Ремонт искусственного ногтя', 'Artificial nail repair', 30, 500],
            ['Ремонт работы другого мастера', 'Fixing another artist’s work', 30, 700]
          ] },
          { title: { ru: 'Дизайн', en: 'Nail art' }, items: [
            ['Френч гель-лаком, все пальцы (руки или ноги)', 'Gel French, all nails (hands or feet)', 30, 1000],
            ['Лёгкий дизайн, все пальцы', 'Light design, all nails', 30, 1000],
            ['Простой дизайн, все пальцы', 'Simple design, all nails', 30, 1000],
            ['Кошачий глаз', 'Cat-eye', 15, 500],
            ['Дизайн I сложности, 1 палец', 'Level I design, 1 nail', 30, 150],
            ['Дизайн II сложности: два дизайна на одном ногте', 'Level II design: two designs on one nail', 30, 250],
            ['Дизайн III сложности: инкрустация всего ногтя', 'Level III design: full-nail inlay', 30, 650],
            ['Роспись акварелью, простая', 'Watercolour painting, simple', 30, 300],
            ['Роспись акварелью, сложная', 'Watercolour painting, complex', 30, 500]
          ] }
        ]
      },
      {
        id: 'spa', icon: 'lotus',
        name: { ru: 'SPA-уход', en: 'SPA care' },
        desc: { ru: 'SPA для рук и ног, парафин, маски и пилинги.', en: 'SPA for hands and feet, paraffin, masks and peels.' },
        items: [
          ['SPA на час: руки', 'One-hour SPA: hands', 60, 1300],
          ['SPA на час: ноги', 'One-hour SPA: feet', 60, 1500],
          ['SPA на час: руки и ноги', 'One-hour SPA: hands & feet', 60, 2500],
          ['SPA-уход с парафином', 'Paraffin SPA treatment', 15, 650],
          ['Маска для рук', 'Hand mask', 15, 400],
          ['Маска для ног', 'Foot mask', 15, 500],
          ['Пилинг рук', 'Hand peel', 15, 350],
          ['Пилинг ног', 'Foot peel', 15, 350]
        ]
      },
      {
        id: 'podology', icon: 'cross',
        name: { ru: 'Подология', en: 'Podology' },
        desc: { ru: 'Помощь при сложной стопе: вросший ноготь, мозоли и натоптыши, онихолизис, микоз.', en: 'Care for problem feet: ingrown nails, corns and calluses, onycholysis, fungal nails.' },
        items: [
          ['Педикюр при микозе (первичный приём)', 'Pedicure for fungal nails (first visit)', 120, 4600],
          ['Коррекционная система: титановая нить или Light System', 'Correction brace: titanium wire or Light System', 60, 2600],
          ['Снятие коррекционной системы', 'Brace removal', 60, 600],
          ['Обработка мозоли, трещины, натоптыша или вросшего ногтя', 'Treatment of a corn, crack, callus or ingrown nail', 15, 500],
          ['Разгрузка мозолей и натоптышей', 'Offloading corns and calluses', 60, 600],
          ['Обработка мозоли + разгрузка', 'Corn treatment + offloading', 60, 1100],
          ['Частичный педикюр: обработка трещин', 'Partial pedicure: crack treatment', 60, 1100],
          ['Частичный педикюр: обработка ногтевых пластин', 'Partial pedicure: nail plate treatment', 60, 1600],
          ['Ногтевая пластина с ониходистрофией, 1 ноготь', 'Onychodystrophy, 1 nail', null, 400],
          ['Зачистка онихолизиса (1–2 зоны)', 'Onycholysis clean-up (1–2 areas)', 60, 1100],
          ['Протезирование ногтя, 1 шт.', 'Nail prosthesis, 1 nail', 60, 800],
          ['Тейпирование, 1 зона', 'Taping, 1 area', 60, 400],
          ['Окклюзионная повязка', 'Occlusive dressing', 60, 600],
          ['Установка тампонады', 'Nail tamponade', 60, 300],
          ['Забор материала', 'Sample collection', 60, 500]
        ]
      },
      {
        id: 'brows', icon: 'brow',
        name: { ru: 'Брови', en: 'Brows' },
        desc: { ru: 'Коррекция и архитектура, окрашивание и осветление, долговременная укладка.', en: 'Shaping and architecture, tinting and lightening, brow lamination.' },
        items: [
          ['Коррекция бровей', 'Brow shaping', 30, 1400],
          ['Прореживание бровей', 'Brow thinning', 30, 800],
          ['Окрашивание бровей', 'Brow tint', 30, 1500],
          ['Осветление бровей', 'Brow lightening', 30, 1500],
          ['Архитектура бровей: коррекция + окрашивание', 'Brow architecture: shaping + tint', 60, 2700],
          ['Архитектура бровей: расширенный комплекс', 'Brow architecture: extended set', 60, 3300],
          ['Осветление + архитектура бровей', 'Lightening + brow architecture', 90, 3400],
          ['«Счастье для бровей» — восстанавливающая процедура', '“Brow Happiness” repair treatment', 30, 1100],
          ['«Счастье для бровей» + архитектура', '“Brow Happiness” + architecture', 60, 3300],
          ['Долговременная укладка без окрашивания', 'Brow lamination without tint', 60, 3200],
          ['Долговременная укладка с коррекцией и окрашиванием', 'Brow lamination with shaping & tint', 60, 3500],
          ['Уход для бровей и ресниц', 'Brow & lash care', 15, 500]
        ]
      },
      {
        id: 'lashes', icon: 'eye',
        name: { ru: 'Ресницы', en: 'Lashes' },
        desc: { ru: 'Ламинирование с окрашиванием и без, окрашивание и снятие нарощенных ресниц.', en: 'Lash lift with or without tint, lash tint and extension removal.' },
        items: [
          ['Ламинирование ресниц без окрашивания', 'Lash lift without tint', 90, 3000],
          ['Ламинирование ресниц с окрашиванием', 'Lash lift with tint', 90, 3300],
          ['Коррекция ламинирования ресниц', 'Lash lift correction', 90, 3700],
          ['Окрашивание ресниц', 'Lash tint', 30, 800],
          ['Снятие нарощенных ресниц', 'Lash extension removal', 45, 600]
        ]
      },
      {
        id: 'pmu', icon: 'pen',
        name: { ru: 'Перманентный макияж', en: 'Permanent make-up' },
        desc: { ru: 'Брови, в том числе в волосковой технике, губы и межресничка — и коррекция.', en: 'Brows, including hair-stroke technique, lips and lash line — plus touch-ups.' },
        groups: [
          { title: { ru: 'Перманентный макияж', en: 'Permanent make-up' }, items: [
            ['Брови', 'Brows', 150, 8000],
            ['Брови в волосковой технике', 'Brows, hair-stroke technique', 180, 8500],
            ['Губы', 'Lips', 180, 9500],
            ['Межресничка', 'Lash line', 120, 7500]
          ] },
          { title: { ru: 'Коррекция', en: 'Touch-up' }, items: [
            ['Коррекция бровей', 'Brow touch-up', 180, 5000],
            ['Коррекция губ', 'Lip touch-up', 180, 6000],
            ['Коррекция межреснички', 'Lash line touch-up', 180, 4500]
          ] }
        ]
      }
    ],

    // Masters and their Yandex Maps rating. services — direction ids from services.
    team: [
      { name: { ru: 'Анна Колесникова', en: 'Anna Kolesnikova' }, level: { ru: 'Ведущий мастер', en: 'Senior artist' }, role: { ru: 'маникюр, педикюр, подология', en: 'manicure, pedicure, podology' }, services: ['manicure', 'pedicure', 'podology'], rating: 5, votes: 162, photo: 'images/team-kolesnikova.webp' },
      { name: { ru: 'Олеся Стрелецкая', en: 'Olesya Streletskaya' }, level: { ru: 'Ведущий мастер', en: 'Senior artist' }, role: { ru: 'маникюр, педикюр', en: 'manicure, pedicure' }, services: ['manicure', 'pedicure'], rating: 5, votes: 135, photo: 'images/team-streletskaya.webp' },
      { name: { ru: 'Татьяна Котова', en: 'Tatyana Kotova' }, level: { ru: 'Топ-мастер', en: 'Top stylist' }, role: { ru: 'парикмахер-универсал, стилист', en: 'all-round hairdresser, stylist' }, services: ['hair', 'colour', 'care', 'perm'], rating: 5, votes: 82, photo: 'images/team-kotova.webp' },
      { name: { ru: 'Ирина Усенко', en: 'Irina Usenko' }, level: { ru: 'Ведущий мастер', en: 'Senior artist' }, role: { ru: 'маникюр, педикюр, перманентный макияж', en: 'manicure, pedicure, permanent make-up' }, services: ['manicure', 'pedicure', 'pmu'], rating: 5, votes: 44, photo: 'images/team-usenko.webp' },
      { name: { ru: 'Саида Мустафина', en: 'Saida Mustafina' }, level: { ru: 'Ведущий мастер', en: 'Senior artist' }, role: { ru: 'маникюр, педикюр', en: 'manicure, pedicure' }, services: ['manicure', 'pedicure'], rating: 5, votes: 28, photo: 'images/team-mustafina.webp' }
    ],

    ui: {
      all: { ru: 'Все', en: 'All' },
      min: { ru: 'мин', en: 'min' },
      hour: { ru: 'ч', en: 'h' },
      from: { ru: 'от', en: 'from' },
      services: { ru: ['услуга', 'услуги', 'услуг'], en: ['service', 'services', 'services'] },
      nothing: { ru: 'Ничего не нашлось. Попробуйте другое слово или позвоните нам — подскажем.', en: 'Nothing found. Try another word or give us a call — we’ll help.' },
      book: { ru: 'Записаться', en: 'Book' },
      votes: { ru: ['оценка', 'оценки', 'оценок'], en: ['rating', 'ratings', 'ratings'] },
      anyMaster: { ru: 'Любой мастер', en: 'Any artist' },
      chooseService: { ru: 'Выберите услугу', en: 'Choose a service' },
      chooseTime: { ru: 'Выберите время', en: 'Choose a time' },
      noTimes: { ru: 'На сегодня свободного времени нет', en: 'No free times left today' },
      open: { ru: 'сейчас открыто', en: 'open now' },
      closed: { ru: 'сейчас закрыто', en: 'closed now' },
      errRequired: { ru: 'Заполните поле', en: 'Please fill in this field' },
      errName: { ru: 'Минимум 2 буквы', en: 'At least 2 letters' },
      errPhone: { ru: 'Введите номер полностью', en: 'Enter the full number' },
      errService: { ru: 'Выберите услугу', en: 'Choose a service' },
      errDate: { ru: 'Выберите дату не раньше сегодняшней', en: 'Pick today or a later date' },
      errTime: { ru: 'Выберите время', en: 'Choose a time' },
      sending: { ru: 'Отправляем…', en: 'Sending…' },
      done: {
        ru: '{name}, мы получили заявку: {service}, {date} в {time}{master}. Администратор перезвонит, чтобы подтвердить время.',
        en: '{name}, we’ve got your request: {service}, {date} at {time}{master}. Our front desk will call you to confirm.'
      },
      withMaster: { ru: ', мастер — {m}', en: ', with {m}' }
    }
  };
})();

window.I18N = {
  en: {
    'meta.title': 'A&Ю — beauty studio on Ryazansky Prospekt, Moscow',
    'meta.description': 'A&Ю beauty studio: haircuts and colouring, hair care, manicure, pedicure, podology, brows, lashes and permanent make-up. Daily 10:00–22:00. 2/1 bldg 5 Ryazansky Prospekt.',
    'a11y.skip': 'Skip to content',
    'a11y.home': 'A&Ю — home',
    'a11y.nav': 'Main navigation',
    'a11y.menu': 'Open menu',
    'a11y.mnav': 'Mobile navigation',
    'logo.sub': 'beauty studio',

    'nav.studio': 'Studio',
    'nav.prices': 'Services & prices',
    'nav.team': 'Artists',
    'nav.booking': 'Booking',
    'nav.contacts': 'Contacts',
    'drawer.info': '2/1 bldg 5 Ryazansky Prospekt · daily 10:00–22:00',
    'cta.book': 'Book now',
    'cta.bookOnline': 'Book online',
    'cta.prices': 'See prices',

    'hero.eyebrow': 'Beauty studio · Ryazansky Prospekt',
    'hero.t1': 'Beauty,',
    'hero.t2': 'all gathered',
    'hero.t3': 'in one place',
    'hero.lead': 'Haircuts and colouring, manicure and pedicure, podology, brows, lashes and permanent make-up. Combine several treatments in one visit — even with two artists at once.',
    'hero.rating': '530 ratings on Yandex Maps',
    'hero.daily': 'Daily',
    'hero.chip': 'Four hands — two treatments at the same time',
    'img.studio': 'The bright A&Ю studio: marble floor, artists’ stations and green plants',
    'img.manicure': 'A manicure artist’s station',
    'img.wide': 'Panorama of the studio: stations by the windows, greenery and marble',
    'img.entrance': 'The entrance to the A&Ю beauty studio with its sign on the facade',
    'dir.label': 'Directions',

    'studio.eyebrow': 'About the studio',
    'studio.title': 'One studio — <em>everything for&nbsp;you</em>',
    'studio.lead': 'A&Ю is a bright studio on Ryazansky Prospekt. Hair stylists, nail technicians, brow, lash and permanent make-up artists work under one roof — so looking after yourself doesn’t turn into a marathon across the city.',
    'why.1': 'All in one place',
    'why.1t': 'Hair, nails, brows, lashes and permanent make-up — in one studio.',
    'why.2': 'Four hands',
    'why.2t': 'Two treatments at once — say, manicure and pedicure. You save time.',
    'why.3': 'Every day',
    'why.3t': 'Open daily from 10:00 to 22:00 — easy before or after work.',
    'why.4': '5.0 on the map',
    'why.4t': '530 ratings and 355 reviews on Yandex Maps.',

    'prices.eyebrow': 'Services & prices',
    'prices.title': 'The full price list — <em>no small print</em>',
    'prices.note': '153 services across 12 directions. Haircut, colour and care prices depend on hair length.',
    'prices.searchLabel': 'Search services',
    'prices.searchP': 'Find a service, e.g. “pedicure” or “keratin”',

    'team.eyebrow': 'Artists',
    'team.title': 'People clients <em>trust</em>',
    'team.note': 'Every artist is rated 5.0 in client reviews on Yandex Maps.',

    'book.eyebrow': 'Online booking',
    'book.title': 'Choose a time <em>for yourself</em>',
    'book.text': 'Leave a request — the front desk will get in touch, confirm the time and suggest which treatments can be combined.',
    'form.direction': 'Direction',
    'form.service': 'Service',
    'form.master': 'Artist',
    'form.date': 'Date',
    'form.time': 'Time',
    'form.name': 'Name',
    'form.nameP': 'Your name',
    'form.phone': 'Phone',
    'form.total': 'Price',
    'form.submit': 'Send request',
    'form.note': 'Concept website: the request is not sent to the studio. To book for real, call +7 (929) 542-24-34.',
    'form.doneTitle': 'Thank you, request received!',
    'form.again': 'New request',

    'con.eyebrow': 'Contacts',
    'con.title': 'How to <em>find us</em>',
    'con.address': 'Address',
    'con.addressV': '2/1 bldg 5 Ryazansky Prospekt, Moscow<br>Nizhegorodskaya metro',
    'con.hours': 'Opening hours',
    'con.hoursV': 'Daily, 10:00–22:00',
    'con.phone': 'Phone',
    'con.amenities': 'Amenities',
    'am.card': 'Card payment',
    'am.parking': 'Parking',
    'am.gift': 'Gift cards',
    'con.call': 'Call',
    'con.route': 'Directions',

    'footer.tag': 'Beauty studio on Ryazansky Prospekt. Open daily 10:00–22:00.',
    'footer.disclaimer': 'Concept website made for a portfolio. This is not the studio’s official site; information and photos come from public sources.',
    'footer.credit': 'Design & development —'
  }
};
