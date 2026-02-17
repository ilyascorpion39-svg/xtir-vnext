param()

$ErrorActionPreference = "Stop"

$index = "src/pages/index.astro"
if (!(Test-Path -LiteralPath $index)) { throw "Не найден $index" }

$ts = Get-Date -Format "yyyyMMdd-HHmmss"
Copy-Item -LiteralPath $index -Destination ($index + "." + $ts + ".bak") -Force

$t = Get-Content -LiteralPath $index -Raw

$marker = "<!-- XTIR_SHOWCASE_V1 -->"
if ($t -match [regex]::Escape($marker)) {
  Write-Host "OK: showcase already present" -ForegroundColor DarkGray
} else {
  $block = @"
$marker

<section class="section">
  <div class="container">
    <p class="kicker">Продукты</p>
    <h2 class="h2">Витрина решений</h2>
    <p class="p">Три популярных сценария. Полный каталог по ссылке ниже.</p>

    <div class="xtir-showcase">
      <a class="card card--flat xtir-cardlink" href="/products/elektronnaya-mishen-puma-100/">
        <div class="card__pad">
          <div class="badge">Электронные мишени</div>
          <div class="xtir-title">PUMA-100</div>
          <p class="p">Электронная мишень для тренировок и контроля попаданий.</p>
          <div class="xtir-more">Открыть →</div>
        </div>
      </a>

      <a class="card card--flat xtir-cardlink" href="/products/beguschaya-mishen-puma-45/">
        <div class="card__pad">
          <div class="badge">Движущиеся цели</div>
          <div class="xtir-title">PUMA-45</div>
          <p class="p">Бегущая мишень. Реалистичный сценарий, повторяемость, ресурс.</p>
          <div class="xtir-more">Открыть →</div>
        </div>
      </a>

      <a class="card card--flat xtir-cardlink" href="/products/sistema-upravleniya-poligonom-pak/">
        <div class="card__pad">
          <div class="badge">Управление</div>
          <div class="xtir-title">ПАК</div>
          <p class="p">Система управления полигоном: сценарии, статус, телеметрия.</p>
          <div class="xtir-more">Открыть →</div>
        </div>
      </a>
    </div>

    <div class="xtir-actions">
      <a class="btn btn--primary" href="/products">Смотреть каталог</a>
      <a class="btn btn--ghost" href="/contact">Оставить заявку</a>
    </div>
  </div>
</section>

<style>
  .xtir-showcase{
    display:grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-top: var(--xtir-s4);
  }
  @media (max-width: 980px){
    .xtir-showcase{ grid-template-columns: 1fr; }
  }
  .xtir-cardlink{ text-decoration:none; }
  .xtir-cardlink:hover{ transform: translateY(-1px); }
  .xtir-more{ margin-top: 10px; font-weight: 650; }
</style>
"@

  # Вставим перед финальным CTA "Готовы начать проект?" если найдём, иначе просто в конец
  if ($t -match "Готовы начать проект") {
    $t = [regex]::Replace($t, "(?s)(##\s*Готовы начать проект\?)", ($block + "`n`n`$1"), 1)
  } else {
    $t = $t.TrimEnd() + "`n`n" + $block + "`n"
  }

  Set-Content -LiteralPath $index -Value $t -NoNewline -Encoding UTF8
  Write-Host "OK: showcase inserted. Backup: $index.$ts.bak" -ForegroundColor Green
}

npm run build | Out-Host
pwsh scripts/wow.ps1 | Out-Host
