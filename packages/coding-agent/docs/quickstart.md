# Quickstart

This page gets you from install to a useful first `millrace-cli` session.

## Install

Millrace CLI is distributed as the `millrace-cli` npm package:

```bash
npm install -g millrace-cli
```

Node.js 22.19 or newer is required. The package does not require lifecycle scripts for normal npm installs, so this is also supported:

```bash
npm install -g --ignore-scripts millrace-cli
```

### Uninstall

Use the package manager that installed `millrace-cli`:

```bash
# npm
npm uninstall -g millrace-cli

# pnpm
pnpm remove -g millrace-cli

# Yarn
yarn global remove millrace-cli

# Bun
bun uninstall -g millrace-cli
```

Uninstalling leaves settings, credentials, sessions, and installed packages in `~/.millrace-cli/agent/`.

Start Millrace CLI in the project directory you want it to work on:

```bash
cd /path/to/project
millrace-cli
```

## Authenticate

Millrace CLI can use subscription providers through `/login`, or API-key providers through environment variables or the auth file.

### Option 1: subscription login

Start `millrace-cli` and run:

```text
/login
```

Then select a provider. Built-in subscription logins include Claude Pro/Max, ChatGPT Plus/Pro (Codex), and GitHub Copilot.

### Option 2: API key

Set an API key before launching `millrace-cli`:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
millrace-cli
```

You can also run `/login` and select an API-key provider to store the key in `~/.millrace-cli/agent/auth.json`.

See [Providers](providers.md) for all supported providers, environment variables, and cloud-provider setup.

## First session

Once Millrace CLI starts, type a request and press Enter:

```text
Summarize this repository and tell me how to run its checks.
```

By default, Millrace CLI gives the model four core tools:

- `read` - read files
- `write` - create or overwrite files
- `edit` - patch files
- `bash` - run shell commands

Additional built-in read-only tools (`grep`, `find`, `ls`) are available through tool options. Millrace CLI runs in your current working directory and can modify files there. Use git or another checkpointing workflow if you want easy rollback.

## Give Project Instructions

Millrace CLI loads context files at startup. Add an `AGENTS.md` file to tell it how to work in a project:

```markdown
# Project Instructions

- Run `npm run check` after code changes.
- Do not run production migrations locally.
- Keep responses concise.
```

Millrace CLI loads:

- `~/.millrace-cli/agent/AGENTS.md` for global instructions
- `AGENTS.md` or `CLAUDE.md` from parent directories and the current directory

Restart `millrace-cli`, or run `/reload`, after changing context files.

## Millrace Tool Boundaries

- Use `millrace-cli` for interactive agent work.
- Use the Python `millrace` CLI for runtime workspace validation, queue, daemon, run, and status operations.
- Use Millracer when you need the existing Python/headless harness.
- Use Millmux for cockpit/session orchestration. When Millrace CLI is launched inside Millmux, it reads explicit environment and context-file data; it does not scrape another terminal pane.

## Common things to try

### Reference files

Type `@` in the editor to fuzzy-search files, or pass files on the command line:

```bash
millrace-cli @README.md "Summarize this"
millrace-cli @src/app.ts @src/app.test.ts "Review these together"
```

Images can be pasted with Ctrl+V (Alt+V on Windows) or dragged into supported terminals.

### Run shell commands

In interactive mode:

```text
!npm run lint
```

The command output is sent to the model. Use `!!command` to run a command without adding its output to the model context.

### Switch models

Use `/model` or Ctrl+L to choose a model. Use Shift+Tab to cycle thinking level. Use Ctrl+P / Shift+Ctrl+P to cycle through scoped models.

### Continue later

Sessions are saved automatically:

```bash
millrace-cli -c                  # Continue most recent session
millrace-cli -r                  # Browse previous sessions
millrace-cli --session <path|id> # Open a specific session
```

Inside Millrace CLI, use `/resume`, `/new`, `/tree`, `/fork`, and `/clone` to manage sessions.

### Non-interactive mode

For one-shot prompts:

```bash
millrace-cli -p "Summarize this codebase"
cat README.md | millrace-cli -p "Summarize this text"
millrace-cli -p @screenshot.png "What's in this image?"
```

Use `--mode json` for JSON event output or `--mode rpc` for process integration.

### Smoke checks

From a source checkout after `npm run build`:

```bash
node packages/coding-agent/dist/cli.js --version
node packages/coding-agent/dist/cli.js --help
```

## Next steps

- [Millrace CLI](millrace-cli.md) - package boundary and local development.
- [Millmux Agent Cockpit](millmux-cockpit.md) - context behavior inside Millmux.
- [Using Millrace CLI](usage.md) - interactive mode, slash commands, sessions, context files, and CLI reference.
- [Providers](providers.md) - authentication and model setup.
- [Settings](settings.md) - global and project configuration.
- [Keybindings](keybindings.md) - shortcuts and customization.
- [Pi Packages](packages.md) - inherited package resource model for shared extensions, skills, prompts, and themes.

Platform notes: [Windows](windows.md), [Termux](termux.md), [tmux](tmux.md), [Terminal setup](terminal-setup.md), [Shell aliases](shell-aliases.md).
