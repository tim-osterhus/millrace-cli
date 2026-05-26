import { existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { formatSkillsForPrompt, loadSkills, loadSkillsFromDir } from "../../src/core/skills.ts";
import {
	BUILTIN_MILLRACE_SKILL_NAMES,
	getBuiltInMillraceSkillPaths,
	getBuiltInMillraceSkillsDir,
} from "../../src/millrace/builtin-skills.ts";

describe("built-in Millrace skills", () => {
	test("loads the complete built-in skill bundle from the normal skill directory path", () => {
		const skillsDir = getBuiltInMillraceSkillsDir();
		expect(existsSync(skillsDir)).toBe(true);

		const { skills, diagnostics } = loadSkillsFromDir({ dir: skillsDir, source: "builtin" });
		expect(diagnostics).toEqual([]);
		expect(skills.map((skill) => skill.name).sort()).toEqual([...BUILTIN_MILLRACE_SKILL_NAMES].sort());

		for (const skill of skills) {
			const normalizedFilePath = skill.filePath.replace(/\\/g, "/");
			expect(skill.sourceInfo.source).toBe("builtin");
			expect(skill.disableModelInvocation).toBe(false);
			expect(skill.description.length).toBeGreaterThan(0);
			expect(normalizedFilePath).toContain(`millrace/skills/${skill.name}/SKILL.md`);
		}
	});

	test("formats built-in skills as model-visible prompt skills", () => {
		const { skills } = loadSkillsFromDir({ dir: getBuiltInMillraceSkillsDir(), source: "builtin" });
		const promptSection = formatSkillsForPrompt(skills);

		expect(promptSection).toContain("<available_skills>");
		for (const skillName of BUILTIN_MILLRACE_SKILL_NAMES) {
			expect(promptSection).toContain(`<name>${skillName}</name>`);
		}
	});

	test("can load built-in skills through explicit loadSkills paths", () => {
		const result = loadSkills({
			cwd: process.cwd(),
			agentDir: join(tmpdir(), "empty-agent"),
			skillPaths: [getBuiltInMillraceSkillsDir()],
			includeDefaults: false,
		});

		expect(result.diagnostics).toEqual([]);
		expect(result.skills.map((skill) => skill.name).sort()).toEqual([...BUILTIN_MILLRACE_SKILL_NAMES].sort());
	});

	test("exports concrete SKILL.md paths for package checks", () => {
		const skillPaths = getBuiltInMillraceSkillPaths();
		expect(skillPaths).toHaveLength(BUILTIN_MILLRACE_SKILL_NAMES.length);

		for (const [index, skillPath] of skillPaths.entries()) {
			expect(skillPath).toContain(BUILTIN_MILLRACE_SKILL_NAMES[index]);
			expect(readFileSync(skillPath, "utf-8")).toContain(`name: ${BUILTIN_MILLRACE_SKILL_NAMES[index]}`);
		}
	});
});
