param()

$ErrorActionPreference = "Stop"

$cssDir = "src/styles"
$cssFile = "src/styles/xtir-tokens.css"
$baseLayout = "src/layouts/BaseLayout.astro"

if (!(Test-Path -LiteralPath $baseLayout)) { throw "Не найден $baseLayout" }
New-Item -Force -ItemType Directory $cssDir | Out-Null

$css = @(
"/* XTIR Design Tokens (v1) */",
":root{",
"  --xtir-bg: #0b0f14;",
"  --xtir-bg-2: #0f1620;",
"  --xtir-fg: rgba(255,255,255,.92);",
"  --xtir-fg-2: rgba(255,255,255,.74);",
"  --xtir-fg-3: rgba(255,255,255,.56);",
"",
"  --xtir-border: rgba(255,255,255,.12);",
"  --xtir-border-2: rgba(255,255,255,.18);",
"  --xtir-card: rgba(255,255,255,.04);",
"  --xtir-card-2: rgba(0,0,0,.18);",
"",
"  --xtir-radius-lg: 18px;",
"  --xtir-radius-md: 14px;",
"  --xtir-radius-sm: 12px;",
"",
"  --xtir-shadow: 0 16px 60px rgba(0,0,0,.45);",
"",
"  --xtir-container: 1160px;",
"",
"  --xtir-s1: 8px;",
"  --xtir-s2: 12px;",
"  --xtir-s3: 16px;",
"  --xtir-s4: 24px;",
"  --xtir-s5: 32px;",
"  --xtir-s6: 48px;",
"}",
"",
"html,body{ height:100%; }",
"body{",
"  margin:0;",
"  background: radial-gradient(1200px 700px at 20% 0%, rgba(255,255,255,.06), rgba(255,255,255,0) 55%),",
"              radial-gradient(900px 600px at 90% 30%, rgba(255,255,255,.04), rgba(255,255,255,0) 60%),",
"              linear-gradient(180deg, var(--xtir-bg), var(--xtir-bg-2));",
"  color: var(--xtir-fg);",
"  -webkit-font-smoothing: antialiased;",
"  -moz-osx-font-smoothing: grayscale;",
"}",
"",
"a{ color: inherit; }",
"*{ box-sizing:border-box; }",
"img{ max-width:100%; height:auto; }",
"",
".container{ max-width: var(--xtir-container); margin:0 auto; padding:0 16px; }",
".section{ padding: var(--xtir-s6) 0; }",
".section--tight{ padding: var(--xtir-s5) 0; }",
".hr{ height:1px; background: rgba(255,255,255,.08); border:0; margin:0; }",
"",
".card{",
"  border:1px solid var(--xtir-border);",
"  background: var(--xtir-card);",
"  border-radius: var(--xtir-radius-lg);",
"  box-shadow: var(--xtir-shadow);",
"}",
".card--flat{ box-shadow:none; background: rgba(255,255,255,.03); }",
".card__pad{ padding: var(--xtir-s4); }",
"",
".h1{ font-size:44px; line-height:1.06; margin:0 0 var(--xtir-s3); letter-spacing:-.02em; }",
".h2{ font-size:28px; line-height:1.15; margin:0 0 var(--xtir-s3); letter-spacing:-.01em; }",
".p{ margin:0; color: var(--xtir-fg-2); line-height:1.6; }",
".kicker{ font-size:12px; letter-spacing:.08em; text-transform:uppercase; color: var(--xtir-fg-3); }",
"",
".btn{",
"  display:inline-flex; align-items:center; justify-content:center;",
"  height:42px; padding:0 14px;",
"  border-radius: var(--xtir-radius-md);",
"  text-decoration:none; font-weight:650; font-size:14px;",
"  border:1px solid var(--xtir-border);",
"  background: rgba(255,255,255,.06);",
"  transition: transform .12s ease, border-color .12s ease, background .12s ease;",
"  backdrop-filter: blur(8px);",
"}",
".btn:hover{ transform: translateY(-1px); border-color: var(--xtir-border-2); background: rgba(255,255,255,.09); }",
".btn--primary{ background: rgba(255,255,255,.12); }",
".btn--ghost{ background: rgba(255,255,255,.05); }",
"",
".pill{",
"  display:inline-flex; align-items:center;",
"  border:1px solid var(--xtir-border);",
"  background: rgba(255,255,255,.04);",
"  border-radius: 999px;",
"  padding:6px 10px;",
"  font-size:12px;",
"  color: var(--xtir-fg-2);",
"}"
) -join "`n"

Set-Content -LiteralPath $cssFile -Value $css -Encoding UTF8
Write-Host "OK: wrote $cssFile" -ForegroundColor Green

$t = Get-Content -LiteralPath $baseLayout -Raw

if ($t -notmatch '---\s*[\s\S]*?---') { throw "BaseLayout без frontmatter." }

if ($t -notmatch "(?m)^\s*import\s+['""]\@/styles/xtir-tokens\.css['""]\s*;?\s*$") {
  $t = [regex]::Replace($t, '---\s*([\s\S]*?)\s*---', {
    param($m)
    $fm = $m.Groups[1].Value.TrimEnd()
    $fm = "import '@/styles/xtir-tokens.css';`n" + $fm
    return "---`n$fm`n---"
  }, 1)
  Write-Host "OK: imported tokens css in BaseLayout frontmatter" -ForegroundColor Green
} else {
  Write-Host "OK: tokens css import already present" -ForegroundColor DarkGray
}

Set-Content -LiteralPath $baseLayout -Value $t -NoNewline -Encoding UTF8

# verify
$t2 = Get-Content -LiteralPath $baseLayout -Raw
if ($t2 -notmatch "(?m)^\s*import\s+['""]\@/styles/xtir-tokens\.css['""]") {
  throw "Не удалось подключить xtir-tokens.css в BaseLayout."
}

Write-Host "Build..." -ForegroundColor Cyan
npm run build | Out-Host

Write-Host "WOW..." -ForegroundColor Cyan
pwsh scripts/wow.ps1 | Out-Host
