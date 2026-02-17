param()

$ErrorActionPreference = "Stop"

New-Item -ItemType Directory -Force "public\images" | Out-Null

# Если у тебя уже есть логотип/картинка — скопируем её в ожидаемые имена
$logo = "public\images\logo.png"
if (Test-Path $logo) {
  Copy-Item $logo "public\ogo.png" -Force
  Copy-Item $logo "public\favicon.ico" -Force
  Write-Host "OK: copied public/images/logo.png -> public/ogo.png and public/favicon.ico" -ForegroundColor Green
} else {
  # создадим заглушки (пустые файлы, чтобы убрать 404)
  # это не идеал, но быстро закрывает ошибки
  if (!(Test-Path "public\ogo.png")) { New-Item -ItemType File -Force "public\ogo.png" | Out-Null }
  if (!(Test-Path "public\favicon.ico")) { New-Item -ItemType File -Force "public\favicon.ico" | Out-Null }
  Write-Host "OK: created placeholder public/ogo.png and public/favicon.ico (replace later with real images)" -ForegroundColor Yellow
}

npm run build | Out-Host
