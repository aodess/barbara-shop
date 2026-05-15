# CLAUDE.md — Barbara Shop

> Читай этот файл первым. Делай, не объясняй. Коммить после каждого блока.

---

## ЗАПУСК И ДЕПЛОЙ

```
npm run dev      # http://localhost:4321
npm run build    # проверить перед деплоем
railway up       # деплой на прод
git push         # GitHub (только история, не триггерит деплой)
```

**Прод:** `https://barbara-shop-production.up.railway.app`
**Деплой:** только `railway up`. Не через GitHub.

---

## ПРОЕКТ

Сайт-визитка салона красоты в Петах-Тикве, Израиль.
3 языка: `ru` (основной), `he` (иврит), `en`.
Без бэкенда. Контент — `src/data/content.json`.
Запись — только WhatsApp (StickyBar внизу). Никаких `tel:`.
Владелец (Евгений) не программист — просит правки в чате.

---

## СТЕК

| | |
|---|---|
| Генератор | Astro 4, static output |
| Стили | чистый CSS с переменными, без Tailwind |
| Карусели | Splide.js v4 через CDN, `is:inline` скрипты (только Services + Masters) |
| Анимации | GSAP 3 (npm) + CSS transitions/keyframes |
| Фото | WebP — `npm run webp` (sharp). Исходники в `originals/` (не коммитить), коммитить только webp |
| Деплой | Railway (через `railway up`) |

**Никогда:** React, Vue, Tailwind, бэкенд, БД, localStorage.

---

## АРХИТЕКТУРА

```
src/
  data/content.json         ← весь контент (услуги, фото, мастера, тексты)
  lib/
    i18n.js                 ← t(), pick(), isRTL, LOCALES
    businessHours.js        ← статус открыто/закрыто (Asia/Jerusalem)
    seo.js                  ← JSON-LD BeautySalon
  styles/global.css         ← переменные, шапка, футер, sticky, граффити, типографика
  layouts/BaseLayout.astro  ← <html>, шапка, плавающее меню, граффити-фон, футер, GSAP
  components/
    SeoHead.astro           ← <head>: meta, OG, JSON-LD, hreflang
    Hero.astro              ← подзаголовок + meta-строка (инста, open/closed, Google★★★★★) + фото салона + описание
    Services.astro          ← карусель Splide: 2 страницы × 4 услуги (без автопрокрутки)
    Gallery.astro           ← слайд-шоу с crossfade (без карусели, без клика, авто 2с)
    Masters.astro           ← карусель Splide: карточки мастеров
    NailsSkin.astro         ← маникюр + косметология, single-column
    Contacts.astro          ← часы, адрес, WhatsApp, IG, Google Maps
    StickyBar.astro         ← нижняя панель: Записаться + WhatsApp
  pages/
    index.astro             ← редирект на язык
    [lang]/index.astro      ← одна страница × 3 языка
    sitemap.xml.js          ← динамический sitemap
public/images/
  shapka.webp 1200×584      ← баннер шапки
  salon.webp                ← фото в Hero
  1.webp – 7.webp           ← портфолио
  menu.webp 561×1484        ← фон выпадающего меню
  logo.jpg                  ← лого-кружок в шапке
  originals/                ← исходники, НЕ коммитить
```

---

## ДИЗАЙН-СИСТЕМА

**Эстетика:** тёмный люкс, barbie-pink неон. Фон почти чёрный, акценты — горячий розовый (`#FF1493`, `#FF85C2`) + золото (`#F0D898`). Плавающие сердечки ♥ на фоне.

### CSS-переменные (global.css)

```css
--paper:          #080810;
--surface:        #0F0F1A;
--surface-raised: #161622;

--rose-bright: #FF85C2;
--rose:        #E8709E;
--rose-deep:   #C04880;
--gold:        #F0D898;

--ink:      #FFF0F8;
--ink-soft: #D8C8D8;
--ink-mute: #806878;

--font-script:  'Great Vibes';        ← название бренда
--font-display: 'Cormorant Garamond'; ← заголовки
--font-body:    'Jost';               ← текст

/* Вертикальный мобильный макет на всех экранах */
--max-w: 600px;
```

`[lang="he"]` переопределяет только `--font-body` (Assistant) и `--font-display` (Frank Ruhl Libre). НЕ трогает `--font-script` — иначе Great Vibes ломается.

---

## АРХИТЕКТУРНЫЕ РЕШЕНИЯ (важно)

### Документ всегда `dir="ltr"` для всех языков

`BaseLayout.astro` форсит `const dir = 'ltr'`. Структура (карусели, шапка, колонки) на иврите **идентична** русской. Иврит-текст рендерится справа-налево сам — через Unicode bidi.

