---
name: millmux-context-awareness
description: Use Millmux Agent Cockpit context data safely, including context files and millmux context JSON, without screen scraping daemon panes.
---

# Millmux Context Awareness

Use this skill when Millrace CLI is running inside Millmux Agent Cockpit mode or when the user asks about the visible daemon, workspace, or cockpit session.

## Context Sources

Check explicit context data before daemon-targeted action:

- `MILLMUX_CONTEXT_FILE`
- `MILLMUX_UI_ID`
- `MILLMUX_STATE_DIR`
- `MILLMUX_CONTROL_SOCK`
- `MILLMUX_AGENT_SESSION_ID`
- `MILLRACE_WORKSPACE`

If `MILLMUX_CONTEXT_FILE` exists, read it for the current cockpit snapshot. If the file is missing, stale, or insufficient, run `millmux context --json` when the command is available.

## Procedure

1. Read the context file or `millmux context --json` before acting on a daemon or workspace.
2. Prefer the workspace reported by Millmux context for daemon-targeted Millrace commands.
3. Refresh context again before changing daemon state, because the visible daemon can change after startup.
4. If no Millmux context exists, fall back to user-provided workspace paths or normal current-working-directory assumptions.

## Guardrails

- Do not screen scrape the daemon pane as source of truth.
- Do not infer the active workspace only from terminal titles or visible scrollback.
- Do not treat Millmux as a replacement for Millrace runtime status commands.
