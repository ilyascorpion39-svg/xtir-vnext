param()

$ErrorActionPreference = "Stop"

$index = "src/pages/index.astro"
if (!(Test-Path -LiteralPath $index)) { throw "Не найден $index" }

$ts = Get-Date -Format "yyyyMMdd-HHmmss"
Copy-Item -LiteralPath $index -Destination ($index + "." + $ts + ".bak") -Force

$t = Get-Content -LiteralPath $index -Raw

$marker = "<!-- XTIR_EXPOSITION_V1 -->"
if ($t -match [regex]::Escape($marker)) {
  Write-Host "OK: exposition already present" -ForegroundColor DarkGray
} else {

  $block = @"
$marker

<hr class="hr" />

<section class="section">
  <div class="container">
    <p class="kicker">Экспозиция</p>
    <h2 class="h2">Сценарии, в которых техника помогает людям</h2>
    <p class="p">Не “продажа”. Мы показываем классы решений и то, как они применяются на практике: обучение, спорт, подготовка, инфраструктура объекта.</p>

    <div class="xtir-expo">
      <a class="card card--flat xtir-expo__item" href="/products">
        <div class="card__pad">
          <div class="xtir-expo__top">
            <span class="pill">Тренировка</span>
            <span class="pill">Обратная связь</span>
          </div>
          <div class="xtir-expo__title">Электронные мишени</div>
          <p class="p">Когда важны повторяемость, контроль попаданий, понятная статистика и дисциплина занятий.</p>
          <div class="xtir-expo__more">Смотреть решения →</div>
        </div>
      </a>

      <a class="card card--flat xtir-expo__item" href="/products">
        <div class="card__pad">
          <div class="xtir-expo__top">
            <span class="pill">Динамика</span>
            <span class="pill">Сценарии</span>
          </div>
          <div class="xtir-expo__title">Движущиеся цели</div>
          <p class="p">Когда нужно моделировать реальную ситуацию: скорость, тайминг, работа с вниманием и реакцией.</p>
          <div class="xtir-expo__more">Как это устроено →</div>
        </div>
      </a>

      <a class="card card--flat xtir-expo__item" href="/technologies">
        <div class="card__pad">
          <div class="xtir-expo__top">
            <span class="pill">Связь</span>
            <span class="pill">Надёжность</span>
          </div>
          <div class="xtir-expo__title">Управление и интеграции</div>
          <p class="p">Когда на объекте много узлов и важна предсказуемая работа: статусы, телеметрия, журнал событий.</p>
          <div class="xtir-expo__more">Технологии →</div>
        </div>
      </a>
    </div>

    <div class="xtir-expo__cta">
      <a class="btn btn--primary" href="/contact">Обсудить задачу</a>
      <a class="btn btn--ghost" href="/gallery">Посмотреть материалы</a>
    </div>
  </div>
</section>

<style>
  .xtir-expo{
    display:grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-top: var(--xtir-s4);
  }
  @media (max-width: 980px){
    .xtir-expo{ grid-template-columns: 1fr; }
  }

  .xtir-expo__item{ text-decoration:none; }
  .xtir-expo__item:hover{ transform: translateY(-1px); }

  .xtir-expo__top{ display:flex; gap:8px; flex-wrap:wrap; margin-bottom: 10px; }
  .xtir-expo__title{ font-weight: 780; margin: 0 0 8px; }
  .xtir-expo__more{ margin-top: 10px; font-weight: 650; color: var(--xtir-fg); opacity: .92; }

  .xtir-expo__cta{ display:flex; gap:10px; flex-wrap:wrap; margin-top: var(--xtir-s4); }
</style>
"@

  # Вставим сразу после Hero (после маркера XTIR_HERO_V1_END)
  $heroEnd = "<!-- XTIR_HERO_V1_END -->"
  if ($t -match [regex]::Escape($heroEnd)) {
    $t = $t -replace [regex]::Escape($heroEnd), ($heroEnd + "`n`n" + $block)
  } else {
    $t = $t.TrimEnd() + "`n`n" + $block + "`n"
  }

  Set-Content -LiteralPath $index -Value $t -NoNewline -Encoding UTF8
  Write-Host "OK: exposition inserted. Backup: $index.$ts.bak" -ForegroundColor Green
}

npm run build | Out-Host
pwsh scripts/wow.ps1 | Out-Host
