param()

$ErrorActionPreference = "Stop"

$index = "src/pages/index.astro"
if (!(Test-Path -LiteralPath $index)) { throw "Не найден $index" }

$ts = Get-Date -Format "yyyyMMdd-HHmmss"
Copy-Item -LiteralPath $index -Destination ($index + "." + $ts + ".bak") -Force

$txt = Get-Content -LiteralPath $index -Raw

$start = "<!-- XTIR_HERO_V1_START -->"
$end   = "<!-- XTIR_HERO_V1_END -->"

if ($txt -notmatch [regex]::Escape($start) -or $txt -notmatch [regex]::Escape($end)) {
  throw "Не найден hero-маркер XTIR_HERO_V1_START/END в index.astro"
}

$hero = @"
$start
<section class="xtir-hero section section--tight">
  <div class="xtir-hero__bg" aria-hidden="true"></div>

  <div class="container">
    <div class="xtir-hero__grid">
      <div>
        <p class="kicker">XTIR · электронно-механические решения для стрельбы</p>

        <h1 class="h1">
          Точная техника.
          <span class="xtir-hero__accent">Жёсткая надёжность.</span>
        </h1>

        <p class="p xtir-hero__subtitle">
          Разработка и производство оборудования: управление, связь, механика, интеграции.
          Без лишних слов, только функционал и ресурс.
        </p>

        <div class="xtir-hero__actions">
          <a class="btn btn--primary" href="/contact">Оставить заявку</a>
          <a class="btn btn--ghost" href="/products">Смотреть продукты</a>
        </div>

        <div class="xtir-hero__pills" role="list" aria-label="Преимущества">
          <span class="pill" role="listitem">Производство</span>
          <span class="pill" role="listitem">Инженерия</span>
          <span class="pill" role="listitem">Интеграции</span>
          <span class="pill" role="listitem">Сервис</span>
        </div>
      </div>

      <aside class="card card--flat">
        <div class="card__pad xtir-hero__stack" aria-label="Ключевые особенности">
          <div class="xtir-hero__feature card card--flat">
            <div class="xtir-hero__ftitle">Контроль и телеметрия</div>
            <div class="p">Управление сценариями, статус, диагностика, журнал событий.</div>
          </div>

          <div class="xtir-hero__feature card card--flat">
            <div class="xtir-hero__ftitle">Связь и устойчивость</div>
            <div class="p">Wi-Fi/радиоканал, устойчивость к помехам, предсказуемая работа.</div>
          </div>

          <div class="xtir-hero__feature card card--flat">
            <div class="xtir-hero__ftitle">Механика и ресурс</div>
            <div class="p">Конструкции под реальную эксплуатацию: нагрузка, вибрации, повторяемость.</div>
          </div>

          <div class="xtir-hero__note">
            <span class="xtir-hero__dot" aria-hidden="true"></span>
            <span class="p">Нужна конфигурация под объект? Опишем решение и сроки.</span>
          </div>
        </div>
      </aside>
    </div>
  </div>
</section>

<style>
  .xtir-hero{ position:relative; overflow:hidden; }
  .xtir-hero__bg{
    position:absolute; inset:-2px;
    background:
      radial-gradient(1000px 500px at 15% 10%, rgba(255,255,255,.08), rgba(255,255,255,0) 60%),
      radial-gradient(900px 500px at 85% 35%, rgba(255,255,255,.06), rgba(255,255,255,0) 65%),
      linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,0));
    pointer-events:none;
  }
  .xtir-hero__grid{ display:grid; gap:18px; grid-template-columns: 1.1fr .9fr; align-items:stretch; }
  @media (max-width: 980px){ .xtir-hero__grid{ grid-template-columns:1fr; } }

  .xtir-hero__accent{ opacity:.92; }
  .xtir-hero__subtitle{ max-width:62ch; margin-top:0; margin-bottom: var(--xtir-s4); }

  .xtir-hero__actions{ display:flex; gap:10px; flex-wrap:wrap; margin: 0 0 var(--xtir-s3); }
  .xtir-hero__pills{ display:flex; gap:8px; flex-wrap:wrap; }

  .xtir-hero__stack{ display:flex; flex-direction:column; gap:10px; }
  .xtir-hero__feature{ padding: 12px 12px; border-radius: var(--xtir-radius-md); }
  .xtir-hero__ftitle{ font-weight:750; margin-bottom:6px; }

  .xtir-hero__note{
    display:flex; gap:10px; align-items:center;
    margin-top: 2px;
    padding: 10px 12px;
    border-radius: var(--xtir-radius-md);
    border:1px solid var(--xtir-border);
    background: rgba(255,255,255,.03);
  }
  .xtir-hero__dot{
    width:8px; height:8px; border-radius:999px;
    background: rgba(255,255,255,.55);
    box-shadow: 0 0 0 3px rgba(255,255,255,.10);
    flex: 0 0 auto;
  }
</style>
$end
"@

$txt2 = [regex]::Replace($txt, [regex]::Escape($start) + "[\s\S]*?" + [regex]::Escape($end), $hero, 1)
Set-Content -LiteralPath $index -Value $txt2 -NoNewline -Encoding UTF8

Write-Host "OK: Hero upgraded to v2 (tokens-based). Backup: $index.$ts.bak" -ForegroundColor Green

Write-Host "Build..." -ForegroundColor Cyan
npm run build | Out-Host

Write-Host "WOW..." -ForegroundColor Cyan
pwsh scripts/wow.ps1 | Out-Host
