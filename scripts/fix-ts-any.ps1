$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

function Patch-File {
  param([string]$Path, [scriptblock]$Fn)
  if (!(Test-Path $Path)) { Write-Host "SKIP: $Path" -ForegroundColor Yellow; return }
  $before = Get-Content -Raw -Encoding UTF8 $Path
  $after = & $Fn $before
  if ($after -ne $before) {
    Set-Content -Path $Path -Encoding UTF8 -NoNewline -Value $after
    Write-Host "OK: patched $Path" -ForegroundColor Green
  } else {
    Write-Host "OK: no changes $Path" -ForegroundColor DarkGray
  }
}

Write-Host "== XTIR: Fix TS implicit any ==" -ForegroundColor Cyan

# 1) reb-zont.astro: withBase(p: string)
Patch-File "src/pages/partners/reb-zont.astro" {
  param($c)
  $c = $c -replace 'const\s+withBase\s*=\s*\(\s*p\s*\)\s*=>', 'const withBase = (p: string) =>'
  return $c
}

# 2) partners/[slug].astro: asset(p: string) + void asset; (to avoid "never read")
Patch-File "src/pages/partners/[slug].astro" {
  param($c)

  # type the parameter in asset
  $c2 = $c -replace 'const\s+asset\s*=\s*\(\s*p\s*\)\s*=>', 'const asset = (p: string) =>'

  # if asset exists and "void asset;" not yet present, add it right after the declaration line (safe, no block removal)
  if ($c2 -match 'const\s+asset\s*=' -and $c2 -notmatch 'void\s+asset\s*;') {
    # Insert "void asset;" after the first occurrence of "const asset = ..."
    $c2 = [regex]::Replace($c2, '(const\s+asset\s*=\s*\([^)]*\)\s*=>)', '$1' + "`r`n" + 'void asset;', 1)
  }

  return $c2
}

# 3) partners/index.astro: same treatment
Patch-File "src/pages/partners/index.astro" {
  param($c)

  $c2 = $c -replace 'const\s+asset\s*=\s*\(\s*p\s*\)\s*=>', 'const asset = (p: string) =>'

  if ($c2 -match 'const\s+asset\s*=' -and $c2 -notmatch 'void\s+asset\s*;') {
    $c2 = [regex]::Replace($c2, '(const\s+asset\s*=\s*\([^)]*\)\s*=>)', '$1' + "`r`n" + 'void asset;', 1)
  }

  return $c2
}

Write-Host "== DONE ==" -ForegroundColor Green