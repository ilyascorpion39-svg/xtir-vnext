param()
$ErrorActionPreference="Stop"

Write-Host "== XTIR: Fix partner pages archive paths for BASE_URL (v2) ==" -ForegroundColor Cyan

$dir = "src/pages/partners"
if (!(Test-Path -LiteralPath $dir)) { throw "Не найдено: $dir" }

$files = Get-ChildItem -LiteralPath $dir -Filter "*.astro" -File -ErrorAction SilentlyContinue
if (!$files) { throw "Не нашёл *.astro в $dir" }

foreach ($f in $files) {
  $t = Get-Content -LiteralPath $f.FullName -Raw
  $orig = $t

  # Ensure frontmatter exists
  if ($t -notmatch "(?s)^---\s*[\s\S]*?\s*---") {
    Write-Host "SKIP (no frontmatter): $($f.Name)" -ForegroundColor Yellow
    continue
  }

  # Inject helper once
  if ($t -notmatch "(?m)^\s*const\s+BASE_URL\s*=" -and $t -notmatch "(?m)^\s*const\s+asset\s*=") {
    $t = [regex]::Replace($t, "(?s)^---\s*([\s\S]*?)\s*---", {
      param($m)
      $fm = $m.Groups[1].Value.TrimEnd()
      $helper = @"
const BASE_URL = import.meta.env.BASE_URL ?? '/';
const asset = (p) => {
  const base = BASE_URL.endsWith('/') ? BASE_URL : (BASE_URL + '/');
  return base + String(p).replace(/^\/+/, '');
};

"@
      return "---`n$fm`n`n$helper---"
    }, 1)
  }

  # Replace src: '/xtir-archive/...' -> src: asset('xtir-archive/...')
  $t = [regex]::Replace($t, "src:\s*'\/(xtir-archive\/[^']+)'", {
    param($m) "src: asset('" + $m.Groups[1].Value + "')"
  })
  $t = [regex]::Replace($t, 'src:\s*"\/(xtir-archive\/[^"]+)"', {
    param($m) 'src: asset("' + $m.Groups[1].Value + '")'
  })

  if ($t -ne $orig) {
    Set-Content -LiteralPath $f.FullName -Value $t -NoNewline -Encoding UTF8
    Write-Host "OK: patched $($f.Name)" -ForegroundColor Green
  } else {
    Write-Host "OK: no changes in $($f.Name)" -ForegroundColor DarkGray
  }
}

npm run build | Out-Host
pwsh scripts/wow.ps1 | Out-Host
