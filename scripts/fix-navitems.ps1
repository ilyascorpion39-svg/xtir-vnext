param()

$ErrorActionPreference = "Stop"

$header = "src/components/common/Header.tsx"
if (!(Test-Path -LiteralPath $header)) { throw "Не найден $header" }

$t = Get-Content -LiteralPath $header -Raw

# Replace navItems array to include name + href (compat with existing rendering)
$navItems = @"
const navItems = [
  { name: 'Главная', href: '/' },
  { name: 'Продукты', href: '/products' },
  { name: 'Технологии', href: '/technologies' },
  { name: 'Галерея', href: '/gallery' },
  { name: 'Партнёры', href: '/partners' },
  { name: 'О компании', href: '/about' },
  { name: 'Поддержка', href: '/support' },
  { name: 'Контакты', href: '/contact' },
];
"@

if ($t -match "const\s+navItems\s*=\s*\[") {
  $t = [regex]::Replace($t, "const\s+navItems\s*=\s*\[[\s\S]*?\];", $navItems, 1)
} else {
  $t = [regex]::Replace($t, "(?m)^(import[\s\S]*?\r?\n\r?\n)", "`$1$navItems`n", 1)
}

Set-Content -LiteralPath $header -Value $t -NoNewline -Encoding UTF8
Write-Host "OK: navItems patched with {name, href}" -ForegroundColor Green

Write-Host "Build..." -ForegroundColor Cyan
npm run build | Out-Host
