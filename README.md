# Millrace CLI

Millrace CLI is the Pi-derived interactive coding-agent harness for Millrace-oriented operator workflows. It keeps Pi's terminal UI, agent loop, provider support, sessions, extensions, skills, prompt templates, themes, and customization model, then adds Millrace-specific operator guidance, built-in Millrace operating skills, and Millmux context awareness.

This repository does not implement the Python Millrace runtime and does not replace Millracer or Millmux. It provides the interactive `millrace-cli` npm package and executable.

## Install

```bash
npm install -g millrace-cli
millrace-cli
```

The package requires Node.js 22.19 or newer. Normal npm installs do not require dependency lifecycle scripts; use `--ignore-scripts` if your environment blocks them:

```bash
npm install -g --ignore-scripts millrace-cli
```

## Local Development

From a source checkout:

```bash
npm ci --ignore-scripts
npm run build
node packages/coding-agent/dist/cli.js --version
node packages/coding-agent/dist/cli.js --help
```

Useful repository checks:

```bash
npm run check
npm --prefix packages/coding-agent run build
```

## Package Shape

- `packages/coding-agent/` publishes the `millrace-cli` npm package and `millrace-cli` executable.
- `packages/agent/`, `packages/ai/`, and `packages/tui/` are the imported Pi core packages used by the CLI.
- `packages/coding-agent/src/millrace/skills/` contains the built-in Millrace operating skills copied into package build output.
- `packages/coding-agent/docs/` contains the npm package documentation that ships with `millrace-cli`.
- `UPSTREAM_PI_SOURCE.md` records the Pi source import commit and attribution.
- `licenses/PI-MIT-LICENSE` preserves the upstream Pi MIT license.
- `ref-millrace/` and `millrace-agents/`, when present in a development workspace, are local reference/runtime state and are not package contents.

## Relationship To Millrace

- `millrace` is the Python Millrace runtime CLI. Use it for runtime workspace validation, queue inspection, daemon control, and run/status operations.
- `millrace-cli` is this interactive Pi-derived coding-agent harness. Use it for direct software work and Millrace-aware operator sessions.
- `millracer` remains the Python/headless operator harness and reference implementation unless it is explicitly superseded elsewhere.
- `millmux` is the session cockpit that can run `millrace-cli` beside a Millrace daemon. `millrace-cli` only consumes explicit Millmux environment values, context-file JSON, or the `millmux context --json` command; it does not infer daemon state by scraping terminal panes.

## Documentation

- [Package quickstart](packages/coding-agent/docs/quickstart.md)
- [Millrace CLI overview](packages/coding-agent/docs/millrace-cli.md)
- [Millmux Agent Cockpit context](packages/coding-agent/docs/millmux-cockpit.md)
- [Upstream Pi attribution](packages/coding-agent/docs/upstream-pi-attribution.md)

## License

The imported Pi source is MIT licensed. This repository also carries Apache-2.0 licensing for Millrace-specific additions. See `LICENSE`, `licenses/PI-MIT-LICENSE`, and `UPSTREAM_PI_SOURCE.md`.
