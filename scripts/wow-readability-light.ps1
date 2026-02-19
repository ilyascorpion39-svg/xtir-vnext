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

# Remove old block if already present
$marker = "XTIR_READABILITY_LIGHT"
$inner = [regex]::Replace(
  $inner,
  "(?is)\s*/\*\s*$marker\s*\*/[\s\S]*?(?=(/\*\s*XTIR_[A-Z0-9_]+\s*\*/)|\z)",
  ""
)

$css = @"
`r`n/* $marker */
:root{
  --xtir-midlift: rgba(255,255,255,.028);
  --xtir-midlift2: rgba(255,255,255,.018);
  --xtir-text-strong: rgba(255,255,255,.92);
  --xtir-text: rgba(255,255,255,.78);
  --xtir-text-soft: rgba(255,255,255,.66);
  --xtir-line: rgba(255,255,255,.12);
  --xtir-line2: rgba(255,255,255,.08);
  --xtir-glowA: rgba(120,170,255,.12);
  --xtir-glowB: rgba(190,120,255,.08);
}

/* Общая читабельность */
.hero, .sec{ color: var(--xtir-text); }
.h1, .h2, .hero__slogan-text{ color: var(--xtir-text-strong); }
.sub, .hero__sub{ color: var(--xtir-text-soft); }

/* Мягче “швы” между блоками */
.sec{
  position: relative;
  border-top: 1px solid var(--xtir-line2);
}
.sec:first-of-type{ border-top: none; }

/* Поднять средние тона секций, чтобы не было “слишком темно” */
.sec--dark, .sec--darker{
  background:
    radial-gradient(1200px 700px at 50% 0%, var(--xtir-midlift), transparent 62%),
    radial-gradient(900px 540px at 20% 10%, var(--xtir-glowA), transparent 68%),
    radial-gradient(900px 540px at 80% 20%, var(--xtir-glowB), transparent 72%),
    linear-gradient(180deg, rgba(255,255,255,.04), rgba(0,0,0,.00) 58%);
}

/* Лёгкая подсветка зоны заголовка секции (если есть .sec__hd) */
.sec__hd{
  position: relative;
}
.sec__hd::after{
  content:"";
  position:absolute;
  left:-6px; right:-6px;
  top:-10px;
  height:140px;
  pointer-events:none;
  background:
    radial-gradient(520px 120px at 18% 40%, rgba(120,170,255,.14), transparent 72%),
    radial-gradient(520px 120px at 70% 40%, rgba(190,120,255,.10), transparent 74%);
  filter: blur(12px);
  opacity:.55;
}

/* Карточки: чуть светлее “поверхность”, читаемее границы */
.dcard, .wcard{
  border-color: var(--xtir-line);
}
.dcard__body, .wcard{
  color: var(--xtir-text);
}

/* Статбар: контрастнее числа и подписи */
.hero__stats{
  border-color: var(--xtir-line);
}
.hero__stats .hstat__n{
  color: rgba(140,190,255,.95);
  text-shadow: 0 0 18px rgba(120,170,255,.22);
}
.hero__stats .hstat__l{
  color: rgba(255,255,255,.62);
}

/* Кнопки: аккуратный объём */
.btn-primary, .btn-ghost{
  box-shadow: 0 10px 28px rgba(0,0,0,.30);
}
`r`n
"@

$inner = $inner.TrimEnd() + $css
$out = $before + $inner + $after

if ($out -ne $orig) {
  WriteUtf8NoBom $index $out
  Write-Host "Patched: readability-light added to index.astro" -ForegroundColor Green
} else {
  Write-Host "No changes made." -ForegroundColor Yellow
}

npx astro check
npm run build
git status
