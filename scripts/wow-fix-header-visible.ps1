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

# Remove old block if present
$marker = "XTIR_HEADER_VISIBLE"
$inner = [regex]::Replace(
  $inner,
  "(?is)\s*/\*\s*$marker\s*\*/[\s\S]*?(?=(/\*\s*XTIR_[A-Z0-9_]+\s*\*/)|\z)",
  ""
)

$css = @"
`r`n/* $marker */
/* Жёстко возвращаем шапку поверх hero/фона */
header, .header, .site-header, .topbar, [data-header], [role="banner"]{
  position: sticky !important;
  top: 0 !important;
  z-index: 9999 !important;
}

/* Видимость/контраст */
header, .header, .site-header, .topbar, [data-header], [role="banner"]{
  background: rgba(6,10,14,.72) !important;
  backdrop-filter: blur(10px) saturate(1.05);
  -webkit-backdrop-filter: blur(10px) saturate(1.05);
  border-bottom: 1px solid rgba(255,255,255,.10) !important;
}

/* Текст/ссылки */
header a, .header a, .site-header a, .topbar a, [role="banner"] a{
  color: rgba(255,255,255,.86) !important;
}
header a:hover, .header a:hover, .site-header a:hover, .topbar a:hover, [role="banner"] a:hover{
  color: rgba(170,210,255,.98) !important;
}

/* На всякий случай: если шапку “съедает” родитель */
body, main, .page, .layout{
  overflow-x: hidden;
}
`r`n
"@

$inner = $inner.TrimEnd() + $css
$out = $before + $inner + $after

if ($out -ne $orig) {
  WriteUtf8NoBom $index $out
  Write-Host "Patched: header visibility fix added to index.astro" -ForegroundColor Green
} else {
  Write-Host "No changes made." -ForegroundColor Yellow
}

npx astro check
npm run build
git status
