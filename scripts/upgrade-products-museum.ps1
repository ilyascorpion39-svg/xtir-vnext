param()

$ErrorActionPreference = "Stop"

$p = "src/pages/products/index.astro"
if (!(Test-Path -LiteralPath $p)) { throw "Не найден $p" }

$ts = Get-Date -Format "yyyyMMdd-HHmmss"
Copy-Item -LiteralPath $p -Destination ($p + "." + $ts + ".bak") -Force

$t = Get-Content -LiteralPath $p -Raw

$marker = "<!-- XTIR_PRODUCTS_MUSEUM_V1 -->"
if ($t -match [regex]::Escape($marker)) {
  Write-Host "OK: products museum already applied" -ForegroundColor DarkGray
} else {

  # Insert intro right after <BaseLayout ...>
  $intro = @"
$marker

<section class="section section--tight">
  <div class="container">
    <p class="kicker">Зал экспонатов</p>
    <h1 class="h1">Решения XTIR</h1>
    <p class="p">Здесь собраны изделия и модули как элементы сценариев. Не витрина, а каталог возможностей: что можно построить на объекте и как это работает в реальной эксплуатации.</p>
  </div>
</section>

<style>
  .xtir-products-wrap{ padding-bottom: var(--xtir-s6); }
</style>
"@

  $m = [regex]::Match($t, "<BaseLayout[^>]*>\s*")
  if ($m.Success) {
    $pos = $m.Index + $m.Length
    $t = $t.Insert($pos, "`n" + $intro + "`n")
  } else {
    $t = $t.TrimEnd() + "`n`n" + $intro + "`n"
  }

  # Best-effort: wrap main content with container if not already
  if ($t -notmatch "class=""container""") {
    # wrap first <main ...>...</main> if exists
    if ($t -match "<main[\s\S]*?</main>") {
      $t = [regex]::Replace($t, "(?s)<main([^>]*)>", "<main`$1>`n  <div class=`"container xtir-products-wrap`">", 1)
      $t = [regex]::Replace($t, "(?s)</main>", "  </div>`n</main>", 1)
    }
  }

  # Tone down salesy words (safe replacements)
  $t = $t -replace "Купить", "Подробнее"
  $t = $t -replace "Заказать", "Обсудить"
  $t = $t -replace "Цена", "Описание"
  $t = $t -replace "Скидк\w*", ""

  Set-Content -LiteralPath $p -Value $t -NoNewline -Encoding UTF8
  Write-Host "OK: products museum intro applied. Backup: $p.$ts.bak" -ForegroundColor Green
}

npm run build | Out-Host
pwsh scripts/wow.ps1 | Out-Host
