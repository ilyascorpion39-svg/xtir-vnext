param()

$ErrorActionPreference = "Stop"

Write-Host "1) Lint/format (если есть)..." -ForegroundColor Cyan
if (Test-Path package.json) {
  $pkg = Get-Content package.json -Raw
  if ($pkg -match '"format"\s*:') { npm run format }
  elseif ($pkg -match '"prettier"\s*:') { npm run prettier }
}

Write-Host "2) Build..." -ForegroundColor Cyan
npm run build

Write-Host "3) Quick checks..." -ForegroundColor Cyan
git grep -n "<Header|<Footer" src/pages | Out-Host
git grep -n "Скачать" src | Out-Host

Write-Host "OK" -ForegroundColor Green
