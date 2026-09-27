/* ==========================================================================
   MANUL — content.
   Russian copy lives in index.html; this file holds the English copy and the
   menu data (both languages). Prices in rubles; null = seasonal, ask a waiter.
   ========================================================================== */

window.MANUL = {
  phone: '+7 (499) 283-75-84',
  // Mon–Fri 14:00–24:00, Sat–Sun 12:00–24:00 (Moscow time). 0 = Sunday.
  hours: { 0: [12, 24], 1: [14, 24], 2: [14, 24], 3: [14, 24], 4: [14, 24], 5: [14, 24], 6: [12, 24] },
  lastSeating: 23,

  signature: [
    {
      name: { ru: 'Строганина из нельмы', en: 'Nelma stroganina' },
      region: { ru: 'Енисей', en: 'Yenisei' },
      text: { ru: 'Тончайшая стружка мороженой северной рыбы с солью и перцем — классика Крайнего Севера.', en: 'Paper-thin shavings of frozen northern fish with salt and pepper — a Far North classic.' }
    },
    {
      name: { ru: 'Согажа', en: 'Sogazha' },
      region: { ru: 'Тыва', en: 'Tuva' },
      text: { ru: 'Баранья печень в кружевном жире, приготовленная на углях.', en: 'Lamb liver wrapped in lace fat and cooked over embers.' }
    },
    {
      name: { ru: 'Хуужууры', en: 'Khuushuur' },
      region: { ru: 'Тыва', en: 'Tuva' },
      text: { ru: 'Тувинские жареные пирожки с сочной мясной начинкой.', en: 'Crisp Tuvan fried pies with a juicy meat filling.' }
    },
    {
      name: { ru: 'Уха по рецепту староверов', en: 'Old Believers’ ukha' },
      region: { ru: 'Тайга', en: 'Taiga' },
      text: { ru: 'Прозрачная рыбная уха — так её варят в таёжных скитах.', en: 'A clear fish soup, cooked the way it is in remote taiga settlements.' }
    },
    {
      name: { ru: 'Копчёная нельма с кедровой кашей', en: 'Smoked nelma with cedar-nut porridge' },
      region: { ru: 'Енисей', en: 'Yenisei' },
      text: { ru: 'С соусом из черемши — дикого лесного чеснока.', en: 'With a sauce of ramsons — wild forest garlic.' }
    },
    {
      name: { ru: 'Филе-миньон из хакасской говядины', en: 'Khakassian beef filet mignon' },
      region: { ru: 'Хакасия', en: 'Khakassia' },
      text: { ru: 'Нежная вырезка из говядины с пастбищ Хакасии.', en: 'Tender tenderloin from the pastures of Khakassia.' }
    }
  ],

  menu: [
    {
      id: 'stroganina',
      title: { ru: 'Строганина', en: 'Stroganina' },
      intro: { ru: 'Мороженая рыба и дичь, нарезанная тончайшей стружкой.', en: 'Frozen fish and game, shaved paper-thin.' },
      items: [
        { name: { ru: 'Строганина из нельмы', en: 'Nelma stroganina' }, price: 1750 },
        { name: { ru: 'Строганина из осетрины', en: 'Sturgeon stroganina' }, note: { ru: '50 г', en: '50 g' }, price: 1800 },
        { name: { ru: 'Строганина из чавычи', en: 'Chinook salmon stroganina' }, note: { ru: '50 г', en: '50 g' }, price: 1200 },
        { name: { ru: 'Строганина из муксуна', en: 'Muksun stroganina' }, note: { ru: '50 г', en: '50 g' }, price: 1200 },
        { name: { ru: 'Строганина из лося', en: 'Elk stroganina' }, note: { ru: '50 г', en: '50 g' }, price: 1000 }
      ]
    },
    {
      id: 'kitchen',
      title: { ru: 'Кухня Сибири', en: 'Siberian kitchen' },
      intro: { ru: 'Горячие блюда и закуски по рецептам из экспедиций.', en: 'Hot dishes and starters from the expedition recipes.' },
      items: [
        { name: { ru: 'Согажа', en: 'Sogazha' }, note: { ru: 'Баранья печень в кружевном жире на углях', en: 'Lamb liver in lace fat, cooked over embers' }, price: 900 },
        { name: { ru: 'Нельма, запечённая в сметане', en: 'Nelma baked in sour cream' }, note: { ru: 'С зеленью', en: 'With fresh herbs' }, price: 5700 },
        { name: { ru: 'Хуужууры', en: 'Khuushuur' }, note: { ru: 'Тувинские пирожки', en: 'Tuvan fried pies' }, price: null },
        { name: { ru: 'Пельмени с кониной', en: 'Horse-meat pelmeni' }, price: null },
        { name: { ru: 'Уха по рецепту староверов', en: 'Old Believers’ ukha' }, price: null },
        { name: { ru: 'Копчёная нельма с кедровой кашей', en: 'Smoked nelma with cedar-nut porridge' }, note: { ru: 'Соус из черемши', en: 'Ramson sauce' }, price: null },
        { name: { ru: 'Филе-миньон из хакасской говядины', en: 'Khakassian beef filet mignon' }, price: null },
        { name: { ru: 'Вителло тоннато из опалённой оленины', en: 'Seared venison vitello tonnato' }, price: null },
        { name: { ru: 'Кета с кедровой кашей', en: 'Chum salmon with cedar-nut porridge' }, price: null },
        { name: { ru: 'Блины с якутским карасём', en: 'Blini with Yakut crucian carp' }, price: null }
      ]
    },
    {
      id: 'desserts',
      title: { ru: 'Десерты', en: 'Desserts' },
      intro: { ru: 'Таёжные ягоды, мёд, сено и черёмуха.', en: 'Taiga berries, honey, hay and bird cherry.' },
      items: [
        { name: { ru: 'Алтайский медовик', en: 'Altai honey cake' }, note: { ru: 'С мороженым из сена', en: 'With hay ice cream' }, price: 950 },
        { name: { ru: 'Черёмуховый торт', en: 'Bird cherry cake' }, price: 1100 },
        { name: { ru: 'Таёжный десерт', en: 'Taiga dessert' }, price: 1000 },
        { name: { ru: 'Мороженое', en: 'Ice cream' }, note: { ru: 'Сметана-сено · шоколад-хлеб', en: 'Sour cream & hay · chocolate & bread' }, price: 400 },
        { name: { ru: 'Сорбет', en: 'Sorbet' }, note: { ru: 'Таёжный доктор · облепиха-имбирь', en: 'Taiga doctor · sea buckthorn & ginger' }, price: 400 }
      ]
    }
  ],

  // Interface strings used by main.js
  ui: {
    seasonal: { ru: 'сезонное', en: 'seasonal' },
    openUntil: { ru: 'Открыто до {t}', en: 'Open until {t}' },
    closedOpens: { ru: 'Закрыто · откроемся в {t}', en: 'Closed · opens at {t}' },
    today: { ru: 'сегодня', en: 'today' },
    days: {
      ru: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
      en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    daysShort: {
      ru: ['Пн–Пт', 'Сб–Вс'],
      en: ['Mon–Fri', 'Sat–Sun']
    },
    guests: { ru: ['гость', 'гостя', 'гостей'], en: ['guest', 'guests', 'guests'] },
    banquet: { ru: 'банкет', en: 'banquet' },
    chooseTime: { ru: 'Выберите время', en: 'Choose a time' },
    noTimes: { ru: 'На эту дату мест уже нет', en: 'No tables left for this date' },
    errRequired: { ru: 'Заполните поле', en: 'Please fill in this field' },
    errName: { ru: 'Минимум 2 буквы', en: 'At least 2 letters' },
    errPhone: { ru: 'Введите номер полностью', en: 'Enter the full number' },
    errDate: { ru: 'Выберите дату не раньше сегодняшней', en: 'Pick today or a later date' },
    errTime: { ru: 'Выберите время', en: 'Choose a time' },
    sending: { ru: 'Отправляем…', en: 'Sending…' },
    done: {
      ru: '{name}, ждём вас {date} в {time}, {guests}. Администратор перезвонит на {phone}, чтобы подтвердить бронь.',
      en: '{name}, we look forward to seeing you on {date} at {time}, {guests}. Our host will call {phone} to confirm.'
    }
  }
};

window.I18N = {
  en: {
    'meta.title': 'MANUL — Siberian cuisine restaurant on Okhotny Ryad, Moscow',
    'meta.description': 'MANUL is a restaurant of Siberian peoples’ cuisine in central Moscow: stroganina, sogazha, khuushuur, nelma and venison. 2 Okhotny Ryad, 2nd floor. Table reservations.',
    'a11y.skip': 'Skip to content',
    'a11y.home': 'MANUL — home',
    'a11y.nav': 'Main navigation',
    'a11y.menu': 'Open menu',
    'a11y.mnav': 'Mobile navigation',
    'a11y.scroll': 'Scroll down',

    'nav.concept': 'Concept',
    'nav.signature': 'Signature',
    'nav.menu': 'Menu',
    'nav.chef': 'Chef',
    'nav.interior': 'Interior',
    'nav.reserve': 'Booking',
    'nav.contacts': 'Contacts',
    'cta.book': 'Book a table',
    'cta.table': 'Book a table',
    'cta.menu': 'See the menu',
    'drawer.address': '2 Okhotny Ryad · 2nd floor',

    'hero.art': 'The eyes of a Pallas’s cat in the dark',
    'hero.eyebrow': 'Siberian peoples’ cuisine · Moscow',
    'hero.t1': 'Siberia',
    'hero.t2': 'in the heart of Moscow',
    'hero.lead': 'Recipes gathered on expeditions across Khakassia, Tuva, Altai and along the Yenisei. Stroganina, game and northern fish — a short walk from Red Square.',
    'hero.address': '2 Okhotny Ryad · 2nd floor',
    'hero.rating': '1,747 ratings on Yandex Maps',

    'ticker': 'Stroganina <i>✦</i> Nelma <i>✦</i> Muksun <i>✦</i> Venison <i>✦</i> Cedar nuts <i>✦</i> Ramsons <i>✦</i> Sea buckthorn <i>✦</i> Bird cherry <i>✦</i> Khakassian beef <i>✦</i> Sturgeon <i>✦</i>',

    'concept.eyebrow': 'Concept',
    'concept.title': 'Six months on the road — <em>to bring Siberia to Okhotny&nbsp;Ryad</em>',
    'concept.p1': 'The MANUL team travelled through Khakassia, Tuva, Altai and the Yenisei region, searching for the products, techniques and recipes of the Khakas, the Tuvans and the taiga Old Believers.',
    'concept.p2': 'The chef adapted what they found to a modern presentation without losing what matters most — the taste. The menu is built on local produce: nelma, muksun, sturgeon, vendace, venison and elk, ramsons and cedar nuts. Bread and sauces are made in-house, and the waiters will tell you the story behind every dish.',
    'route.title': 'Expedition route: Khakassia, Tuva, Altai, the Yenisei — and Moscow',
    'route.khakassia': 'Khakassia',
    'route.tuva': 'Tuva',
    'route.altai': 'Altai',
    'route.yenisei': 'Yenisei',
    'route.moscow': 'Moscow',
    'route.l1': '<b>Khakassia</b> — beef, steppe herbs',
    'route.l2': '<b>Tuva</b> — sogazha, khuushuur, lamb',
    'route.l3': '<b>Altai</b> — honey, cedar, sea buckthorn',
    'route.l4': '<b>Yenisei</b> — nelma, muksun, sturgeon',
    'stats.months': 'months of expeditions',
    'stats.regions': 'Siberian regions on the menu',
    'stats.seasons': 'seasonal menus a year',
    'stats.guests': 'guests in the dining room',

    'sig.eyebrow': 'Signature dishes',
    'sig.title': 'Dishes worth <em>crossing the city for</em>',
    'sig.note': 'Flavours rarely found in Moscow: from Tuvan sogazha to Old Believers’ fish soup.',

    'menu.eyebrow': 'Menu',
    'menu.title': 'From the taiga, the steppe <em>and northern rivers</em>',
    'menu.tabs': 'Menu sections',
    'menu.note': 'The menu changes three times a year. Prices are in rubles; ask your waiter about seasonal dishes and current prices. Average bill — 3,000–6,000&nbsp;₽.',

    'seasons.eyebrow': 'Seasons',
    'seasons.title': 'Three menus — <em>three Siberian seasons</em>',
    'seasons.spring': 'Spring',
    'seasons.springText': 'Forest herbs and ramsons — the first greens after a long winter.',
    'seasons.autumn': 'Autumn',
    'seasons.autumnText': 'Mushrooms, berries and game — harvest time in the taiga.',
    'seasons.winter': 'Winter',
    'seasons.winterText': 'Stroganina of frozen fish — the great winter dish of the North.',

    'chef.eyebrow': 'Brand chef',
    'chef.first': 'Viktor',
    'chef.last': 'Shaydetsky',
    'chef.statement': 'He spent six months on expeditions, immersing himself in the cuisines of Siberian peoples — and brought their recipes to the centre of Moscow.',
    'chef.text': 'Some dishes Viktor reinterpreted in his own way: seared venison vitello tonnato, chum salmon with cedar-nut porridge, blini with Yakut crucian carp. Seasonal berries and roots balance acidity and sweetness, while local fish and game stay at the centre of the plate.',
    'chef.f1': 'Bread and sauces made in-house',
    'chef.f2': 'A new seasonal menu three times a year',
    'chef.f3': 'Produce from Siberian suppliers',

    'int.eyebrow': 'Interior',
    'int.title': 'The taiga, <em>reflected in black water</em>',
    'int.note': 'A second floor on Okhotny Ryad: up to 155 guests, a private VIP room and a banquet hall.',
    'int.p1': 'Wood and fur',
    'int.p1t': 'Wooden furniture draped with hides',
    'int.p2': 'Mirrored partition',
    'int.p2t': 'Glass divides the room and multiplies the lights',
    'int.p3': 'A ceiling like water',
    'int.p3t': 'A black gloss surface above the room',
    'int.f1': '155',
    'int.f1t': 'guests in the dining room',
    'int.f2': 'VIP',
    'int.f2t': 'a private room',
    'int.f3': 'Live',
    'int.f3t': 'live music and DJ sets',
    'int.f4': 'Wine',
    'int.f4t': 'wine list and bar',
    'int.f5t': 'menu in English',

    'res.eyebrow': 'Reservations',
    'res.title': 'Your table <em>is waiting</em>',
    'res.text': 'Leave a request and our host will call you back to confirm. For banquets and private events choose “9+”.',
    'res.call': 'Or call us',
    'form.name': 'Name',
    'form.nameP': 'How should we address you',
    'form.phone': 'Phone',
    'form.date': 'Date',
    'form.time': 'Time',
    'form.guests': 'Guests',
    'form.comment': 'Requests',
    'form.commentP': 'Occasion, high chair, table by the window…',
    'form.submit': 'Send request',
    'form.note': 'Concept website: requests are not sent to the restaurant. Please call to make a real booking.',
    'form.doneTitle': 'Request received',
    'form.again': 'New request',

    'con.eyebrow': 'Contacts',
    'con.title': '2 Okhotny Ryad <em>· second floor</em>',
    'con.address': 'Address',
    'con.addressV': '2 Okhotny Ryad St., 2nd floor, Moscow<br>Metro: Okhotny Ryad, Teatralnaya, Ploshchad Revolyutsii',
    'con.phone': 'Phone',
    'con.hours': 'Opening hours',
    'con.check': 'Average bill',
    'con.checkV': '3,000–6,000 ₽',
    'con.route': 'Get directions',
    'con.2gis': 'Open in 2GIS',
    'map.title': 'Map: MANUL on Okhotny Ryad, next to Manezhnaya Square and Red Square',
    'map.kremlin': 'Kremlin',
    'map.red': 'Red Square',
    'map.manege': 'Manezhnaya Sq.',
    'map.tverskaya': 'Tverskaya St.',
    'map.okhotny': 'Okhotny Ryad',
    'map.theatre': 'Teatralnaya Sq.',
    'map.river': 'Moskva River',

    'footer.tag': 'Siberian peoples’ cuisine in the heart of Moscow',
    'footer.address': '2 Okhotny Ryad, 2nd floor<br>Moscow',
    'footer.hours': 'Mon–Fri 14:00–00:00<br>Sat–Sun 12:00–00:00',
    'footer.official': 'Official website',
    'footer.disclaimer': 'Concept website made for a portfolio. This is not the restaurant’s official site; the information comes from public sources.',
    'footer.credit': 'Design & development —',
    'dock.call': 'Call'
  }
};
