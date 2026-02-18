param()
$ErrorActionPreference="Stop"

Write-Host "== XTIR: Fix partner asset() order (v1) ==" -ForegroundColor Cyan

$dir = "src/pages/partners"
$files = Get-ChildItem -LiteralPath $dir -Filter "*.astro" -File -ErrorAction SilentlyContinue
if (!$files) { throw "Не нашёл *.astro в $dir" }

$helper = @"
const BASE_URL = import.meta.env.BASE_URL ?? '/';
const asset = (p) => {
  const base = BASE_URL.endsWith('/') ? BASE_URL : (BASE_URL + '/');
  return base + String(p).replace(/^\/+/, '');
};
"@

foreach ($f in $files) {
  $t = Get-Content -LiteralPath $f.FullName -Raw
  if ($t -notmatch "(?s)^---\s*([\s\S]*?)\s*---") { continue }

  $fm = $Matches[1]

  # remove any existing helper (BASE_URL/asset) to reinsert cleanly
  $fm2 = $fm
  $fm2 = [regex]::Replace($fm2, "(?ms)^\s*const\s+BASE_URL\s*=\s*.*?;\s*$", "")
  $fm2 = [regex]::Replace($fm2, "(?ms)^\s*const\s+asset\s*=\s*\(p\)\s*=>\s*\{[\s\S]*?\};\s*$", "")
  $fm2 = [regex]::Replace($fm2, "(?ms)^\s*const\s+asset\s*=\s*\(p\)\s*=>\s*\{[\s\S]*?\}\s*$", "")
  $fm2 = $fm2.Trim()

  # find earliest "const photos|docs|videoLinks|partner|data" to insert helper before it
  $m = [regex]::Match($fm2, "(?m)^\s*const\s+(photos|docs|videoLinks|partner|data)\b")
  if ($m.Success) {
    $idx = $m.Index
    $before = $fm2.Substring(0,$idx).TrimEnd()
    $after  = $fm2.Substring($idx).TrimStart()
    $fm2 = ($before + "`n`n" + $helper + "`n`n" + $after).Trim()
  } else {
    # if no obvious const blocks, append helper at end of frontmatter
    $fm2 = ($fm2 + "`n`n" + $helper).Trim()
  }

  $t2 = [regex]::Replace($t, "(?s)^---\s*[\s\S]*?\s*---", "---`n$fm2`n---", 1)
  if ($t2 -ne $t) {
    Set-Content -LiteralPath $f.FullName -Value $t2 -NoNewline -Encoding UTF8
    Write-Host "OK: fixed order in $($f.Name)" -ForegroundColor Green
  } else {
    Write-Host "OK: no change $($f.Name)" -ForegroundColor DarkGray
  }
}

npm run dev -- --host 0.0.0.0 | Out-Host
