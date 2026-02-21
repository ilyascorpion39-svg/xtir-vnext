# XTIR — Сайт компании

Официальный сайт XTIR — производителя электронно-механического оборудования для стрельбы.

## Технологии

- **Astro 5** — статическая генерация
- **React 19** — интерактивные компоненты
- **TypeScript** — типизация
- **Tailwind CSS** — стили
- **Framer Motion** — анимации

## Запуск

```bash
npm install
npm run dev        # локальный сервер http://localhost:4321
npm run build      # сборка в /dist
npm run preview    # превью сборки
npm run verify:premium # type-check + обе сборки + smoke e2e
npm run visual:baseline # скриншот-бейзлайн ключевых страниц
```

## Структура

```
src/
├── components/
│   ├── common/     # Header, Footer
│   └── sections/   # ProductCard, ProductCatalog и др.
├── data/
│   ├── products.ts # каталог продуктов (30 позиций)
│   └── partners.ts # данные партнёров
├── layouts/        # BaseLayout
├── pages/          # страницы сайта
└── styles/         # global.css, xtir-tokens.css
public/
└── xtir-archive/   # фото, PDF, материалы партнёров
scripts/
└── import-products.ps1  # импорт продуктов из архива
```

## Страницы

| URL | Описание |
|-----|----------|
| `/` | Главная |
| `/products` | Каталог (30 позиций) |
| `/products/[slug]` | Страница продукта |
| `/docs` | Библиотека документов |
| `/gallery` | Наше фото |
| `/partners/reb-zont` | Партнёр РЭБ ЗОНТ |
| `/about` | О компании |
| `/contact` | Контакты |

## Деплой

GitHub Actions → GitHub Pages автоматически при push в `main`.

Продакшн: **https://x-tir.ru**

## Контакты

- Email: info@xtir.ru
- Тел: +7 (915) 425-00-95
