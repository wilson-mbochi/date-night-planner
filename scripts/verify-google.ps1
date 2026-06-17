# Verify Google Places integration
# Usage: powershell -ExecutionPolicy Bypass -File scripts/verify-google.ps1

$ErrorActionPreference = "Stop"
$baseUrl = if ($env:APP_URL) { $env:APP_URL } else { "http://localhost:3000" }

Write-Host "Verifying Google Places setup at $baseUrl ..." -ForegroundColor Cyan

try {
    $config = Invoke-RestMethod -Uri "$baseUrl/api/config" -TimeoutSec 15
} catch {
    Write-Host "Could not reach $baseUrl/api/config" -ForegroundColor Red
    Write-Host "Make sure the dev server is running: npm run dev"
    exit 1
}

Write-Host "Config: $($config | ConvertTo-Json -Compress)"

if (-not $config.googleAvailable) {
    Write-Host ""
    Write-Host "Google is NOT configured yet." -ForegroundColor Yellow
    Write-Host "Run: powershell -ExecutionPolicy Bypass -File scripts/setup-google.ps1"
    exit 1
}

Write-Host "googleAvailable: true" -ForegroundColor Green

$geo = Invoke-RestMethod -Uri "$baseUrl/api/geocode?location=78701" -TimeoutSec 30
$places = Invoke-RestMethod -Uri "$baseUrl/api/places?lat=$($geo.lat)&lng=$($geo.lng)&provider=google" -TimeoutSec 60

Write-Host "Provider: $($places.provider)"
Write-Host "Venues returned: $($places.venues.Count)"

if ($places.provider -eq "google" -and $places.venues.Count -gt 0) {
    Write-Host "Google Places search works!" -ForegroundColor Green
    exit 0
}

Write-Host "Google Places returned no venues or wrong provider." -ForegroundColor Red
exit 1
