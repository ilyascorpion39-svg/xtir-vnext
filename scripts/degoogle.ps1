param()

$ErrorActionPreference = "Stop"

Write-Host "== XTIR: Degoogle ==" -ForegroundColor Cyan

$files = @(git ls-files src | Where-Object { $_ -match "\.(astro|tsx|jsx|ts|js|css)$" })

$changed = 0
foreach ($f in $files) {
  if (!(Test-Path -LiteralPath $f)) { continue }
  $t = Get-Content -LiteralPath $f -Raw
  $o = $t

  # remove gtag script includes
  $t = $t -replace "(?m)^\s*<script[^>]+googletagmanager\.com/gtag/js\?id=[^>]+>\s*</script>\s*\r?\n?", ""
  # remove inline GA placeholder blocks if present (best-effort)
  $t = $t -replace "(?s)<script[^>]*>\s*window\.dataLayer\s*=.*?GA_MEASUREMENT_ID.*?</script>\s*\r?\n?", ""
  $t = $t -replace "(?s)<script[^>]*>.*?GA_MEASUREMENT_ID.*?</script>\s*\r?\n?", ""

  # remove google fonts link tags
  $t = $t -replace "(?m)^\s*<link[^>]+fonts\.googleapis\.com[^>]*>\s*\r?\n?", ""
  $t = $t -replace "(?m)^\s*<link[^>]+fonts\.gstatic\.com[^>]*>\s*\r?\n?", ""

  if ($t -ne $o) {
    Set-Content -LiteralPath $f -Value $t -NoNewline -Encoding UTF8
    $changed++
  }
}

Write-Host "Changed files: $changed" -ForegroundColor Green

Write-Host "Build..." -ForegroundColor Cyan
npm run build | Out-Host
