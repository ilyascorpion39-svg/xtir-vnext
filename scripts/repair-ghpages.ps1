param()

$ErrorActionPreference = "Stop"

Write-Host "== XTIR: Repair GitHub Pages deploy ==" -ForegroundColor Cyan

# --- 1) Ensure astro.config has correct base for GH Pages ---
# Support: astro.config.mjs / astro.config.ts
$cfg = @("astro.config.mjs","astro.config.ts","astro.config.js") | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if (!$cfg) { throw "Не найден astro.config.(mjs|ts|js) в корне проекта" }

$t = Get-Content -LiteralPath $cfg -Raw

# If base already present, we keep it. If not, inject base/site logic.
if ($t -notmatch "(?m)\bbase\s*:") {
  # Try to inject inside defineConfig({...})
  if ($t -match "defineConfig\(\{") {
    $inject = @"
import { defineConfig } from 'astro/config';

const isGh = process.env.GITHUB_ACTIONS === 'true';
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'xtir-vnext';
const ghBase = `/${repo}/`;

"@

    # If file already imports defineConfig, don't duplicate import
    if ($t -match "import\s+\{\s*defineConfig\s*\}\s+from\s+['""]astro/config['""]") {
      # ensure env helpers exist
      if ($t -notmatch "const\s+isGh\s*=") {
        $t = $t -replace "import\s+\{\s*defineConfig\s*\}\s+from\s+['""]astro/config['""]\s*;\s*", ("import { defineConfig } from 'astro/config';`n`nconst isGh = process.env.GITHUB_ACTIONS === 'true';`nconst repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'xtir-vnext';`nconst ghBase = `"/${repo}/`";`n`n")
      }
    } else {
      # prepend header
      $t = $inject + $t
    }

    # add base/site into config object near the beginning
    $t = [regex]::Replace($t, "defineConfig\(\{", "defineConfig({`n  site: isGh ? `https://$((process.env.GITHUB_REPOSITORY?.Split('/')[0]) ?? 'ilyascorpion39-svg').github.io${ghBase}` : 'https://x-tir.ru',`n  base: isGh ? ghBase : '/',", 1)
    Write-Host "OK: injected site/base for GitHub Pages in $cfg" -ForegroundColor Green
  } else {
    Write-Host "WARN: could not inject base (unknown astro config format). Skipped." -ForegroundColor Yellow
  }
} else {
  Write-Host "OK: astro config already contains base:" -ForegroundColor DarkGray
}

Set-Content -LiteralPath $cfg -Value $t -NoNewline -Encoding UTF8

# --- 2) Write known-good GitHub Pages workflow ---
New-Item -ItemType Directory -Force ".github/workflows" | Out-Null

@"
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install
        run: npm ci

      - name: Build
        env:
          GITHUB_ACTIONS: "true"
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
"@ | Set-Content -Encoding UTF8 ".github/workflows/deploy-pages.yml"

Write-Host "OK: wrote .github/workflows/deploy-pages.yml" -ForegroundColor Green

# --- 3) Local sanity build ---
Write-Host "Local build..." -ForegroundColor Cyan
npm run build | Out-Host

Write-Host "OK: repair done" -ForegroundColor Green
