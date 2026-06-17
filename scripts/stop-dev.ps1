# Stop Next.js dev servers on common local ports (3000-3010)
# Usage:
#   powershell -ExecutionPolicy Bypass -File scripts/stop-dev.ps1
#   powershell -ExecutionPolicy Bypass -File scripts/stop-dev.ps1 -All

param(
    [switch]$All
)

$ErrorActionPreference = "SilentlyContinue"

function Stop-PortListeners {
    param([int]$Port)

    $lines = netstat -ano | Select-String ":$Port\s"
    $pids = @()

    foreach ($line in $lines) {
        if ($line -match "\s+(\d+)\s*$") {
            $pids += [int]$Matches[1]
        }
    }

    $pids = $pids | Sort-Object -Unique
    foreach ($procId in $pids) {
        if ($procId -le 4) { continue }
        $proc = Get-Process -Id $procId -ErrorAction SilentlyContinue
        if ($proc) {
            Write-Host "Stopping PID $procId ($($proc.ProcessName)) on port $Port"
            Stop-Process -Id $procId -Force
        }
    }
}

Write-Host "Date Night Planner - stop dev servers" -ForegroundColor Cyan
Write-Host ""

if ($All) {
    Write-Host "Stopping all node processes..." -ForegroundColor Yellow
    Get-Process node -ErrorAction SilentlyContinue | ForEach-Object {
        Write-Host "Stopping PID $($_.Id) (node)"
        Stop-Process -Id $_.Id -Force
    }
} else {
    3000..3010 | ForEach-Object { Stop-PortListeners -Port $_ }
}

Start-Sleep -Milliseconds 500

$stillListening = netstat -ano | Select-String ":300[0-9]\s|:3010\s"
if ($stillListening) {
    Write-Host ""
    Write-Host "Some ports may still be in use:" -ForegroundColor Yellow
    $stillListening | ForEach-Object { Write-Host $_.Line }
} else {
    Write-Host ""
    Write-Host "Ports 3000-3010 are free." -ForegroundColor Green
}
