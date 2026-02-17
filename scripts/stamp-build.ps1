param()

$ErrorActionPreference = "Stop"

$baseLayout = "src/layouts/BaseLayout.astro"
if (!(Test-Path -LiteralPath $baseLayout)) { throw "Не найден $baseLayout" }

New-Item -ItemType Directory -Force "public" | Out-Null

$sha = (git rev-parse --short HEAD).Trim()
$ts  = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
$stamp = "XTIR_BUILD:$sha | $ts"

# 1) write public build file (super easy to verify on Pages)
Set-Content -LiteralPath "public/xtir-build.txt" -Value $stamp -Encoding UTF8
Write-Host "OK: wrote public/xtir-build.txt -> $stamp" -ForegroundColor Green

# 2) inject meta + html comment into BaseLayout
$t = Get-Content -LiteralPath $baseLayout -Raw

# replace or insert meta
if ($t -match '<meta\s+name=["'']xtir-build["'']') {
  $t = [regex]::Replace(
    $t,
    '<meta\s+name=["'']xtir-build["'']\s+content=["''][^"''>]*["'']\s*/?>',
    "<meta name=`"xtir-build`" content=`"$stamp`">",
    1
  )
  Write-Host "OK: updated meta xtir-build" -ForegroundColor Green
} elseif ($t -match '</head>') {
  $t = [regex]::Replace($t, '(</head>)', "  <meta name=`"xtir-build`" content=`"$stamp`">`n`$1", 1)
  Write-Host "OK: inserted meta xtir-build" -ForegroundColor Green
} else {
  # fallback: after frontmatter
  $t = [regex]::Replace($t, '(---\s*[\s\S]*?\s*---\s*)', "`$1`n<!-- $stamp -->`n", 1)
  Write-Host "OK: inserted fallback comment (no </head> found)" -ForegroundColor Yellow
}

# ensure end-of-file comment
if ($t -notmatch [regex]::Escape("<!-- $stamp -->")) {
  $t = $t.TrimEnd() + "`n<!-- $stamp -->`n"
}

Set-Content -LiteralPath $baseLayout -Value $t -NoNewline -Encoding UTF8

Write-Host "Build..." -ForegroundColor Cyan
npm run build | Out-Host

Write-Host "WOW..." -ForegroundColor Cyan
pwsh scripts/wow.ps1 | Out-Host
