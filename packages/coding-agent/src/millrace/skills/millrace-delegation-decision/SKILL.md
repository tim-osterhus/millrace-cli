---
name: millrace-delegation-decision
description: Decide whether work should stay in the direct Millrace CLI session or be delegated into Millrace, including when to use a probe first.
---

# Millrace Delegation Decision

Use this skill when the user asks whether work should enter Millrace, when a task looks large enough to need staged governance, or when repository uncertainty is high.

## Decision Bias

Prefer direct work when all of these are true:

- the change is small, local, and likely to finish in the current session
- durable queue state, staged review, and retry evidence are not useful
- a conversational fix or explanation is lower overhead than a Millrace run

Prefer Millrace when any of these are true:

- the work is large, ambiguous, multi-stage, cross-file, or long-running
- durable queue state, run artifacts, recovery routing, or closure evidence matter
- the user wants a plan executed over time rather than one direct edit session
- the task should survive interruption, crash, pause, or context loss

In a large pre-existing codebase, choose a Millrace probe when uncertainty is meaningful and the right task boundary is not clear yet.

## Procedure

1. State `decision: direct`, `decision: millrace`, or `decision: probe`.
2. Give one concrete reason tied to scope, risk, durability, or uncertainty.
3. For Millrace or probe decisions, operate through supported Millrace CLI surfaces instead of editing runtime-owned state by hand.
4. If the user explicitly forbids Millrace, stay direct.

## Guardrails

- Do not delegate tiny one-file fixes just to use Millrace.
- Do not claim that a prompt or skill controls queue routing; the runtime does.
- Do not mutate `millrace-agents/` state directly unless the user explicitly asks for runtime-state repair.
