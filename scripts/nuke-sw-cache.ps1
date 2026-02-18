param()

$ErrorActionPreference = "Stop"

$base = "src/layouts/BaseLayout.astro"
if (!(Test-Path -LiteralPath $base)) { throw "Не найден $base" }

$t = Get-Content -LiteralPath $base -Raw

$markerStart = "<!-- XTIR_CACHE_NUKE_START -->"
$markerEnd   = "<!-- XTIR_CACHE_NUKE_END -->"

$block = @"
$markerStart
<script is:inline>
  // XTIR: one-time cache nuke for GitHub Pages updates
  (async () => {
    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r => r.unregister()));
      }
      if (window.caches && caches.keys) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
    } catch (e) {}
  })();
</script>
$markerEnd
"@

# insert before </body> if not present
if ($t -notmatch [regex]::Escape($markerStart)) {
  if ($t -match "(?i)</body>") {
    $t = [regex]::Replace($t, "(?i)</body>", $block + "`n</body>", 1)
    Write-Host "OK: inserted cache nuke block into BaseLayout" -ForegroundColor Green
  } else {
    # fallback: append end
    $t = $t.TrimEnd() + "`n" + $block + "`n"
    Write-Host "WARN: </body> not found, appended cache nuke block at end" -ForegroundColor Yellow
  }
} else {
  Write-Host "OK: cache nuke already present" -ForegroundColor DarkGray
}

Set-Content -LiteralPath $base -Value $t -NoNewline -Encoding UTF8

npm run build | Out-Host
pwsh scripts/wow.ps1 | Out-Host
