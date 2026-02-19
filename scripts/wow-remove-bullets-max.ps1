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

# --- locate first <style>...</style>
$open = [regex]::Match($c, "(?is)<style\b[^>]*>")
if(!$open.Success){ throw "No <style> found in index.astro" }
$close = [regex]::Match($c.Substring($open.Index + $open.Length), "(?is)</style>")
if(!$close.Success){ throw "No </style> found in index.astro" }

$styleInnerStart = $open.Index + $open.Length
$styleInnerEnd = $styleInnerStart + $close.Index

$before = $c.Substring(0, $styleInnerStart)
$inner  = $c.Substring($styleInnerStart, $styleInnerEnd - $styleInnerStart)
$after  = $c.Substring($styleInnerEnd)

# remove old block if exists
$inner = [regex]::Replace($inner, "(?is)\s*/\*\s*XTIR_NO_BULLETS_MAX\s*\*/[\s\S]*?(?=(/\*\s*XTIR_[A-Z0-9_]+\s*\*/)|\z)", "")

$css = @"
`r`n/* XTIR_NO_BULLETS_MAX */
.hero :where(.hero__bg,.hero__grid,.hero__scan,.hero__fx,.hero__decor,.hero__effects,.hero__backdrop,.bg,.grid,.scan,.fx,.decor,.effects,.backdrop){
  animation: none !important;
  transition: none !important;
  filter: none !important;
}
.hero :where(.hero__bg,.hero__grid,.hero__scan,.hero__fx,.hero__decor,.hero__effects,.hero__backdrop,.bg,.grid,.scan,.fx,.decor,.effects,.backdrop) *,
.hero :where(.hero__bg,.hero__grid,.hero__scan,.hero__fx,.hero__decor,.hero__effects,.hero__backdrop,.bg,.grid,.scan,.fx,.decor,.effects,.backdrop)::before,
.hero :where(.hero__bg,.hero__grid,.hero__scan,.hero__fx,.hero__decor,.hero__effects,.hero__backdrop,.bg,.grid,.scan,.fx,.decor,.effects,.backdrop)::after{
  animation: none !important;
  transition: none !important;
  animation-play-state: paused !important;
}
/* Если “пули” сделаны как тонкие абсолютные линии */
.hero :where(span, i, b, em, strong, div)[class]{
  /* только для явно декоративных элементов по именам */
}
.hero [class*="bullet" i],
.hero [class*="tracer" i],
.hero [class*="streak" i],
.hero [class*="shot" i],
.hero [class*="beam" i],
.hero [class*="laser" i],
.hero [class*="ray" i],
.hero [class*="sweep" i],
.hero [class*="scan" i],
.hero [class*="line" i]{
  display: none !important;
  opacity: 0 !important;
  animation: none !important;
  transition: none !important;
}
/* Часто “полоски” живут в псевдоэлементах hero */
.hero::before, .hero::after{
  animation: none !important;
  transition: none !important;
}
`r`n
"@

$inner = $inner.TrimEnd() + $css
$out = $before + $inner + $after

# --- inject tiny remover script near end of hero (or before </body> as fallback)
$jsMarker = "<!-- XTIR_NO_BULLETS_MAX_JS -->"
if ($out -notmatch [regex]::Escape($jsMarker)) {
  $js = @"
`r`n$jsMarker
<script is:inline>
(() => {
  const killRe = /(bullet|tracer|streak|shot|beam|laser|ray|sweep|scan|line)/i;
  const root = document.querySelector('.hero') || document;
  const sweep = () => {
    root.querySelectorAll('[class]').forEach(el => {
      const cls = (el.className && el.className.toString()) || '';
      if (killRe.test(cls)) el.remove();
    });
    root.querySelectorAll('[style]').forEach(el => {
      const st = el.getAttribute('style') || '';
      if (/animation/i.test(st) && /(bullet|tracer|streak|shot|beam|laser|ray|sweep|scan|line)/i.test(st)) el.remove();
    });
  };
  sweep();
  // на случай, если эффекты создаются после загрузки
  const mo = new MutationObserver(() => sweep());
  mo.observe(root, { subtree:true, childList:true });
  setTimeout(() => mo.disconnect(), 8000);
})();
</script>
`r`n
"@

  if ($out -match "(?is)</body>") {
    $out = [regex]::Replace($out, "(?is)</body>", ($js + "`r`n</body>"), 1)
  } else {
    $out += $js
  }
}

WriteUtf8NoBom $index $out
Write-Host "Applied MAX bullets removal (CSS + JS)." -ForegroundColor Green

npx astro check
npm run build
git status
