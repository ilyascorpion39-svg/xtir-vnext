param()

$ErrorActionPreference = "Stop"

$footer = "src/components/common/Footer.tsx"
if (!(Test-Path -LiteralPath $footer)) { throw "Не найден $footer" }

$t = Get-Content -LiteralPath $footer -Raw
$orig = $t

# 1) map((link) => ...) -> map((link, i) => ...)
$t = [regex]::Replace($t, "map\(\(\s*link\s*\)\s*=>", "map((link, i) =>", "IgnoreCase")

# 2) key={link.name} -> key={link?.name ?? i}
$t = [regex]::Replace($t, "key=\{link\.name\}", "key={link?.name ?? i}")

# 3) href={link.href} -> href={link?.href ?? '#'}
$t = [regex]::Replace($t, "href=\{link\.href\}", "href={link?.href ?? '#'}")

# 4) {link.name} -> {link?.name ?? ''}
$t = [regex]::Replace($t, "\{link\.name\}", "{link?.name ?? ''}")

# 5) На всякий случай: оставшиеся link.href/link.name сделать безопасными
$t = [regex]::Replace($t, "\blink\.href\b", "link?.href", "IgnoreCase")
$t = [regex]::Replace($t, "\blink\.name\b", "link?.name", "IgnoreCase")

if ($t -eq $orig) {
  Write-Host "NOTE: patterns not found, Footer not changed." -ForegroundColor Yellow
} else {
  Set-Content -LiteralPath $footer -Value $t -NoNewline -Encoding UTF8
  Write-Host "OK: Footer hardened (optional chaining + key fallback)." -ForegroundColor Green
}

Write-Host "Build..." -ForegroundColor Cyan
npm run build | Out-Host

Write-Host "WOW..." -ForegroundColor Cyan
pwsh scripts/wow.ps1 | Out-Host
