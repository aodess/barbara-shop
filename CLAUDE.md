# CLAUDE.md — Barbara Shop

> Читай этот файл первым. Работай блоками с коммитами. Не объясняй — делай.

---

## ЗАПУСК И ДЕПЛОЙ

```
npm run dev       # http://localhost:4321
npm run build     # проверить сборку перед деплоем
railway up        # деплой на прод (НЕ git push)
```

**URL:** `https://barbara-shop-production.up.railway.app`  
**Деплой только через `railway up`.** Push в git = просто история.

---

## ПРОЕКТ

**Barbara Shop** — сайт-визитка салона красоты, Петах-Тиква, Израиль.  
Три языка: `ru` (основной), `he` (иврит, RTL), `en`.  
Без бэкенда. Весь контент — `src/data/content.json`.  
Связь с клиентами — только WhatsApp. Кнопок `tel:` нет.  
Владелец (Евгений) — не программист. Просит правки в чате.

---

## СТЕК

| | |
|---|---|
| Генератор | Astro 4, static output |
| Стили | Чистый CSS, переменные. Никакого Tailwind |
| Карусели | Splide.js через CDN (глобальный `window.Splide`), `is:inline` скрипты |
| Анимации | GSAP 3 через npm, `ScrollTrigger` |
| Фото | WebP — `npm run webp` (sharp), исходники в `originals/`, коммитить только WebP |
| Данные | `src/data/content.json` |
| Деплой | Railway |

**Никогда:** React, Vue, Tailwind, бэкенд, БД, localStorage.

---

## АРХИТЕКТУРА

```
src/
  data/content.json        ← весь контент: услуги, галерея, мастера, тексты
  lib/
    i18n.js                ← t(), pick(), isRTL(), LOCALES
    businessHours.js       ← статус открыто/закрыто (Asia/Jerusalem)
    seo.js                 ← JSON-LD BeautySalon
  styles/global.css        ← переменные, типографика, header, footer, splide
  components/
    SeoHead.astro          ← <head>: meta, OG, JSON-LD, hreflang
    Hero.astro             ← лого-кружок, название, фото салона, статы
    Services.astro         ← карусель карточек с ценами (hairServices)
    Gallery.astro          ← карусель фото работ + лайтбокс
    Masters.astro          ← карточки мастеров
    NailsSkin.astro        ← маникюр + косметология
    Contacts.astro         ← часы, адрес, карта, WhatsApp
    StickyBar.astro        ← нижняя панель: Записаться + WhatsApp
  layouts/BaseLayout.astro ← шапка, футер, меню, граффити-фон, GSAP
  pages/
    index.astro            ← редирект на язык
    [lang]/index.astro     ← одна страница × 3 языка
public/images/
  *.webp                   ← коммитить
  originals/               ← НЕ коммитить
  shapka.webp              ← фото в шапке сайта
  salon.webp               ← фото в Hero
  1.webp – 7.webp          ← галерея работ
  logo.jpg                 ← лого кружок
```

---

## ДИЗАЙН-СИСТЕМА

**Эстетика:** тёмный люкс, barbie-pink неон. Фон почти чёрный. Акценты — горячий розовый (`#FF1493`, `#FF85C2`) + золото (`#F0D898`). Повсюду плавающие сердечки ♥.

### Актуальные CSS-переменные (global.css)

```css
--paper:          #080810;
--surface:        #0F0F1A;
--surface-raised: #161622;

--rose-bright: #FF85C2;
--rose:        #E8709E;
--rose-deep:   #C04880;
--rose-glow:   rgba(255,133,194,0.25);

--gold:        #F0D898;
--gold-deep:   #C89040;

--ink:      #FFF0F8;
--ink-soft: #D8C8D8;
--ink-mute: #806878;

--font-script:  'Great Vibes', cursive;       ← название "Barbara Shop"
--font-display: 'Cormorant Garamond', serif;  ← заголовки
--font-body:    'Jost', sans-serif;           ← текст

--r-lg: 28px;  --r-xl: 50px;  --max-w: 1160px;
```

**[lang="he"] переопределяет только:**
```css
--font-body:    'Assistant', sans-serif;
--font-display: 'Frank Ruhl Libre', serif;
```
**НЕ трогает `--font-script`** — иначе Great Vibes сломается на иврите.

### Шрифты Google Fonts

```
Great Vibes — для brand-name
Cormorant Garamond — заголовки
Jost — основной текст
Frank Ruhl Libre + Assistant — иврит
```

---

## ШАПКА (BaseLayout.astro)

Текущая структура:
```
<header.site-header>  ← sticky, с фото shapka.webp за стеклом
  .header-shapka-bg   ← абсолютное фото, opacity 0.18–0.32
  .header-top         ← лого + языки + Instagram + бургер
</header>
<nav.nav-dropdown>    ← выезжает справа по кнопке ☰
```

