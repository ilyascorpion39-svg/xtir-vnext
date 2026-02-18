#requires -Version 7
<#
.SYNOPSIS
    XTIR: WOW Check — проверка качества Astro-проекта (v3.0)

.DESCRIPTION
    Проверяет типичные ошибки и антипаттерны в Astro-проектах:
    • успешная сборка
    • lang="ru" в BaseLayout
    • наличие Header/Footer только в layout
    • запрещённые слова
    • нежелательные внешние ресурсы и трекеры
    • утечки в итоговой сборке (dist/index.html)
#>

[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
$WarningPreference     = "Continue"

Set-StrictMode -Version Latest

# ─── Цветные помощники ───────────────────────────────────────────────────────
function Ok    { param([string]$msg) Write-Host "✅ $msg" -ForegroundColor Green }
function Warn  { param([string]$msg) Write-Host "⚠️  $msg" -ForegroundColor Yellow }
function Bad   { param([string]$msg) Write-Host "❌ $msg" -ForegroundColor Red   }
function Info  { param([string]$msg) Write-Host "• $msg"  -ForegroundColor Cyan  }
function Title { param([string]$msg) Write-Host "`n$msg" -ForegroundColor White -BackgroundColor DarkCyan }

# ─── Поиск по файлам (замена grep) ───────────────────────────────────────────
function Find-InSource {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)] [string] $Pattern,
        [string] $Path = "src",
        [string[]] $Include = @("*.astro", "*.tsx", "*.ts", "*.jsx", "*.js", "*.css", "*.json", "*.md", "*.mdx")
    )

    $found = @()

    Get-ChildItem -Path $Path -Recurse -File -Include $Include -ErrorAction SilentlyContinue |
        ForEach-Object {
            $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue
            if ($content -and $content -match $Pattern) {
                # Находим первую строку с совпадением
                $lines = $content -split '\r?\n'
                for ($i = 0; $i -lt $lines.Count; $i++) {
                    if ($lines[$i] -match $Pattern) {
                        $found += "{0}:{1}: {2}" -f $_.FullName, ($i+1), $lines[$i].Trim()
                        break   # достаточно первой строки с совпадением
                    }
                }
            }
        }

    return $found
}

# ─── Чтение файла если существует ────────────────────────────────────────────
function ReadIfExists([string]$Path) {
    if (Test-Path -LiteralPath $Path) {
        return Get-Content -LiteralPath $Path -Raw -ErrorAction SilentlyContinue
    }
    return $null
}

# ─── Основная логика ─────────────────────────────────────────────────────────
Clear-Host

Title "XTIR: WOW Check  v3.0   (Astro project quality check)"
Write-Host "Текущая папка: $PWD`n" -ForegroundColor DarkGray

# 1. Проверка, что мы в корне проекта
if (!(Test-Path "package.json")) {
    Bad "package.json не найден → запустите скрипт из корня проекта"
    exit 1
}

# 2. Сборка проекта
Info "Запуск сборки (npm run build)..."
$buildOutput = ""
$buildSuccess = $false

try {
    $buildOutput = & npm run build 2>&1
    $buildSuccess = ($LASTEXITCODE -eq 0)
}
catch {
    $buildOutput = $_.Exception.Message
}

if ($buildSuccess) {
    Ok "Сборка прошла успешно"
}
else {
    Bad "Сборка завершилась с ошибкой (код $LASTEXITCODE)"
    Write-Host $buildOutput -ForegroundColor DarkRed
    exit 1
}

# 3. Проверка BaseLayout
$baseLayoutPath = "src/layouts/BaseLayout.astro"

if (!(Test-Path $baseLayoutPath)) {
    Bad "Файл не найден: $baseLayoutPath"
}
else {
    $layout = Get-Content $baseLayoutPath -Raw

    if ($layout -match '(?i)<html\b[^>]*lang\s*=\s*["'']ru["'']') {
        Ok 'BaseLayout → <html lang="ru">'
    }
    else {
        Warn 'BaseLayout → атрибут lang не "ru" или отсутствует'
    }

    if ($layout -match '<Header\b') { Ok "BaseLayout → <Header" } else { Bad "BaseLayout → <Header не найден" }
    if ($layout -match '<Footer\b') { Ok "BaseLayout → <Footer" } else { Bad "BaseLayout → <Footer не найден" }
}

# 4. Header / Footer не должны быть в pages
Info "Проверка дублирования Header/Footer в src/pages..."
$directHF = Find-InSource -Pattern '<Header|<Footer' -Path "src/pages"

