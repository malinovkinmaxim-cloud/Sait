/* ==========================================================================
   MATTO — content.
   Russian copy lives in index.html; English copy and all data are here.
   Prices in rubles, from the barbershop's public price list.
   ========================================================================== */

window.MATTO = {
  hours: { open: 10 * 60, close: 22 * 60, lastStart: 21 * 60 }, // daily, Moscow time
  bookingDays: 14,

  services: [
    {
      id: 'cuts',
      title: { ru: 'Стрижки', en: 'Haircuts' },
      items: [
        { id: 'cut', name: { ru: 'Мужская стрижка', en: 'Men’s haircut' }, price: 1000 },
        { id: 'cut-beard', name: { ru: 'Стрижка + борода', en: 'Haircut + beard' }, price: 1800, hit: true },
        { id: 'clipper', name: { ru: 'Стрижка машинкой', en: 'Clipper cut' }, note: { ru: 'Под одну насадку', en: 'One guard all over' }, price: 600 },
        { id: 'scissors', name: { ru: 'Стрижка ножницами', en: 'Scissor cut' }, note: { ru: 'Длинные волосы', en: 'Long hair' }, price: 1300 },
        { id: 'kids', name: { ru: 'Детская стрижка', en: 'Kids’ haircut' }, note: { ru: 'С 4 до 11 лет включительно', en: 'Ages 4 to 11' }, price: 800 }
      ]
    },
    {
      id: 'beard',
      title: { ru: 'Борода и бритьё', en: 'Beard & shave' },
      items: [
        { id: 'beard-shape', name: { ru: 'Моделирование бороды', en: 'Beard shaping' }, price: 800 },
        { id: 'beard-clipper', name: { ru: 'Стрижка бороды машинкой', en: 'Beard clipper trim' }, note: { ru: 'Под одну насадку', en: 'One guard' }, price: 500 },
        { id: 'razor', name: { ru: 'Опасное бритьё', en: 'Straight-razor shave' }, price: 1000 },
        { id: 'shaver', name: { ru: 'Бритьё шейвером', en: 'Shaver shave' }, price: 800 }
      ]
    },
    {
      id: 'camo',
      title: { ru: 'Камуфляж', en: 'Grey blending' },
      items: [
        { id: 'camo-beard', name: { ru: 'Камуфляж бороды', en: 'Beard grey blending' }, note: { ru: 'Тонирование седины', en: 'Tones down grey hair' }, price: 800 },
        { id: 'camo-head', name: { ru: 'Камуфляж головы', en: 'Hair grey blending' }, note: { ru: 'Тонирование седины', en: 'Tones down grey hair' }, price: 1300 }
      ]
    },
    {
      id: 'care',
      title: { ru: 'Уход и дополнительно', en: 'Care & extras' },
      items: [
        { id: 'temple', name: { ru: 'Рисунок на висках', en: 'Temple design' }, note: { ru: 'Детский фигурный выстриг: полосы, цифры, узор', en: 'Kids’ patterns: lines, numbers, shapes' }, price: 200 },
        { id: 'scrub', name: { ru: 'Скраб + чёрная маска', en: 'Scrub + black mask' }, price: 500 },
        { id: 'wash', name: { ru: 'Мытьё головы', en: 'Hair wash' }, note: { ru: 'Без стрижки', en: 'Without a haircut' }, price: 300 },
        { id: 'wax', name: { ru: 'Эпиляция воском', en: 'Waxing' }, price: 500 }
      ]
    }
  ],

  // Barbers and their Yandex Maps rating. away: true — on leave, booking closed.
  team: [
    { id: 'kolya', name: { ru: 'Коля', en: 'Kolya' }, rating: 5.0, votes: 122, photo: 'images/team-kolya.webp' },
    { id: 'aziz', name: { ru: 'Азиз', en: 'Aziz' }, rating: 5.0, votes: 37, photo: 'images/team-aziz.webp' },
    { id: 'muhammad', name: { ru: 'Мухаммад', en: 'Muhammad' }, rating: 5.0, votes: 80, photo: 'images/team-muhammad.webp', away: true },
    { id: 'gairat', name: { ru: 'Гайрат', en: 'Gairat' }, rating: 5.0, votes: 16, photo: 'images/team-gairat.webp' }
  ],

  gallery: [
    { src: 'images/hall.webp', thumb: 'images/hall-480.webp', alt: { ru: 'Зал: кресла, зеркала и световые рамки', en: 'The hall: chairs, mirrors and light frames' } },
    { src: 'images/lounge.webp', thumb: 'images/lounge-480.webp', alt: { ru: 'Зона ожидания с кожаным диваном', en: 'Waiting area with a leather sofa' } },
    { src: 'images/products.webp', thumb: 'images/products-480.webp', alt: { ru: 'Полка с косметикой для волос и бороды', en: 'Shelf with hair and beard products' } },
    { src: 'images/wash.webp', thumb: 'images/wash-480.webp', alt: { ru: 'Мойка для головы', en: 'Hair wash station' } },
    { src: 'images/reception.webp', thumb: 'images/reception-480.webp', alt: { ru: 'Ресепшен с деревянной стойкой', en: 'Reception with a wooden desk' } },
    { src: 'images/entrance.webp', thumb: 'images/entrance-480.webp', alt: { ru: 'Вход с вывеской MATTO', en: 'Entrance with the MATTO sign' } }
  ],

  ui: {
    barber: { ru: 'Барбер', en: 'Barber' },
    away: { ru: 'В отпуске', en: 'On leave' },
    votes: { ru: ['оценка', 'оценки', 'оценок'], en: ['rating', 'ratings', 'ratings'] },
    bookWith: { ru: 'Записаться', en: 'Book' },
    anyBarber: { ru: 'Любой свободный мастер', en: 'Any available barber' },
    chooseService: { ru: 'Выберите услугу', en: 'Choose a service' },
    openUntil: { ru: 'Открыто до {t}', en: 'Open until {t}' },
    closedOpens: { ru: 'Закрыто · откроемся в {t}', en: 'Closed · opens at {t}' },
    today: { ru: 'Сегодня', en: 'Today' },
    tomorrow: { ru: 'Завтра', en: 'Tomorrow' },
    noSlots: { ru: 'На этот день свободного времени нет — выберите другую дату.', en: 'No free times left on this day — please pick another date.' },
    errRequired: { ru: 'Заполните поле', en: 'Please fill in this field' },
    errName: { ru: 'Минимум 2 буквы', en: 'At least 2 letters' },
    errPhone: { ru: 'Введите номер полностью', en: 'Enter the full number' },
    errService: { ru: 'Выберите услугу', en: 'Choose a service' },
    errSlot: { ru: 'Выберите время', en: 'Choose a time' },
    sending: { ru: 'Записываем…', en: 'Booking…' },
    done: {
      ru: '{name}, ждём вас {date} в {time}. {service} — {barber}. Если планы изменятся, позвоните или напишите в WhatsApp.',
      en: '{name}, see you on {date} at {time}. {service} — {barber}. If your plans change, call us or message on WhatsApp.'
    }
  }
};