**Языки (RU/HE/EN)** — в `.header-langs-inline` внутри `.header-top`.  
Кнопки "Записаться" в шапке нет — только в StickyBar снизу.

**Мобильная шапка** — растягивается вниз до кружка-логотипа Hero:
```css
/* global.css */
@media (max-width: 820px) {
  .site-header:not(.scrolled) { padding-block-end: 160px; border-bottom: none; }
  .site-header.scrolled       { padding-block-end: 4px; }
}
```
При скролле шапка сжимается (CSS transition на padding).  
`.scrolled` класс добавляется через JS при `window.scrollY > 50`.

---

## SPLIDE — ВАЖНЫЕ ПРАВИЛА

Splide подключён через CDN в `<head>`, скрипты с `is:inline`.

**НЕЛЬЗЯ добавлять `direction: isRTL ? 'rtl' : 'ltr'`** в конфиг Splide —  
это ломает мобильную вёрстку на иврите (карточки съезжают за экран).  
RTL-поведение достигается только через CSS `[dir="rtl"]` в `global.css`.

**RTL стрелки** — зеркалить через `global.css` (не через Astro scoped CSS):
```css
/* Scoped CSS Astro не достигает [dir="rtl"] на <html> — только global.css */
[dir="rtl"] .hair-arrow svg,
[dir="rtl"] .m-arrow svg { transform: scaleX(-1) !important; }
```

---

## GSAP

Подключён через npm. Анимирует `.section-head` при скролле.  
**НЕ анимировать карточки** (`.price-card`, `.master-card`, `.ns-item`) через `fromTo({ opacity:0 })` —  
вызывает мигание на странице (карточки рендерятся невидимыми).

---

## ИЗВЕСТНЫЕ ПРОБЛЕМЫ И РЕШЕНИЯ

### Иврит (RTL)

| Проблема | Решение |
|---|---|
| Шрифт Great Vibes не работает на иврите | `[lang="he"]` НЕ должен переопределять `--font-script` |
| Стрелки карусели смотрят внутрь на иврите | `[dir="rtl"] .arrow svg { transform: scaleX(-1) }` в `global.css` |
| Splide-карточки съезжают на мобиле | Убрать `direction: isRTL ? 'rtl' : 'ltr'` из всех Splide конфигов |
| Scoped CSS Astro не достигает `[dir="rtl"]` | Писать RTL-фиксы только в `global.css` |

### Шапка

| Проблема | Решение |
|---|---|
| Название "Barbara Shop" обрезается (B, S) | `line-height: 1.3; padding-block: 6px; overflow: visible` на `.brand-name` |
| Попытки вставить фото в шапку через прозрачный header | Отклонено. Используем `header-shapka-bg` — абсолютное фото внутри sticky шапки |

### Фото

| Проблема | Решение |
|---|---|
| `npm run webp` падает с ошибкой icc | Убрать `.withMetadata({ icc: {} })` из `scripts/to-webp.js` |
| Gallery не показывалась | Компонент не был подключён в `[lang]/index.astro` |

---

## КОНТЕНТ (content.json) — ЧТО УЖЕ ЕСТЬ

- `brand.logo` → `/images/logo.jpg` ✓
- `gallery.photos` → `1.webp` – `7.webp` ✓  
- `salon` фото → `/images/salon.webp` в Hero ✓
- `shapka.webp` → в шапке ✓
- `masters[0].experienceYears` → `20` ✓
- `googleReviews.url` → реальная ссылка ✓
- `contacts.whatsapp` → placeholder, нужен реальный номер ✗
- Реальный адрес и координаты → нужны ✗
- Фото мастеров → нужны ✗

---

## ЧТО ОСТАЛОСЬ СДЕЛАТЬ

- [ ] Реальный WhatsApp номер в `contacts.whatsapp`
- [ ] Реальный адрес салона в `salon.address`
- [ ] Фото мастеров (сейчас SVG-иконки как плейсхолдер)
- [ ] OG-картинка `public/images/og.jpg` (1200×630) для соцсетей
- [ ] GA4 ID → `seo.ga4Id` в content.json
- [ ] Search Console — подтвердить сайт, отправить sitemap

---

## GIT ТЕГИ (точки отката)

```
backup-pre-header-2025-05-14   ← состояние перед правкой шапки (май 2025)
ad09940                        ← первое добавление фотографий
```

Создавать перед крупными правками: `git tag backup-YYYY-MM-DD`

---

## ФОРМАТ КОММИТОВ

`feat:` `fix:` `ux:` `content:` `seo:` `perf:`
