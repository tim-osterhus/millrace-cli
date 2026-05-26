import { existsSync, readFileSync } from "node:fs";

export const MILLMUX_CONTEXT_ENV_NAMES = [
	"MILLMUX_UI_ID",
	"MILLMUX_CONTEXT_FILE",
	"MILLMUX_STATE_DIR",
	"MILLMUX_CONTROL_SOCK",
	"MILLMUX_AGENT_SESSION_ID",
	"MILLRACE_WORKSPACE",
] as const;

export type MillmuxContextEnvName = (typeof MILLMUX_CONTEXT_ENV_NAMES)[number];

export type MillmuxContextEnvironment = Partial<Record<MillmuxContextEnvName, string | undefined>>;

export type MillmuxContextFileStatus = "loaded" | "missing" | "unreadable" | "invalid";

export interface MillmuxContextFileSnapshot {
	path: string;
	status: MillmuxContextFileStatus;
	json?: JsonValue;
}

export interface MillmuxContext {
	env: Partial<Record<MillmuxContextEnvName, string>>;
	contextFile?: MillmuxContextFileSnapshot;
}

export type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];

export interface JsonObject {
	[key: string]: JsonValue;
}

const MAX_PROMPT_VALUE_LENGTH = 240;
const MAX_JSON_STRING_LENGTH = 240;
const MAX_JSON_OBJECT_KEYS = 24;
const MAX_JSON_ARRAY_ITEMS = 12;
const MAX_JSON_DEPTH = 4;

function isNonEmptyString(value: string | undefined): value is string {
	return typeof value === "string" && value.trim().length > 0;
}

export function collectMillmuxContextEnvironment(
	env: Record<string, string | undefined> = process.env,
): MillmuxContextEnvironment {
	const result: MillmuxContextEnvironment = {};
	for (const name of MILLMUX_CONTEXT_ENV_NAMES) {
		result[name] = env[name];
	}
	return result;
}

function normalizeOneLine(value: string, maxLength = MAX_PROMPT_VALUE_LENGTH): string {
	const normalized = value
		.replace(/[\r\n\t]+/g, " ")
		.replace(/\s+/g, " ")
		.trim();
	if (normalized.length <= maxLength) {
		return normalized;
	}
	return `${normalized.slice(0, maxLength - 3)}...`;
}

function isJsonObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function compactJsonValue(value: unknown, depth = 0): JsonValue {
	if (value === null || typeof value === "boolean") {
		return value;
	}

	if (typeof value === "number") {
		return Number.isFinite(value) ? value : String(value);
	}

	if (typeof value === "string") {
		return normalizeOneLine(value, MAX_JSON_STRING_LENGTH);
	}

	if (depth >= MAX_JSON_DEPTH) {
		return Array.isArray(value) ? `[array:${value.length}]` : isJsonObject(value) ? "[object]" : String(value);
	}

	if (Array.isArray(value)) {
		const compactItems = value.slice(0, MAX_JSON_ARRAY_ITEMS).map((item) => compactJsonValue(item, depth + 1));
		if (value.length > MAX_JSON_ARRAY_ITEMS) {
			compactItems.push(`... ${value.length - MAX_JSON_ARRAY_ITEMS} more item(s)`);
		}
		return compactItems;
	}

	if (isJsonObject(value)) {
		const entries = Object.entries(value);
		const compactObject: JsonObject = {};
		for (const [key, entryValue] of entries.slice(0, MAX_JSON_OBJECT_KEYS)) {
			compactObject[normalizeOneLine(key, 80)] = compactJsonValue(entryValue, depth + 1);
		}
		if (entries.length > MAX_JSON_OBJECT_KEYS) {
			compactObject.__truncated_keys = entries.length - MAX_JSON_OBJECT_KEYS;
		}
		return compactObject;
	}

	return String(value);
}

function readContextFileSnapshot(path: string): MillmuxContextFileSnapshot {
	if (!existsSync(path)) {
		return { path, status: "missing" };
	}

	let content: string;
	try {
		content = readFileSync(path, "utf-8");
	} catch {
		return { path, status: "unreadable" };
	}

	try {
		return {
			path,
			status: "loaded",
			json: compactJsonValue(JSON.parse(content)),
		};
	} catch {
		return { path, status: "invalid" };
	}
}

export function detectMillmuxContext(env: MillmuxContextEnvironment = process.env): MillmuxContext | undefined {
	const detectedEnv: Partial<Record<MillmuxContextEnvName, string>> = {};
	for (const name of MILLMUX_CONTEXT_ENV_NAMES) {
		const value = env[name];
		if (isNonEmptyString(value)) {
			detectedEnv[name] = value;
		}
	}

	const contextFilePath = detectedEnv.MILLMUX_CONTEXT_FILE;
	const contextFile = contextFilePath ? readContextFileSnapshot(contextFilePath) : undefined;

	if (Object.keys(detectedEnv).length === 0 && !contextFile) {
		return undefined;
	}

	return {
		env: detectedEnv,
		contextFile,
	};
}

export function formatMillmuxContextNote(context: MillmuxContext | undefined): string | undefined {
	if (!context) {
		return undefined;
	}

	const lines = ["<millmux_context>", "Millmux Agent Cockpit context detected:"];
	for (const name of MILLMUX_CONTEXT_ENV_NAMES) {
		const value = context.env[name];
		if (!value) {
			continue;
		}
		if (name === "MILLMUX_CONTEXT_FILE" && context.contextFile) {
			lines.push(`- ${name}: ${normalizeOneLine(value)} (${context.contextFile.status})`);
		} else {
			lines.push(`- ${name}: ${normalizeOneLine(value)}`);
		}
	}

	if (context.contextFile?.status === "loaded" && context.contextFile.json !== undefined) {
		lines.push(`Context file snapshot: ${JSON.stringify(context.contextFile.json)}`);
	}

	lines.push(
		"Before daemon-targeted actions, refresh Millmux context from `MILLMUX_CONTEXT_FILE` or `millmux context --json`; do not infer daemon state from screen output.",
		"</millmux_context>",
	);

	return lines.join("\n");
}

export function getMillmuxContextPromptNote(env: MillmuxContextEnvironment = process.env): string | undefined {
	return formatMillmuxContextNote(detectMillmuxContext(env));
}
