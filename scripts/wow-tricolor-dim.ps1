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
$orig = $c

# Find first <style ...> ... </style>
$open = [regex]::Match($c, "(?is)<style\b[^>]*>")
if(!$open.Success){ throw "No <style> found in index.astro" }
$close = [regex]::Match($c.Substring($open.Index + $open.Length), "(?is)</style>")
if(!$close.Success){ throw "No </style> found in index.astro" }

$styleInnerStart = $open.Index + $open.Length
$styleInnerEnd = $styleInnerStart + $close.Index

$before = $c.Substring(0, $styleInnerStart)
$inner  = $c.Substring($styleInnerStart, $styleInnerEnd - $styleInnerStart)
$after  = $c.Substring($styleInnerEnd)

# Remove previous block if present
$marker = "XTIR_TRICOLOR_TINT"
$inner = [regex]::Replace(
  $inner,
  "(?is)\s*/\*\s*$marker\s*\*/[\s\S]*?(?=(/\*\s*XTIR_[A-Z0-9_]+\s*\*/)|\z)",
  ""
)

$css = @"
`r`n/* $marker */
/* Затемняем/приглушаем триколор-полоску под шапкой */
:root{
  --xtir-tricolor-dim: .62;     /* 0..1: меньше = темнее */
  --xtir-tricolor-alpha: .78;   /* прозрачность полоски */
}

/* Попытка поймать разные варианты классов/атрибутов */
.tricolor, .tricolor-bar, .xtir-tricolor, .topbar__tricolor, .header__tricolor,
[data-tricolor], [data-xtir-tricolor]{
  opacity: var(--xtir-tricolor-alpha) !important;
  filter: brightness(var(--xtir-tricolor-dim)) saturate(.95) !important;
}

/* Если триколор нарисован псевдоэлементом */
.tricolor::before, .tricolor::after,
.tricolor-bar::before, .tricolor-bar::after,
.xtir-tricolor::before, .xtir-tricolor::after,
.topbar__tricolor::before, .topbar__tricolor::after,
.header__tricolor::before, .header__tricolor::after,
[data-tricolor]::before, [data-tricolor]::after,
[data-xtir-tricolor]::before, [data-xtir-tricolor]::after{
  opacity: var(--xtir-tricolor-alpha) !important;
  filter: brightness(var(--xtir-tricolor-dim)) saturate(.95) !important;
}

/* Лёгкая “дымка” поверх, чтобы выглядело технично и не кричало */
.tricolor, .tricolor-bar, .xtir-tricolor, .topbar__tricolor, .header__tricolor,
[data-tricolor], [data-xtir-tricolor]{
  position: relative;
}
.tricolor::after, .tricolor-bar::after, .xtir-tricolor::after,
.topbar__tricolor::after, .header__tricolor::after,
[data-tricolor]::after, [data-xtir-tricolor]::after{
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(to bottom, rgba(0,0,0,.28), rgba(0,0,0,.10));
}
`r`n
"@

$inner = $inner.TrimEnd() + $css
$out = $before + $inner + $after

if ($out -ne $orig) {
  WriteUtf8NoBom $index $out
  Write-Host "Patched: tricolor tint added to index.astro" -ForegroundColor Green
} else {
  Write-Host "No changes made." -ForegroundColor Yellow
}

npx astro check
npm run build
git status
