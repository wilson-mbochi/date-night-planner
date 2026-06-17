# Interactive Google API key setup for Date Night Planner
# Usage: powershell -ExecutionPolicy Bypass -File scripts/setup-google.ps1

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $projectRoot ".env.local"

Write-Host ""
Write-Host "Date Night Planner — Google Places Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$open = Read-Host "Open Google Cloud Console pages in your browser? (Y/n)"
if ($open -ne "n" -and $open -ne "N") {
    Write-Host "Opening Google Cloud Console..."
    Start-Process "https://console.cloud.google.com/projectcreate"
    Start-Sleep -Seconds 1
    Start-Process "https://console.cloud.google.com/billing"
    Start-Sleep -Seconds 1
    Start-Process "https://console.cloud.google.com/apis/library/places.googleapis.com"
    Start-Sleep -Seconds 1
    Start-Process "https://console.cloud.google.com/apis/credentials"
    Write-Host ""
    Write-Host "Complete these in the browser:" -ForegroundColor Yellow
    Write-Host "  1. Create/select a project"
    Write-Host "  2. Enable billing"
    Write-Host "  3. Enable Places API (New)"
    Write-Host "  4. Create an API key"
    Write-Host ""
    Read-Host "Press Enter when you have your API key"
}

Write-Host ""
$apiKey = Read-Host "Paste your Google Places API key" -AsSecureString
$plainKey = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($apiKey)
)

if ([string]::IsNullOrWhiteSpace($plainKey)) {
    Write-Host "No API key provided. Exiting." -ForegroundColor Red
    exit 1
}

$content = @"
# Google Places API — configured by setup-google.ps1
GOOGLE_PLACES_API_KEY=$plainKey
PLACES_PROVIDER=google
"@

Set-Content -Path $envFile -Value $content -Encoding UTF8 -NoNewline
Write-Host ""
Write-Host "Wrote $envFile" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Restart the dev server: npm run dev"
Write-Host "  2. Open http://localhost:3000/settings"
Write-Host "  3. Select Google Places and search a location"
Write-Host ""
