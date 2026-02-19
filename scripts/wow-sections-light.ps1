$ErrorActionPreference = "Stop"

$path = "src/pages/index.astro"
if (!(Test-Path $path)) { throw "Not found: $path" }

$c = Get-Content $path -Raw -Encoding UTF8

if ($c -notmatch "<style>") { throw "No <style> block found in $path" }
if ($c -notmatch "</style>") { throw "No </style> block found in $path" }

$start = "/* XTIR_SECTIONS_LIGHT */"
$end   = "/* END_XTIR_SECTIONS_LIGHT */"

$block = @"
$start
  /* Секции: делаем «средний свет» выше, чтобы не было ощущения провала в черноту.
     Логика: поднимаем базовую яркость фона секций, добавляем мягкий top-glow,
     и подсветку под заголовок секции. Без картинок, только градиенты. */

  :root{
    --xtir-sec-ink: rgba(255,255,255,.86);
    --xtir-sec-sub: rgba(255,255,255,.62);
    --xtir-sec-dim: rgba(255,255,255,.42);

    /* фоновая «дымка» */
    --xtir-sec-fogA: rgba(120,190,255,.10);
    --xtir-sec-fogB: rgba(160,120,255,.08);
    --xtir-sec-fogC: rgba(255,120,120,.06);

    /* базовая подсветка */
    --xtir-sec-base: rgba(255,255,255,.03);
    --xtir-sec-base2: rgba(255,255,255,.015);
  }

  /* Общая рамка секций */
  .sec{ position: relative; color: var(--xtir-sec-ink); }

  /* Ненавязчивый верхний свет в каждой секции */
  .sec::before{
    content:"";
    position:absolute;
    inset:0;
    pointer-events:none;
    background:
      radial-gradient(1200px 520px at 50% -140px, rgba(120,190,255,.16), transparent 60%),
      radial-gradient(900px 420px at 70% -120px, rgba(160,120,255,.12), transparent 62%),
      radial-gradient(900px 420px at 20% -120px, rgba(255,120,120,.08), transparent 64%);
    opacity:.75;
    mix-blend-mode: screen;
  }

  /* Поднимаем яркость у тёмных секций, чтобы не «проваливались» */
  .sec--dark, .sec--darker{
    background:
      linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.00) 55%),
      radial-gradient(1200px 700px at 50% 0%, var(--xtir-sec-base), transparent 60%),
      radial-gradient(900px 600px at 10% 40%, var(--xtir-sec-base2), transparent 60%),
      radial-gradient(900px 600px at 90% 40%, var(--xtir-sec-base2), transparent 60%);
  }

  /* Чуть разница между --dark и --darker */
  .sec--darker{
    background:
      linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.00) 58%),
      radial-gradient(1200px 700px at 50% 0%, rgba(255,255,255,.028), transparent 62%),
      radial-gradient(900px 600px at 10% 40%, rgba(255,255,255,.012), transparent 62%),
      radial-gradient(900px 600px at 90% 40%, rgba(255,255,255,.012), transparent 62%);
  }

  /* Подсветка под заголовок секции (там где есть .sec__hd) */
  .sec__hd{
    position: relative;
  }
  .sec__hd::after{
    content:"";
    position:absolute;
    left:-6px;
    right:-6px;
    top:-10px;
    height:140px;
    pointer-events:none;
    background:
      radial-gradient(520px 120px at 10% 40%, rgba(120,190,255,.16), transparent 70%),
      radial-gradient(520px 120px at 60% 40%, rgba(160,120,255,.12), transparent 72%),
      radial-gradient(520px 120px at 95% 40%, rgba(255,120,120,.08), transparent 74%);
    filter: blur(10px);
    opacity:.55;
  }

  /* Текстовая иерархия секций */
  .sec .sub{ color: var(--xtir-sec-sub); }
  .sec .kicker{ color: rgba(170,210,255,.78); letter-spacing:.14em; }

  /* Мягкие разделители, если где-то есть тонкие линии */
  .sec hr, .sec .divider, .sec .hsdiv{
    opacity:.55;
  }
$end
"@

# replace existing block if present, else insert before </style>
if ($c -match [regex]::Escape($start)) {
  $pattern = "(?s)\r?\n?\s*/\*\s*XTIR_SECTIONS_LIGHT\s*\*/.*?/\*\s*END_XTIR_SECTIONS_LIGHT\s*\*/"
  $c2 = [regex]::Replace($c, $pattern, "`r`n$block")
} else {
  $c2 = $c -replace "</style>", "`r`n$block`r`n</style>"
}

if ($c2 -ne $c) {
  Set-Content -Path $path -Value $c2 -Encoding UTF8
  Write-Host "Patched: $path" -ForegroundColor Green
} else {
  Write-Host "No changes made (already up to date)." -ForegroundColor Yellow
}

npx astro check
npm run build
git status
