param(
  [switch]$Push
)

$ErrorActionPreference = "Stop"

Write-Host "== XTIR: Deploy to GitHub Pages (docs/) ==" -ForegroundColor Cyan

# 1) Safety checks
if (!(Test-Path "package.json")) { throw "Запусти из корня проекта" }
if (!(Test-Path "docs")) { New-Item -ItemType Directory -Force docs | Out-Null }

# 2) Build + WOW
pwsh scripts/wow.ps1 | Out-Host

Write-Host "Build (final)..." -ForegroundColor Cyan
npm run build | Out-Host

if (!(Test-Path "dist/index.html")) { throw "dist/index.html не найден, сборка не создала dist" }

# 3) Replace docs/ with dist/
Write-Host "Sync dist -> docs ..." -ForegroundColor Cyan

# Clean docs (but keep the folder)
Get-ChildItem -Force docs | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue

# Copy dist content into docs
Copy-Item -Path "dist\*" -Destination "docs\" -Recurse -Force

# Ensure GH Pages does not run Jekyll
Set-Content -LiteralPath "docs\.nojekyll" -Value "" -Encoding ASCII

# 4) Quick leak check on docs/index.html
$h = Get-Content -LiteralPath "docs/index.html" -Raw
if ($h -match "(?i)\bimport\s+\w+\s+from\s+['""]") { throw "Leak detected in docs/index.html after deploy sync" }
if ($h -match "(?i)\bGA_MEASUREMENT_ID\b") { throw "GA_MEASUREMENT_ID placeholder found in docs/index.html" }

Write-Host "OK: docs ready." -ForegroundColor Green

# 5) Commit
git add -A
$ts = Get-Date -Format "yyyy-MM-dd HH:mm"
git commit -m "deploy(pages): update docs from dist ($ts)" | Out-Host

if ($Push) {
  Write-Host "Pushing to origin/main ..." -ForegroundColor Cyan
  git push origin main | Out-Host
  Write-Host "OK: pushed. GitHub Pages will update after workflow finishes." -ForegroundColor Green
} else {
  Write-Host "NOTE: run: git push origin main" -ForegroundColor Yellow
}
