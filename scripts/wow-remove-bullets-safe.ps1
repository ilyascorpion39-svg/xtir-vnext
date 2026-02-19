$ErrorActionPreference = "Stop"

$index = "src/pages/index.astro"
if (!(Test-Path $index)) { throw "Not found: $index" }

function ReadUtf8NoBom($p){
  [System.IO.File]::ReadAllText($p, [System.Text.UTF8Encoding]::new($false))
}
function WriteUtf8NoBom($p, $t){
  [System.IO.File]::WriteAllText($p, $t, [System.Text.UTF8Encoding]::new($false))
}

# 1) Всегда стартуем с чистого index (чтобы не тащить мусорный CSS вне <style>)
git restore -- $index

$c = ReadUtf8NoBom $index

# 2) Найти ПЕРВЫЙ блок <style ...> ... </style>
$open = [regex]::Match($c, "(?is)<style\b[^>]*>")
if(!$open.Success){ throw "No <style> found in index.astro" }
$close = [regex]::Match($c.Substring($open.Index + $open.Length), "(?is)</style>")
if(!$close.Success){ throw "No </style> found in index.astro" }

$styleStart = $open.Index
$styleInnerStart = $open.Index + $open.Length
$styleInnerEnd = $styleInnerStart + $close.Index
$styleEnd = $styleInnerEnd + $close.Length

$before = $c.Substring(0, $styleInnerStart)
$inner  = $c.Substring($styleInnerStart, $styleInnerEnd - $styleInnerStart)
$after  = $c.Substring($styleInnerEnd)

# 3) Вырезать старый блок, если уже вставляли раньше
$inner = [regex]::Replace($inner, "(?is)\s*/\*\s*XTIR_NO_BULLETS\s*\*/[\s\S]*?(?=(/\*\s*XTIR_[A-Z0-9_]+\s*\*/)|\z)", "")

# 4) Добавить безопасный фикс (без лишних } и только CSS)
$fix = @"
`r`n/* XTIR_NO_BULLETS */
.hero [class*="bullet"], .hero [class*="streak"], .hero [class*="tracer"], .hero [class*="shot"], .hero [class*="sweep"]{
  animation: none !important;
  transition: none !important;
  opacity: 0 !important;
  display: none !important;
}
.hero :where(.hero__bg, .hero__grid, .hero__scan)::before,
.hero :where(.hero__bg, .hero__grid, .hero__scan)::after{
  animation: none !important;
}
`r`n
"@

$inner = $inner.TrimEnd() + $fix

# 5) Собрать обратно и сохранить в UTF-8 без BOM
$out = $before + $inner + $after
WriteUtf8NoBom $index $out

Write-Host "Patched: bullets disabled safely inside <style>." -ForegroundColor Green

npx astro check
npm run build
git status
