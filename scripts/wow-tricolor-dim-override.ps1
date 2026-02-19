$ErrorActionPreference = "Stop"

$index = "src/pages/index.astro"
if (!(Test-Path $index)) { throw "Not found: $index" }

function ReadUtf8NoBom($p){
  [System.IO.File]::ReadAllText($p, [System.Text.UTF8Encoding]::new($false))
}
function WriteUtf8NoBom($p, $t){
  [System.IO.File]::WriteAllText($p, $t, [System.Text.UTF8Encoding]::new($false))
}

$c = ReadUtf8NoBom $index

$marker = "XTIR_TRICOLOR_DIM_OVERRIDE"
$nl = "(?:\r?\n)"

# 1) Remove previous override block if exists (idempotent)
$patternRemove = "(?is)$nl?\s*/\*\s*$marker\s*\*/.*?(?=$nl\s*</style>)"
$c = [regex]::Replace($c, $patternRemove, "")

# 2) Inject override right before </style>
if ($c -notmatch "(?is)</style>") { throw "No </style> found in index.astro" }

$css = @"
/* $marker */
:root{
  --xtir-tricolor-opacity: .33;      /* ~в 3 раза тише */
  --xtir-tricolor-brightness: .72;   /* чуть темнее */
  --xtir-tricolor-saturate: .80;     /* меньше “кислоты” */
}

/* Ловим самые частые варианты классов/блоков */
.tricolor,
.tricolor-bar,
.header-tricolor,
.xtir-tricolor,
.top-tricolor,
.xtir-topline,
[data-tricolor],
[aria-label*="триколор" i],
[aria-label*="tricolor" i]{
  opacity: var(--xtir-tricolor-opacity) !important;
  filter: brightness(var(--xtir-tricolor-brightness)) saturate(var(--xtir-tricolor-saturate)) !important;
}

/* Если триколор нарисован псевдоэлементом */
.tricolor::before, .tricolor::after,
.tricolor-bar::before, .tricolor-bar::after,
.header-tricolor::before, .header-tricolor::after,
.xtir-tricolor::before, .xtir-tricolor::after,
.top-tricolor::before, .top-tricolor::after,
.xtir-topline::before, .xtir-topline::after,
[data-tricolor]::before, [data-tricolor]::after{
  opacity: var(--xtir-tricolor-opacity) !important;
  filter: brightness(var(--xtir-tricolor-brightness)) saturate(var(--xtir-tricolor-saturate)) !important;
}
/* $marker END */
"@

$c = [regex]::Replace($c, "(?is)$nl\s*</style>", "`r`n`r`n$css`r`n</style>")

WriteUtf8NoBom $index $c
Write-Host "Injected tricolor dim override into $index" -ForegroundColor Green

npx astro check
npm run build
git status
