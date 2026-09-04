$ErrorActionPreference = "Stop"

Write-Host "==> Initializing Python Virtual Environment..."
python -m venv .venv
& .\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt

Write-Host "==> Materializing Directory Tree..."
$dirs = @(
    "external\onnxruntime\include",
    "external\onnxruntime\lib",
    "external\sqlite3",
    "models"
)
foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
}

Write-Host "==> Fetching SQLite3 Amalgamation..."
if (-not (Test-Path "external\sqlite3\sqlite3.c")) {
    $sqliteUrl = "https://www.sqlite.org/2024/sqlite-amalgamation-3450200.zip"
    Invoke-WebRequest -Uri $sqliteUrl -OutFile "sqlite.zip"
    Expand-Archive -Path "sqlite.zip" -DestinationPath "sqlite_temp" -Force
    Copy-Item "sqlite_temp\sqlite-amalgamation-3450200\sqlite3.c" "external\sqlite3\"
    Copy-Item "sqlite_temp\sqlite-amalgamation-3450200\sqlite3.h" "external\sqlite3\"
    Remove-Item -Recurse -Force "sqlite.zip", "sqlite_temp"
}

Write-Host "==> Fetching ONNX Runtime (Win-x64)..."
$ortVersion = "1.17.3"
if (-not (Test-Path "external\onnxruntime\lib\onnxruntime.lib")) {
    $ortUrl = "https://github.com/microsoft/onnxruntime/releases/download/v$ortVersion/onnxruntime-win-x64-$ortVersion.zip"
    Invoke-WebRequest -Uri $ortUrl -OutFile "ort.zip"
    Expand-Archive -Path "ort.zip" -DestinationPath "ort_temp" -Force
    Copy-Item -Recurse "ort_temp\onnxruntime-win-x64-$ortVersion\include\*" "external\onnxruntime\include\"
    Copy-Item -Recurse "ort_temp\onnxruntime-win-x64-$ortVersion\lib\*" "external\onnxruntime\lib\"
    Remove-Item -Recurse -Force "ort.zip", "ort_temp"
}

Write-Host "==> Environment ready for Windows build."