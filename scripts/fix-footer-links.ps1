param()

$ErrorActionPreference = "Stop"

$footer = "src/components/common/Footer.tsx"
if (!(Test-Path -LiteralPath $footer)) { throw "Не найден $footer" }

$t = Get-Content -LiteralPath $footer -Raw
$orig = $t

# 1) Самый надёжный фикс: где бы ни был map по link, добавляем безопасный фильтр
# Превращаем:
#   links.map((link) => (
# в:
#   links.filter(Boolean).map((link) => (
$t = [regex]::Replace(
  $t,
  "(?m)(\b[a-zA-Z0-9_]+\b)\.map\(\(\s*link\s*\)\s*=>",
  '$1.filter(Boolean).map((link) =>'
)

# 2) Если у тебя именование не link, но ошибка именно link — достаточно пункта (1).
# На всякий случай добиваем вариант с явным массивом:
$t = $t -replace "(?m)\blinks\.map\(\(", "links.filter(Boolean).map(("

if ($t -eq $orig) {
  Write-Host "NOTE: patterns not found, Footer not changed (maybe already fixed)." -ForegroundColor Yellow
} else {
  Set-Content -LiteralPath $footer -Value $t -NoNewline -Encoding UTF8
  Write-Host "OK: Footer links hardened (filter(Boolean) before map)." -ForegroundColor Green
}

Write-Host "Build..." -ForegroundColor Cyan
npm run build | Out-Host

Write-Host "WOW..." -ForegroundColor Cyan
pwsh scripts/wow.ps1 | Out-Host
