export const LOCALES = ['ru', 'he', 'en'];
export const DEFAULT_LOCALE = 'ru';
export const FALLBACK_LOCALE = 'en';
export const RTL_LOCALES = ['he'];

export function isRTL(lang) { return RTL_LOCALES.includes(lang); }

/** Вернуть мультиязычное поле { ru, he, en } для нужного языка */
export function pick(obj, lang) {
  if (!obj) return '';
  return obj[lang] ?? obj[DEFAULT_LOCALE] ?? obj[FALLBACK_LOCALE] ?? '';
}

/** Получить все UI-переводы для языка */
export function t(lang) {
  return TRANSLATIONS[lang] ?? TRANSLATIONS[FALLBACK_LOCALE];
}

const TRANSLATIONS = {
  ru: {
    nav: {
      services: 'Услуги',
      gallery:  'Работы',
      masters:  'Мастера',
      about:    'О нас',
      reviews:  'Отзывы',
      contacts: 'Контакты',
    },
    hero: {
      eyebrow: 'Салон красоты · Бат-Ям',
      cta:     'Записаться',
    },
    services: {
      title:    'Услуги и цены',
      duration: 'мин',
      from:     'от',
      details:  'Подробнее',
    },
    gallery: {
      title: 'Наши работы',
      eyebrow: 'Портфолио',
    },
    masters: {
      title:      'Наши мастера',
      eyebrow:    'Команда',
      experience: 'лет опыта',
    },
    reviews: {
      title:   'Отзывы клиентов',
      eyebrow: 'Отзывы',
      link:    'Все отзывы на Google',
      rating:  'на основе отзывов',
    },
    contacts: {
      title:       'Контакты',
      address:     'Адрес',
      schedule:    'Режим работы',
      writePrefer: 'Запись и вопросы — только через WhatsApp',
    },
    hours: {
      sun: 'Вс', mon: 'Пн', tue: 'Вт', wed: 'Ср',
      thu: 'Чт', fri: 'Пт', sat: 'Сб',
      open:    'Открыто',
      closed:  'Закрыто',
      dayOff:  'Выходной',
      until:   'до',
      opensAt: 'откроется в',
      tomorrow: 'завтра',
    },
    cta: {
      book:      'Записаться',
      whatsapp:  'Написать в WhatsApp',
      viewMap:   'Открыть на карте',
      instagram: 'Instagram',
    },
    booking: {
      title:    'Выбери дату',
      back:     'Назад',
      close:    'Закрыть',
      stepDay:  'Выбери удобный день:',
      closedDay: 'Выходной',
      message:  'Здравствуйте! Хочу записаться на {day}, {date} в {time}.',
    },
    footer: {
      rights: 'Все права защищены',
    },
    months: ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'],
    masterClasses: { title: 'Обучение' },
    studio: { title: 'Студия', address: 'Адрес' },
  },

  he: {
    nav: {
      services: 'שירותים',
      gallery:  'עבודות',
      masters:  'צוות',
      about:    'אודות',
      reviews:  'ביקורות',
      contacts: 'צור קשר',
    },
    hero: {
      eyebrow: 'סלון יופי · בת ים',
      cta:     'קביעת תור',
    },
    services: {
      title:    'שירותים ומחירים',
      duration: 'דקות',
      from:     'מ-',
      details:  'פרטים',
    },
    gallery: {
      title:  'העבודות שלנו',
      eyebrow: 'פורטפוליו',
    },
    masters: {
      title:      'הצוות שלנו',
      eyebrow:    'צוות',
      experience: 'שנות ניסיון',
    },
    reviews: {
      title:   'ביקורות לקוחות',
      eyebrow: 'ביקורות',
      link:    'כל הביקורות ב-Google',
      rating:  'על בסיס ביקורות',
    },
    contacts: {
      title:       'צור קשר',
      address:     'כתובת',
      schedule:    'שעות פעילות',
      writePrefer: 'קביעת תורים ושאלות — דרך וואטסאפ בלבד',
    },
    hours: {
      sun: 'א\'', mon: 'ב\'', tue: 'ג\'', wed: 'ד\'',
      thu: 'ה\'', fri: 'ו\'', sat: 'ש\'',
      open:    'פתוח',
      closed:  'סגור',
      dayOff:  'יום מנוחה',
      until:   'עד',
      opensAt: 'נפתח ב-',
      tomorrow: 'מחר',
    },
    cta: {
      book:      'קביעת תור',
      whatsapp:  'כתוב לנו בוואטסאפ',
      viewMap:   'פתח במפה',
      instagram: 'אינסטגרם',
    },
    booking: {
      title:    'בחר תאריך',
      back:     'חזרה',
      close:    'סגור',
      stepDay:  'בחר יום מועדף:',
      closedDay: 'יום מנוחה',
      message:  'שלום! אני רוצה לקבוע תור ל{day}, {date} בשעה {time}.',
    },
    footer: {
      rights: 'כל הזכויות שמורות',
    },
    months: ['ינו','פבר','מרץ','אפר','מאי','יונ','יול','אוג','ספט','אוק','נוב','דצמ'],
    masterClasses: { title: 'הדרכה' },
    studio: { title: 'הסלון', address: 'כתובת' },
  },

  en: {
    nav: {
      services: 'Services',
      gallery:  'Gallery',
      masters:  'Team',
      about:    'About',
      reviews:  'Reviews',
      contacts: 'Contact',
    },
    hero: {
      eyebrow: 'Beauty Salon · Bat Yam',
      cta:     'Book Now',
    },
    services: {
      title:    'Services & Prices',
      duration: 'min',
      from:     'from',
      details:  'Details',
    },
    gallery: {
      title:  'Our Work',
      eyebrow: 'Portfolio',
    },
    masters: {
      title:      'Our Team',
      eyebrow:    'Team',
      experience: 'years of experience',
    },
    reviews: {
      title:   'Client Reviews',
      eyebrow: 'Reviews',
      link:    'All reviews on Google',
      rating:  'based on reviews',
    },
    contacts: {
      title:       'Contact',
      address:     'Address',
      schedule:    'Working Hours',
      writePrefer: 'Bookings and questions — WhatsApp only',
    },
    hours: {
      sun: 'Sun', mon: 'Mon', tue: 'Tue', wed: 'Wed',
      thu: 'Thu', fri: 'Fri', sat: 'Sat',
      open:    'Open',
      closed:  'Closed',
      dayOff:  'Day off',
      until:   'until',
      opensAt: 'opens at',
      tomorrow: 'tomorrow',
    },
    cta: {
      book:      'Book Now',
      whatsapp:  'Message on WhatsApp',
      viewMap:   'Open on Map',
      instagram: 'Instagram',
    },
    booking: {
      title:    'Choose a Date',
      back:     'Back',
      close:    'Close',
      stepDay:  'Pick a convenient day:',
      closedDay: 'Day off',
      message:  'Hello! I\'d like to book for {day}, {date} at {time}.',
    },
    footer: {
      rights: 'All rights reserved',
    },
    months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    masterClasses: { title: 'Training' },
    studio: { title: 'Studio', address: 'Address' },
  },
};
