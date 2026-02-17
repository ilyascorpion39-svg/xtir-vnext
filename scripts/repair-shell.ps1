param()

$ErrorActionPreference = "Stop"

function ToAliasImport($filePath) {
  if ($filePath -match "^src/") { return "@/" + $filePath.Substring(4) }
  return $filePath
}

Write-Host "== XTIR: Repair Layout Shell (v3) ==" -ForegroundColor Cyan

$baseLayout = "src/layouts/BaseLayout.astro"
if (!(Test-Path $baseLayout)) { throw "Не найден файл $baseLayout" }

# Use known component locations first (your repo)
$headerFile = "src/components/common/Header.tsx"
$footerFile = "src/components/common/Footer.tsx"

if (!(Test-Path $headerFile)) { throw "Не найден $headerFile" }
if (!(Test-Path $footerFile)) { throw "Не найден $footerFile" }

$headerImport = ToAliasImport $headerFile
$footerImport = ToAliasImport $footerFile

Write-Host "Header: $headerFile -> import $headerImport" -ForegroundColor DarkGray
Write-Host "Footer: $footerFile -> import $footerImport" -ForegroundColor DarkGray

$c = Get-Content -LiteralPath $baseLayout -Raw

# Ensure <html lang="ru">
$c = $c -replace '<html\b([^>]*?)\blang\s*=\s*["''][^"'''']+["'']', '<html$1lang="ru"'
if ($c -notmatch '<html\b[^>]*\blang\s*=\s*["'']ru["'']') {
  $c = $c -replace '<html\b', '<html lang="ru"'
}

# Ensure frontmatter exists
if ($c -notmatch '---\s*[\s\S]*?---') { throw "BaseLayout.astro без frontmatter (--- ... ---)." }

# Patch frontmatter: replace wrong imports or add missing
$c = [regex]::Replace($c, '---\s*([\s\S]*?)\s*---', {
  param($m)
  $fm = $m.Groups[1].Value

  # Replace existing imports (even if they were 's')
  if ($fm -match '(?m)^\s*import\s+Header\s+from\s+') {
    $fm = [regex]::Replace($fm, "(?m)^\s*import\s+Header\s+from\s+['""][^'""]+['""]\s*;\s*$", "import Header from '$headerImport';")
  } else {
    $fm = "import Header from '$headerImport';`n" + $fm
  }

  if ($fm -match '(?m)^\s*import\s+Footer\s+from\s+') {
    $fm = [regex]::Replace($fm, "(?m)^\s*import\s+Footer\s+from\s+['""][^'""]+['""]\s*;\s*$", "import Footer from '$footerImport';")
  } else {
    $fm = "import Footer from '$footerImport';`n" + $fm
  }

  return "---`n$($fm.TrimEnd())`n---"
}, 1)

# Ensure Header exists after <body>
if ($c -notmatch '<Header\b') {
  $c = [regex]::Replace($c, '(<body\b[^>]*>\s*)', ('$1' + "`n" + '    <Header client:load />' + "`n"), 1)
}

# Ensure Footer exists before </body>
if ($c -notmatch '<Footer\b') {
  $c = [regex]::Replace($c, '(\s*</body>)', ("`n" + '    <Footer client:load />' + "`n" + '$1'), 1)
}

Set-Content -LiteralPath $baseLayout -Value $c -NoNewline -Encoding UTF8
Write-Host "OK: BaseLayout repaired (imports + header/footer + ru)." -ForegroundColor Green

# Normalize BaseLayout import in pages (and use -LiteralPath to handle [slug].astro)
$pages = git ls-files "src/pages" | Where-Object { $_ -match "\.astro$" }

foreach ($f in $pages) {
  if (!(Test-Path -LiteralPath $f)) { continue }

  $t = Get-Content -LiteralPath $f -Raw
  $t2 = $t -replace "(?m)^\s*import\s+BaseLayout\s+from\s+['""][^'""]+BaseLayout\.astro['""]\s*;\s*$", "import BaseLayout from '@/layouts/BaseLayout.astro';"

  if ($t2 -ne $t) {
    Set-Content -LiteralPath $f -Value $t2 -NoNewline -Encoding UTF8
  }
}

Write-Host "OK: BaseLayout imports normalized in pages." -ForegroundColor Green

Write-Host "Now running build..." -ForegroundColor Cyan
npm run build

Write-Host "Greps:" -ForegroundColor Cyan
git grep -n "<Header|<Footer" src | Out-Host
