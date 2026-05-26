import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, test } from "vitest";
import {
	detectMillmuxContext,
	formatMillmuxContextNote,
	getMillmuxContextPromptNote,
} from "../../src/millrace/millmux-context.ts";

const tempDirs: string[] = [];

function createTempDir(): string {
	const dir = mkdtempSync(join(tmpdir(), "millmux-context-"));
	tempDirs.push(dir);
	return dir;
}

afterEach(() => {
	for (const dir of tempDirs.splice(0)) {
		rmSync(dir, { recursive: true, force: true });
	}
});

describe("Millmux context detection", () => {
	test("stays quiet when no Millmux environment exists", () => {
		expect(detectMillmuxContext({})).toBeUndefined();
		expect(getMillmuxContextPromptNote({})).toBeUndefined();
	});

	test("detects Millmux environment variables and readable JSON context files", () => {
		const dir = createTempDir();
		const contextPath = join(dir, "context.json");
		writeFileSync(
			contextPath,
			JSON.stringify({
				ui: { id: "ui-123" },
				visibleDaemon: { workspace: "/workspace/from-file", status: "running" },
				panes: ["agent", "daemon"],
			}),
		);

		const context = detectMillmuxContext({
			MILLMUX_UI_ID: "ui-123",
			MILLMUX_CONTEXT_FILE: contextPath,
			MILLMUX_STATE_DIR: join(dir, "state"),
			MILLMUX_CONTROL_SOCK: join(dir, "control.sock"),
			MILLMUX_AGENT_SESSION_ID: "agent-session-456",
			MILLRACE_WORKSPACE: "/workspace/from-env",
		});

		expect(context?.env.MILLMUX_UI_ID).toBe("ui-123");
		expect(context?.env.MILLRACE_WORKSPACE).toBe("/workspace/from-env");
		expect(context?.contextFile?.status).toBe("loaded");

		const note = formatMillmuxContextNote(context);
		expect(note).toContain("<millmux_context>");
		expect(note).toContain("MILLMUX_UI_ID: ui-123");
		expect(note).toContain(`MILLMUX_CONTEXT_FILE: ${contextPath} (loaded)`);
		expect(note).toContain("Context file snapshot:");
		expect(note).toContain('"visibleDaemon"');
		expect(note).toContain("millmux context --json");
		expect(note).toContain("do not infer daemon state from screen output");
	});

	test("handles a missing context file without throwing or adding a snapshot", () => {
		const contextPath = join(createTempDir(), "missing.json");
		const note = getMillmuxContextPromptNote({ MILLMUX_CONTEXT_FILE: contextPath });

		expect(note).toContain(`MILLMUX_CONTEXT_FILE: ${contextPath} (missing)`);
		expect(note).not.toContain("Context file snapshot:");
	});

	test("handles invalid JSON context files without throwing or adding a snapshot", () => {
		const contextPath = join(createTempDir(), "invalid.json");
		writeFileSync(contextPath, "{not-json");

		const note = getMillmuxContextPromptNote({ MILLMUX_CONTEXT_FILE: contextPath });

		expect(note).toContain(`MILLMUX_CONTEXT_FILE: ${contextPath} (invalid)`);
		expect(note).not.toContain("Context file snapshot:");
	});

	test("handles unreadable context file paths without throwing", () => {
		const contextPath = createTempDir();
		const context = detectMillmuxContext({ MILLMUX_CONTEXT_FILE: contextPath });

		expect(context?.contextFile?.status).toBe("unreadable");
		expect(formatMillmuxContextNote(context)).toContain(`MILLMUX_CONTEXT_FILE: ${contextPath} (unreadable)`);
	});

	test("renders workspace-only Millrace context as relevant Millmux prompt context", () => {
		const note = getMillmuxContextPromptNote({ MILLRACE_WORKSPACE: "/workspace/current" });

		expect(note).toContain("MILLRACE_WORKSPACE: /workspace/current");
		expect(note).toContain("Before daemon-targeted actions");
		expect(note).not.toContain("- MILLMUX_CONTEXT_FILE:");
	});
});
