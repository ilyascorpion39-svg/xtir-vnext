param()

$ErrorActionPreference = "Stop"

$footer = "src/components/common/Footer.tsx"
if (!(Test-Path -LiteralPath $footer)) { throw "Не найден $footer" }

$t = Get-Content -LiteralPath $footer -Raw
$orig = $t

# 1) Заменяем links.filter(Boolean).map(...) на полноценный type-guard:
#    links.filter((link): link is { name: string; href: string } => !!link).map(...)
$t = [regex]::Replace(
  $t,
  "links\.filter\(Boolean\)\.map\(",
  "links.filter((link): link is { name: string; href: string } => !!link).map(",
  1
)

# 2) Если где-то осталось просто links.map(...), тоже усилим:
if ($t -match "links\.map\(" -and $t -notmatch "links\.filter\(\(link\): link is") {
  $t = [regex]::Replace(
    $t,
    "links\.map\(",
    "links.filter((link): link is { name: string; href: string } => !!link).map(",
    1
  )
}

if ($t -eq $orig) {
  Write-Host "NOTE: patterns not found. Footer not changed (maybe different variable name)." -ForegroundColor Yellow
} else {
  Set-Content -LiteralPath $footer -Value $t -NoNewline -Encoding UTF8
  Write-Host "OK: Footer links hardened with TS type-guard." -ForegroundColor Green
}

Write-Host "Build..." -ForegroundColor Cyan
npm run build | Out-Host

Write-Host "WOW..." -ForegroundColor Cyan
pwsh scripts/wow.ps1 | Out-Host
