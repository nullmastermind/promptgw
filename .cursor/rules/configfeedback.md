---
alwaysApply: false
description: "feedback"
---

{
  "mcpServers": {
    "mcp-feedback-enhanced": {
      "command": "uvx",
      "args": [
        "mcp-feedback-enhanced@latest"
      ],
      "env": {
        "MCP_DEBUG": "false",
        "MCP_DESKTOP_MODE": "true",
        "MCP_WEB_HOST": "127.0.0.1",
        "MCP_WEB_PORT": "8765"
      }
    }
  }
}