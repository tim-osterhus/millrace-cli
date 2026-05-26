---
name: millrace-runtime-operation
description: Operate a Millrace workspace through supported CLI commands for status, queues, runs, approvals, pause/resume, and safe interventions.
---

# Millrace Runtime Operation

Use this skill when the user asks to run, monitor, inspect, or intervene in a Millrace workspace.

## Safe Operating Surface

Prefer supported commands over hand-editing runtime-owned files:

- `millrace compile validate --workspace <workspace>` before trusting a workspace configuration
- `millrace status show --format json --workspace <workspace>` for machine-readable runtime status
- `millrace queue ls --workspace <workspace>` for queue and active-work counts
- `millrace runs ls --workspace <workspace>` and `millrace runs show <run_id> --workspace <workspace>` for run evidence
- `millrace runs trace <run_id> --workspace <workspace>` for the concrete stage path a run followed
- `millrace approvals ls/show/approve/deny --workspace <workspace>` for approval-gated execution capabilities
- `millrace control pause --workspace <workspace>` and `millrace control resume --workspace <workspace>` for operator pause intent

Use `millrace run daemon --max-ticks 1 --workspace <workspace>` for one bounded tick. Use long-running daemon mode only when the user wants ongoing runtime progress.

## Procedure

1. Identify the workspace path, preferably from user input or current Millmux context.
2. Read status before intervening.
3. Inspect queue, run, approval, or error artifacts that match the request.
4. Use control commands for runtime interventions.
5. Report what the runtime says now and which evidence supports the next action.

## Guardrails

- Do not infer runtime state from terminal screen text alone.
- Do not bypass approval or pause semantics with direct file edits.
- If command syntax is uncertain, run `millrace --help` or the relevant subcommand help before acting.
