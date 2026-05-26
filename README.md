# Millrace CLI

Millrace CLI is a Pi-derived terminal coding-agent harness for Millrace-aware software work.

Use it when you want Pi's interactive coding workflow with built-in guidance for deciding when to work directly, when to delegate into Millrace, and how to operate safely beside a Millrace daemon. It preserves Pi's terminal UI, provider support, sessions, extensions, skills, prompt templates, themes, JSON mode, RPC mode, and file/shell tool model, then adds Millrace operator guidance, built-in Millrace operating skills, and Millmux Agent Cockpit context awareness.

Status: v0.1.0 release line. This repository does not implement the Millrace runtime, Millracer, or Millmux.

## Install

```bash
npm install -g millrace-cli
cd /path/to/project
millrace-cli
```

Millrace CLI requires Node.js 22.19 or newer. Normal npm installs do not require lifecycle scripts, so locked-down environments can use:

```bash
npm install -g --ignore-scripts millrace-cli
```

## First Useful Commands

```bash
# Start an interactive TUI session
millrace-cli

# Start with an initial request
millrace-cli "Inspect this repository and tell me how to run its checks."

# Run a one-shot prompt and exit
millrace-cli --print "Summarize this repository."

# Include files in the first message
millrace-cli @README.md @package.json "Review these together."

# Show the installed package version and command surface
millrace-cli --version
millrace-cli --help
```

The command stores settings, credentials, sessions, and installed resources under `~/.millrace-cli/agent/` by default.

## What Millrace CLI Adds To Pi

Millrace CLI starts from Pi's agent harness and keeps the inherited coding-agent surface. The Millrace-specific layer is deliberately small:

| Surface | What it does |
| --- | --- |
| Operator preamble | Biases the agent toward direct work for small changes and toward Millrace probes or delegation for large, ambiguous, cross-file, or long-running work. |
| Built-in skills | Ships Millrace skills for delegation decisions, runtime operation, completion evidence, and Millmux context awareness. |
| Millmux context detection | Reads explicit Millmux environment values and bounded JSON context snapshots when launched inside Agent Cockpit mode. |
| Package identity | Uses `millrace-cli`, `~/.millrace-cli/agent/`, and Millrace-specific docs while preserving Pi-compatible extension and package infrastructure. |

The built-in Millrace skills are always part of the operator layer. Passing `--no-skills` disables discovery of non-built-in skills; explicit `--skill <path>` entries and built-in Millrace skills still load.

## Tool Boundaries

Millrace CLI is one tool in the Millrace ecosystem, not the runtime itself.

| Tool | Purpose |
| --- | --- |
| `millrace-cli` | Interactive coding-agent harness for direct work and Millrace-aware operator sessions. |
| `millrace` | Python Millrace runtime CLI for workspace validation, queues, daemon control, approvals, run status, and runtime artifacts. |
| `millracer` | Headless Millrace operations gateway and reference harness for typed runtime operations. |
| `millmux` | Session cockpit that can place `millrace-cli` beside visible Millrace daemon panes and expose explicit context. |

When Millrace CLI runs inside Millmux, it uses `MILLMUX_CONTEXT_FILE`, Millmux environment variables, or `millmux context --json` as context. It does not infer runtime state by scraping terminal panes. Use the `millrace` command for runtime truth.

## Common Workflows

### Direct Coding Work

```bash
millrace-cli "Find the failing test, fix the smallest responsible code path, and rerun the focused check."
```

Use direct mode for local, bounded changes that can finish inside one session.

### Millrace Delegation Decisions

```bash
millrace-cli "Inspect this codebase and decide whether this work should stay direct, become a Millrace probe, or be delegated into Millrace."
```

The built-in delegation skill favors a Millrace probe when a large existing codebase has meaningful uncertainty and the right task boundary is not clear yet.

### Non-Interactive Output

```bash
millrace-cli --print "List the package entrypoints and summarize what each one does."
millrace-cli --mode json --print "Summarize this repository as structured events."
millrace-cli --mode rpc
```

Use print mode for one-shot prompts, JSON mode for structured event streams, and RPC mode for process integration.

### Sessions

```bash
millrace-cli --continue
millrace-cli --resume
millrace-cli --session <path-or-id>
millrace-cli --fork <path-or-id>
```

Sessions are saved automatically unless you pass `--no-session`.

## Local Development

From a source checkout:

```bash
npm ci --ignore-scripts
npm run build
node packages/coding-agent/dist/cli.js --version
node packages/coding-agent/dist/cli.js --help
```

Useful checks:

```bash
npm run check
npm --prefix packages/coding-agent run build
npm --workspace packages/coding-agent publish --access public --dry-run
```

Some inherited provider tests can contact external services or require provider-specific credentials. Keep live-provider tests explicitly gated when running the full upstream-derived test suite.

## Repository Shape

```text
packages/coding-agent/        Published `millrace-cli` npm package and executable
packages/agent/               Imported Pi agent core package
packages/ai/                  Imported Pi provider/model package
packages/tui/                 Imported Pi terminal UI package
packages/coding-agent/docs/   Package documentation shipped with the npm package
packages/coding-agent/src/millrace/
                              Millrace operator preamble, built-in skills, and Millmux context handling
licenses/PI-MIT-LICENSE       Preserved upstream Pi MIT license
UPSTREAM_PI_SOURCE.md         Source import attribution
```

Development-only directories such as `millrace-agents/`, `ref-millrace/`, and local dependency caches are not package contents.

## Documentation

- `packages/coding-agent/docs/quickstart.md` - install, authenticate, and run a first session
- `packages/coding-agent/docs/millrace-cli.md` - package boundary and local development notes
- `packages/coding-agent/docs/millmux-cockpit.md` - Millmux context behavior
- `packages/coding-agent/docs/usage.md` - interactive mode, slash commands, context files, and CLI reference
- `packages/coding-agent/docs/providers.md` - provider authentication and model setup
- `packages/coding-agent/docs/skills.md` - skill discovery, validation, commands, and package loading
- `packages/coding-agent/docs/upstream-pi-attribution.md` - Pi source and license notes

## Attribution And License

Millrace CLI is derived from [Pi](https://github.com/earendil-works/pi) by Earendil Works, imported at commit `fc8a1559`. The upstream Pi source is MIT licensed and the license text is preserved at `licenses/PI-MIT-LICENSE`.

Millrace-specific additions are covered by the repository Apache-2.0 license. See `LICENSE`, `licenses/PI-MIT-LICENSE`, and `UPSTREAM_PI_SOURCE.md`.
