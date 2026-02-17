param()

$ErrorActionPreference = "Stop"

function Line(){ Write-Host ("-"*60) -ForegroundColor DarkGray }
function Run($cmd){
  Write-Host ""
  Write-Host ("▶ " + $cmd) -ForegroundColor Cyan
  pwsh -NoProfile -ExecutionPolicy Bypass -Command $cmd
}

while ($true) {
  Write-Host ""
  Write-Host "XTIR Wizard" -ForegroundColor Cyan
  Line
  Write-Host "1) Repair shell (Header/Footer + imports)"
  Write-Host "2) WOW check"
  Write-Host "3) Degoogle (remove gtag + Google Fonts)"
  Write-Host "4) Create partner page scaffold"
  Write-Host "5) Create product page scaffold"
  Write-Host "6) Release prep (repair + wow + build)"
  Write-Host "0) Exit"
  Line

  $c = Read-Host "Choose"
  switch ($c) {
    "1" { Run "pwsh scripts/repair-shell.ps1" }
    "2" { Run "pwsh scripts/wow.ps1" }
    "3" { Run "pwsh scripts/degoogle.ps1"; Run "pwsh scripts/wow.ps1" }

    "4" {
      $slug = Read-Host "partner slug (e.g. acme)"
      if ([string]::IsNullOrWhiteSpace($slug)) { continue }
      $target = "src/pages/partners/$slug.astro"
      if (Test-Path -LiteralPath $target) { Write-Host "Exists: $target" -ForegroundColor Yellow; continue }

@"
---
import BaseLayout from '@/layouts/BaseLayout.astro';

const title = 'Партнёр';
const description = 'Партнёр XTIR';
---

<BaseLayout title={title} description={description}>
  <section class="container">
    <h1>{title}</h1>
    <p>TODO: описание партнёра</p>
  </section>
</BaseLayout>
"@ | Set-Content -Encoding UTF8 $target

      Write-Host "OK: $target" -ForegroundColor Green
    }

    "5" {
      $id = Read-Host "product id (e.g. xtir-01)"
      if ([string]::IsNullOrWhiteSpace($id)) { continue }
      $target = "src/pages/products/$id.astro"
      if (Test-Path -LiteralPath $target) { Write-Host "Exists: $target" -ForegroundColor Yellow; continue }

@"
---
import BaseLayout from '@/layouts/BaseLayout.astro';

const title = 'Продукт';
const description = 'Продукт XTIR';
---

<BaseLayout title={title} description={description}>
  <section class="container">
    <h1>{title}</h1>
    <p>TODO: описание продукта</p>
  </section>
</BaseLayout>
"@ | Set-Content -Encoding UTF8 $target

      Write-Host "OK: $target" -ForegroundColor Green
    }

    "6" {
      Run "pwsh scripts/repair-shell.ps1"
      Run "pwsh scripts/wow.ps1"
      Write-Host ""
      Write-Host "Preview: npm run preview" -ForegroundColor DarkGray
    }

    "0" { break }
    default { Write-Host "?" -ForegroundColor DarkGray }
  }
}
