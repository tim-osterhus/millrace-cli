# millrace-cli

Pi-derived interactive coding-agent CLI for Millrace-oriented operator workflows.

## Install

```bash
npm install -g millrace-cli
millrace-cli
```

Node.js 22.19 or newer is required. Normal npm installs do not need lifecycle scripts; `npm install -g --ignore-scripts millrace-cli` is supported.

## What This Package Is

`millrace-cli` is the npm package and executable for the interactive Millrace operator harness. It is derived from Pi, so it keeps the inherited terminal UI, model/provider support, session handling, extension system, skills, prompt templates, themes, and tool surfaces.

The current Millrace-specific agent layer includes:

- canonical Millrace operator system prompt guidance;
- always-included Millrace operating skills for delegation decisions, runtime operation, completion evidence, and Millmux context-awareness guidance;
- Millmux Agent Cockpit context detection from environment variables and an optional JSON context file, rendered only when context is present;
- isolated default configuration under `~/.millrace-cli/agent`.

## Current Capabilities

This package keeps the inherited Pi functionality:

- interactive terminal coding-agent UI;
- print, JSON, and RPC modes;
- session persistence;
- model/provider support;
- built-in Millrace operating skills plus user, project, package, extension, and CLI-provided skills;
- Millmux context prompt notes from `MILLMUX_*` and `MILLRACE_WORKSPACE` environment values without screen scraping;
- prompt templates, extensions, and themes;
- read, write, edit, bash, grep, find, and ls tool surfaces.

This package does not implement the Python Millrace runtime, does not replace Millracer, and does not implement Millmux.

## Usage

```bash
millrace-cli
millrace-cli "inspect this repository"
millrace-cli --print "summarize the current directory"
millrace-cli --help
millrace-cli --version
```

## Configuration

By default, user configuration and sessions live under:

```text
~/.millrace-cli/agent
```

Useful environment variables:

```text
MILLRACE_CLI_CODING_AGENT_DIR
MILLRACE_CLI_CODING_AGENT_SESSION_DIR
```

Some inherited compatibility environment variables still use the `PI_` prefix, such as `PI_OFFLINE`, `PI_PACKAGE_DIR`, and `PI_SKIP_VERSION_CHECK`.

## Relationship To Other Millrace Tools

- `millrace` is the Python Millrace runtime CLI.
- `millrace-cli` is the interactive agent harness.
- `millracer` remains the existing Python/headless operator harness for now.
- `millmux` is the session cockpit that can run `millrace-cli` beside a Millrace daemon; this package can consume explicit Millmux environment values, context-file JSON, or `millmux context --json`.

`millrace-cli` does not infer daemon state from screen output. Refresh Millmux context from the file or `millmux context --json` before daemon-targeted actions.

## Package Contents

The npm package ships `dist`, docs, examples, changelog, license files, and the generated package shrinkwrap. Development-only `ref-millrace/` and runtime-owned `millrace-agents/` directories do not ship with the package.

## Local Development

```bash
npm ci --ignore-scripts
npm run build
npm run check
npm --prefix packages/coding-agent run build
node packages/coding-agent/dist/cli.js --help
node packages/coding-agent/dist/cli.js --version
```

See [Development](docs/development.md), [Millrace CLI](docs/millrace-cli.md), and [Millmux Agent Cockpit](docs/millmux-cockpit.md).

## Attribution And License

This package is derived from Pi by Earendil Works. The upstream Pi source is MIT licensed and its license text is included in `licenses/PI-MIT-LICENSE`. Millrace-specific additions are covered by the repository Apache-2.0 license. The package license expression is `MIT AND Apache-2.0`.
