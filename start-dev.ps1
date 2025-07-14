# TaskMate Development Startup Script
# Automatically starts both backend and frontend servers
# Handles port conflicts and provides status updates

param(
    [switch]$SkipBackend,
    [switch]$SkipFrontend,
    [int]$BackendPort = 5000,
    [int]$FrontendPort = 3000
)

Write-Host "🚀 TaskMate Development Environment Startup" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Function to check if port is in use
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

# Function to find available port
function Find-AvailablePort {
    param([int]$StartPort)
    $port = $StartPort
    while (Test-Port -Port $port) {
        $port++
    }
    return $port
}

# Start Backend Server
if (-not $SkipBackend) {
    Write-Host "`n📡 Starting Backend Server..." -ForegroundColor Yellow
    
    # Check if backend port is available
    if (Test-Port -Port $BackendPort) {
        Write-Host "⚠️  Port $BackendPort is in use. Finding available port..." -ForegroundColor Yellow
        $BackendPort = Find-AvailablePort -StartPort $BackendPort
        Write-Host "✅ Backend will use port $BackendPort" -ForegroundColor Green
    }
    
    # Start backend in background
    $backendJob = Start-Job -ScriptBlock {
        param($BackendPath, $Port)
        Set-Location $BackendPath
        $env:PORT = $Port
        npm start
    } -ArgumentList "$PSScriptRoot\src\backend", $BackendPort
    
    Write-Host "✅ Backend server started (Job ID: $($backendJob.Id))" -ForegroundColor Green
    Write-Host "   URL: http://localhost:$BackendPort" -ForegroundColor Cyan
}

# Start Frontend Server
if (-not $SkipFrontend) {
    Write-Host "`n🌐 Starting Frontend Server..." -ForegroundColor Yellow
    
    # Check if frontend port is available
    if (Test-Port -Port $FrontendPort) {
        Write-Host "⚠️  Port $FrontendPort is in use. Finding available port..." -ForegroundColor Yellow
        $FrontendPort = Find-AvailablePort -StartPort $FrontendPort
        Write-Host "✅ Frontend will use port $FrontendPort" -ForegroundColor Green
    }
    
    # Start frontend in background
    $frontendJob = Start-Job -ScriptBlock {
        param($FrontendPath, $Port)
        Set-Location $FrontendPath
        $env:PORT = $Port
        $env:BROWSER = "none"  # Prevent auto-opening browser
        npm start
    } -ArgumentList "$PSScriptRoot\src\frontend", $FrontendPort
    
    Write-Host "✅ Frontend server started (Job ID: $($frontendJob.Id))" -ForegroundColor Green
    Write-Host "   URL: http://localhost:$FrontendPort" -ForegroundColor Cyan
}

# Wait a moment for servers to start
Write-Host "`n⏳ Waiting for servers to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Check server status
Write-Host "`n📊 Server Status:" -ForegroundColor Green
Write-Host "=================" -ForegroundColor Green

if (-not $SkipBackend) {
    $backendStatus = if (Test-Port -Port $BackendPort) { "✅ Running" } else { "❌ Not Responding" }
    Write-Host "Backend  (Port $BackendPort): $backendStatus" -ForegroundColor $(if ($backendStatus -like "*Running*") { "Green" } else { "Red" })
}

if (-not $SkipFrontend) {
    $frontendStatus = if (Test-Port -Port $FrontendPort) { "✅ Running" } else { "❌ Not Responding" }
    Write-Host "Frontend (Port $FrontendPort): $frontendStatus" -ForegroundColor $(if ($frontendStatus -like "*Running*") { "Green" } else { "Red" })
}

# Open browser if both servers are running
if ((-not $SkipBackend) -and (-not $SkipFrontend)) {
    if ((Test-Port -Port $BackendPort) -and (Test-Port -Port $FrontendPort)) {
        Write-Host "`n🌐 Opening TaskMate in browser..." -ForegroundColor Green
        Start-Process "http://localhost:$FrontendPort"
    }
}

Write-Host "`n🎉 TaskMate Development Environment Ready!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host "`n📝 Management Commands:" -ForegroundColor Yellow
Write-Host "   View running jobs: Get-Job" -ForegroundColor Cyan
Write-Host "   Stop all servers: Get-Job | Stop-Job" -ForegroundColor Cyan
Write-Host "   View job output: Receive-Job -Job JobID" -ForegroundColor Cyan
Write-Host "`n💡 Tip: Keep this window open to monitor the servers!" -ForegroundColor Yellow 