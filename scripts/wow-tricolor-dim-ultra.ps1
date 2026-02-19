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

$marker = "XTIR_TRICOLOR_TINT"
if ($c -notmatch "(?is)/\*\s*$marker\s*\*/") {
  throw "Block /* $marker */ not found. Run scripts/wow-tricolor-dim.ps1 (or prior dim script) first."
}

# 1) Drop alpha ~3x (пример: 0.45 -> 0.15). If alpha not present, insert it.
if ($c -match "(?is)--xtir-tricolor-alpha\s*:\s*([0-9.]+)\s*;") {
  $c = [regex]::Replace($c, "(?is)(--xtir-tricolor-alpha:\s*)([0-9.]+)(\s*;)", "`$1.15`$3")
} else {
  $c = [regex]::Replace($c, "(?is)(/\*\s*$marker\s*\*/[\s\S]*?\{)", "`$1`n  --xtir-tricolor-alpha: .15;")
}

# 2) Slightly reduce brightness too (so even white segment doesn't pop)
if ($c -match "(?is)--xtir-tricolor-dim\s*:\s*([0-9.]+)\s*;") {
  $c = [regex]::Replace($c, "(?is)(--xtir-tricolor-dim:\s*)([0-9.]+)(\s*;)", "`$1.28`$3")
} else {
  $c = [regex]::Replace($c, "(?is)(/\*\s*$marker\s*\*/[\s\S]*?\{)", "`$1`n  --xtir-tricolor-dim: .28;")
}

# 3) Stronger dark overlay to sink the bar into header
$c = [regex]::Replace(
  $c,
  "(?is)(/\*\s*$marker\s*\*/[\s\S]*?background:\s*linear-gradient\()to bottom,\s*rgba\(0,0,0,[^)]+\),\s*rgba\(0,0,0,[^)]+\)\)",
  "`$1to bottom, rgba(0,0,0,.72), rgba(0,0,0,.40))"
)

if ($c -eq $orig) {
  Write-Host "No changes made (pattern not applied)." -ForegroundColor Yellow
} else {
  WriteUtf8NoBom $index $c
  Write-Host "Patched: tricolor is now ~3x less visible (alpha .15 + dim .28 + stronger overlay)." -ForegroundColor Green
}

npx astro check
npm run build
git status
