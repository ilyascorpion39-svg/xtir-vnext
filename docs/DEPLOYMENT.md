# 🚀 Руководство по развертыванию сайта XTIR

## Подготовка к развертыванию

### 1. Предварительные требования

- Node.js версии 18.x или выше
- npm или yarn
- Git
- Доменное имя xtir.ru

### 2. Установка зависимостей

```bash
# Клонировать репозиторий (если используется Git)
git clone https://github.com/your-org/xtir-website.git
cd xtir-website

# Установить зависимости
npm install

# Создать файл .env из примера
cp .env.example .env

# Отредактировать .env с вашими настройками
nano .env
```

---

## 🌐 Варианты развертывания

### Вариант 1: Vercel (Рекомендуется)

Vercel идеально подходит для Astro и обеспечивает отличную производительность.

#### Через веб-интерфейс:

1. Зарегистрируйтесь на [vercel.com](https://vercel.com)
2. Нажмите "New Project"
3. Импортируйте ваш Git репозиторий
4. Vercel автоматически определит Astro
5. Добавьте environment variables из `.env`
6. Нажмите "Deploy"

#### Через CLI:

```bash
# Установить Vercel CLI
npm install -g vercel

# Залогиниться
vercel login

# Развернуть
vercel

# Для production
vercel --prod
```

#### Настройка домена:

1. В Vercel Dashboard → Settings → Domains
2. Добавить `xtir.ru`
3. Настроить DNS записи у регистратора домена:
   ```
   A     @     76.76.21.21
   CNAME www   cname.vercel-dns.com
   ```

---

### Вариант 2: Netlify

#### Через веб-интерфейс:

1. Зарегистрируйтесь на [netlify.com](https://netlify.com)
2. "New site from Git"
3. Выберите репозиторий
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Deploy

#### Через CLI:

```bash
# Установить Netlify CLI
npm install -g netlify-cli

# Залогиниться
netlify login

# Инициализировать
netlify init

# Развернуть
netlify deploy

# Production deployment
netlify deploy --prod
```

#### netlify.toml (опционально):

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

---

### Вариант 3: Традиционный хостинг (VPS/shared)

#### Шаги:

```bash
# 1. Собрать проект локально
npm run build

# 2. Результат в папке dist/
# 3. Загрузить содержимое dist/ на сервер через FTP/SFTP
# Или использовать rsync:
rsync -avz dist/ user@your-server.com:/var/www/xtir.ru/
```

#### Настройка Nginx:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name xtir.ru www.xtir.ru;

    root /var/www/xtir.ru;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Кэширование статических файлов
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip сжатие
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}

# SSL (после получения сертификата Let's Encrypt)
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name xtir.ru www.xtir.ru;

    ssl_certificate /etc/letsencrypt/live/xtir.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/xtir.ru/privkey.pem;

    root /var/www/xtir.ru;
    index index.html;

    # ... остальные настройки как выше
}

# Редирект с HTTP на HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name xtir.ru www.xtir.ru;
    return 301 https://$server_name$request_uri;
}
```

#### Получение SSL сертификата:

```bash
# Установить certbot
sudo apt install certbot python3-certbot-nginx

# Получить сертификат
sudo certbot --nginx -d xtir.ru -d www.xtir.ru

# Автообновление
sudo certbot renew --dry-run
```

---

### Вариант 4: Docker

#### Dockerfile:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### docker-compose.yml:

```yaml
version: "3.8"

services:
  xtir-website:
    build: .
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./dist:/usr/share/nginx/html:ro
    restart: unless-stopped
```

#### Команды:

```bash
# Собрать образ
docker build -t xtir-website .

# Запустить контейнер
docker run -d -p 80:80 --name xtir xtir-website

# Или через docker-compose
docker-compose up -d
```

---

## 🔧 Post-Deployment задачи

### 1. Проверка работоспособности

```bash
# Проверить доступность
curl -I https://xtir.ru

# Проверить SSL
openssl s_client -connect xtir.ru:443 -servername xtir.ru

# Lighthouse аудит
npx lighthouse https://xtir.ru --view
```

### 2. Настройка мониторинга

#### UptimeRobot (бесплатный):

1. Зарегистрироваться на [uptimerobot.com](https://uptimerobot.com)
2. Добавить мониторинг для `https://xtir.ru`
3. Настроить уведомления на email

#### Google Analytics:

1. Создать property для xtir.ru
2. Получить ID (G-XXXXXXXXXX)
3. Добавить в `.env`: `PUBLIC_GA_ID=G-XXXXXXXXXX`
4. Обновить код в `BaseLayout.astro`

#### Яндекс.Метрика:

1. Создать счетчик на [metrika.yandex.ru](https://metrika.yandex.ru)
2. Получить ID
3. Добавить в `.env`: `PUBLIC_YM_ID=XXXXXXXX`
4. Добавить код в `BaseLayout.astro`

### 3. Настройка резервного копирования

```bash
# Скрипт для backup (cron job)
#!/bin/bash
DATE=$(date +%Y%m%d)
BACKUP_DIR="/backups/xtir"

# Backup files
tar -czf $BACKUP_DIR/xtir-$DATE.tar.gz /var/www/xtir.ru

# Удалить старые бэкапы (старше 30 дней)
find $BACKUP_DIR -name "xtir-*.tar.gz" -mtime +30 -delete
```

Добавить в crontab:

```bash
0 2 * * * /path/to/backup-script.sh
```

### 4. CDN (опционально)

#### Cloudflare:

1. Зарегистрироваться на [cloudflare.com](https://cloudflare.com)
2. Добавить сайт xtir.ru
3. Обновить nameservers у регистратора
4. Включить кэширование и SSL

---

## 📊 Мониторинг производительности

### Инструменты:

1. **Google PageSpeed Insights**
   - URL: https://pagespeed.web.dev/
   - Цель: Score > 90

2. **GTmetrix**
   - URL: https://gtmetrix.com/
   - Цель: Grade A

3. **WebPageTest**
   - URL: https://www.webpagetest.org/
   - Проверка из разных локаций

### Оптимизация:

```bash
# Минификация
npm run build

# Анализ bundle
npm install -g source-map-explorer
source-map-explorer dist/**/*.js

# Image optimization
npm install -g imagemin-cli
imagemin public/images/* --out-dir=public/images
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions (.github/workflows/deploy.yml):

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          PUBLIC_SITE_URL: ${{ secrets.SITE_URL }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: "--prod"
```

---

## 🆘 Troubleshooting

### Проблема: 404 на всех страницах кроме главной

**Решение:** Настроить rewrites для SPA

Nginx:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

Vercel (vercel.json):

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

### Проблема: Медленная загрузка

**Решение:**

1. Включить gzip/brotli сжатие
2. Оптимизировать изображения
3. Использовать CDN
4. Включить кэширование

### Проблема: Errors в консоли

**Решение:**

```bash
# Проверить логи
npm run build

# Проверить type errors
npm run type-check

# Проверить lint errors
npm run lint
```

---

## 📞 Поддержка

По вопросам развертывания:

- Email: dev@xtir.ru
- Документация: /docs
- Issues: GitHub Issues

---

**Успешного развертывания! 🚀**
