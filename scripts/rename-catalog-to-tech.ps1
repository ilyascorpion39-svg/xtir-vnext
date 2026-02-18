param()
$ErrorActionPreference="Stop"

$header = "src/components/common/Header.tsx"
if (!(Test-Path -LiteralPath $header)) { throw "Не найден $header" }

$t = Get-Content -LiteralPath $header -Raw
$orig = $t

# 1) Меняем label/name: "Каталог" -> "Технологии"
$t = $t -replace "(['""])(Каталог)\1", "`$1Технологии`$1"

# 2) Если пункт вел на /products, переведём на /technologies (логично под названием)
# Варианты: href: '/products' или href="/products"
$t = $t -replace "href:\s*['""]\/products\/?['""]", "href: '/technologies'"
$t = $t -replace "href=\{?['""]\/products\/?['""]\}?", "href={withBase('/technologies')}"  # если у вас уже есть withBase

if ($t -eq $orig) {
  Write-Host "NOTE: patterns not changed (maybe already renamed or different structure)." -ForegroundColor Yellow
} else {
  Set-Content -LiteralPath $header -Value $t -NoNewline -Encoding UTF8
  Write-Host "OK: Header renamed 'Каталог' -> 'Технологии' (and href adjusted if found)." -ForegroundColor Green
}

npm run build | Out-Host
pwsh scripts/wow.ps1 | Out-Host
