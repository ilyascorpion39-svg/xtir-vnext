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
  throw "Block /* $marker */ not found. Run scripts/wow-tricolor-dim.ps1 first (it creates the block)."
}

# Replace just the variables + overlay gradient in that block
$c2 = $c

# Dim + alpha
$c2 = [regex]::Replace($c2, "(?is)(--xtir-tricolor-dim:\s*)([0-9.]+)(\s*;)", "`$1.42`$3")
$c2 = [regex]::Replace($c2, "(?is)(--xtir-tricolor-alpha:\s*)([0-9.]+)(\s*;)", "`$1.45`$3")

# Make overlay stronger to “sink” the stripe into the header
$c2 = [regex]::Replace(
  $c2,
  "(?is)(/\*\s*$marker\s*\*/[\s\S]*?background:\s*linear-gradient\()to bottom,\s*rgba\(0,0,0,[^)]+\),\s*rgba\(0,0,0,[^)]+\)\)",
  "`$1to bottom, rgba(0,0,0,.55), rgba(0,0,0,.25))"
)

if ($c2 -eq $orig) {
  Write-Host "No changes made (pattern not applied)." -ForegroundColor Yellow
} else {
  WriteUtf8NoBom $index $c2
  Write-Host "Patched: tricolor is now much less prominent (dim/alpha/overlay)." -ForegroundColor Green
}

npx astro check
npm run build
git status
