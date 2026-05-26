# Millrace CLI Documentation

Millrace CLI is a Pi-derived terminal coding-agent harness for Millrace-oriented operator workflows. It keeps Pi's interactive TUI and customization model, while adding Millrace operator guidance, built-in Millrace skills, and Millmux context awareness.

## Quick start

Install the npm package:

```bash
npm install -g millrace-cli
millrace-cli
```

For a source checkout:

```bash
npm ci --ignore-scripts
npm run build
node packages/coding-agent/dist/cli.js --help
node packages/coding-agent/dist/cli.js --version
```

`millrace-cli` is not the Python `millrace` runtime command. Use `millrace` for runtime queue, daemon, and run operations; use `millrace-cli` for interactive coding-agent sessions.

## Start here

- [Quickstart](quickstart.md) - install, authenticate, and run a first session.
- [Millrace CLI](millrace-cli.md) - package boundary, local development, and relationship to other Millrace tools.
- [Millmux Agent Cockpit](millmux-cockpit.md) - context environment, context files, and daemon-targeted context refresh.
- [Using Millrace CLI](usage.md) - interactive mode, slash commands, context files, and CLI reference.
- [Providers](providers.md) - subscription and API-key setup for built-in providers.
- [Settings](settings.md) - global and project settings.
- [Keybindings](keybindings.md) - default shortcuts and custom keybindings.
- [Sessions](sessions.md) - session management, branching, and tree navigation.
- [Compaction](compaction.md) - context compaction and branch summarization.

## Customization

- [Extensions](extensions.md) - TypeScript modules for tools, commands, events, and custom UI.
- [Skills](skills.md) - Agent Skills for reusable on-demand capabilities.
- [Prompt templates](prompt-templates.md) - reusable prompts that expand from slash commands.
- [Themes](themes.md) - built-in and custom terminal themes.
- [Package resources](packages.md) - inherited package resource model for extensions, skills, prompts, and themes.
- [Custom models](models.md) - add model entries for supported provider APIs.
- [Custom providers](custom-provider.md) - implement custom APIs and OAuth flows.

## Programmatic usage

- [SDK](sdk.md) - embed the inherited coding-agent APIs in Node.js applications.
- [RPC mode](rpc.md) - integrate over stdin/stdout JSONL.
- [JSON event stream mode](json.md) - print mode with structured events.
- [TUI components](tui.md) - build custom terminal UI for extensions.

## Reference

- [Session format](session-format.md) - JSONL session file format, entry types, and SessionManager API.

## Platform setup

- [Windows](windows.md)
- [Termux on Android](termux.md)
- [tmux](tmux.md)
- [Terminal setup](terminal-setup.md)
- [Shell aliases](shell-aliases.md)

## Development

- [Development](development.md) - local setup, project structure, and debugging.
- [Upstream Pi attribution](upstream-pi-attribution.md) - source import and license notes.
