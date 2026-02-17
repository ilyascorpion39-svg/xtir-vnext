param()

$ErrorActionPreference = "Stop"

$footer = "src/components/common/Footer.tsx"
if (!(Test-Path -LiteralPath $footer)) { throw "Не найден $footer" }

$t = Get-Content -LiteralPath $footer -Raw
$orig = $t

# Убираем ссылки/тексты про новости, rss, карту сайта (best-effort)
$t = $t -replace "(?is)\{[^{}]*news[^{}]*\}", ""
$t = $t -replace "(?im)^\s*.*\/news.*\r?\n", ""
$t = $t -replace "(?im)^\s*.*Новости.*\r?\n", ""
$t = $t -replace "(?im)^\s*.*RSS.*\r?\n", ""
$t = $t -replace "(?im)^\s*.*Карта сайта.*\r?\n", ""

if ($t -ne $orig) {
  Set-Content -LiteralPath $footer -Value $t -NoNewline -Encoding UTF8
  Write-Host "OK: footer cleaned (no news/rss/sitemap)" -ForegroundColor Green
} else {
  Write-Host "NOTE: patterns not found, no changes" -ForegroundColor Yellow
}

npm run build | Out-Host
pwsh scripts/wow.ps1 | Out-Host
