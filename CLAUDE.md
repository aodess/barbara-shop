# CLAUDE.md — Barbara Shop

> Claude Code читает этот файл автоматически. Здесь всё необходимое для работы над проектом.
> Не задавай лишних вопросов — всё есть здесь. Работай блоками с коммитами.

---

## ЗАПУСК И ДЕПЛОЙ

```
npm install               # установить зависимости
npm run dev               # локальный сервер → http://localhost:4321
npm run build             # проверить сборку
railway up                # задеплоить напрямую в Railway (без GitHub push)
```

**⚠️ Деплой — ТОЛЬКО через `railway up`, не через git push.**
URL сайта: `https://barbara-shop-production.up.railway.app`

**Порядок работы:**
1. Прочитай этот файл целиком.
2. Прочитай `src/data/content.json` — там вся структура данных.
3. Редактируй компоненты по задаче.
4. `npm run build` — проверить что нет ошибок.
5. `railway up` — задеплоить.

---

## ДЕПЛОЙ — первый раз (GitHub + Railway)

Если ещё нет git-репозитория и Railway-проекта — выполни по порядку:

### Шаг 1 — GitHub репозиторий

```bash
git init
git add .
git commit -m "feat: initial Barbara Shop project structure"
gh repo create barbara-shop --public --source=. --remote=origin --push
```

> `gh` — это GitHub CLI, уже установлен и авторизован (пользователь aodess).
> Команда создаст репозиторий `github.com/aodess/barbara-shop` и запушит `main`.

### Шаг 2 — Railway проект

```bash
railway login          # пропустить если уже авторизован
railway init           # создать новый проект, выбрать "Empty project"
railway link           # привязать текущую папку к проекту
railway up             # первый деплой (ручной)
```

> После `railway init` Railway создаст проект. Затем в веб-интерфейсе Railway
> (railway.app → проект → Settings → Source) связать с репозиторием GitHub.
> После этого push в `main` = автодеплой.

### Шаг 3 — URL сайта

```bash
railway domain         # получить временный домен вида *.up.railway.app
```

Прописать домен в `src/data/content.json` → поле `seo.siteUrl`.

### Шаг 4 — обновить robots.txt

В `public/robots.txt` заменить `REPLACE_WITH_SITE_URL` на реальный URL.

---

## Проект

**Barbara Shop** — сайт-визитка салона красоты. Три языка (ru/he/en), SEO для локального поиска в Израиле. Связь с клиентами — через WhatsApp (кнопки `tel:` не нужны). Без бэкенда, весь контент в `content.json`.

**Владелец:** не программист. Просит правки в чате → Claude правит файлы → `git push` → Railway деплоит.

---

## Стек

| Что | Технология |
|---|---|
| Генератор | **Astro 4** (static output) |
| Стили | **Чистый CSS** с переменными, никакого Tailwind |
| Карусель | **Splide.js** (`@splidejs/splide`) — для галереи |
| Изображения | WebP вручную через `npm run webp` (sharp) |
| Данные | `src/data/content.json` — единый источник правды |
| Деплой | GitHub → Railway (автодеплой при push в `main`) |
| Аналитика | GA4 + Meta Pixel (поля в content.json, пустые = скрипты не подключаются) |

**Никогда не предлагать:** React, Vue, Tailwind, бэкенд, базы данных, localStorage.

---

## Архитектура

