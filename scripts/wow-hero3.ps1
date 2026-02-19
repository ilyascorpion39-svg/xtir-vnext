$ErrorActionPreference = "Stop"

$path = "src/pages/index.astro"
$c = Get-Content $path -Raw

$marker = "XTIR_HERO3"

$block = @"
  /* XTIR_HERO3 */
  :root{
    --xtir-hero-glow: rgba(120,180,255,.14);
    --xtir-hero-glow2: rgba(120,180,255,.08);
    --xtir-hero-top: rgba(255,255,255,.045);
    --xtir-hero-bottom: rgba(0,0,0,.42);
    --xtir-hero-grid: rgba(255,255,255,.035);
    --xtir-hero-vignette: rgba(0,0,0,.55);
  }

  /* Чуть светлее, чтобы не было “слишком темно” */
  body{
    background:
      radial-gradient(1200px 700px at 50% 0%, rgba(120,180,255,.06), transparent 60%),
      linear-gradient(180deg, rgba(255,255,255,.03), rgba(0,0,0,.70));
  }

  /* HERO: глубина без картинок */
  .hero{
    position: relative;
    overflow: hidden;
    background:
      radial-gradient(900px 520px at 50% 18%, var(--xtir-hero-glow), transparent 62%),
      radial-gradient(700px 420px at 35% 22%, var(--xtir-hero-glow2), transparent 64%),
      linear-gradient(180deg, var(--xtir-hero-top), var(--xtir-hero-bottom));
  }

  .hero::before{
    content:"";
    position:absolute;
    inset:-2px;
    pointer-events:none;
    background:
      linear-gradient(90deg, var(--xtir-hero-grid) 1px, transparent 1px),
      linear-gradient(0deg,  var(--xtir-hero-grid) 1px, transparent 1px);
    background-size: 140px 140px;
    opacity: .22;
    mask-image: radial-gradient(80% 60% at 50% 22%, rgba(0,0,0,1), rgba(0,0,0,0));
  }

  .hero::after{
    content:"";
    position:absolute;
    inset:-2px;
    pointer-events:none;
    background: radial-gradient(1200px 700px at 50% 25%, rgba(0,0,0,0), var(--xtir-hero-vignette) 72%);
    opacity:.85;
  }

  .hero__logo{
    filter: drop-shadow(0 18px 38px rgba(0,0,0,.55));
  }

  .hero__sub{
    color: rgba(255,255,255,.72);
    text-shadow: 0 10px 30px rgba(0,0,0,.55);
  }

  .hero__actions .btn-primary{
    box-shadow: 0 14px 34px rgba(0,0,0,.45), 0 0 0 1px rgba(120,180,255,.18) inset;
  }
  .hero__actions .btn-ghost{
    box-shadow: 0 10px 26px rgba(0,0,0,.35), 0 0 0 1px rgba(255,255,255,.10) inset;
  }
"@

# 1) Если блок уже есть — заменить
$pattern = '(?s)\r?\n\s*/\*\s*XTIR_HERO3\s*\*/.*?(?=\r?\n\s*/\*\s*XTIR_[A-Z0-9_]+\s*\*/|\r?\n\s*</style>)'
if ([regex]::IsMatch($c, $pattern)) {
  $c2 = [regex]::Replace($c, $pattern, "`r`n$block`r`n")
}
else {
  # 2) Иначе — вставить перед </style> (в первом style-блоке страницы)
  if ($c -notmatch '(?s)</style>') { throw "No </style> found in $path" }
  $c2 = [regex]::Replace($c, '(?s)</style>', "`r`n$block`r`n</style>", 1)
}

if ($c2 -ne $c) {
  Set-Content -Path $path -Value $c2 -Encoding UTF8
  Write-Host "OK: XTIR_HERO3 applied to src/pages/index.astro" -ForegroundColor Green
} else {
  Write-Host "No changes made." -ForegroundColor Yellow
}

npx astro check
npm run build
git status