if ($directHF.Count -eq 0) {
    Ok "Header и Footer не используются напрямую в страницах"
}
else {
    Warn "Обнаружены прямые упоминания Header/Footer в страницах:"
    $directHF | ForEach-Object { Write-Host "  $_" -ForegroundColor Yellow }
}

# 5. Запрещённые / нежелательные слова
$badWords = @(
    "Скачать", "скачать", "клик", "кликни", "жми", "жмите",
    "тык", "тыкни", "Download", "Click", "кнопк[ауе]"
)

Info "Поиск запрещённых слов..."
$badFindings = @()

foreach ($word in $badWords) {
    $found = Find-InSource -Pattern "\b$word\b" -Include "*.astro","*.md","*.mdx","*.tsx","*.ts","*.jsx","*.js"
    if ($found) { $badFindings += $found }
}

if ($badFindings.Count -eq 0) {
    Ok "Запрещённые слова не найдены"
}
else {
    Bad "Найдены нежелательные слова/фразы:"
    $badFindings | Sort-Object -Unique | ForEach-Object { Write-Host "  $_" }
}

# 6. Проверка внешних доменов и трекеров
Info "Анализ внешних URL..."

$allowed = @("t.me", "vk.com", "rutube.ru", "youtube.com", "youtu.be", "schema.org", "x-tir.ru")
$blocked = @("googletagmanager.com", "google-analytics.com", "mc.yandex.ru", "yandex.", "metrika", "gtag", "facebook.net", "doubleclick.net")

$allUrls = [System.Collections.Generic.HashSet[string]]::new()
$filesWithUrls = Get-ChildItem "src" -Recurse -File -Include *.astro,*.ts,*.tsx,*.js,*.jsx,*.css,*.json,*.md,*.mdx

foreach ($file in $filesWithUrls) {
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    if (!$content) { continue }
    [regex]::Matches($content, 'https?://[^\s"''<>)+]+') |
        ForEach-Object { [void]$allUrls.Add($_.Value) }
}

$trackingUrls = [System.Collections.Generic.List[string]]::new()
$otherUrls    = [System.Collections.Generic.List[string]]::new()

foreach ($url in $allUrls) {
    try {
        $uri = [uri]$url
        $host = $uri.Host.ToLowerInvariant()

        if ([string]::IsNullOrEmpty($host)) { continue }

        $isAllowed = $allowed | Where-Object { $host -like "*$_" } | Select-Object -First 1
        if ($isAllowed) { continue }

        $isTracking = $blocked | Where-Object { $host -like "*$_" } | Select-Object -First 1
        if ($isTracking) {
            [void]$trackingUrls.Add($url)
            continue
        }

        if (!$host.EndsWith("x-tir.ru", [StringComparison]::OrdinalIgnoreCase)) {
            [void]$otherUrls.Add($url)
        }
    }
    catch { }
}

if ($trackingUrls.Count -eq 0) { Ok "Трекеры / аналитика не найдены" }
else {
    Warn "Обнаружены потенциально нежелательные трекеры:"
    $trackingUrls | Sort-Object -Unique | ForEach-Object { "  $_" }
}

if ($otherUrls.Count -eq 0) { Ok "Других подозрительных внешних доменов нет" }
else {
    Warn "Найдены внешние ссылки (кроме разрешённых):"
    $otherUrls | Sort-Object -Unique | ForEach-Object { "  $_" }
}

# 7. Проверка чистоты dist/index.html
Info "Проверка содержимого dist/index.html..."

$indexHtml = ReadIfExists "dist/index.html"

if (!$indexHtml) {
    Warn "dist/index.html не найден → возможно сборка не завершена"
}
else {
    $issues = [System.Collections.Generic.List[string]]::new()

    if ($indexHtml -match 'import\s+.*\s+from\s+["'']')         { $issues.Add("ESM import в HTML") }
    if ($indexHtml -match '\bGA_MEASUREMENT_ID\b')             { $issues.Add("Google Analytics ID") }
    if ($indexHtml -match '(Header|Footer)\s+from')            { $issues.Add("Импорт компонентов в HTML") }
    if ($indexHtml -match '<!--\s*#\s*sourceMappingURL')       { $issues.Add("source map ссылка") }
    if ($indexHtml -match 'yandex_metrika')                    { $issues.Add("Яндекс.Метрика") }

    if ($issues.Count -eq 0) {
        Ok "dist/index.html выглядит чистым"
    }
    else {
        Bad "Обнаружены потенциальные утечки в итоговом HTML:"
        $issues | ForEach-Object { "  • $_" }
    }
}

Title "ПРОВЕРКА ЗАВЕРШЕНА"
Write-Host "Дата проверки: $(Get-Date -Format "dd.MM.yyyy HH:mm")`n" -ForegroundColor DarkGray