```
barbara-shop/
├── CLAUDE.md
├── package.json
├── astro.config.mjs
├── scripts/
│   └── to-webp.js            ← npm run webp → конвертирует originals/ в WebP
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── images/
│       ├── originals/        ← сюда класть исходники (jpg/png), НЕ коммитить тяжёлые
│       └── *.webp            ← WebP после конвертации, коммитить
└── src/
    ├── data/content.json     ← ВСЁ редактируемое: услуги, галерея, мастера, часы, тексты
    ├── lib/
    │   ├── i18n.js           ← UI-переводы и хелперы (t(), pick(), isRTL())
    │   ├── businessHours.js  ← статус открыто/закрыто (Asia/Jerusalem)
    │   └── seo.js            ← JSON-LD BeautySalon, WhatsApp ссылка
    ├── styles/
    │   └── global.css        ← CSS-переменные, типографика, базовые компоненты
    ├── components/
    │   ├── SeoHead.astro     ← <head>: meta, OG, JSON-LD, hreflang
    │   ├── Hero.astro        ← секция: большое фото + логотип + tagline + CTA
    │   ├── Services.astro    ← секция: карточки услуг с ценами
    │   ├── Gallery.astro     ← секция: карусель Splide с фото работ
    │   ├── Masters.astro     ← секция: карточки мастеров (фото + специализация)
    │   ├── Reviews.astro     ← секция: ссылка на Google-отзывы
    │   ├── Contacts.astro    ← секция: часы, адрес, карта, WhatsApp
    │   ├── Booking.astro     ← модал записи: день → час → WhatsApp
    │   └── StickyBar.astro   ← фиксированная кнопка «Записаться»
    ├── layouts/
    │   └── BaseLayout.astro  ← HTML-оболочка: header, footer, StickyBar, Booking
    └── pages/
        ├── index.astro       ← редирект на язык по navigator.language
        ├── sitemap.xml.js    ← динамический sitemap
        └── [lang]/
            └── index.astro   ← одна страница на 3 языках
```

---

## Дизайн-система

### Эстетика
**Тёмный люкс** — как премиальный beauty-бренд. Глубокий тёмный фон, акценты шампанское/золото и пудровая роза. Больше фотографий, крупнее. Яркие свечения на кнопках, карточках, заголовках — не пастельные намёки, а видимый эффект. Логотип/бренд присутствует крупно в нескольких местах.

Не путать с massage-profi: там терракота/охра, здесь золото/роза. Там брутальный, здесь элегантный.

### CSS-переменные (уже в `global.css`)

```css
:root {
  /* Фон */
  --paper:          #0C0C10;
  --surface:        #141419;
  --surface-raised: #1C1C24;
  --surface-high:   #242430;

  /* Акценты */
  --gold:        #DDB87A;   /* шампанское/золото — основной */
  --gold-deep:   #B8922A;   /* тёмное золото */
  --gold-glow:   rgba(221, 184, 122, 0.35);
  --rose:        #E090B4;   /* пудровая роза — второй акцент */
  --rose-deep:   #C06890;
  --rose-glow:   rgba(224, 144, 180, 0.30);
  --lavender:    #A096D4;   /* лаванда — третий акцент */

  /* Текст */
  --ink:      #F5EEE8;
  --ink-soft: #C5BCB8;
  --ink-mute: #7A7270;

  /* Линии */
  --line:        rgba(221, 184, 122, 0.10);
  --line-strong: rgba(221, 184, 122, 0.22);

  /* Тени */
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.45);
  --shadow-md: 0 16px 40px rgba(0,0,0,0.55);
  --shadow-lg: 0 28px 80px rgba(0,0,0,0.65);

  /* Геометрия */
  --r-sm: 4px;
  --r-md: 12px;
  --r-lg: 24px;
  --max-w: 1200px;

  /* Шрифты */
  --font-display: 'Cormorant Garamond', 'David Libre', Georgia, serif;
  --font-body:    'Jost', 'Assistant', system-ui, sans-serif;
}

[lang="he"] {
  --font-display: 'David Libre', 'Cormorant Garamond', Georgia, serif;
  --font-body:    'Assistant', 'Jost', system-ui, sans-serif;
}
```

### Google Fonts (в `<head>` через SeoHead или BaseLayout)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&family=David+Libre:wght@400;500;700&family=Assistant:wght@300;400;600&display=swap" rel="stylesheet">
```

### Эффекты (применять смелее, чем в massage-profi)

- **Фоновый космос:** `body::before` fixed — радиальные пятна gold + rose по углам, opacity 0.20–0.30 (видно невооружённым глазом). `body::after` — шум 5%.
- **Заголовки:** `text-shadow: 0 0 40px rgba(221,184,122,0.30)` — видимое золотое свечение.
- **Кнопки CTA:** `box-shadow: 0 0 30px var(--gold-glow)` всегда (не только hover). На hover — усиливать.
- **Карточки hover:** gold border + `box-shadow: 0 0 40px rgba(221,184,122,0.20)`.
- **Логотип:** крупно в Hero, в header, в footer. Если есть SVG-логотип — использовать. Если нет — стилизованное "B" или "Barbara Shop" с gradient текстом.
- **Секции:** чередовать фон (--paper / --surface) для визуального разделения.

---

## Карусель Splide.js

### Установка
```
npm install @splidejs/splide
```

### Использование в Gallery.astro

```astro
---
// Server-side: данные фото из content.json
import content from '../data/content.json';
import { t } from '../lib/i18n.js';
const { lang } = Astro.props;
const tr = t(lang);
const photos = content.gallery.photos;
---

