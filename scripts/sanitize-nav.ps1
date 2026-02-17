param()

$ErrorActionPreference = "Stop"

$header = "src/components/common/Header.tsx"
if (!(Test-Path -LiteralPath $header)) { throw "Не найден $header" }

$t = Get-Content -LiteralPath $header -Raw
$orig = $t

# Heuristic: remove obvious junk words if they appear as standalone menu labels
$junk = @("йога","золот","ставки","ще","папа")
$found = @()
foreach ($w in $junk) {
  if ($t -match [regex]::Escape($w)) { $found += $w }
}

if (@($found).Count -gt 0) {
  Write-Host "Found junk tokens in Header.tsx:" -ForegroundColor Yellow
  $found | Sort-Object -Unique | Out-Host
}

# Replace a nav array if it exists (best-effort)
# We try to find something like: const navItems = [...]
$navItems = @"
const navItems = [
  { label: 'Главная', href: '/' },
  { label: 'Продукты', href: '/products' },
  { label: 'Технологии', href: '/technologies' },
  { label: 'Галерея', href: '/gallery' },
  { label: 'Партнёры', href: '/partners' },
  { label: 'О компании', href: '/about' },
  { label: 'Поддержка', href: '/support' },
  { label: 'Контакты', href: '/contact' },
];
"@

if ($t -match "const\s+navItems\s*=\s*\[") {
  $t = [regex]::Replace($t, "const\s+navItems\s*=\s*\[[\s\S]*?\];", $navItems, 1)
} else {
  # If no navItems, inject near top after imports
  $t = [regex]::Replace($t, "(?m)^(import[\s\S]*?\r?\n\r?\n)", "`$1$navItems`n", 1)
}

# Optional: remove junk literals if still present
foreach ($w in $junk) {
  $t = $t -replace [regex]::Escape($w), ""
}

if ($t -ne $orig) {
  Set-Content -LiteralPath $header -Value $t -NoNewline -Encoding UTF8
  Write-Host "OK: Header navigation sanitized." -ForegroundColor Green
} else {
  Write-Host "No changes made (pattern not found)." -ForegroundColor Yellow
}

Write-Host "Build..." -ForegroundColor Cyan
npm run build | Out-Host
