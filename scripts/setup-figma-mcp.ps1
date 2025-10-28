# Figma MCP Setup Script
# This script helps configure the Figma MCP server for Cursor

param(
    [Parameter(Mandatory=$true)]
    [string]$FigmaApiToken
)

$mcpConfigPath = "$env:APPDATA\Cursor\User\globalStorage\mcp.json"
$mcpConfigDir = Split-Path $mcpConfigPath -Parent

# Create directory if it doesn't exist
if (!(Test-Path $mcpConfigDir)) {
    New-Item -ItemType Directory -Path $mcpConfigDir -Force
    Write-Host "Created MCP configuration directory: $mcpConfigDir"
}

# Create MCP configuration
$mcpConfig = @{
    mcpServers = @{
        "Framelink MCP for Figma" = @{
            command = "cmd"
            args = @("/c", "npx", "-y", "figma-developer-mcp", "--figma-api-key=$FigmaApiToken", "--stdio")
        }
    }
} | ConvertTo-Json -Depth 3

# Write configuration to file
$mcpConfig | Out-File -FilePath $mcpConfigPath -Encoding UTF8

Write-Host "✅ MCP configuration created successfully!"
Write-Host "📁 Configuration file: $mcpConfigPath"
Write-Host ""
Write-Host "⚠️  IMPORTANT: You must restart Cursor completely for the MCP server to load."
Write-Host "   Close all Cursor windows and reopen the application."
Write-Host ""
Write-Host "🔧 To test the integration:"
Write-Host "   1. Open Cursor's agent mode or chat"
Write-Host "   2. Check if 'Framelink MCP for Figma' appears in MCP servers"
Write-Host "   3. Paste a Figma URL and ask Cursor to describe the design"