<!-- CSS Splide — подключить один раз -->
<link rel="stylesheet" href="/node_modules/@splidejs/splide/dist/css/splide-core.min.css">

<section class="gallery" id="gallery">
  <div class="container">
    <div class="splide" id="gallery-splide" aria-label={tr.gallery.title}>
      <div class="splide__track">
        <ul class="splide__list">
          {photos.map(photo => (
            <li class="splide__slide">
              <img src={photo.src} alt={photo.alt?.[lang] || ''} loading="lazy" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
</section>

<script>
import Splide from '@splidejs/splide';
new Splide('#gallery-splide', {
  type:      'loop',
  perPage:   3,
  perMove:   1,
  gap:       '1.5rem',
  autoplay:  true,
  interval:  4500,
  pauseOnHover: true,
  breakpoints: {
    900: { perPage: 2 },
    600: { perPage: 1 },
  }
}).mount();
</script>
```

> Splide CSS можно также импортировать через npm: `import '@splidejs/splide/dist/css/splide-core.min.css'` — но только если Astro поддерживает обработку этого пути. Если не работает — подключить через CDN в BaseLayout.

**CDN альтернатива** (добавить в `<head>` в BaseLayout):
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@splidejs/splide@4/dist/css/splide-core.min.css">
```
И скрипт через CDN вместо npm-импорта:
```html
<script src="https://cdn.jsdelivr.net/npm/@splidejs/splide@4/dist/js/splide.min.js"></script>
```

---

## Конвертация фото в WebP

**Алгоритм:**
1. Положить исходники (jpg/png) в `public/images/originals/`
2. Запустить `npm run webp`
3. WebP появятся в `public/images/`
4. Прописать пути в `content.json`
5. Коммитить WebP, НЕ коммитить originals (тяжёлые)

**Скрипт** (`scripts/to-webp.js`) — уже создан, использует `sharp`.

Целевые параметры: ширина до 1920px (hero), до 1200px (gallery/cards), качество 85, метаданные убрать.

---

## Языки

`ru` (основной), `he` (иврит, RTL), `en`. Все три индексируются. Hreflang проставлен.

- `DEFAULT_LOCALE = 'ru'`
- `FALLBACK_LOCALE = 'en'` (для неизвестных языков и hreflang x-default)
- Иврит: `dir="rtl"`, шрифты David Libre + Assistant, все flex/margin зеркальные через `[dir="rtl"]`
- Редирект с `/` — через JS `location.replace`, `<meta http-equiv="refresh">` только в `<noscript>`

---

## Контентная модель

Всё редактируемое — `src/data/content.json`. Поля `{ ru, he, en }` — мультиязычный текст.

**Ключевые массивы:**

- `services` — услуги (id, name, category, price, duration, description + фото опционально)
- `gallery.photos` — массив `{ src, alt: {ru,he,en} }` для карусели
- `masters` — мастера (name, role, photo, specialties)
- `googleReviews` — `{ url, rating, count }` — ссылка на профиль Google

**Звонки отключены** — только WhatsApp. `contacts.phoneDisplay` пустой. Кнопок `tel:` нет.

**Запись** — модал Booking.astro, формирует готовый текст → открывает `wa.me`. Без бэкенда.

**Отзывы** — карточка-ссылка на Google. Отдельных текстов нет, только `rating` и `count`.

---

## SEO

- JSON-LD тип: `BeautySalon` (не MassageBusiness)
- Адрес, координаты, часы, услуги — из `content.json`
- `areaServed` — из `salon.serviceAreas`
- Hreflang для 3 языков + `x-default`
- Open Graph + Twitter Cards
- Geo-метатеги
- `sitemap.xml` — динамический, из `pages/sitemap.xml.js`
- `robots.txt` — `Sitemap:` указывает на `seo.siteUrl/sitemap.xml`

---

## Структура JSON-LD (для seo.js)

```js
{
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  "name": content.brand.name,
  "url": siteUrl + '/' + lang + '/',
  "telephone": content.contacts.phone || undefined,
  "address": { "@type": "PostalAddress", "streetAddress": ..., "addressLocality": ..., "addressCountry": "IL" },
  "geo": { "@type": "GeoCoordinates", "latitude": ..., "longitude": ... },
  "openingHoursSpecification": [ ... ],
  "areaServed": content.salon.serviceAreas.map(a => ({ "@type": "City", "name": a })),
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": ..., "reviewCount": ... },
  "hasOfferCatalog": { ... услуги ... }
}
```

---

## GitHub + Railway

**GitHub:** `https://github.com/aodess/barbara-shop` (создать вручную, потом `git remote add origin ...`)

**Railway:** новый проект, linked к этому репозиторию. Автодеплой при push в `main`.
Build command: `npm run build`
Output: `dist/`

**Workflow:**
- Вся работа в ветке `main`, прямые коммиты (Евгений не программист, PR не нужны)
- Коммит после каждого рабочего блока
- Push → Railway деплоит автоматически

**Формат коммита:** `тип: краткое описание` (feat, fix, ux, seo, content, perf)

---

## Workflow Claude Code

- **Одна задача = один промпт.** Не дробить.
- **Перед правкой контента** — прочитать `content.json` целиком.
- **При правке компонента** — смотреть его `<style>` блок.
- **Стиль ответов:** коротко, без длинных объяснений. Делать, не объяснять.
- **Коммитить и пушить** после каждого рабочего блока — не ждать ОК на пуш.
- **Для экономии токенов:** не читать node_modules, не читать dist/, не читать `public/images/originals/`.

---

## Чего НЕ делать

- Не предлагать React, Vue, Next.js, бэкенд, БД, CMS
- Не добавлять `tel:` кнопки
- Не использовать `localStorage` / `sessionStorage`
- Не создавать многостраничный сайт без обсуждения
- Не добавлять тяжёлые библиотеки (>50KB gzip) без явного ОК владельца
- Не коммитить файлы из `public/images/originals/` (тяжёлые исходники)
- Не изменять внешний вид без явного ОК, если в задаче только контент

---

## Состояние проекта — чек-лист

> Дата последней правки: заполнить при старте.

### Инфраструктура
- [ ] Репозиторий создан на GitHub
- [ ] Railway проект создан и linked
- [ ] `npm install` выполнен
- [ ] Домен подключён (или временный Railway-домен)

### Разработка
- [ ] BaseLayout.astro — header, footer, структура
- [ ] Hero.astro — большое фото, логотип, tagline, CTA
- [ ] Services.astro — карточки услуг с ценами
- [ ] Gallery.astro — карусель Splide
- [ ] Masters.astro — карточки мастеров
- [ ] Reviews.astro — ссылка на Google
- [ ] Contacts.astro — часы, карта, WhatsApp
- [ ] Booking.astro — модал записи
- [ ] StickyBar.astro — кнопка "Записаться"
- [ ] SeoHead.astro — meta, JSON-LD, hreflang

### Контент (нужно от владельца)
- [ ] Реальный адрес и координаты → `salon.address`, `salon.geo`
- [ ] Список услуг с ценами → `services[]`
- [ ] Фото для галереи → `public/images/`, `gallery.photos[]`
- [ ] Фото мастеров → `masters[].photo`
- [ ] Фото героя → `brand.heroPhotos[]`
- [ ] Логотип → `public/images/logo.svg` или `logo.webp`
- [ ] WhatsApp номер → `contacts.whatsapp`
- [ ] Instagram → `contacts.instagram`
- [ ] Google Maps URL → `salon.googleMapsUrl`
- [ ] Рабочие часы → `hours{}`
- [ ] Google Reviews URL → `googleReviews.url`

### SEO
- [ ] Search Console — подтвердить сайт
- [ ] Sitemap отправлен в Search Console
- [ ] GA4 ID вписан → `seo.ga4Id`
- [ ] OG-картинка (1200×630) → `public/images/og.jpg`

### Точки возврата (git tags)
- (создавать перед крупными изменениями: `git tag backup-YYYY-MM-DD`)
