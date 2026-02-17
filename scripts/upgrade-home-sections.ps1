param()

$ErrorActionPreference = "Stop"

$index = "src/pages/index.astro"
if (!(Test-Path -LiteralPath $index)) { throw "Не найден $index" }

$ts = Get-Date -Format "yyyyMMdd-HHmmss"
Copy-Item -LiteralPath $index -Destination ($index + "." + $ts + ".bak") -Force

$txt = Get-Content -LiteralPath $index -Raw

$start = "<!-- XTIR_HOME_V1_START -->"
$end   = "<!-- XTIR_HOME_V1_END -->"

$block = @"
$start
<hr class="hr" />

<section class="section section--tight">
  <div class="container">
    <p class="kicker">Почему XTIR</p>
    <h2 class="h2">Инженерный подход и предсказуемый результат</h2>

    <div class="xtir-grid">
      <div class="card card--flat"><div class="card__pad">
        <div class="xtir-title">Проектирование</div>
        <p class="p">Требования, расчёт, прототипирование, документация. Без догадок.</p>
      </div></div>

      <div class="card card--flat"><div class="card__pad">
        <div class="xtir-title">Производство</div>
        <p class="p">Сборка, контроль, повторяемость. Узлы рассчитаны на эксплуатацию.</p>
      </div></div>

      <div class="card card--flat"><div class="card__pad">
        <div class="xtir-title">Интеграции</div>
        <p class="p">Связь, управление, сценарии. Подстраиваемся под объект и задачи.</p>
      </div></div>

      <div class="card card--flat"><div class="card__pad">
        <div class="xtir-title">Поддержка</div>
        <p class="p">Сопровождение, диагностика, обновления. Коммуникация по делу.</p>
      </div></div>
    </div>

    <div class="xtir-actions">
      <a class="btn btn--primary" href="/contact">Обсудить задачу</a>
      <a class="btn btn--ghost" href="/technologies">Посмотреть технологии</a>
    </div>
  </div>
</section>

<style>
  .xtir-grid{
    display:grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-top: var(--xtir-s4);
  }
  @media (max-width: 980px){
    .xtir-grid{ grid-template-columns: 1fr; }
  }
  .xtir-title{ font-weight:750; margin-bottom:8px; }
  .xtir-actions{ display:flex; gap:10px; flex-wrap:wrap; margin-top: var(--xtir-s4); }
</style>
$end
"@

if ($txt -match [regex]::Escape($start) -and $txt -match [regex]::Escape($end)) {
  $txt2 = [regex]::Replace($txt, [regex]::Escape($start) + "[\s\S]*?" + [regex]::Escape($end), $block, 1)
} else {
  # Insert right after hero end marker
  $heroEnd = "<!-- XTIR_HERO_V1_END -->"
  if ($txt -notmatch [regex]::Escape($heroEnd)) { throw "Не найден маркер XTIR_HERO_V1_END" }
  $txt2 = $txt -replace [regex]::Escape($heroEnd), ($heroEnd + "`n`n" + $block)
}

Set-Content -LiteralPath $index -Value $txt2 -NoNewline -Encoding UTF8

Write-Host "OK: Home sections block added (markers XTIR_HOME_V1_*). Backup: $index.$ts.bak" -ForegroundColor Green

Write-Host "Build..." -ForegroundColor Cyan
npm run build | Out-Host

Write-Host "WOW..." -ForegroundColor Cyan
pwsh scripts/wow.ps1 | Out-Host
