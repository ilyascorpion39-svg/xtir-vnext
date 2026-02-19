Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$path = "src/pages/index.astro"
if (!(Test-Path $path)) { throw "Not found: $path" }

$orig = Get-Content -Path $path -Raw
$nl = if ($orig -match "`r`n") { "`r`n" } else { "`n" }

$c = $orig

# Ensure marker block content (idempotent)
$marker = "XTIR_SECTIONS_LIGHT"
$block = @"
  /* $marker */
  :root{
    /* slightly brighter overall page feel (still dark) */
    --xtir-sec-glowA: rgba(120,170,255,.12);
    --xtir-sec-glowB: rgba(255,255,255,.055);
    --xtir-sec-glowC: rgba(190,120,255,.07);
  }

  .sec--dark,
  .sec--darker,
  .sec--cta{
    position: relative;
    isolation: isolate;
    background:
      radial-gradient(1100px 620px at 18% 0%, var(--xtir-sec-glowA), transparent 62%),
      radial-gradient(900px 520px at 84% 18%, var(--xtir-sec-glowC), transparent 68%),
      linear-gradient(180deg, rgba(255,255,255,.045), rgba(255,255,255,.018));
  }

  .sec--dark{ background-color: rgba(14,18,24,.56); }
  .sec--darker{ background-color: rgba(12,14,18,.60); }
  .sec--cta{ background-color: rgba(14,18,24,.48); }

  .sec--dark::before,
  .sec--darker::before,
  .sec--cta::before{
    content: "";
    position: absolute;
    inset: -46px -34px;
    background:
      linear-gradient(180deg, rgba(255,255,255,.09), transparent 44%),
      radial-gradient(1200px 700px at 50% 30%, rgba(120,170,255,.08), transparent 62%);
    opacity: .55;
    filter: blur(24px);
    pointer-events: none;
    z-index: -1;
  }

  .sec .sub{ color: rgba(255,255,255,.72); }
  .sec .kicker{ color: rgba(170,200,255,.78); }

  .hero__stats{
    border-color: rgba(255,255,255,.12);
    background: rgba(10,14,18,.55);
  }
  .hero__stats .hstat__n{ color: rgba(140,190,255,.95); text-shadow: 0 0 18px rgba(120,170,255,.22); }
  .hero__stats .hstat__l{ color: rgba(255,255,255,.62); }
"@

$block = $block -replace "`r`n", $nl

# Replace existing block or insert before </style>
$pattern = "(?s)\s*/\*\s*$marker\s*\*/.*?(?=(\r?\n\s*/\*\s*XTIR_[A-Z0-9_]+\s*\*/)|(\r?\n\s*</style>))"

if ([regex]::IsMatch($c, "/\*\s*$marker\s*\*/")) {
  $c = [regex]::Replace($c, $pattern, $nl + $block + $nl)
} else {
  $m = [regex]::Match($c, "(\r?\n)\s*</style>", [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
  if (!$m.Success) { throw "Can't find </style> in $path" }
  $idx = $m.Index
  $c = $c.Insert($idx, $nl + $block + $nl)
}

if ($c -ne $orig) {
  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($path, $c, $utf8NoBom)
  Write-Host "Updated: $path" -ForegroundColor Green
} else {
  Write-Host "No changes made." -ForegroundColor Yellow
}

npx astro check
npm run build
git status
