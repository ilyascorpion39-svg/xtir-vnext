param()

$ErrorActionPreference = "Stop"

Write-Host "== XTIR Release Prep ==" -ForegroundColor Cyan

Write-Host "1) Repair shell..." -ForegroundColor Cyan
pwsh scripts/repair-shell.ps1 | Out-Host

Write-Host "2) WOW check..." -ForegroundColor Cyan
pwsh scripts/wow.ps1 | Out-Host

Write-Host "3) Build (again)..." -ForegroundColor Cyan
npm run build | Out-Host

if (!(Test-Path -LiteralPath "dist")) { throw "dist не создан" }
if (!(Test-Path -LiteralPath "dist/index.html")) { throw "dist/index.html не найден" }

Write-Host ""
Write-Host "OK: dist готов к загрузке на хостинг." -ForegroundColor Green
Write-Host "Path: $(Resolve-Path dist)" -ForegroundColor DarkGray
