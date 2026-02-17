param()

$ErrorActionPreference = "Stop"

$index = "src/pages/index.astro"
if (!(Test-Path -LiteralPath $index)) { throw "Не найден $index" }

# Backup
$ts = Get-Date -Format "yyyyMMdd-HHmmss"
Copy-Item -LiteralPath $index -Destination ($index + "." + $ts + ".bak") -Force

$txt = Get-Content -LiteralPath $index -Raw

$heroStart = "<!-- XTIR_HERO_V1_START -->"
$heroEnd   = "<!-- XTIR_HERO_V1_END -->"

$heroBlock = @"
$heroStart
<section class="xtir-hero">
  <div class="xtir-hero__bg" aria-hidden="true"></div>

  <div class="xtir-hero__container">
    <div class="xtir-hero__grid">
      <div class="xtir-hero__copy">
        <p class="xtir-hero__kicker">XTIR · электронно-механические решения для стрельбы</p>

        <h1 class="xtir-hero__title">
          Точная техника.
          <span class="xtir-hero__titleAccent">Жёсткая надёжность.</span>
        </h1>

        <p class="xtir-hero__subtitle">
          Разработка и производство оборудования: управление, связь, механика, интеграции.
          Без лишних слов, только функционал и ресурс.
        </p>

        <div class="xtir-hero__actions">
          <a class="xtir-btn xtir-btn--primary" href="/contact">Оставить заявку</a>
          <a class="xtir-btn xtir-btn--ghost" href="/products">Смотреть продукты</a>
        </div>

        <div class="xtir-hero__chips" role="list" aria-label="Преимущества">
          <span class="xtir-chip" role="listitem">Производство</span>
          <span class="xtir-chip" role="listitem">Инженерия</span>
          <span class="xtir-chip" role="listitem">Интеграции</span>
          <span class="xtir-chip" role="listitem">Сервис</span>
        </div>
      </div>

      <div class="xtir-hero__panel" aria-label="Ключевые особенности">
        <div class="xtir-card">
          <div class="xtir-card__title">Контроль и телеметрия</div>
          <div class="xtir-card__text">Управление сценариями, статус, диагностика, журнал событий.</div>
        </div>

        <div class="xtir-card">
          <div class="xtir-card__title">Связь и устойчивость</div>
          <div class="xtir-card__text">Wi-Fi/радиоканал, устойчивость к помехам, предсказуемая работа.</div>
        </div>

        <div class="xtir-card">
          <div class="xtir-card__title">Механика и ресурс</div>
          <div class="xtir-card__text">Конструкции под реальную эксплуатацию: нагрузка, вибрации, повторяемость.</div>
        </div>

        <div class="xtir-panel__note">
          <span class="xtir-dot" aria-hidden="true"></span>
          <span>Нужна конфигурация под ваш объект? Опишем решение и сроки.</span>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .xtir-hero{ position:relative; padding:56px 0 28px; overflow:hidden; }
  .xtir-hero__bg{
    position:absolute; inset:-2px;
    background:
      radial-gradient(1000px 500px at 15% 10%, rgba(255,255,255,.08), rgba(255,255,255,0) 60%),
      radial-gradient(900px 500px at 85% 35%, rgba(255,255,255,.06), rgba(255,255,255,0) 65%),
      linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,0));
    pointer-events:none;
  }
  .xtir-hero__container{ max-width:1160px; margin:0 auto; padding:0 16px; }
  .xtir-hero__grid{ display:grid; gap:18px; grid-template-columns: 1.1fr .9fr; align-items:stretch; }
  @media (max-width: 980px){ .xtir-hero__grid{ grid-template-columns:1fr; } }

  .xtir-hero__kicker{ font-size:12px; letter-spacing:.08em; text-transform:uppercase; opacity:.8; margin:0 0 10px; }
  .xtir-hero__title{ font-size:44px; line-height:1.06; margin:0 0 12px; }
  @media (max-width: 980px){ .xtir-hero__title{ font-size:36px; } }
  .xtir-hero__titleAccent{ display:inline-block; opacity:.9; }
  .xtir-hero__subtitle{ font-size:16px; line-height:1.55; opacity:.9; margin:0 0 18px; max-width:62ch; }

  .xtir-hero__actions{ display:flex; gap:10px; flex-wrap:wrap; margin:0 0 14px; }
  .xtir-btn{
    display:inline-flex; align-items:center; justify-content:center;
    height:42px; padding:0 14px; border-radius:14px;
    text-decoration:none; font-weight:600; font-size:14px;
    border:1px solid rgba(255,255,255,.14);
    backdrop-filter: blur(8px);
    transition: transform .12s ease, border-color .12s ease, background .12s ease;
  }
  .xtir-btn:hover{ transform: translateY(-1px); border-color: rgba(255,255,255,.22); }
  .xtir-btn--primary{ background: rgba(255,255,255,.12); }
  .xtir-btn--ghost{ background: rgba(255,255,255,.06); }

  .xtir-hero__chips{ display:flex; gap:8px; flex-wrap:wrap; margin-top:4px; }
  .xtir-chip{
    font-size:12px; padding:6px 10px; border-radius:999px;
    border:1px solid rgba(255,255,255,.12);
    background: rgba(255,255,255,.04);
    opacity:.95;
  }

  .xtir-hero__panel{
    border:1px solid rgba(255,255,255,.12);
    background: rgba(255,255,255,.03);
    border-radius:18px;
    padding:14px;
  }
  .xtir-card{
    padding:12px 12px;
    border-radius:14px;
    border:1px solid rgba(255,255,255,.10);
    background: rgba(0,0,0,.08);
  }
  .xtir-card + .xtir-card{ margin-top:10px; }
  .xtir-card__title{ font-weight:700; margin-bottom:6px; }
  .xtir-card__text{ opacity:.9; line-height:1.45; font-size:13px; }

  .xtir-panel__note{
    display:flex; gap:10px; align-items:center;
    margin-top:12px; padding:10px 12px;
    border-radius:14px;
    background: rgba(255,255,255,.04);
    border:1px solid rgba(255,255,255,.10);
    font-size:13px; opacity:.95;
  }
  .xtir-dot{ width:8px; height:8px; border-radius:999px; background: rgba(255,255,255,.55); box-shadow: 0 0 0 3px rgba(255,255,255,.10); }
</style>
$heroEnd
"@

function InsertOrReplaceHero($content) {
  if ($content -match [regex]::Escape($heroStart) -and $content -match [regex]::Escape($heroEnd)) {
    return [regex]::Replace($content, [regex]::Escape($heroStart) + "[\s\S]*?" + [regex]::Escape($heroEnd), $heroBlock, 1)
  }

  # Insert right after opening <BaseLayout ...> tag if possible
  $m = [regex]::Match($content, "<BaseLayout[^>]*>\s*")
  if ($m.Success) {
    $pos = $m.Index + $m.Length
    return $content.Insert($pos, "`n" + $heroBlock + "`n")
  }

  # Fallback: prepend after frontmatter end
  return [regex]::Replace($content, "(---\s*[\s\S]*?\s*---\s*)", "`$1`n" + $heroBlock + "`n", 1)
}

$txt2 = InsertOrReplaceHero $txt
Set-Content -LiteralPath $index -Value $txt2 -NoNewline -Encoding UTF8

Write-Host "OK: Hero applied to src/pages/index.astro (backup created: $index.$ts.bak)" -ForegroundColor Green

Write-Host "Build..." -ForegroundColor Cyan
npm run build | Out-Host

Write-Host "WOW..." -ForegroundColor Cyan
pwsh scripts/wow.ps1 | Out-Host
