param()

$ErrorActionPreference = "Stop"

$wfDir = ".github/workflows"
if (!(Test-Path -LiteralPath $wfDir)) { throw "Нет $wfDir" }

$files = @(Get-ChildItem -LiteralPath $wfDir -Filter "*.yml" -File -ErrorAction SilentlyContinue)
if (@($files).Count -eq 0) { $files = @(Get-ChildItem -LiteralPath $wfDir -Filter "*.yaml" -File -ErrorAction SilentlyContinue) }
if (@($files).Count -eq 0) { throw "Workflow файлов не найдено в $wfDir" }

$patched = 0

foreach ($f in $files) {
  $t = Get-Content -LiteralPath $f.FullName -Raw

  # only workflows related to pages deploy
  if ($t -notmatch "pages|deploy-pages|upload-pages-artifact") { continue }
  if ($t -match "XTIR leak guard") { continue } # already patched

  $guard = @"
      - name: XTIR leak guard (dist)
        run: |
          test -f dist/index.html
          if grep -E -i "import\s+\w+\s+from\s+['""]|import\s+Header\s+from|import\s+Footer\s+from|GA_MEASUREMENT_ID" dist/index.html; then
            echo "Leak detected in dist/index.html"
            exit 1
          fi
"@

  if ($t -match "(?m)^\s*-\s*name:\s*Upload.*\r?\n[\s\S]*?upload-pages-artifact") {
    $t = [regex]::Replace($t, "(?m)^(\s*-\s*name:\s*Upload[\s\S]*?upload-pages-artifact[\s\S]*?\r?\n)", ($guard + "`n`$1"), 1)
  } elseif ($t -match "deploy-pages|actions/deploy-pages") {
    $t = [regex]::Replace($t, "(?m)^(\s*-\s*name:.*deploy.*\r?\n)", ($guard + "`n`$1"), 1)
  } else {
    continue
  }

  Set-Content -LiteralPath $f.FullName -Value $t -NoNewline -Encoding UTF8
  $patched++
}

Write-Host "OK: patched workflows: $patched" -ForegroundColor Green
if ($patched -eq 0) { Write-Host "NOTE: подходящий workflow не найден или уже пропатчен." -ForegroundColor Yellow }
