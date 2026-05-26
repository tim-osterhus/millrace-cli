# Contributing to Millrace CLI

Millrace CLI is a Pi-derived codebase with a Millrace-specific package identity and operator layer. Keep changes small, understandable, and easy to verify.

## Before Opening A Change

- Read `README.md` and the relevant docs under `packages/coding-agent/docs/`.
- Preserve the upstream Pi attribution and dependency names where they are still required.
- Use `millrace-cli` naming for user-facing commands, scripts, docs, config paths, generated artifacts, and release assets.
- Do not commit runtime state, local reference folders, dependency caches, or generated build artifacts unless they are intentional package assets.

## Checks

Run the focused checks that match your change. The usual local baseline is:

```bash
npm run build
npm run check
./test.sh
```

For release work, also run:

```bash
npm --workspace packages/coding-agent publish --access public --dry-run
node packages/coding-agent/dist/cli.js --version
node packages/coding-agent/dist/cli.js --help
```

## Source Boundaries

The published npm package is `packages/coding-agent/`. The imported `packages/ai/`, `packages/agent/`, and `packages/tui/` packages remain Pi-derived support packages and still use `@earendil-works/pi-*` names where the dependency graph requires them.

When a change touches inherited APIs or package resource compatibility, keep backwards compatibility unless the change is part of an explicit breaking release.
