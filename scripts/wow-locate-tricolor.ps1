$ErrorActionPreference="Stop"

$root = Get-Location
$include = @("*.astro","*.tsx","*.ts","*.css","*.scss","*.sass","*.less","*.html","*.md")

$patterns = @(
  "tricolor",
  "триколор",
  "topline",
  "stripe",
  "gradient",
  "linear-gradient",
  "#0039a6",
  "#d52b1e",
  "#ffffff",
  "#fff",
  "::before",
  "::after",
  "background",
  "opacity",
  "filter",
  "height:\s*(2|3|4)px"
)

Write-Host "XTIR: locating tricolor sources..." -ForegroundColor Cyan
Write-Host ("Root: " + $root.Path) -ForegroundColor DarkGray

$results = foreach($p in $patterns){
  Get-ChildItem -Path $root -Recurse -File -Include $include -ErrorAction SilentlyContinue |
    Select-String -Pattern $p -SimpleMatch -List:$false -ErrorAction SilentlyContinue |
    ForEach-Object {
      [pscustomobject]@{
        Pattern = $p
        File    = $_.Path.Replace($root.Path + "\", "")
        Line    = $_.LineNumber
        Text    = ($_.Line.Trim() -replace "\s{2,}"," ")
      }
    }
}

if(-not $results){
  Write-Host "No matches found. (Unexpected)" -ForegroundColor Yellow
  exit 0
}

# Heuristic scoring: prioritize likely tricolor definitions
$scoreMap = @{
  "linear-gradient" = 6
  "gradient"        = 4
  "#0039a6"         = 7
  "#d52b1e"         = 7
  "#ffffff"         = 3
  "#fff"            = 3
  "tricolor"        = 5
  "триколор"        = 5
  "topline"         = 4
  "stripe"          = 4
  "::before"        = 2
  "::after"         = 2
  "background"      = 2
  "height:\s*(2|3|4)px" = 4
  "opacity"         = 1
  "filter"          = 1
}

$scored = $results | ForEach-Object {
  $s = 0
  foreach($k in $scoreMap.Keys){
    if($_.Pattern -eq $k){ $s += $scoreMap[$k] }
  }
  $_ | Add-Member -NotePropertyName Score -NotePropertyValue $s -Force
  $_
}

# Group by file and rank by total score
$byFile = $scored |
  Group-Object File |
  ForEach-Object {
    $total = ($_.Group | Measure-Object Score -Sum).Sum
    [pscustomobject]@{
      File = $_.Name
      ScoreTotal = [int]$total
      Hits = $_.Group.Count
      Lines = ($_.Group | Sort-Object Line | Select-Object -First 12)
    }
  } | Sort-Object ScoreTotal -Descending, Hits -Descending

Write-Host ""
Write-Host "Top suspects (where tricolor is most likely defined):" -ForegroundColor Green
$byFile | Select-Object -First 12 | ForEach-Object {
  Write-Host ("- " + $_.File + "  [score " + $_.ScoreTotal + ", hits " + $_.Hits + "]") -ForegroundColor Green
}

Write-Host ""
Write-Host "Details (first ~12 lines per file):" -ForegroundColor Cyan
$byFile | Select-Object -First 12 | ForEach-Object {
  Write-Host ""
  Write-Host ("=== " + $_.File + " ===") -ForegroundColor White
  $_.Lines | ForEach-Object {
    Write-Host ("  L" + $_.Line + " [" + $_.Pattern + "] " + $_.Text) -ForegroundColor DarkGray
  }
}

Write-Host ""
Write-Host "Done. Paste the 'Top suspects' + 'Details' output сюда." -ForegroundColor Yellow
