# Millrace CLI

Millrace CLI is a Pi-derived interactive coding-agent harness for Millrace-oriented operator workflows.

This repository currently contains an imported Pi source baseline plus the initial npm package identity for `millrace-cli`. The next implementation phase will add the hardcoded Millrace operator prompt, bundled Millrace skills, and Millmux context awareness described in `lab/specs/pending/2026-05-26-millrace-cli-pi-derived-agent-harness-implementation-spec.md` in the parent Millrace development workspace.

## Install

```bash
npm install -g millrace-cli
millrace-cli
```

For local source development:

```bash
npm ci --ignore-scripts
npm run build
node packages/coding-agent/dist/cli.js --help
```

## Package Shape

- `packages/coding-agent/` publishes the `millrace-cli` npm package and `millrace-cli` executable.
- `packages/agent/`, `packages/ai/`, and `packages/tui/` are the imported Pi core packages used by the CLI.
- `UPSTREAM_PI_SOURCE.md` records the Pi source import commit and attribution.
- `licenses/PI-MIT-LICENSE` preserves the upstream Pi MIT license.

## Relationship To Millrace

- `millrace` is the Python Millrace runtime CLI.
- `millrace-cli` is the interactive agent harness intended to operate Millrace-aware workflows.
- `millracer` remains the existing Python/headless operator harness unless and until it is explicitly superseded.
- `millmux` is the future durable session cockpit that can run `millrace-cli` beside a visible Millrace daemon.

## License

The imported Pi source is MIT licensed. This repository also carries Apache-2.0 licensing for Millrace-specific additions. See `LICENSE`, `licenses/PI-MIT-LICENSE`, and `UPSTREAM_PI_SOURCE.md`.