window.I18N = {
  en: {
    'meta.title': 'MATTO — barbershop in Mikhailovsky Park, Moscow',
    'meta.description': 'MATTO barbershop: men’s and kids’ haircuts, beard, straight-razor shave, grey blending. Daily 10:00–22:00. 30A Mikhailova St., bldg 5. Booking +7 968 777-69-97.',
    'a11y.skip': 'Skip to content',
    'a11y.home': 'MATTO — home',
    'a11y.nav': 'Main navigation',
    'a11y.menu': 'Open menu',
    'a11y.mnav': 'Mobile navigation',
    'a11y.social': 'Contact links',
    'a11y.photo': 'Photo',
    'a11y.close': 'Close',
    'a11y.prev': 'Previous photo',
    'a11y.next': 'Next photo',

    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.team': 'Barbers',
    'nav.gallery': 'Gallery',
    'nav.booking': 'Booking',
    'nav.contacts': 'Contacts',
    'drawer.hours': 'Daily 10:00–22:00',
    'cta.book': 'Book now',
    'cta.bookOnline': 'Book online',
    'cta.prices': 'Services & prices',

    'hero.eyebrow': 'Barbershop · Mikhailovsky Park',
    'hero.t1': 'A haircut',
    'hero.t2': 'with character',
    'hero.t3': 'and no rush',
    'hero.lead': 'Men’s and kids’ haircuts, beard, straight-razor shave and grey blending. A warm room, a leather sofa and barbers who listen to what you want.',
    'hero.f1': 'rating on Yandex Maps',
    'hero.f2': 'ratings',
    'hero.f3': 'reviews',
    'img.hall': 'MATTO’s hall: chairs, mirrors and light frames on the ceiling',
    'img.lounge': 'Waiting area with a leather sofa',
    'img.reception': 'MATTO’s reception with a wooden desk',
    'img.entrance': 'The entrance to MATTO with its sign on a brick facade',
    'marquee': 'Haircuts <i></i> Beard <i></i> Straight-razor shave <i></i> Grey blending <i></i> Kids’ haircuts <i></i> Care <i></i>',

    'about.eyebrow': 'About',
    'about.title': 'More than <span class="accent">a haircut</span>',
    'about.caption': 'Reception · 30A Mikhailova St., bldg 5',
    'about.lead': 'MATTO is a neighbourhood barbershop in the Mikhailovsky Park residential complex. Precise cuts, straight-razor shaves and nobody rushing you.',
    'about.text': 'Burgundy walls, wood, Edison bulbs and a leather sofa in the waiting area — a gentlemen’s club without the pretence. Bring your own idea or trust the barber: from classic cuts to patterned designs for kids.',
    'perk.parking': 'Parking',
    'perk.parkingT': 'Including accessible spaces',
    'perk.wifiT': 'Free for guests',
    'perk.access': 'Accessible',
    'perk.accessT': 'Step-free entrance for wheelchairs',
    'perk.pay': 'Any payment',
    'perk.payT': 'Card, cash, SBP, QR code',

    'svc.eyebrow': 'Services & prices',
    'svc.title': 'Prices <span class="accent">with no surprises</span>',
    'svc.note': 'Fixed prices, whichever barber you choose. Tap a service to go straight to booking.',
    'svc.tabs': 'Service categories',
    'combo.tag': 'Most popular',
    'combo.title': 'Haircut + beard',
    'combo.text': 'The full look in one visit: a haircut and beard shaping.',

    'team.eyebrow': 'Barbers',
    'team.title': 'The <span class="accent">MATTO</span> team',
    'team.note': 'Each barber’s rating comes from client reviews on Yandex Maps.',

    'gal.eyebrow': 'Gallery',
    'gal.title': 'Take a look <span class="accent">inside</span>',
    'gal.note': 'Real photos of the barbershop. Tap to enlarge.',

    'book.eyebrow': 'Online booking',
    'book.title': 'Book <span class="accent">in a minute</span>',
    'book.note': 'Choose a service, a barber and a time — the front desk will confirm by phone or messenger.',
    'book.s1': 'Service & barber',
    'book.s2': 'Date & time',
    'book.s3': 'Your details',
    'form.service': 'Service',
    'form.barber': 'Barber',
    'form.date': 'Date',
    'form.time': 'Time',
    'form.name': 'Name',
    'form.nameP': 'How should we address you',
    'form.phone': 'Phone',
    'form.submit': 'Confirm booking',
    'form.note': 'Concept website: the request is not sent. To book for real, call or message the barbershop.',
    'form.doneTitle': 'You’re booked!',
    'form.again': 'Book again',
    'sum.title': 'Your booking',
    'sum.when': 'When',
    'sum.total': 'Total',

    'con.eyebrow': 'Contacts',
    'con.title': 'Look for the <span class="accent">MATTO</span> sign',
    'con.address': 'Address',
    'con.addressV': '30A Mikhailova St., bldg 5, Moscow<br>Mikhailovsky Park, ground floor · Okskaya metro',
    'con.hours': 'Opening hours',
    'con.hoursV': 'Daily, 10:00–22:00',
    'con.phone': 'Phone',
    'con.phoneNote': 'WhatsApp and Telegram on the same number',
    'con.route': 'Directions',
    'con.photo': 'Street entrance — the MATTO sign on a brick facade',

    'footer.line': 'Barbershop · 30A Mikhailova St., bldg 5 · Daily 10:00–22:00',
    'footer.call': 'Call',
    'footer.disclaimer': 'Concept website made for a portfolio. This is not the barbershop’s official site; information and photos come from public sources.',
    'footer.credit': 'Design & development —'
  }
};
