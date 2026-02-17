param()

$ErrorActionPreference = "Stop"

$baseLayout = "src/layouts/BaseLayout.astro"
if (!(Test-Path -LiteralPath $baseLayout)) { throw "Не найден $baseLayout" }

$sha = (git rev-parse --short HEAD).Trim()
$stamp = "XTIR_BUILD:$sha"

$t = Get-Content -LiteralPath $baseLayout -Raw

# 1) Добавим meta в <head> (или обновим)
if ($t -match '<meta\s+name=["'']xtir-build["'']') {
  $t = [regex]::Replace($t, '<meta\s+name=["'']xtir-build["'']\s+content=["''][^"''>]*["'']\s*/?>', "<meta name=`"xtir-build`" content=`"$stamp`">", 1)
} elseif ($t -match '</head>') {
  $t = [regex]::Replace($t, '(</head>)', "  <meta name=`"xtir-build`" content=`"$stamp`">`n`$1", 1)
} else {
  # если нет head (редко), просто вставим после frontmatter
  $t = [regex]::Replace($t, '(---\s*[\s\S]*?\s*---\s*)', "`$1`n<!-- $stamp -->`n", 1)
}

# 2) Добавим HTML-комментарий в конец (удобно искать в view-source)
if ($t -notmatch [regex]::Escape("<!-- $stamp -->")) {
  $t = $t.TrimEnd() + "`n<!-- $stamp -->`n"
}

Set-Content -LiteralPath $baseLayout -Value $t -NoNewline -Encoding UTF8

Write-Host "OK: stamped build id $stamp" -ForegroundColor Green

npm run build | Out-Host
pwsh scripts/wow.ps1 | Out-Host
