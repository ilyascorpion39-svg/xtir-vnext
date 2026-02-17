param()

$ErrorActionPreference = "Stop"

$baseLayout = "src/layouts/BaseLayout.astro"
if (!(Test-Path -LiteralPath $baseLayout)) { throw "Не найден $baseLayout" }

$t = Get-Content -LiteralPath $baseLayout -Raw

# Find frontmatter boundaries
$start = $t.IndexOf("---")
if ($start -ne 0) {
  throw "BaseLayout.astro должен начинаться с frontmatter '---' (сейчас не так)."
}

$second = $t.IndexOf("`n---", 3)
if ($second -lt 0) {
  # try CRLF
  $second = $t.IndexOf("`r`n---", 3)
}
if ($second -lt 0) { throw "Не нашёл закрывающий '---' во frontmatter." }

# Locate end of second delimiter line
$afterSecond = $t.IndexOf("`n", $second + 1)
if ($afterSecond -lt 0) { $afterSecond = $t.Length }
$front = $t.Substring(0, $afterSecond)
$body  = $t.Substring($afterSecond)

# Remove leaked import text from BODY (outside frontmatter)
$body2 = $body
$body2 = $body2 -replace "(?m)^\s*import\s+Header\s+from\s+['""][^'""]+['""]\s*;\s*$", ""
$body2 = $body2 -replace "(?m)^\s*import\s+Footer\s+from\s+['""][^'""]+['""]\s*;\s*$", ""
$body2 = $body2 -replace "(?m)^\s*import\s+Header\s+from\s+['""][^'""]+['""]\s*;\s*import\s+Footer\s+from\s+['""][^'""]+['""]\s*;\s*-->\s*$", ""
$body2 = $body2 -replace "(?m)^\s*import\s+Header\s+from\s+['""][^'""]+['""]\s*;\s*import\s+Footer\s+from\s+['""][^'""]+['""]\s*;\s*$", ""

# Also kill any single-line garbage that contains both imports (very defensive)
$body2 = $body2 -replace "(?m)^.*import\s+Header\s+from\s+['""][^'""]+['""]\s*;.*import\s+Footer\s+from\s+['""][^'""]+['""]\s*;.*\r?\n?", ""

# Collapse excessive blank lines at top
$body2 = $body2 -replace "^\s*\r?\n", ""

if ($body2 -eq $body) {
  Write-Host "No leaks found in BaseLayout body. (Nothing changed)" -ForegroundColor Yellow
} else {
  Set-Content -LiteralPath $baseLayout -Value ($front + $body2) -NoNewline -Encoding UTF8
  Write-Host "OK: cleaned leaked imports from BaseLayout body." -ForegroundColor Green
}

Write-Host "Build..." -ForegroundColor Cyan
npm run build | Out-Host

Write-Host "Quick check (no leaked imports in built HTML)..." -ForegroundColor Cyan
# Look for leaked text in built index.html (and a couple of others if exist)
if (Test-Path -LiteralPath "dist/index.html") {
  $h = Get-Content -LiteralPath "dist/index.html" -Raw
  if ($h -match "import\s+Header\s+from") { throw "Leak still present in dist/index.html" }
}
Write-Host "OK" -ForegroundColor Green
