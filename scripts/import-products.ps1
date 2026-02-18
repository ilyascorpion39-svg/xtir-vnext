param(
    [string]$ProductsFolder = "D:\Сайт XTIR\Продукты",
    [string]$ProjectRoot    = "D:\Сайт XTIR\xtir-vnext-archive"
)

$ErrorActionPreference = "Stop"
Write-Host "== XTIR: Product catalog generator v5 ==" -ForegroundColor Cyan

$catIds = @{
    "1" = "lifters"; "2" = "rotators"; "3" = "combo"; "4" = "ceiling"
    "5" = "moving";  "6" = "suspended"; "7" = "electronic"; "8" = "polygon"
}

# ------------------------------------------------------------------
function To-Latin([string]$s) {
    $map = @{
        [char]0x0430='a';  [char]0x0431='b';  [char]0x0432='v';  [char]0x0433='g';
        [char]0x0434='d';  [char]0x0435='e';  [char]0x0451='yo'; [char]0x0436='zh';
        [char]0x0437='z';  [char]0x0438='i';  [char]0x0439='y';  [char]0x043a='k';
        [char]0x043b='l';  [char]0x043c='m';  [char]0x043d='n';  [char]0x043e='o';
        [char]0x043f='p';  [char]0x0440='r';  [char]0x0441='s';  [char]0x0442='t';
        [char]0x0443='u';  [char]0x0444='f';  [char]0x0445='kh'; [char]0x0446='ts';
        [char]0x0447='ch'; [char]0x0448='sh'; [char]0x0449='shch';[char]0x044a='';
        [char]0x044b='y';  [char]0x044c='';   [char]0x044d='e';  [char]0x044e='yu';
        [char]0x044f='ya'; [char]0x0410='a';  [char]0x0411='b';  [char]0x0412='v';
        [char]0x0413='g';  [char]0x0414='d';  [char]0x0415='e';  [char]0x0401='yo';
        [char]0x0416='zh'; [char]0x0417='z';  [char]0x0418='i';  [char]0x0419='y';
        [char]0x041a='k';  [char]0x041b='l';  [char]0x041c='m';  [char]0x041d='n';
        [char]0x041e='o';  [char]0x041f='p';  [char]0x0420='r';  [char]0x0421='s';
        [char]0x0422='t';  [char]0x0423='u';  [char]0x0424='f';  [char]0x0425='kh';
        [char]0x0426='ts'; [char]0x0427='ch'; [char]0x0428='sh'; [char]0x0429='shch';
        [char]0x042a='';   [char]0x042b='y';  [char]0x042c='';   [char]0x042d='e';
        [char]0x042e='yu'; [char]0x042f='ya'
    }
    $result = ""
    foreach ($c in $s.ToCharArray()) {
        if ($map.ContainsKey($c)) { $result += $map[$c] } else { $result += $c }
    }
    return $result
}

function Make-Slug([string]$text) {
    $t = To-Latin $text.ToLower().Trim()
    $t = $t -replace '[^a-z0-9]+', '-'
    return $t.Trim('-')
}

