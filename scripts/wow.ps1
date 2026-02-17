param()

$ErrorActionPreference = "Stop"

function Ok($msg){ Write-Host ("✅ " + $msg) -ForegroundColor Green }
function Warn($msg){ Write-Host ("⚠️  " + $msg) -ForegroundColor Yellow }
function Bad($msg){ Write-Host ("❌ " + $msg) -ForegroundColor Red }
function Info($msg){ Write-Host ("• " + $msg) -ForegroundColor Cyan }

function Grep($pattern, $path){
  try { return @(git grep -n $pattern $path 2>$null) } catch { return @() }
}

Write-Host "== XTIR: WOW Check (v2.3) ==" -ForegroundColor Cyan

if (!(Test-Path "package.json")) { throw "package.json не найден. Запусти из корня проекта." }

Info "Build..."
npm run build | Out-Host
Ok "Build прошёл"

$baseLayout = "src/layouts/BaseLayout.astro"
if (!(Test-Path $baseLayout)) { Bad "Нет src/layouts/BaseLayout.astro"; exit 1 }

$layoutText = Get-Content -LiteralPath $baseLayout -Raw

if ($layoutText -match '<html\b[^>]*\blang\s*=\s*["'']ru["'']') { Ok 'RU-only: <html lang="ru">' } else { Warn "RU-only: lang не ru в BaseLayout" }
if ($layoutText -match '<Header\b') { Ok "Header присутствует в BaseLayout" } else { Bad "Header НЕ найден в BaseLayout" }
if ($layoutText -match '<Footer\b') { Ok "Footer присутствует в BaseLayout" } else { Bad "Footer НЕ найден в BaseLayout" }

$hfPages = Grep "<Header|<Footer" "src/pages"
if (@($hfPages).Count -eq 0) { Ok "Нет дублей Header/Footer в src/pages" } else { Warn "Найдены Header/Footer в страницах (дубли):"; $hfPages | Out-Host }

$badImports = Grep "import\s+BaseLayout\s+from\s+['""][.]{1,2}/" "src/pages"
if (@($badImports).Count -eq 0) { Ok "Импорты BaseLayout унифицированы (без ../)" } else { Warn "Есть относительные импорты BaseLayout (лучше @/):"; $badImports | Out-Host }

$downloads = Grep "Скачать" "src"
if (@($downloads).Count -eq 0) { Ok "Запрещённое слово 'Скачать' не найдено в src" } else { Bad "Найдено 'Скачать' (нужно убрать):"; $downloads | Out-Host }

# --- External domains report (smarter) ---
$allowSocial = @("t.me","vk.com","rutube.ru","youtube.com","youtu.be")
$allowInfra  = @("schema.org")          # structured data
$allowSelf   = @("x-tir.ru")            # own domain
$allowFonts  = @()                      # if you still allow google fonts, add "fonts.googleapis.com","fonts.gstatic.com"
$blockHard   = @("googletagmanager.com")# analytics/tracking by default

$foundUrls = New-Object System.Collections.Generic.HashSet[string]
$files = @(git ls-files src)
foreach ($f in $files) {
  if (!(Test-Path -LiteralPath $f)) { continue }
  $t = Get-Content -LiteralPath $f -Raw
  $m = [regex]::Matches($t, "(https?:\/\/[^\s""')]+)")
  foreach ($x in $m) { [void]$foundUrls.Add($x.Value) }
}

function HostOf($u) {
  try { return ([uri]$u).Host.ToLowerInvariant() } catch { return "" }
}

$fonts = @()
$social = @()
$self = @()
$infra = @()
$tracking = @()
$other = @()

foreach ($u in $foundUrls) {
  $h = HostOf $u
  if (!$h) { continue }

  if ($h -in @("fonts.googleapis.com","fonts.gstatic.com")) { $fonts += $u; continue }
  if ($allowSelf | Where-Object { $h -like "*$_" }) { $self += $u; continue }
  if ($allowInfra | Where-Object { $h -like "*$_" }) { $infra += $u; continue }
  if ($allowSocial | Where-Object { $h -like "*$_" }) { $social += $u; continue }
  if ($blockHard | Where-Object { $h -like "*$_" }) { $tracking += $u; continue }
  $other += $u
}

if (@($tracking).Count -eq 0) { Ok "Трекинг-домены не найдены" } else { Warn "Найдены трекинг/аналитика домены:"; $tracking | Sort-Object | Out-Host }
if (@($fonts).Count -eq 0) { Ok "Google Fonts не найдены" } else { Warn "Найдены Google Fonts (можно перевести в локальные):"; $fonts | Sort-Object | Out-Host }
if (@($other).Count -eq 0) { Ok "Лишних внешних доменов не найдено" } else { Warn "Найдены прочие внешние домены:"; $other | Sort-Object | Out-Host }

Write-Host ""
Write-Host "== DONE ==" -ForegroundColor Cyan
