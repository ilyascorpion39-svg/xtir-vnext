param()

$ErrorActionPreference = "Stop"

$baseLayout = "src/layouts/BaseLayout.astro"
if (!(Test-Path $baseLayout)) { throw "Не найден $baseLayout" }

$headerFile = "src/components/common/Header.tsx"
if (!(Test-Path $headerFile)) { throw "Не найден $headerFile" }
$headerImport = "@/components/common/Header.tsx"

$c = Get-Content -LiteralPath $baseLayout -Raw

# Ensure frontmatter exists
if ($c -notmatch '---\s*[\s\S]*?---') { throw "BaseLayout.astro без frontmatter (--- ... ---)." }

# Add/replace Header import
$c = [regex]::Replace($c, '---\s*([\s\S]*?)\s*---', {
  param($m)
  $fm = $m.Groups[1].Value

  if ($fm -match '(?m)^\s*import\s+Header\s+from\s+') {
    $fm = [regex]::Replace($fm, "(?m)^\s*import\s+Header\s+from\s+['""][^'""]+['""]\s*;\s*$", "import Header from '$headerImport';")
  } else {
    $fm = "import Header from '$headerImport';`n" + $fm
  }

  return "---`n$($fm.TrimEnd())`n---"
}, 1)

# If Header already rendered, stop here
if ($c -match '<Header\b') {
  Set-Content -LiteralPath $baseLayout -Value $c -NoNewline -Encoding UTF8
  Write-Host "OK: Header already present." -ForegroundColor Green
  exit 0
}

# Insert Header using robust anchors
$headerTag = "    <Header client:load />`n"

if ($c -match '<body\b[^>]*>\s*') {
  $c = [regex]::Replace($c, '(<body\b[^>]*>\s*)', ('$1' + "`n" + $headerTag), 1)
}
elseif ($c -match '<main\b') {
  $c = [regex]::Replace($c, '(<main\b)', ($headerTag + '$1'), 1)
}
elseif ($c -match '<slot\s*/>') {
  $c = [regex]::Replace($c, '(<slot\s*/>)', ($headerTag + '$1'), 1)
}
elseif ($c -match '<Footer\b') {
  $c = [regex]::Replace($c, '(<Footer\b)', ($headerTag + '$1'), 1)
}
elseif ($c -match '</head>') {
  # extreme fallback: right after </head>
  $c = [regex]::Replace($c, '(</head>\s*)', ('$1' + "`n" + $headerTag), 1)
}
else {
  # final fallback: after frontmatter end
  $c = [regex]::Replace($c, '(---\s*[\s\S]*?\s*---\s*)', ('$1' + "`n" + $headerTag), 1)
}

# Validate
if ($c -notmatch '<Header\b') { throw "Не удалось вставить Header (после патча всё ещё нет <Header)" }

Set-Content -LiteralPath $baseLayout -Value $c -NoNewline -Encoding UTF8
Write-Host "OK: Header injected into BaseLayout." -ForegroundColor Green

Write-Host "Build..." -ForegroundColor Cyan
npm run build | Out-Host

Write-Host "WOW..." -ForegroundColor Cyan
pwsh scripts/wow.ps1 | Out-Host
