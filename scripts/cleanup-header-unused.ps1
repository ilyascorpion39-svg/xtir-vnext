param()
$ErrorActionPreference="Stop"

$header = "src/components/common/Header.tsx"
if (!(Test-Path -LiteralPath $header)) { throw "Не найден $header" }

$t = Get-Content -LiteralPath $header -Raw
$hits = (Select-String -Path $header -Pattern "makeHref" -AllMatches).Matches.Count

if ($hits -le 1) {
  $orig = $t
  # remove the whole const makeHref = (...) => {...}; block
  $t = [regex]::Replace($t, "(?s)\nconst\s+makeHref\s*=\s*\(.*?\)\s*=>\s*\{.*?\};\s*\n", "`n", 1)
  if ($t -ne $orig) {
    Set-Content -LiteralPath $header -Value $t -NoNewline -Encoding UTF8
    Write-Host "OK: removed unused makeHref from Header.tsx" -ForegroundColor Green
  } else {
    Write-Host "NOTE: makeHref block not found as expected" -ForegroundColor Yellow
  }
} else {
  Write-Host "SKIP: makeHref seems used ($hits hits), not removing" -ForegroundColor Yellow
}

npm run build | Out-Host
pwsh scripts/wow.ps1 | Out-Host
