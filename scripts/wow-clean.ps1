$ErrorActionPreference = "Stop"

$path = "src/pages/index.astro"
$c = Get-Content $path -Raw

$removeMarkers = @(
  "XTIR_HERO_OVERLAY_FIX",
  "XTIR_HERO_LAYER_FIX",
  "XTIR_HERO_LOGO_CLEANUP",
  "XTIR_HERO_BG_LOGO_MASK",
  "XTIR_HERO_FINAL_CLEAN",
  "XTIR_HERO_ANTI_MUD",
  "XTIR_CINEMATIC_FLOW",
  "XTIR_DEPTH_CORRIDOR",
  "XTIR_DEPTH_CORRIDOR_TUNE"
)

function Remove-CssBlockByMarker([string]$text, [string]$marker) {
  $nl = "(?:\r?\n)"
  # ВАЖНО: ${nl} чтобы PowerShell не пытался прочитать переменную $nl?
  $pattern = "(?s)${nl}?\s*/\*\s*$marker\s*\*/.*?(?=((${nl})\s*/\*\s*XTIR_[A-Z0-9_]+\s*\*/)|(${nl})\s*</style>)"
  return [regex]::Replace($text, $pattern, "`r`n")
}

$before = $c
$removed = @()

foreach ($m in $removeMarkers) {
  $new = Remove-CssBlockByMarker $c $m
  if ($new -ne $c) { $removed += $m }
  $c = $new
}

$c = [regex]::Replace($c, "(\r?\n){4,}", "`r`n`r`n`r`n")

if ($c -ne $before) {
  Set-Content -Path $path -Value $c -Encoding UTF8
  Write-Host "OK: removed blocks:" -ForegroundColor Green
  $removed | ForEach-Object { Write-Host " - $_" -ForegroundColor Green }
} else {
  Write-Host "Nothing removed — file unchanged." -ForegroundColor Yellow
}

npx astro check
npm run build
git status
