Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$path = "src/pages/index.astro"
if (!(Test-Path $path)) { throw "Not found: $path" }

$orig = Get-Content -Path $path -Raw
$nl = if ($orig -match "`r`n") { "`r`n" } else { "`n" }

$c = $orig

# Fix stray boolean attributes (from earlier regex mistakes)
$c = $c -replace '\s+xtir-h1(?=\s|>)', ''
$c = $c -replace '\s+xtir-lead(?=\s|>)', ''

# Ensure classes include xtir-h1 / xtir-lead
$c = [regex]::Replace(
  $c,
  '(<h1\b[^>]*\bclass=")([^"]*\bhero__slogan-text\b[^"]*)(")',
  { param($m)
    $pre = $m.Groups[1].Value
    $cls = $m.Groups[2].Value
    $post = $m.Groups[3].Value
    if ($cls -notmatch '\bxtir-h1\b') { $cls = ($cls + ' xtir-h1').Trim() }
    return "$pre$cls$post"
  },
  [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
)

$c = [regex]::Replace(
  $c,
  '(<p\b[^>]*\bclass=")([^"]*\bhero__sub\b[^"]*)(")',
  { param($m)
    $pre = $m.Groups[1].Value
    $cls = $m.Groups[2].Value
    $post = $m.Groups[3].Value
    if ($cls -notmatch '\bxtir-lead\b') { $cls = ($cls + ' xtir-lead').Trim() }
    return "$pre$cls$post"
  },
  [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
)

# Slightly brighten base palette on the index page (only if variables exist)
$c = $c -replace '(--bg:\s*)#[0-9a-fA-F]{3,8}', '${1}#111822'
$c = $c -replace '(--bg2:\s*)#[0-9a-fA-F]{3,8}', '${1}#0e131b'
$c = $c -replace '(--sf:\s*)#[0-9a-fA-F]{3,8}', '${1}#171f2a'

$marker = "XTIR_SECTIONS_LIGHT"
$block = @"
  /* $marker */
  :root{
    /* brighter, but still "night-ops" */
    --xtir-sec-glowA: rgba(120,170,255,.12);
    --xtir-sec-glowB: rgba(255,255,255,.055);
    --xtir-sec-glowC: rgba(190,120,255,.07);
  }

  /* Sections: less "black hole", more readable depth */
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

  /* Soft top haze (prevents harsh seam under hero) */
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

  /* Lift secondary text a bit */
  .sec .sub{ color: rgba(255,255,255,.72); }
  .sec .kicker{ color: rgba(170,200,255,.78); }

  /* Stats bar: bump contrast so it doesn't "sink" */
  .hero__stats{
    border-color: rgba(255,255,255,.12);
    background: rgba(10,14,18,.55);
  }
  .hero__stats .hstat__n{ color: rgba(140,190,255,.95); text-shadow: 0 0 18px rgba(120,170,255,.22); }
  .hero__stats .hstat__l{ color: rgba(255,255,255,.62); }
"@

# Normalize newlines to match file
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
