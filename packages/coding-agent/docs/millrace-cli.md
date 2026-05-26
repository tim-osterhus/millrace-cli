# Millrace CLI

`millrace-cli` is the interactive Millrace operator harness published by this package. It is derived from Pi, so it keeps Pi's terminal UI, model/provider support, sessions, extension runtime, skill loading, prompt templates, themes, and normal file/shell tool surfaces.

Millrace-specific additions include a built-in operator preamble, built-in Millrace operating skills, and Millmux context awareness.

## Commands

```bash
millrace-cli
millrace-cli "inspect this repo and decide whether Millrace delegation is useful"
millrace-cli --print "summarize this repository"
millrace-cli --help
millrace-cli --version
```

From a source checkout after `npm run build`:

```bash
node packages/coding-agent/dist/cli.js --help
node packages/coding-agent/dist/cli.js --version
```

## Tool Boundaries

- `millrace-cli` is the interactive coding-agent harness in this npm package.
- `millrace` is the Python Millrace runtime CLI for workspaces, queues, daemon control, run status, and runtime artifacts.
- `millracer` is the existing Python/headless operator harness and reference implementation unless superseded elsewhere.
- `millmux` is the cockpit/session layer that can run an agent beside a visible daemon and expose context explicitly.

This package does not implement the Python Millrace runtime, does not ship Millracer, and does not implement Millmux.

## Package Contents

The npm package ships the compiled CLI, package docs, examples, changelog, license files, shrinkwrap, UI assets, and built-in Millrace skill assets copied into `dist/millrace/skills`.

Development-only directories such as `ref-millrace/` and runtime-owned `millrace-agents/` do not ship with the package and must not be treated as runtime dependencies.

## Configuration

Default user state is isolated under:

```text
~/.millrace-cli/agent
```

Primary Millrace CLI environment overrides:

```text
MILLRACE_CLI_CODING_AGENT_DIR
MILLRACE_CLI_CODING_AGENT_SESSION_DIR
```

Some inherited compatibility switches still use the `PI_` prefix, including `PI_OFFLINE`, `PI_PACKAGE_DIR`, and `PI_SKIP_VERSION_CHECK`.

## Local Development

```bash
npm ci --ignore-scripts
npm run build
npm run check
npm --prefix packages/coding-agent run build
node packages/coding-agent/dist/cli.js --help
node packages/coding-agent/dist/cli.js --version
```

See [Upstream Pi Attribution](upstream-pi-attribution.md) for source and license notes.
