# millrace-cli

Pi-derived interactive coding-agent CLI for Millrace-oriented operator workflows.

## Install

```bash
npm install -g millrace-cli
millrace-cli
```

## What This Release Is

`millrace-cli` is the first npm package cut from the imported Pi source baseline. It provides the Pi-derived interactive CLI under the `millrace-cli` command with isolated default configuration in `~/.millrace-cli/agent`.

The full Millrace-specific agent layer is intentionally staged for follow-up implementation:

- hardcoded Millrace operator system prompt;
- always-included Millrace operating skills;
- Millmux Agent Cockpit context awareness;
- docs rewritten around Millrace operations instead of upstream Pi usage.

## Current Capabilities

This initial package keeps the inherited Pi functionality:

- interactive terminal coding-agent UI;
- print, JSON, and RPC modes;
- session persistence;
- model/provider support;
- skills, prompt templates, extensions, and themes;
- read, write, edit, bash, grep, find, and ls tool surfaces.

## Usage

```bash
millrace-cli
millrace-cli "inspect this repository"
millrace-cli --print "summarize the current directory"
millrace-cli --help
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

## Relationship To Other Millrace Tools

- `millrace` is the Python Millrace runtime CLI.
- `millrace-cli` is the interactive agent harness.
- `millracer` remains the existing Python/headless operator harness for now.
- `millmux` is the future session cockpit that can run `millrace-cli` beside a Millrace daemon.

## Attribution And License

This package is derived from Pi by Earendil Works. The upstream Pi source is MIT licensed and its license text is included in `licenses/PI-MIT-LICENSE`. Millrace-specific additions are covered by the repository Apache-2.0 license. The package license expression is `MIT AND Apache-2.0`.
