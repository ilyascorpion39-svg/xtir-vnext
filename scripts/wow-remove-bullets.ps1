Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$path = "src/pages/index.astro"
if (!(Test-Path $path)) { throw "Not found: $path" }

# Читаем строго как UTF-8 без BOM
$utf8 = New-Object System.Text.UTF8Encoding($false)
$orig = [System.IO.File]::ReadAllText($path, $utf8)
$nl = if ($orig -match "`r`n") { "`r`n" } else { "`n" }
$c = $orig

$marker = "XTIR_REMOVE_BULLETS"
$block = @"
  /* $marker */
  /* Глушим декоративные "пули/точки/пульсы", не ломая структуру */
  .bullet, .bullets, .pulse, .pulses, .dot, .dots, .marker, .markers,
  .hero__bdot, .cta__dot, .cta__bdot, .ui-dot, .ui-bullet{
    display: none !important;
  }

  /* Если пули нарисованы псевдоэлементами */
  .bullet::before, .bullet::after,
  .pulse::before, .pulse::after,
  .dot::before, .dot::after,
  .hero__badge::before, .hero__badge::after{
    content: none !important;
    display: none !important;
  }

  /* На всякий случай: списки на главной без маркеров */
  .sec ul, .hero ul{
    list-style: none;
    padding-left: 0;
  }
  .sec li::marker, .hero li::marker{ content: ""; }
"@ -replace "`r`n", $nl

# Replace existing marker block OR insert before </style>
$pattern = "(?s)\s*/\*\s*$marker\s*\*/.*?(?=(\r?\n\s*/\*\s*XTIR_[A-Z0-9_]+\s*\*/)|(\r?\n\s*</style>))"

if ([regex]::IsMatch($c, "/\*\s*$marker\s*\*/")) {
  $c = [regex]::Replace($c, $pattern, $nl + $block + $nl)
} else {
  $m = [regex]::Match($c, "(\r?\n)\s*</style>", [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
  if (!$m.Success) { throw "Can't find </style> in $path" }
  $idx = $m.Index
  $c = $c.Insert($idx, $nl + $block + $nl)
}

if ($c -ne $orig) {
  [System.IO.File]::WriteAllText($path, $c, $utf8)
  Write-Host "Updated: $path" -ForegroundColor Green
} else {
  Write-Host "No changes made." -ForegroundColor Yellow
}

npx astro check
npm run build
git status
