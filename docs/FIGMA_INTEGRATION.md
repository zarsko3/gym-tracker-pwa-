# Figma Integration with Cursor

## How to Use

### Implementing a New Screen from Figma

1. Open Cursor's agent mode or chat
2. Paste your Figma file/frame/group URL, for example:
   ```
   https://www.figma.com/file/YOUR_FILE_ID/...
   ```
3. Ask Cursor to implement the design:
   ```
   Implement this Figma design as a React component with Tailwind CSS,
   matching the exact spacing, colors, and typography from the design.
   ```

### Updating an Existing Screen

1. Paste the Figma URL for the updated design
2. Reference the existing component:
   ```
   Update src/features/workout/WorkoutScreen.tsx to match this Figma design.
   Preserve existing functionality while updating the UI.
   ```

## Benefits

- **Pixel-perfect implementation**: AI gets exact spacing, colors, typography from Figma
- **Faster iteration**: Paste link → get implementation in one shot
- **Design consistency**: All values come directly from Figma source
- **Better than screenshots**: Structured metadata vs. visual interpretation

## Figma File Organization

Store your Figma file URLs here for quick reference:

### Main Screens
- Dashboard: `[YOUR_FIGMA_URL]`
- Workout Screen: `[YOUR_FIGMA_URL]`
- Statistics: `[YOUR_FIGMA_URL]`
- Settings: `[YOUR_FIGMA_URL]`

### Components
- Bottom Navigation: `[YOUR_FIGMA_URL]`
- Workout Selection Menu: `[YOUR_FIGMA_URL]`
- Calendar Widget: `[YOUR_FIGMA_URL]`

## Example Workflow

1. Designer updates a screen in Figma
2. Copy the frame's Figma link
3. In Cursor: "Update this component to match [Figma URL]"
4. AI fetches metadata and implements changes accurately

## Setup Instructions

### Prerequisites

1. **Figma API Token**: Get one at https://www.figma.com/developers/api#access-tokens
2. **Update MCP Config**: Replace `YOUR_FIGMA_API_TOKEN` in the MCP configuration file

### Configuration File Location

Windows: `C:\Users\{YourUsername}\AppData\Roaming\Cursor\User\globalStorage\mcp.json`

### Alternative Environment Variable Setup

If you prefer using environment variables instead of hardcoding the API key:

```json
{
  "mcpServers": {
    "Framelink MCP for Figma": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "figma-developer-mcp", "--stdio"],
      "env": {
        "FIGMA_API_KEY": "YOUR_FIGMA_API_TOKEN"
      }
    }
  }
}
```

### Restart Required

After updating the configuration, completely restart Cursor (close all windows and reopen) to load the new MCP server.

## Troubleshooting

### MCP Server Not Appearing
- Verify the configuration file is in the correct location
- Check that the JSON syntax is valid
- Ensure Cursor has been completely restarted

### API Token Issues
- Verify the token has appropriate permissions to read your Figma files
- Check that the token is correctly placed in the configuration
- Test the token by visiting the Figma API directly

### Connection Errors
- Ensure you have an active internet connection
- Check that the Figma file URLs are accessible
- Verify the file permissions in Figma

## Best Practices

1. **Organize Figma Files**: Use clear naming conventions and proper layer organization
2. **Version Control**: Keep track of Figma file versions and update URLs when files change
3. **Component Structure**: Create reusable components in Figma for consistent implementation
4. **Design Tokens**: Use Figma's design tokens feature for consistent colors, typography, and spacing








