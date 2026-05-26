import { existsSync } from "node:fs";
import { join } from "node:path";
import { getPackageDir, isBunBinary } from "../config.ts";

export const BUILTIN_MILLRACE_SKILL_NAMES = [
	"millrace-delegation-decision",
	"millrace-runtime-operation",
	"millrace-completion-evidence",
	"millmux-context-awareness",
] as const;

export type BuiltInMillraceSkillName = (typeof BUILTIN_MILLRACE_SKILL_NAMES)[number];

export function getBuiltInMillraceSkillsDir(): string {
	if (isBunBinary) {
		return join(getPackageDir(), "millrace", "skills");
	}

	const packageDir = getPackageDir();
	const sourceDir = join(packageDir, "src", "millrace", "skills");
	return existsSync(sourceDir) ? sourceDir : join(packageDir, "dist", "millrace", "skills");
}

export function getBuiltInMillraceSkillPaths(): string[] {
	const skillsDir = getBuiltInMillraceSkillsDir();
	return BUILTIN_MILLRACE_SKILL_NAMES.map((name) => join(skillsDir, name, "SKILL.md"));
}
