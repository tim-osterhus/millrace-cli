# Millmux Agent Cockpit Context

Millrace CLI can run inside Millmux Agent Cockpit mode beside a visible Millrace daemon. In that mode, Millmux provides explicit context through environment variables, an optional JSON context file, and the `millmux context --json` command.

Millrace CLI does not scrape terminal panes or infer daemon state from screen output.

## Environment Values

When present, Millrace CLI detects:

```text
MILLMUX_UI_ID
MILLMUX_CONTEXT_FILE
MILLMUX_STATE_DIR
MILLMUX_CONTROL_SOCK
MILLMUX_AGENT_SESSION_ID
MILLRACE_WORKSPACE
```

Startup prompt context is intentionally compact. It can include which Millmux context sources exist and, when `MILLMUX_CONTEXT_FILE` is readable, a bounded snapshot of that JSON.

## Refresh Before Daemon Actions

The visible daemon can change after the agent starts. Before daemon-targeted actions, refresh explicit context from one of these sources:

```bash
cat "$MILLMUX_CONTEXT_FILE"
millmux context --json
```

Use the Python `millrace` CLI for runtime truth such as workspace validation, queue state, run status, and daemon operations. Use Millmux context only to identify the visible daemon/session/workspace that the cockpit is exposing.

## What This Package Does Not Do

- It does not implement Millmux.
- It does not register custom Millrace or Millmux operation tools.
- It does not inspect another terminal pane as state.
- It does not replace the Python `millrace` runtime CLI.