**Почему:** RTL-мод Splide ломает мобильную вёрстку, `[dir="rtl"]` CSS-хаки множатся. С LTR-структурой иврит «просто работает», а пара точечных правок (`row-reverse` в строках прайса) делает текст-выравнивание адекватным.

### Вертикальный «мобильный» макет на всех экранах

`--max-w: 600px`. Hero/Services/Gallery/NailsSkin/Contacts — single-column всегда. На широких экранах контент — узкая колонка по центру, по краям тёмный фон + граффити-сердечки.

### Шапка — баннер с фото, не sticky

`.site-header` это `position: relative; aspect-ratio: 1200/584; max-width: var(--max-w)`. Контент налезает снизу через `.site-main { margin-top: -54px; z-index: 5 }`. Плавный градиент-фейд `.header-shapka-bg::after` (до `var(--paper)` снизу) — без чёткой полосы.

Бургер-меню вынесено в `.floating-menu` (`position: fixed; top-right`) — доступно при любой прокрутке.

### Position: fixed на iOS — БЕЗ backdrop-filter

`backdrop-filter` на `position: fixed` элементах ломает скролл на iOS Safari (элементы «гуляют»). У `.sticky-bar`, `.floating-menu`, `.nav-dropdown` — сплошной тёмный фон.

`overflow-x: hidden` НЕ на body (иначе body становится скролл-контейнером и тоже ломает fixed). На `<html>` — `hidden`, на `<body>` — `clip` (clip не создаёт скролл-контейнер).

### Galleria — НЕ карусель, а fade-slideshow

В Gallery нет Splide. Все 7 фото абсолютно наложены, активный имеет `opacity: 1`, остальные `0`. JS `setInterval(2000)` переключает класс `is-active`. Точки внизу — декор (`pointer-events: none`). Лайтбокса нет, клик не работает.

Фото с белыми каёмками в исходниках клиппятся через `transform: scale(1.05)` + `overflow: hidden` на рамке.

### Splide где остался

Только Services (`#hair-splide`, 2 слайда, без autoplay, со стрелками) и Masters (`#masters-splide`, autoplay, со стрелками). Подключён через CDN в `<head>`.

**Никогда не добавлять `direction: 'rtl'` в Splide-конфиг** — ломает мобиль. С `dir="ltr"` это и не нужно.

---

## КОНТЕНТ — что есть, что нужно

**Есть:**
- 7 фото портфолио, логотип, баннер шапки, фото салона
- Прайс: 3 категории (8 услуг) — рендерятся как 2 страницы × 4
- 3 мастера (без фото — пока SVG-иконки)
- Реальный URL отзывов Google: `googleReviews.url`
- Instagram: `barbara_shop__`

**Нужно от владельца:**
- Реальный WhatsApp-номер → `contacts.whatsapp`
- Реальный адрес и координаты → `salon.address`, `salon.geo`
- Фото мастеров (3 шт.) → подкладывать вместо SVG-иконок в Masters
- Фото для маникюра/косметологии (вместо placeholder в NailsSkin)
- OG-картинка `public/images/og.jpg` (1200×630)

---

## ИЗВЕСТНЫЕ ПОДВОДНЫЕ КАМНИ

| Проблема | Решение |
|---|---|
| iOS Safari: sticky-bar «гуляет» при скролле | Никаких `backdrop-filter` на `position: fixed` |
| iOS Safari: `overflow-x: hidden` на body ломает `position: fixed` | На `<html>` — `hidden`, на `<body>` — `clip` |
| Splide на иврите ломает карточки на мобиле | Документ всегда `dir="ltr"`, не задавать `direction` в Splide-конфиге |
| Great Vibes пропадает на иврите | `[lang="he"]` НЕ должен переопределять `--font-script` |
| Бренд-имя в шапке плохо читается на фото | Градиент с белым стартом + `filter: drop-shadow` с тёмной тенью |
| Фото портфолио имеют светлые края | `transform: scale(1.05)` на `.gallery-slide-inner` + `overflow: hidden` |
| GSAP `fromTo({opacity:0})` на карточках вызывает мигание | Анимировать только `.section-head`, карточки не трогать |
| `npm run webp` падает с `icc` | Убрать `.withMetadata({icc:{}})` из `scripts/to-webp.js` |

---

## GIT-ТЕГИ (точки отката)

```
backup-pre-header-2025-05-14   ← перед правкой шапки
ad09940                        ← первое добавление фото
```

Создавать перед крупными правками: `git tag backup-YYYY-MM-DD`.

---

## ФОРМАТ КОММИТОВ

`feat:` `fix:` `ux:` `content:` `seo:` `perf:` `docs:`
