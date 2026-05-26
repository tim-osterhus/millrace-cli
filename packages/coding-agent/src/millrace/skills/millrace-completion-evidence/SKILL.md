---
name: millrace-completion-evidence
description: Check the evidence required before calling direct or delegated Millrace-related work complete.
---

# Millrace Completion Evidence

Use this skill before telling the user that direct work, a Millrace run, or a Millrace-guided task is done.

## Evidence Checklist

For direct code work, check the relevant subset:

- source diff and changed files
- focused tests for the touched behavior
- build or typecheck when the change affects compiled surfaces
- package or asset output when shipping files are part of the task
- docs updates when the user-facing contract changed

For Millrace-delegated work, also check:

- runtime status and queue state
- latest run status, run summary, and run trace when applicable
- expected artifacts under the run directory
- closure target, generated task, or report files named by the runtime
- pending approvals, pause sources, or blocked idle reason

## Procedure

1. Identify the claim you are about to make.
2. Collect enough evidence at the same layer as the claim.
3. If evidence is missing, say what is missing instead of calling the work complete.
4. If there is residual risk, state it plainly with the commands or files checked.

## Guardrails

- Do not use "looks done" as a completion standard.
- Do not treat a successful edit as proof that tests, packaging, or runtime state passed.
- Do not hide blockers behind a success summary.
