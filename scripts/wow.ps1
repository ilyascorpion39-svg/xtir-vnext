param()

$ErrorActionPreference = "Stop"

function Ok($msg){ Write-Host ("✅ " + $msg) -ForegroundColor Green }
function Warn($msg){ Write-Host ("⚠️  " + $msg) -ForegroundColor Yellow }
function Bad($msg){ Write-Host ("❌ " + $msg) -ForegroundColor Red }
function Info($msg){ Write-Host ("• " + $msg) -ForegroundColor Cyan }

function Grep($pattern, $path){
  try {
    # force to array no matter what comes back
    return @(git grep -n $pattern $path 2>$null)
  } catch {
    return @()
  }
}

Write-Host "== XTIR: WOW Check (v2.2) ==" -ForegroundColor Cyan

if (!(Test-Path "package.json")) { throw "package.json не найден. Запусти из корня проекта." }

# 1) Build
Info "Build..."
npm run build | Out-Host
Ok "Build прошёл"

# 2) Layout shell checks
$baseLayout = "src/layouts/BaseLayout.astro"
if (!(Test-Path $baseLayout)) { Bad "Нет src/layouts/BaseLayout.astro"; exit 1 }

$layoutText = Get-Content -LiteralPath $baseLayout -Raw

if ($layoutText -match '<html\b[^>]*\blang\s*=\s*["'']ru["'']') { Ok 'RU-only: <html lang="ru">' } else { Warn "RU-only: lang не ru в BaseLayout" }
if ($layoutText -match '<Header\b') { Ok "Header присутствует в BaseLayout" } else { Bad "Header НЕ найден в BaseLayout" }
if ($layoutText -match '<Footer\b') { Ok "Footer присутствует в BaseLayout" } else { Bad "Footer НЕ найден в BaseLayout" }

# No Header/Footer in pages
$hfPages = Grep "<Header|<Footer" "src/pages"
if (@($hfPages).Count -eq 0) { Ok "Нет дублей Header/Footer в src/pages" } else { Warn "Найдены Header/Footer в страницах (дубли):"; $hfPages | Out-Host }

# 3) BaseLayout import normalization
$badImports = Grep "import\s+BaseLayout\s+from\s+['""][.]{1,2}/" "src/pages"
if (@($badImports).Count -eq 0) { Ok "Импорты BaseLayout унифицированы (без ../)" } else { Warn "Есть относительные импорты BaseLayout (лучше @/):"; $badImports | Out-Host }

# 4) Forbidden word "Скачать"
$downloads = Grep "Скачать" "src"
if (@($downloads).Count -eq 0) { Ok "Запрещённое слово 'Скачать' не найдено в src" } else { Bad "Найдено 'Скачать' (нужно убрать):"; $downloads | Out-Host }

# 5) Social links policy (heuristic)
$allowed = @("t.me","vk.com","rutube.ru","youtube.com","youtu.be")
$foundUrls = New-Object System.Collections.Generic.HashSet[string]

$files = @(git ls-files src)
foreach ($f in $files) {
  if (!(Test-Path -LiteralPath $f)) { continue }
  $t = Get-Content -LiteralPath $f -Raw
  $m = [regex]::Matches($t, "(https?:\/\/[^\s""')]+)")
  foreach ($x in $m) { [void]$foundUrls.Add($x.Value) }
}

$nonAllowed = @()
foreach ($u in $foundUrls) {
  $ok = $false
  foreach ($d in $allowed) { if ($u -match [regex]::Escape($d)) { $ok = $true; break } }
  if (-not $ok) { $nonAllowed += $u }
}

if (@($nonAllowed).Count -eq 0) {
  Ok "Ссылки: только допустимые домены (или внешних ссылок не найдено)"
} else {
  Warn "Найдены ссылки на другие домены (проверь, не лишние ли это соцсети):"
  $nonAllowed | Sort-Object | Out-Host
}

Write-Host ""
Write-Host "== DONE ==" -ForegroundColor Cyan
