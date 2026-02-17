param()

$ErrorActionPreference = "Stop"

$wfDir = ".github/workflows"
if (!(Test-Path -LiteralPath $wfDir)) { throw "Нет $wfDir" }

$files = Get-ChildItem -LiteralPath $wfDir -Filter "*.yml" -File
if ($files.Count -eq 0) { $files = Get-ChildItem -LiteralPath $wfDir -Filter "*.yaml" -File }
if ($files.Count -eq 0) { throw "Workflow файлов не найдено" }

$patched = 0

foreach ($f in $files) {
  $t = Get-Content -LiteralPath $f.FullName -Raw

  # ищем место перед upload-pages-artifact или deploy-pages
  if ($t -match "upload-pages-artifact|deploy-pages|actions/deploy-pages") {

    if ($t -match "XTIR leak guard") { continue } # уже есть

    $guard = @"
      - name: XTIR leak guard (dist)
        run: |
          test -f dist/index.html
          if grep -E -i "import\s+\w+\s+from\s+['""]|import\s+Header\s+from|import\s+Footer\s+from|GA_MEASUREMENT_ID" dist/index.html; then
            echo "Leak detected in dist/index.html"
            exit 1
          fi
"@

    # вставим перед upload-pages-artifact если есть
    if ($t -match "upload-pages-artifact") {
      $t = [regex]::Replace($t, "(?m)^(\s*-\s*name:\s*Upload artifact[\s\S]*?upload-pages-artifact[\s\S]*?\n)", ($guard + "`n`$1"), 1)
    } else {
      # иначе вставим перед deploy-pages шагом
      $t = [regex]::Replace($t, "(?m)^(\s*-\s*name:.*deploy.*\r?\n)", ($guard + "`n`$1"), 1)
    }

    Set-Content -LiteralPath $f.FullName -Value $t -NoNewline -Encoding UTF8
    $patched++
  }
}

Write-Host "OK: patched workflows: $patched" -ForegroundColor Green
