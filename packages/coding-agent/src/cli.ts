#!/usr/bin/env node
import { parseArgs, printHelp } from "./cli/args.ts";
/**
 * CLI entry point for the refactored coding agent.
 * Uses main.ts with AgentSession and new mode modules.
 *
 * Test with: npx tsx src/cli-new.ts [args...]
 */
import { APP_NAME } from "./config.ts";
import { configureHttpDispatcher } from "./core/http-dispatcher.ts";
import { takeOverStdout } from "./core/output-guard.ts";

process.title = APP_NAME;
process.env.PI_CODING_AGENT = "true";
process.emitWarning = (() => {}) as typeof process.emitWarning;

// Configure undici's global dispatcher before provider SDKs issue requests.
// Runtime settings are applied once SettingsManager has loaded global/project settings.
configureHttpDispatcher();

function isTruthyEnvFlag(value: string | undefined): boolean {
	if (!value) return false;
	return value === "1" || value.toLowerCase() === "true" || value.toLowerCase() === "yes";
}

function shouldRouteHelpToStderr(args: ReturnType<typeof parseArgs>): boolean {
	if (args.mode === "rpc") return true;
	if (args.mode === "json") return true;
	return Boolean(args.print || !process.stdin.isTTY);
}

function isPackageCommandHelp(args: string[], parsed: ReturnType<typeof parseArgs>): boolean {
	if (!parsed.help) return false;
	const command = args[0];
	return (
		command === "install" ||
		command === "remove" ||
		command === "uninstall" ||
		command === "update" ||
		command === "list"
	);
}

async function resolveConfiguredPackagesForHelp(): Promise<void> {
	const [{ getAgentDir }, { DefaultPackageManager }, { SettingsManager }] = await Promise.all([
		import("./config.ts"),
		import("./core/package-manager.ts"),
		import("./core/settings-manager.ts"),
	]);
	const cwd = process.cwd();
	const agentDir = getAgentDir();
	const settingsManager = SettingsManager.create(cwd, agentDir);
	const packageManager = new DefaultPackageManager({ cwd, agentDir, settingsManager });
	await packageManager.resolve();
}

async function runCli(): Promise<void> {
	const args = process.argv.slice(2);
	const parsed = parseArgs(args);
	const offlineMode = args.includes("--offline") || isTruthyEnvFlag(process.env.PI_OFFLINE);
	if (offlineMode) {
		process.env.PI_OFFLINE = "1";
		process.env.PI_SKIP_VERSION_CHECK = "1";
	}

	if (isPackageCommandHelp(args, parsed)) {
		const { normalizePackageCommand, printPackageCommandHelp } = await import("./package-command-help.ts");
		const command = normalizePackageCommand(args[0]);
		if (command) {
			printPackageCommandHelp(command);
			process.exit(0);
		}
	}

	if (parsed.help || parsed.version) {
		if (shouldRouteHelpToStderr(parsed)) {
			takeOverStdout();
		}
		if (parsed.version) {
			const { VERSION } = await import("./config.ts");
			console.log(VERSION);
			process.exit(0);
		}
		try {
			await resolveConfiguredPackagesForHelp();
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			console.error(`Warning: failed to load configured package resources for help: ${message}`);
		}
		printHelp();
		process.exit(0);
	}

	const { main } = await import("./main.ts");
	await main(args);
}

void runCli().catch((error) => {
	const message = error instanceof Error ? error.message : String(error);
	console.error(message);
	process.exit(1);
});
