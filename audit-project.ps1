# XTIR Website Audit Script - Исправленная версия
param()

$ErrorActionPreference = "Continue"
Write-Host "🔍 XTIR Website Project Audit" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""

# 1. Базовая информация о проекте
Write-Host "📁 PROJECT INFO" -ForegroundColor Yellow
Write-Host "===============" -ForegroundColor Yellow
try {
    $pkg = Get-Content package.json -ErrorAction Stop | ConvertFrom-Json
    Write-Host "  Name: $($pkg.name)"
    Write-Host "  Version: $($pkg.version)"
    Write-Host "  Description: $($pkg.description)"
    Write-Host ""
} catch {
    Write-Host "  ❌ Не удалось прочитать package.json" -ForegroundColor Red
}

# 2. Структура проекта
Write-Host "📂 PROJECT STRUCTURE ANALYSIS" -ForegroundColor Yellow
Write-Host "============================" -ForegroundColor Yellow

# Подсчет файлов по типам
$astroFiles = @(Get-ChildItem -Recurse -File src -Filter "*.astro" -ErrorAction SilentlyContinue).Count
$tsxFiles = @(Get-ChildItem -Recurse -File src -Filter "*.tsx" -ErrorAction SilentlyContinue).Count
$tsFiles = @(Get-ChildItem -Recurse -File src -Filter "*.ts" -ErrorAction SilentlyContinue).Count
$cssFiles = @(Get-ChildItem -Recurse -File src -Filter "*.css" -ErrorAction SilentlyContinue).Count
$jsonFiles = @(Get-ChildItem -Recurse -File src -Filter "*.json" -ErrorAction SilentlyContinue).Count

Write-Host "  Astro files: $astroFiles"
Write-Host "  TSX files: $tsxFiles"
Write-Host "  TS files: $tsFiles"
Write-Host "  CSS files: $cssFiles"
Write-Host "  JSON files: $jsonFiles"
Write-Host ""

# 3. Проверка важных файлов
Write-Host "📋 REQUIRED FILES CHECK" -ForegroundColor Yellow
Write-Host "=======================" -ForegroundColor Yellow

$requiredFiles = @(
    "src/env.d.ts",
    "astro.config.mjs",
    "tailwind.config.mjs",
    "tsconfig.json",
    "package.json"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file" -ForegroundColor Red
    }
}
Write-Host ""

# 4. Анализ страниц
Write-Host "📄 PAGES ANALYSIS" -ForegroundColor Yellow
Write-Host "=================" -ForegroundColor Yellow

$pages = Get-ChildItem -Path "src/pages" -Recurse -File -Filter "*.astro" -ErrorAction SilentlyContinue
Write-Host "  Total pages: $($pages.Count)"

