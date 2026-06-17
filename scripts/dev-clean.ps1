# Stop stale dev servers, clear .next cache, and start fresh on port 3000
# Usage: powershell -ExecutionPolicy Bypass -File scripts/dev-clean.ps1

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$stopScript = Join-Path $PSScriptRoot "stop-dev.ps1"

Write-Host ""
Write-Host "Date Night Planner - clean dev start" -ForegroundColor Cyan
Write-Host ""

& $stopScript

$nextDir = Join-Path $projectRoot ".next"
if (Test-Path $nextDir) {
    Write-Host "Removing .next cache..."
    Remove-Item -Recurse -Force $nextDir
    Write-Host "Removed .next" -ForegroundColor Green
}

Write-Host ""
Write-Host "Starting dev server on http://localhost:3000 ..." -ForegroundColor Cyan
Write-Host ""

Set-Location $projectRoot
npm run dev
