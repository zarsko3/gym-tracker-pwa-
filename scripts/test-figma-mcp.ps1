# Figma MCP Test Script
# This script helps troubleshoot MCP integration issues

Write-Host "🔍 Figma MCP Troubleshooting Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if MCP config files exist
Write-Host "1. Checking MCP configuration files..." -ForegroundColor Yellow

$config1 = "C:\Users\galz\AppData\Roaming\Cursor\User\globalStorage\mcp.json"
$config2 = "C:\Users\galz\AppData\Roaming\Cursor\User\mcp.json"

if (Test-Path $config1) {
    Write-Host "   ✅ Found: $config1" -ForegroundColor Green
    $content1 = Get-Content $config1 -Raw
    if ($content1 -match "figma") {
        Write-Host "   ✅ Contains Figma configuration" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Missing Figma configuration" -ForegroundColor Red
    }
} else {
    Write-Host "   ❌ Missing: $config1" -ForegroundColor Red
}

if (Test-Path $config2) {
    Write-Host "   ✅ Found: $config2" -ForegroundColor Green
    $content2 = Get-Content $config2 -Raw
    if ($content2 -match "figma") {
        Write-Host "   ✅ Contains Figma configuration" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Missing Figma configuration" -ForegroundColor Red
    }
} else {
    Write-Host "   ❌ Missing: $config2" -ForegroundColor Red
}

Write-Host ""

# Test if the MCP package can be installed
Write-Host "2. Testing MCP package installation..." -ForegroundColor Yellow
try {
    $result = npx -y figma-developer-mcp --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Package can be installed and run" -ForegroundColor Green
        Write-Host "   📦 Version: $result" -ForegroundColor Gray
    } else {
        Write-Host "   ❌ Package installation failed" -ForegroundColor Red
        Write-Host "   Error: $result" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Error testing package: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Check Cursor processes
Write-Host "3. Checking Cursor processes..." -ForegroundColor Yellow
$cursorProcesses = Get-Process -Name "Cursor" -ErrorAction SilentlyContinue
if ($cursorProcesses) {
    Write-Host "   ✅ Cursor is running (PID: $($cursorProcesses[0].Id))" -ForegroundColor Green
    Write-Host "   ⚠️  You may need to restart Cursor for MCP changes to take effect" -ForegroundColor Yellow
} else {
    Write-Host "   ℹ️  Cursor is not currently running" -ForegroundColor Blue
}

Write-Host ""

# Provide next steps
Write-Host "4. Next Steps:" -ForegroundColor Yellow
Write-Host "   🔄 1. Completely close Cursor (all windows)" -ForegroundColor White
Write-Host "   ⏱️  2. Wait 10 seconds" -ForegroundColor White
Write-Host "   🚀 3. Reopen Cursor" -ForegroundColor White
Write-Host "   🔍 4. Open agent mode (Cmd/Ctrl + I)" -ForegroundColor White
Write-Host "   📋 5. Look for 'figma' or 'Framelink MCP for Figma' in MCP servers" -ForegroundColor White
Write-Host "   🧪 6. Test with a Figma URL" -ForegroundColor White

Write-Host ""
Write-Host "💡 If MCP still doesn't appear, try:" -ForegroundColor Cyan
Write-Host "   • Check Cursor's MCP settings in Preferences" -ForegroundColor White
Write-Host "   • Try restarting your computer" -ForegroundColor White
Write-Host "   • Check if Cursor has MCP support enabled" -ForegroundColor White