# Проверка на дубликаты маршрутов
$routePatterns = @()
$duplicates = @()
foreach ($page in $pages) {
    $route = $page.FullName.Replace((Get-Location).Path + "\src\pages\", "").Replace("\", "/").Replace(".astro", "")
    if ($routePatterns -contains $route) {
        $duplicates += $route
    }
    $routePatterns += $route
}

if ($duplicates.Count -gt 0) {
    Write-Host "  ⚠️  Duplicate routes found:" -ForegroundColor Yellow
    $duplicates | ForEach-Object { Write-Host "    - $_" -ForegroundColor Yellow }
} else {
    Write-Host "  ✅ No duplicate routes" -ForegroundColor Green
}
Write-Host ""

# 5. Проверка компонентов
Write-Host "🧩 COMPONENTS ANALYSIS" -ForegroundColor Yellow
Write-Host "======================" -ForegroundColor Yellow

if (Test-Path "src/components") {
    $componentDirs = Get-ChildItem -Path "src/components" -Directory
    Write-Host "  Component directories: $($componentDirs.Count)"
    foreach ($dir in $componentDirs) {
        $compFiles = @(Get-ChildItem -Path $dir.FullName -Filter "*.tsx" -ErrorAction SilentlyContinue).Count
        Write-Host "    $($dir.Name): $compFiles components"
    }
} else {
    Write-Host "  ❌ Components directory not found" -ForegroundColor Red
}
Write-Host ""

# 6. Проверка зависимостей
Write-Host "📦 DEPENDENCIES ANALYSIS" -ForegroundColor Yellow
Write-Host "========================" -ForegroundColor Yellow

try {
    $pkg = Get-Content package.json -ErrorAction Stop | ConvertFrom-Json
    
    # Получаем количество зависимостей безопасно
    $depsCount = 0
    $devDepsCount = 0
    
    if ($pkg.PSObject.Properties.Name -contains "dependencies") {
        $depsCount = ($pkg.dependencies | Get-Member -MemberType NoteProperty).Count
    }
    
    if ($pkg.PSObject.Properties.Name -contains "devDependencies") {
        $devDepsCount = ($pkg.devDependencies | Get-Member -MemberType NoteProperty).Count
    }
    
    Write-Host "  Dependencies: $depsCount"
    Write-Host "  Dev Dependencies: $devDepsCount"
    
} catch {
    Write-Host "  ⚠️  Failed to analyze dependencies: $($_.Exception.Message)" -ForegroundColor Yellow
}
Write-Host ""

# 7. Проверка конфигурации Astro
Write-Host "🚀 ASTRO CONFIG ANALYSIS" -ForegroundColor Yellow
Write-Host "========================" -ForegroundColor Yellow

if (Test-Path "astro.config.mjs") {
    $configContent = Get-Content "astro.config.mjs" -Raw -ErrorAction SilentlyContinue
    
    # Проверка на site и base
    if ($configContent -match "site:") {
        Write-Host "  ✅ Site configuration found" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Site configuration missing" -ForegroundColor Yellow
    }
    
    if ($configContent -match "base:") {
        Write-Host "  ✅ Base configuration found" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Base configuration missing" -ForegroundColor Yellow
    }
    
    # Проверка интеграций
    if ($configContent -match "integrations:") {
        Write-Host "  ✅ Integrations configured" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  No integrations found" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ❌ astro.config.mjs not found" -ForegroundColor Red
}
Write-Host ""

# 8. Проверка Tailwind конфигурации
Write-Host "🎨 TAILWIND CONFIG ANALYSIS" -ForegroundColor Yellow
Write-Host "===========================" -ForegroundColor Yellow

if (Test-Path "tailwind.config.mjs") {
    $tailwindContent = Get-Content "tailwind.config.mjs" -Raw -ErrorAction SilentlyContinue
    
    # Проверка на плагины
    if ($tailwindContent -match "@tailwindcss/typography") {
        Write-Host "  ✅ Typography plugin found" -ForegroundColor Green
    }
    
    # Проверка content paths
    if ($tailwindContent -match "content:") {
        Write-Host "  ✅ Content paths configured" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Content paths may be misconfigured" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ❌ tailwind.config.mjs not found" -ForegroundColor Red
}
Write-Host ""

# 9. Проверка скриптов сборки
Write-Host "⚙️  BUILD SCRIPTS ANALYSIS" -ForegroundColor Yellow
Write-Host "=========================" -ForegroundColor Yellow

try {
    $pkg = Get-Content package.json -ErrorAction Stop | ConvertFrom-Json
    
    $essentialScripts = @("dev", "build", "preview")
    foreach ($script in $essentialScripts) {
        if ($pkg.scripts.PSObject.Properties.Name -contains $script) {
            Write-Host "  ✅ $script script found" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  $script script missing" -ForegroundColor Yellow
        }
    }
    
    # Проверка custom scripts
    $customScripts = @("archive:build", "format", "lint", "type-check", "clean:vite")
    foreach ($script in $customScripts) {
        if ($pkg.scripts.PSObject.Properties.Name -contains $script) {
            Write-Host "  ✅ $script script found" -ForegroundColor Green
        }
    }
} catch {
    Write-Host "  ❌ Failed to analyze build scripts: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 10. Рекомендации по улучшению
Write-Host "💡 IMPROVEMENT RECOMMENDATIONS" -ForegroundColor Yellow
Write-Host "==============================" -ForegroundColor Yellow

$recommendations = @(
    "1. Добавьте .editorconfig для единообразия кода",
    "2. Создайте README.md с документацией проекта",
    "3. Добавьте .gitignore с нужными исключениями",
    "4. Рассмотрите использование Prettier для форматирования",
    "5. Добавьте тесты для критических компонентов",
    "6. Оптимизируйте изображения для лучшей производительности",
    "7. Добавьте robots.txt и sitemap.xml для SEO",
    "8. Рассмотрите использование image optimization через Astro",
    "9. Добавьте favicon.ico и метатеги для социальных сетей",
    "10. Проверьте сайт на мобильных устройствах"
)

$recommendations | ForEach-Object { Write-Host "  $_" -ForegroundColor Cyan }
Write-Host ""

# 11. Проверка на потенциальные ошибки (исправлено)
Write-Host "🚨 POTENTIAL ISSUES" -ForegroundColor Yellow
Write-Host "===================" -ForegroundColor Yellow

# Проверка на неиспользуемые файлы (безопасно)
try {
    $unusedFiles = Get-ChildItem -Recurse -File src -ErrorAction SilentlyContinue | Where-Object {
        $_.Extension -match '\.(js|jsx|ts|tsx|astro)$' -and 
        $_.Name -notmatch '^\.' -and
        $_.Length -eq 0
    }
    
    if ($unusedFiles -and $unusedFiles.Count -gt 0) {
        Write-Host "  ⚠️  Empty files found:" -ForegroundColor Yellow
        $unusedFiles | ForEach-Object { Write-Host "    - $($_.FullName)" -ForegroundColor Yellow }
    }
} catch {
    Write-Host "  ℹ️  Could not check for empty files" -ForegroundColor Gray
}

# Проверка на большие файлы (>100KB) (безопасно)
try {
    $largeFiles = Get-ChildItem -Recurse -File src -ErrorAction SilentlyContinue | Where-Object {
        $_.Length -gt 100KB
    }
    
    if ($largeFiles -and $largeFiles.Count -gt 0) {
        Write-Host "  ⚠️  Large files (>100KB) found:" -ForegroundColor Yellow
        $largeFiles | ForEach-Object { 
            $size = [math]::Round($_.Length / 1KB, 2)
            Write-Host "    - $($_.Name) ($size KB)" -ForegroundColor Yellow 
        }
    }
} catch {
    Write-Host "  ℹ️  Could not check for large files" -ForegroundColor Gray
}

Write-Host ""
Write-Host "✅ Audit completed successfully!" -ForegroundColor Green