function Esc([string]$s) {
    return $s.Replace('\','\\').Replace('"','\"').Replace('`','\`').Replace('$','\$')
}

# ------------------------------------------------------------------
# Index all product folders from disk
# ------------------------------------------------------------------
$allFolders = @{}
$catDirs = Get-ChildItem $ProductsFolder -Directory -ErrorAction SilentlyContinue
foreach ($cat in $catDirs) {
    $num = ""; if ($cat.Name -match '^(\d+)') { $num = $matches[1] }
    $prodDirs = Get-ChildItem $cat.FullName -Directory -ErrorAction SilentlyContinue
    foreach ($pd in $prodDirs) {
        $s = Make-Slug $pd.Name
        $allFolders[$s] = @{
            fullPath = $pd.FullName
            catNum   = $num
        }
    }
}
Write-Host "Indexed $($allFolders.Count) product folders" -ForegroundColor Gray

# Slug-to-slug overrides (txt slug -> folder slug)
$slugOverrides = @{
    "pmu-10-popper"   = "puma-10-popper"
    "pmu-8c"          = "pmu-8s-na-dve-misheni"
    "pmu-90"          = "puma-90"
    "pmu-50-telezhka" = "pmu-50-radioupravlyaemaya-telezhka"
    "pmu-53"          = "pmu-53"
}

# Category overrides (txt slug -> categoryId)
$catOverrides = @{
    "pmu-50-telezhka" = "moving"
    "pmu-53"          = "suspended"
    "puma-45"         = "moving"
}

# ------------------------------------------------------------------
function Parse-Txt([string]$path) {
    $raw   = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
    $lines = $raw -split "`r?`n"
    $desc = [System.Collections.Generic.List[string]]::new()
    $features = [System.Collections.Generic.List[string]]::new()
    $specs = [System.Collections.Generic.List[hashtable]]::new()
    $section = 'desc'; $grp = ''

    foreach ($line in $lines) {
        $l = $line.Trim(); if (-not $l) { continue }
        $lLat = To-Latin $l.ToLower()
        if ($lLat -match 'vstroenny')          { $section = 'features'; continue }
        if ($lLat -match 'osnovny|kharakter')  { if ($section -ne 'desc') { $section = 'specs' }; continue }
        if ($lLat -match 'mogut byt izmeneny') { continue }
        switch ($section) {
            'desc'     { $desc.Add($l) }
            'features' { $features.Add($l) }
            'specs'    {
                if ($l -match '^(.+):\s+(.+)$')      { $specs.Add(@{ label=$matches[1].Trim(); value=$matches[2].Trim() }) }
                elseif ($l -match '^(.+):$')          { $grp = $matches[1].Trim() }
                elseif ($grp)                         { $specs.Add(@{ label=$grp; value=$l }) }
            }
        }
    }
    return @{
        description = ($desc -join ' ').Trim()
        features    = [string[]]$features
        specs       = [hashtable[]]$specs
    }
}

# ------------------------------------------------------------------
function Find-Entry([string]$txtBaseName) {
    $slug = Make-Slug $txtBaseName

    # 1) Slug override
    $lookupSlug = if ($slugOverrides.ContainsKey($slug)) { $slugOverrides[$slug] } else { $slug }

    # 2) Exact match
    if ($allFolders.ContainsKey($lookupSlug)) {
        $fo    = $allFolders[$lookupSlug]
        $catId = if ($catIds.ContainsKey($fo.catNum)) { $catIds[$fo.catNum] } else { 'other' }
        if ($catOverrides.ContainsKey($slug)) { $catId = $catOverrides[$slug] }
        return @{ fullPath=$fo.fullPath; catId=$catId }
    }

    # 3) Fuzzy
    foreach ($kv in $allFolders.GetEnumerator()) {
        if ($kv.Key.Contains($lookupSlug) -or $lookupSlug.Contains($kv.Key)) {
            $fo    = $kv.Value
            $catId = if ($catIds.ContainsKey($fo.catNum)) { $catIds[$fo.catNum] } else { 'other' }
            if ($catOverrides.ContainsKey($slug)) { $catId = $catOverrides[$slug] }
            return @{ fullPath=$fo.fullPath; catId=$catId }
        }
    }
    return $null
}

# ------------------------------------------------------------------
$imgRoot = Join-Path $ProjectRoot "public\products-img"
New-Item -ItemType Directory -Force $imgRoot | Out-Null

function Copy-Photos([string]$fullPath, [string]$slug) {
    if (-not $fullPath -or -not (Test-Path $fullPath)) { return [string[]]@() }
    $destDir = Join-Path $imgRoot $slug
    New-Item -ItemType Directory -Force $destDir | Out-Null
    $imgs = Get-ChildItem $fullPath -File | Where-Object { $_.Extension -match '\.(png|jpg|jpeg|webp)$' } | Sort-Object Name
    $urls = [System.Collections.Generic.List[string]]::new()
    foreach ($img in $imgs) {
        $dest = Join-Path $destDir $img.Name
        if (-not (Test-Path $dest)) { Copy-Item $img.FullName $dest }
        $urls.Add("/products-img/$slug/$($img.Name)")
    }
    return [string[]]$urls
}

# ------------------------------------------------------------------
# MAIN
# ------------------------------------------------------------------
$txtFiles = Get-ChildItem $ProductsFolder -Filter "*.txt" -File | Sort-Object Name
Write-Host "Found $($txtFiles.Count) .txt files" -ForegroundColor Yellow
Write-Host ""

$products = [System.Collections.Generic.List[hashtable]]::new()
$id = 1

foreach ($txt in $txtFiles) {
    Write-Host "  $($txt.Name)" -NoNewline
    $parsed = Parse-Txt $txt.FullName
    $entry  = Find-Entry $txt.BaseName
    $slug   = Make-Slug $txt.BaseName
    $catId  = if ($entry) { $entry.catId } else { 'other' }
    $photos = if ($entry) { Copy-Photos $entry.fullPath $slug } else { [string[]]@() }
    $color  = if ($catId -eq 'other' -or $photos.Length -eq 0) { 'Red' } else { 'Green' }
    Write-Host "  [$catId]  $($photos.Length) photos" -ForegroundColor $color
    $products.Add(@{
        id=$id++; slug=$slug; name=$txt.BaseName; categoryId=$catId
        description=$parsed.description; features=$parsed.features
        specs=$parsed.specs; photos=$photos
    })
}

# Summary
$problemList = [System.Collections.Generic.List[string]]::new()
foreach ($p in $products) {
    if ($p.categoryId -eq 'other' -or $p.photos.Length -eq 0) {
        $problemList.Add("  - $($p.name)  [$($p.categoryId)]  $($p.photos.Length) photos")
    }
}
Write-Host ""
if ($problemList.Count -gt 0) {
    Write-Host "Issues ($($problemList.Count)):" -ForegroundColor Yellow
    foreach ($line in $problemList) { Write-Host $line -ForegroundColor Yellow }
} else {
    Write-Host "All $($products.Count) products OK!" -ForegroundColor Green
}

# ------------------------------------------------------------------
# Generate products.ts
# ------------------------------------------------------------------
$sb = [System.Text.StringBuilder]::new()
$nl = [System.Environment]::NewLine

[void]$sb.AppendLine("// AUTO-GENERATED — run scripts/import-products.ps1 to regenerate")
[void]$sb.AppendLine("// Last updated: $(Get-Date -Format 'yyyy-MM-dd HH:mm')")
[void]$sb.AppendLine("")
[void]$sb.AppendLine("export interface ProductSpec { label: string; value: string }")
[void]$sb.AppendLine("")
[void]$sb.AppendLine("export interface Product {")
[void]$sb.AppendLine("  id: number")
[void]$sb.AppendLine("  slug: string")
[void]$sb.AppendLine("  name: string")
[void]$sb.AppendLine("  categoryId: string")
[void]$sb.AppendLine("  description: string")
[void]$sb.AppendLine("  features: string[]")
[void]$sb.AppendLine("  specs: ProductSpec[]")
[void]$sb.AppendLine("  photos: string[]")
[void]$sb.AppendLine("}")
[void]$sb.AppendLine("")
[void]$sb.AppendLine("export interface ProductCategory { id: string; name: string }")
[void]$sb.AppendLine("")

$usedCats = [System.Collections.Generic.List[string]]::new()
foreach ($p in $products) { if (-not $usedCats.Contains($p.categoryId)) { $usedCats.Add($p.categoryId) } }
$usedCats.Sort()

[void]$sb.AppendLine("export const PRODUCT_CATEGORIES: ProductCategory[] = [")
foreach ($cid in $usedCats) {
    [void]$sb.AppendLine("  { id: `"$cid`", name: `"$cid`" },")
}
[void]$sb.AppendLine("]")
[void]$sb.AppendLine("")
[void]$sb.AppendLine("export const PRODUCTS: Product[] = [")

foreach ($p in $products) {
    $photosStr = ($p.photos | ForEach-Object { "`"$(Esc $_)`"" }) -join ", "
    $featParts = [System.Collections.Generic.List[string]]::new()
    foreach ($f in $p.features) { $featParts.Add("      `"$(Esc $f)`"") }
    $specParts = [System.Collections.Generic.List[string]]::new()
    foreach ($sp in $p.specs) { $specParts.Add("      { label: `"$(Esc $sp.label)`", value: `"$(Esc $sp.value)`" }") }

    [void]$sb.AppendLine("  {")
    [void]$sb.AppendLine("    id: $($p.id),")
    [void]$sb.AppendLine("    slug: `"$($p.slug)`",")
    [void]$sb.AppendLine("    name: `"$(Esc $p.name)`",")
    [void]$sb.AppendLine("    categoryId: `"$($p.categoryId)`",")
    [void]$sb.AppendLine("    description: `"$(Esc $p.description)`",")
    [void]$sb.AppendLine("    features: [")
    if ($featParts.Count -gt 0) { [void]$sb.AppendLine(($featParts -join ",$nl")) }
    [void]$sb.AppendLine("    ],")
    [void]$sb.AppendLine("    specs: [")
    if ($specParts.Count -gt 0) { [void]$sb.AppendLine(($specParts -join ",$nl")) }
    [void]$sb.AppendLine("    ],")
    [void]$sb.AppendLine("    photos: [$photosStr],")
    [void]$sb.AppendLine("  },")
}

[void]$sb.AppendLine("]")
[void]$sb.AppendLine("")
[void]$sb.AppendLine("export function getProductBySlug(slug: string): Product | undefined {")
[void]$sb.AppendLine("  return PRODUCTS.find(p => p.slug === slug)")
[void]$sb.AppendLine("}")
[void]$sb.AppendLine("")
[void]$sb.AppendLine("export function getProductsByCategory(categoryId: string): Product[] {")
[void]$sb.AppendLine("  return PRODUCTS.filter(p => p.categoryId === categoryId)")
[void]$sb.AppendLine("}")

$outPath = Join-Path $ProjectRoot "src\data\products.ts"
[System.IO.File]::WriteAllText($outPath, $sb.ToString(), [System.Text.UTF8Encoding]::new($true))

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Done!  $($products.Count) products" -ForegroundColor Green
Write-Host " Photos -> public\products-img\" -ForegroundColor Green
Write-Host " Data   -> src\data\products.ts" -ForegroundColor Green
Write-Host " Next:  npm run dev" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan
