param()
$ErrorActionPreference="Stop"

Write-Host "== XTIR: replace xtir.ru -> x-tir.ru ==" -ForegroundColor Cyan

$paths = @("src","public","scripts")
foreach ($p in $paths) {
  if (!(Test-Path -LiteralPath $p)) { continue }
  $files = Get-ChildItem -LiteralPath $p -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { $_.Extension -match "\.(ts|tsx|astro|js|mjs|json|css|md)$" }

  foreach ($f in $files) {
    $t = Get-Content -LiteralPath $f.FullName -Raw
    $orig = $t
    $t = $t -replace "http:\/\/xtir\.ru", "https://x-tir.ru"
    $t = $t -replace "https:\/\/xtir\.ru", "https://x-tir.ru"
    if ($t -ne $orig) {
      Set-Content -LiteralPath $f.FullName -Value $t -NoNewline -Encoding UTF8
      Write-Host "OK: patched $($f.FullName)" -ForegroundColor Green
    }
  }
}

npm run build | Out-Host
pwsh scripts/wow.ps1 | Out-Host
