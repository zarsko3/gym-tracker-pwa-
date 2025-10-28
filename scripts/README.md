# Scripts Directory

This directory contains utility scripts for the GYMZARSKI project.

## Available Scripts

### `setup-figma-mcp.ps1`

PowerShell script to configure the Figma MCP server for Cursor integration.

**Usage:**
```powershell
.\scripts\setup-figma-mcp.ps1 -FigmaApiToken "your_figma_api_token_here"
```

**What it does:**
- Creates the MCP configuration directory if it doesn't exist
- Generates the MCP configuration file with your Figma API token
- Provides instructions for restarting Cursor

**Prerequisites:**
- Figma API token (get one at https://www.figma.com/developers/api#access-tokens)
- PowerShell execution policy that allows running scripts

**After running:**
1. Completely restart Cursor (close all windows and reopen)
2. Open Cursor's agent mode or chat
3. Verify "Framelink MCP for Figma" appears in MCP servers
4. Test by pasting a Figma URL and asking Cursor to describe the design

## Manual Configuration

If you prefer to configure manually, the MCP configuration file is located at:
`%APPDATA%\Cursor\User\globalStorage\mcp.json`

Example configuration:
```json
{
  "mcpServers": {
    "Framelink MCP for Figma": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "figma-developer-mcp", "--figma-api-key=YOUR_FIGMA_API_TOKEN", "--stdio"]
    }
  }
}
```








