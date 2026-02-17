# 📖 ИНСТРУКЦИЯ ПО ИСПОЛЬЗОВАНИЮ ПРОЕКТА XTIR

## 🎯 Содержание

1. [Первый запуск](#первый-запуск)
2. [Структура проекта](#структура-проекта)
3. [Работа с компонентами](#работа-с-компонентами)
4. [Добавление контента](#добавление-контента)
5. [Кастомизация дизайна](#кастомизация-дизайна)
6. [FAQ](#faq)

---

## 🚀 Первый запуск

### Шаг 1: Установка

```bash
# Перейти в директорию проекта
cd xtir-website-astro

# Установить все зависимости
npm install
```

### Шаг 2: Настройка окружения

```bash
# Скопировать файл с переменными окружения
cp .env.example .env

# Отредактировать .env (опционально)
nano .env
```

### Шаг 3: Запуск dev-сервера

```bash
# Запустить сервер разработки
npm run dev

# Сайт будет доступен по адресу: http://localhost:4321
```

### Шаг 4: Открыть в браузере

Откройте http://localhost:4321 в вашем браузере.

---

## 📁 Структура проекта

```
xtir-website-astro/
├── src/
│   ├── components/       # React компоненты
│   │   ├── common/       # Общие (Header, Footer)
│   │   ├── sections/     # Секции страниц (Hero, Features)
│   │   ├── ui/           # UI элементы (Button, Card)
│   │   └── 3d/           # 3D компоненты (Three.js)
│   │
│   ├── layouts/          # Layouts страниц
│   │   └── BaseLayout.astro  # Базовый layout
│   │
│   ├── pages/            # Страницы сайта
│   │   ├── index.astro   # Главная страница
│   │   ├── products.astro # Каталог продукции
│   │   ├── about.astro   # О компании
│   │   └── contact.astro # Контакты
│   │
│   ├── styles/           # Глобальные стили
│   │   └── global.css    # Tailwind + кастомные стили
│   │
│   ├── data/             # Данные
│   │   └── products.ts   # Информация о продуктах
│   │
│   └── assets/           # Статичные файлы (в процессе сборки)
│
├── public/               # Публичные файлы (напрямую)
│   ├── images/           # Изображения
│   ├── videos/           # Видео
│   └── fonts/            # Шрифты
│
├── docs/                 # Документация
│   ├── DEPLOYMENT.md     # Инструкции по деплою
│   ├── VIDEO_PRESENTATION_PROMPT.md # Промт для видео
│   └── COMPONENTS.md     # Документация компонентов
│
└── scripts/              # Утилиты и скрипты
```

---

## 🧩 Работа с компонентами

### Создание нового компонента

#### React компонент:

```tsx
// src/components/ui/MyButton.tsx

import { motion } from "framer-motion";

interface MyButtonProps {
  text: string;
  onClick?: () => void;
}

export default function MyButton({ text, onClick }: MyButtonProps) {
  return (
    <motion.button
      className="btn btn-primary"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {text}
    </motion.button>
  );
}
```

#### Использование в Astro:

```astro
---
// src/pages/my-page.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import MyButton from '@/components/ui/MyButton';
---

<BaseLayout title="My Page">
  <MyButton client:load text="Click me!" />
</BaseLayout>
```

**Важно:** Используйте `client:load` для интерактивных React компонентов!

### Директивы client:

- `client:load` - загрузить сразу (приоритет)
- `client:idle` - загрузить когда браузер не занят
- `client:visible` - загрузить когда компонент виден
- `client:only` - рендерить только на клиенте

---

## 📝 Добавление контента

### Добавление нового продукта

1. Откройте `src/data/products.ts`

2. Добавьте новый объект в массив `allProducts`:

```typescript
{
  id: 'new-product',
  name: 'Название продукта',
  category: 'electronic', // или другая категория
  shortDescription: 'Краткое описание',
  description: 'Полное описание продукта...',
  features: [
    'Особенность 1',
    'Особенность 2',
    'Особенность 3',
  ],
  specs: {
    'Размер': '10 x 20 см',
    'Вес': '5 кг',
    'Питание': '220В',
  },
  images: [
    '/images/products/new-product-1.jpg',
    '/images/products/new-product-2.jpg',
  ],
}
```

3. Добавьте изображения в `public/images/products/`

### Создание новой страницы

```astro
---
// src/pages/new-page.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
---

<BaseLayout title="Новая страница" description="Описание новой страницы">
  <Header client:load />

  <main>
    <section class="section">
      <div class="section-container">
        <h1 class="section-title">Заголовок</h1>
        <p>Контент страницы...</p>
      </div>
    </section>
  </main>

  <Footer client:load />
</BaseLayout>
```

Страница будет доступна по адресу `/new-page`

### Добавление изображений

1. Поместите изображение в `public/images/`
2. Используйте в коде:

```astro
<img src="/images/my-image.jpg" alt="Описание" />
```

Или для оптимизации:

```astro
---
import { Image } from 'astro:assets';
import myImage from '@/assets/images/my-image.jpg';
---

<Image src={myImage} alt="Описание" />
```

---

## 🎨 Кастомизация дизайна

### Изменение цветов

Откройте `tailwind.config.mjs`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#00ff41', // Ваш новый цвет
        // ... остальные оттенки
      },
    },
  },
},
```

Или через CSS переменные в `src/styles/global.css`:

```css
:root {
  --primary: #00ff41; /* Ваш цвет */
}
```

### Изменение шрифтов

1. Добавьте шрифт в `public/fonts/`
2. Обновите `tailwind.config.mjs`:

```javascript
fontFamily: {
  sans: ['YourFont', 'system-ui', 'sans-serif'],
},
```

3. Добавьте @font-face в `global.css`:

```css
@font-face {
  font-family: "YourFont";
  src: url("/fonts/your-font.woff2") format("woff2");
  font-weight: normal;
  font-style: normal;
}
```

### Создание новой утилиты Tailwind

В `src/styles/global.css`:

```css
@layer utilities {
  .my-custom-class {
    @apply bg-gradient-to-r from-primary to-secondary;
    /* или обычный CSS */
    background: linear-gradient(90deg, #00ff41, #ff6b35);
  }
}
```

Использование:

```html
<div class="my-custom-class">Контент</div>
```

---

## 🔧 Полезные команды

```bash
# Разработка
npm run dev              # Запустить dev-сервер
npm run build            # Собрать production
npm run preview          # Просмотр production сборки

# Проверка кода
npm run type-check       # Проверить TypeScript
npm run lint             # Проверить ESLint
npm run format           # Форматировать код (Prettier)

# Очистка
rm -rf node_modules      # Удалить зависимости
npm install              # Переустановить
rm -rf .astro dist       # Очистить кэш и сборку
```

---

## 💡 Советы и трюки

### 1. Быстрая навигация (VS Code)

Установите расширение "Astro" для подсветки синтаксиса.

`.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[astro]": {
    "editor.defaultFormatter": "astro-build.astro-vscode"
  }
}
```

### 2. Горячие клавиши

- `Ctrl/Cmd + P` - Быстрый поиск файлов
- `Ctrl/Cmd + Shift + F` - Поиск по всему проекту
- `Ctrl/Cmd + /` - Закомментировать строку

### 3. Дебаг

Добавьте в компонент:

```tsx
console.log("Debug:", someVariable);
```

Или используйте React DevTools в браузере.

### 4. Производительность

```bash
# Анализ bundle size
npm run build
npx vite-bundle-visualizer

# Lighthouse проверка
npx lighthouse http://localhost:4321 --view
```

---

## ❓ FAQ

### Q: Как изменить порт dev-сервера?

A: Добавьте в `package.json`:

```json
"scripts": {
  "dev": "astro dev --port 3000"
}
```

### Q: Ошибка "Module not found"

A: Проверьте пути импорта. Используйте alias:

```tsx
import Component from "@/components/Component"; // ✅
import Component from "../../components/Component"; // ❌ избегайте
```

### Q: Как добавить Google Analytics?

A: В `src/layouts/BaseLayout.astro` перед `</head>`:

```html
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "GA_MEASUREMENT_ID");
</script>
```

### Q: React компонент не обновляется

A: Убедитесь, что используете `client:load` (или другую client: директиву):

```astro
<MyComponent client:load />
```

### Q: Как добавить мета-теги для SEO?

A: В каждой странице:

```astro
---
const title = "Заголовок страницы";
const description = "Описание страницы";
---
<BaseLayout title={title} description={description}>
  <!-- контент -->
</BaseLayout>
```

### Q: Ошибки при сборке production

A: Проверьте:

1. `npm run type-check` - TypeScript ошибки
2. `npm run lint` - ESLint ошибки
3. Очистите кэш: `rm -rf .astro dist && npm run build`

---

## 📚 Дополнительные ресурсы

### Документация:

- [Astro Docs](https://docs.astro.build)
- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Three.js Docs](https://threejs.org/docs/)

### Обучение:

- [Astro Tutorial](https://docs.astro.build/en/tutorial/0-introduction/)
- [Tailwind CSS Course](https://tailwindcss.com/course)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)

### Сообщество:

- [Astro Discord](https://astro.build/chat)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/astro)

---

## 🆘 Получить помощь

**Техническая поддержка:**

- Email: dev@xtir.ru
- Документация: `/docs`
- GitHub Issues: [открыть issue]

**Для заказчика:**

- Email: info@xtir.ru
- Телефон: +7 (915) 425-00-95

---

**Удачной разработки! 🚀**
