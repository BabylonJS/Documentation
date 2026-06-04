---
title: Babylon.js MCP Servers
image:
description: Learn how to configure Babylon.js Model Context Protocol servers in MCP-compatible AI clients and connect them to Babylon.js editors.
keywords: babylon.js, tools, resources, mcp, model context protocol, ai, editor, nme, nge, npe, gui, flow graph, smart filters
further-reading:
  - title: Node Material Editor
    url: /toolsAndResources/nme
  - title: Node Geometry Editor
    url: /toolsAndResources/nge
  - title: Node Particle Editor
    url: /toolsAndResources/npe
  - title: GUI Editor
    url: /toolsAndResources/guiEditor
  - title: Smart Filter Editor
    url: /toolsAndResources/sfe
video-overview:
video-content:
---

## Overview

Babylon.js MCP servers let MCP-compatible AI clients work with Babylon.js authoring tools. They can create, edit, validate, import, export, and live-sync editor graphs through the [Model Context Protocol](https://modelcontextprotocol.io/).

The servers are distributed in the `@babylonjs/mcp-servers` npm package. Dedicated extensions and plugins for specific environments are being worked on, but today you can use the package directly from any MCP client that can start a local command.

## Included Servers

| Editor | Dispatcher name | Direct binary | Editor URL |
| --- | --- | --- | --- |
| Node Material Editor | `nme` | `babylonjs-nme-mcp-server` | [nme.babylonjs.com](https://nme.babylonjs.com) |
| Node Geometry Editor | `nge` | `babylonjs-nge-mcp-server` | [nge.babylonjs.com](https://nge.babylonjs.com) |
| Node Render Graph Editor | `nrge` | `babylonjs-nrge-mcp-server` | [nrge.babylonjs.com](https://nrge.babylonjs.com) |
| Node Particle Editor | `npe` | `babylonjs-npe-mcp-server` | [npe.babylonjs.com](https://npe.babylonjs.com) |
| GUI Editor | `gui` | `babylonjs-gui-mcp-server` | [gui.babylonjs.com](https://gui.babylonjs.com) |
| Flow Graph Editor | `flow-graph` | `babylonjs-flow-graph-mcp-server` | [flowgraph.babylonjs.com](https://flowgraph.babylonjs.com) |
| Smart Filters Editor | `smart-filters` | `babylonjs-smart-filters-mcp-server` | [sfe.babylonjs.com](https://sfe.babylonjs.com) |

Use the dispatcher command when your client supports command arguments:

```sh
npx -y @babylonjs/mcp-servers nme
```

Use the direct binary form when your client expects the server executable name:

```sh
npx -y -p @babylonjs/mcp-servers babylonjs-nme-mcp-server
```

Replace `nme` or `babylonjs-nme-mcp-server` with the server you want to use.

## VS Code

VS Code uses an `mcp.json` file. For a workspace configuration, create or edit `.vscode/mcp.json` and add the server under the `servers` object:

```json
{
    "servers": {
        "babylonjs-node-material": {
            "type": "stdio",
            "command": "npx",
            "args": ["-y", "@babylonjs/mcp-servers", "nme"]
        }
    }
}
```

To add multiple Babylon.js editor servers, add one entry per server:

```json
{
    "servers": {
        "babylonjs-node-material": {
            "type": "stdio",
            "command": "npx",
            "args": ["-y", "@babylonjs/mcp-servers", "nme"]
        },
        "babylonjs-gui": {
            "type": "stdio",
            "command": "npx",
            "args": ["-y", "@babylonjs/mcp-servers", "gui"]
        },
        "babylonjs-flow-graph": {
            "type": "stdio",
            "command": "npx",
            "args": ["-y", "@babylonjs/mcp-servers", "flow-graph"]
        }
    }
}
```

After saving the file, reload or restart the MCP servers from VS Code's MCP controls if the client does not pick up the change automatically.

## Claude Desktop

Claude Desktop uses a `claude_desktop_config.json` file with an `mcpServers` object:

```json
{
    "mcpServers": {
        "babylonjs-node-material": {
            "command": "npx",
            "args": ["-y", "@babylonjs/mcp-servers", "nme"]
        }
    }
}
```

Restart Claude Desktop after changing the configuration.

## Cursor

Cursor can use an MCP configuration with the same `mcpServers` shape:

```json
{
    "mcpServers": {
        "babylonjs-node-geometry": {
            "command": "npx",
            "args": ["-y", "@babylonjs/mcp-servers", "nge"]
        }
    }
}
```

Restart or refresh MCP servers in Cursor after saving the file.

## Other MCP Clients

Most MCP clients need the same two values: a command and an argument list. Use the dispatcher form when possible:

```json
{
    "command": "npx",
    "args": ["-y", "@babylonjs/mcp-servers", "smart-filters"]
}
```

If the client requires an executable server name, use the direct binary form:

```json
{
    "command": "npx",
    "args": ["-y", "-p", "@babylonjs/mcp-servers", "babylonjs-smart-filters-mcp-server"]
}
```

Microsoft and other agent environments that support local stdio MCP servers can use the same command and arguments. If an environment only supports remote hosted tools, use an MCP-compatible local client until a dedicated integration is available.

## Connect a Server Session to an Editor

The Babylon.js MCP servers can create a local editor session that links the MCP server to the matching Babylon.js editor.

1. Start the MCP server in your AI client.
2. Ask the client to get or start an editor session for the current graph.
3. Copy the session URL returned by the MCP server.
4. Open the matching Babylon.js editor URL.
5. Paste the session URL in the editor's MCP session section.

![The MCP Session section in the Node Material Editor right panel](/img/tools/nme/mcpSessionSection.webp)

The local session is served from `127.0.0.1` or `localhost` by default. It stops when the MCP process exits, when the MCP session server is stopped, or after a period without MCP/editor activity.

### Connect And Push

Use **Connect and push** when you want the editor to connect to the MCP session and immediately send the editor's current graph to the MCP server. This is useful when you already have work open in the editor and want the MCP server to use that graph as its current state. Make sure to notify your agent that you pushed a change so it can react to the pushed graph.

### Push To MCP Server

Use **Push to MCP server** after the editor is already connected. It sends the current editor graph to the connected MCP server without starting a new connection. Make sure to notify your agent that you pushed a change so it can react to the updated graph.

## Troubleshooting

### The MCP Client Cannot Find npx Or node

Many MCP clients are launched as desktop apps and do not inherit the same shell environment as your terminal. This is common when Node.js is installed with `nvm`.

First, find the full paths from a terminal where Node.js works:

```sh
which node
which npx
```

Then use the full path in the MCP configuration:

```json
{
    "servers": {
        "babylonjs-nme": {
            "type": "stdio",
            "command": "/Users/you/.nvm/versions/node/v22.12.0/bin/npx",
            "args": ["-y", "@babylonjs/mcp-servers", "nme"]
        }
    }
}
```

Replace the path with the value returned by `which npx` on your machine.

### Load nvm Before Running npx

If you prefer to keep using `npx` through `nvm`, run the server through a login shell that loads `nvm` first:

```json
{
    "servers": {
        "babylonjs-nme": {
            "type": "stdio",
            "command": "/bin/zsh",
            "args": ["-lc", "source $HOME/.nvm/nvm.sh && npx -y @babylonjs/mcp-servers nme"]
        }
    }
}
```

Use the direct absolute path option if your MCP client has trouble with shell commands.

### Use npm exec Instead of npx

Some environments can resolve `npm` more reliably than `npx`. In that case, use `npm exec` and run the dispatcher command from the package:

```json
{
    "servers": {
        "babylonjs-node-material": {
            "type": "stdio",
            "command": "npm",
            "args": ["exec", "--yes", "--package", "@babylonjs/mcp-servers", "--", "babylonjs-mcp-servers", "nme"]
        }
    }
}
```

Replace the final `nme` argument with the dispatcher name for the editor you want to use.

### Windows npx Path

On Windows, point the command to `npx.cmd` if the client cannot resolve `npx` by name:

```json
{
    "mcpServers": {
        "babylonjs-nme": {
            "command": "C:\\Program Files\\nodejs\\npx.cmd",
            "args": ["-y", "@babylonjs/mcp-servers", "nme"]
        }
    }
}
```

If Node.js is installed somewhere else, run this in PowerShell to find it:

```powershell
Get-Command npx
```

### Pin a Package Version

The examples above use the latest published package. To make a configuration repeatable, pin a version:

```json
{
    "command": "npx",
    "args": ["-y", "@babylonjs/mcp-servers@9.11.0", "nme"]
}
```

### A Session URL Does Not Connect

Make sure the MCP server process is still running, the editor matches the server type, and the session URL was copied exactly. For example, a Node Material Editor session belongs in the Node Material Editor, not the GUI Editor.

If you restarted the MCP server, ask the client for a new session URL and paste the new URL into the editor.
