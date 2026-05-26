import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { createSyntheticSourceInfo } from "../../src/core/source-info.ts";
import { buildSystemPrompt } from "../../src/core/system-prompt.ts";
import { MILLRACE_OPERATOR_PREAMBLE, withMillraceOperatorPreamble } from "../../src/millrace/system-prompt.ts";

function countPreamble(prompt: string): number {
	return prompt.split(MILLRACE_OPERATOR_PREAMBLE).length - 1;
}

describe("Millrace operator preamble", () => {
	test("is present exactly once in the default system prompt", () => {
		const prompt = buildSystemPrompt({
			contextFiles: [],
			skills: [],
			cwd: "/workspace/project",
		});

		expect(prompt.startsWith(`${MILLRACE_OPERATOR_PREAMBLE}\n\n`)).toBe(true);
		expect(countPreamble(prompt)).toBe(1);
		expect(prompt).toContain("operating inside Millrace CLI");
		expect(prompt).toContain("Available tools:");
		expect(prompt).toContain("Current date:");
		expect(prompt).toContain("Current working directory: /workspace/project");
	});

	test("is present exactly once when a custom system prompt is provided", () => {
		const prompt = buildSystemPrompt({
			customPrompt: "Custom lower-level behavior.",
			contextFiles: [],
			skills: [],
			cwd: "/workspace/project",
		});

		expect(prompt.startsWith(`${MILLRACE_OPERATOR_PREAMBLE}\n\n`)).toBe(true);
		expect(countPreamble(prompt)).toBe(1);
		expect(prompt).toContain("Custom lower-level behavior.");
		expect(prompt).toContain("Current working directory: /workspace/project");
	});

	test("deduplicates the canonical preamble from custom and appended prompt text", () => {
		const prompt = buildSystemPrompt({
			customPrompt: `${MILLRACE_OPERATOR_PREAMBLE}\n\nCustom behavior.`,
			appendSystemPrompt: `${MILLRACE_OPERATOR_PREAMBLE}\n\nAppended behavior.`,
			contextFiles: [],
			skills: [],
			cwd: "/workspace/project",
		});

		expect(countPreamble(prompt)).toBe(1);
		expect(prompt).toContain("Custom behavior.");
		expect(prompt).toContain("Appended behavior.");
	});

	test("preserves append prompt, context files, skills, and footer order", () => {
		const prompt = buildSystemPrompt({
			selectedTools: ["read"],
			appendSystemPrompt: "Additional operator note.",
			contextFiles: [{ path: "/workspace/project/AGENTS.md", content: "Project rule." }],
			skills: [
				{
					name: "project-skill",
					description: "Project skill description.",
					filePath: "/workspace/project/.millrace-cli/skills/project-skill/SKILL.md",
					baseDir: "/workspace/project/.millrace-cli/skills/project-skill",
					sourceInfo: createSyntheticSourceInfo("/workspace/project/.millrace-cli/skills/project-skill/SKILL.md", {
						source: "local",
						scope: "project",
					}),
					disableModelInvocation: false,
				},
			],
			cwd: "/workspace/project",
		});

		expect(countPreamble(prompt)).toBe(1);
		expect(prompt).toContain("Additional operator note.");
		expect(prompt).toContain('<project_instructions path="/workspace/project/AGENTS.md">');
		expect(prompt).toContain("<available_skills>");
		expect(prompt).toContain("<name>project-skill</name>");

		expect(prompt.indexOf(MILLRACE_OPERATOR_PREAMBLE)).toBeLessThan(prompt.indexOf("Additional operator note."));
		expect(prompt.indexOf("Additional operator note.")).toBeLessThan(prompt.indexOf("<project_context>"));
		expect(prompt.indexOf("<project_context>")).toBeLessThan(prompt.indexOf("<available_skills>"));
		expect(prompt.indexOf("<available_skills>")).toBeLessThan(prompt.indexOf("Current date:"));
		expect(prompt.indexOf("Current date:")).toBeLessThan(prompt.indexOf("Current working directory:"));
	});

	test("normalizes an already wrapped prompt to a single leading preamble", () => {
		const prompt = withMillraceOperatorPreamble(
			`Custom intro.\n\n${MILLRACE_OPERATOR_PREAMBLE}\n\n${MILLRACE_OPERATOR_PREAMBLE}\n\nRest.`,
		);

		expect(prompt.startsWith(`${MILLRACE_OPERATOR_PREAMBLE}\n\n`)).toBe(true);
		expect(countPreamble(prompt)).toBe(1);
		expect(prompt).toContain("Custom intro.");
		expect(prompt).toContain("Rest.");
	});

	test("omits the Millmux startup context note when no Millmux context exists", () => {
		const prompt = buildSystemPrompt({
			contextFiles: [],
			skills: [],
			cwd: "/workspace/project",
			millmuxContextEnv: {},
		});

		expect(prompt).not.toContain("<millmux_context>");
	});

	test("adds a compact Millmux startup context note when context exists", () => {
		const dir = mkdtempSync(join(tmpdir(), "millmux-system-prompt-"));
		try {
			const contextPath = join(dir, "context.json");
			writeFileSync(contextPath, JSON.stringify({ visibleDaemon: { workspace: "/workspace/daemon" } }));

			const prompt = buildSystemPrompt({
				customPrompt: "Custom lower-level behavior.",
				appendSystemPrompt: "Additional operator note.",
				contextFiles: [],
				skills: [],
				cwd: "/workspace/project",
				millmuxContextEnv: {
					MILLMUX_CONTEXT_FILE: contextPath,
					MILLMUX_UI_ID: "ui-123",
					MILLRACE_WORKSPACE: "/workspace/env",
				},
			});

			expect(countPreamble(prompt)).toBe(1);
			expect(prompt).toContain("<millmux_context>");
			expect(prompt).toContain(`MILLMUX_CONTEXT_FILE: ${contextPath} (loaded)`);
			expect(prompt).toContain('"visibleDaemon"');
			expect(prompt).toContain("Before daemon-targeted actions");
			expect(prompt).toContain("millmux context --json");
			expect(prompt).toContain("do not infer daemon state from screen output");
			expect(prompt.indexOf("Additional operator note.")).toBeLessThan(prompt.indexOf("<millmux_context>"));
			expect(prompt.indexOf("<millmux_context>")).toBeLessThan(prompt.indexOf("Current date:"));
		} finally {
			rmSync(dir, { recursive: true, force: true });
		}
	});
});
