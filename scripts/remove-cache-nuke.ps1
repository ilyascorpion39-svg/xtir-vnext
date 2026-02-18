param()
$ErrorActionPreference="Stop"

$base = "src/layouts/BaseLayout.astro"
if (!(Test-Path -LiteralPath $base)) { throw "Не найден $base" }

$t = Get-Content -LiteralPath $base -Raw
$orig = $t

$t = [regex]::Replace($t, "(?s)\s*<!-- XTIR_CACHE_NUKE_START -->.*?<!-- XTIR_CACHE_NUKE_END -->\s*", "`n", 1)

if ($t -eq $orig) {
  Write-Host "NOTE: cache nuke block not found (already removed?)" -ForegroundColor Yellow
} else {
  Set-Content -LiteralPath $base -Value $t -NoNewline -Encoding UTF8
  Write-Host "OK: cache nuke block removed" -ForegroundColor Green
}

npm run build | Out-Host
pwsh scripts/wow.ps1 | Out-Host
