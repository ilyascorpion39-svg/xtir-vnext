param()

$ErrorActionPreference = "Stop"

$p = "src/pages/products/index.astro"
if (!(Test-Path -LiteralPath $p)) { throw "Не найден $p" }

$ts = Get-Date -Format "yyyyMMdd-HHmmss"
Copy-Item -LiteralPath $p -Destination ($p + "." + $ts + ".bak") -Force

$t = Get-Content -LiteralPath $p -Raw

$marker = "<!-- XTIR_PRODUCTS_MUSEUM_V1 -->"
if ($t -match [regex]::Escape($marker)) {
  Write-Host "OK: museum already present" -ForegroundColor DarkGray
} else {
  $intro = @"
$marker
<section class="section section--tight">
  <div class="container">
    <p class="kicker">Экспозиция</p>
    <h1 class="h1">Решения и модули</h1>
    <p class="p">Собрание инженерных “экспонатов”. Каждый элемент здесь не сам по себе, а как часть сценария: тренировка, динамика, инфраструктура объекта, интеграция.</p>
  </div>
</section>
"@

  # вставка сразу после открывающего <BaseLayout ...>
  $m = [regex]::Match($t, "<BaseLayout[^>]*>\s*")
  if ($m.Success) {
    $pos = $m.Index + $m.Length
    $t = $t.Insert($pos, "`n" + $intro + "`n")
  } else {
    $t = $t.TrimEnd() + "`n`n" + $intro + "`n"
  }

  # мягкая “де-продажность”
  $t = $t -replace "(?i)\bкупить\b", "Подробнее"
  $t = $t -replace "(?i)\bзаказать\b", "Обсудить"
  $t = $t -replace "(?i)\bцена\b", "Описание"
  $t = $t -replace "(?i)\bакци\w*\b", ""
  $t = $t -replace "(?i)\bскидк\w*\b", ""

  Set-Content -LiteralPath $p -Value $t -NoNewline -Encoding UTF8
  Write-Host "OK: products museum intro inserted. Backup: $p.$ts.bak" -ForegroundColor Green
}

npm run build | Out-Host
pwsh scripts/wow.ps1 | Out-Host
