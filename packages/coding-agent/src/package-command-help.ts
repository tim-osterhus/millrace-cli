import chalk from "chalk";
import { APP_NAME, CONFIG_DIR_NAME } from "./config.ts";

export type PackageCommand = "install" | "remove" | "update" | "list";

const PROJECT_SETTINGS_DISPLAY_PATH = `${CONFIG_DIR_NAME}/settings.json`;

export function normalizePackageCommand(command: string | undefined): PackageCommand | undefined {
	if (command === "uninstall") {
		return "remove";
	}
	if (command === "install" || command === "remove" || command === "update" || command === "list") {
		return command;
	}
	return undefined;
}

export function getPackageCommandUsage(command: PackageCommand): string {
	switch (command) {
		case "install":
			return `${APP_NAME} install <source> [-l]`;
		case "remove":
			return `${APP_NAME} remove <source> [-l]`;
		case "update":
			return `${APP_NAME} update [source|self|${APP_NAME}] [--self] [--extensions] [--extension <source>] [--force]`;
		case "list":
			return `${APP_NAME} list`;
	}
}

export function printPackageCommandHelp(command: PackageCommand): void {
	switch (command) {
		case "install":
			console.log(`${chalk.bold("Usage:")}
  ${getPackageCommandUsage("install")}

Install a package and add it to settings.

Options:
  -l, --local    Install project-locally (${PROJECT_SETTINGS_DISPLAY_PATH})

Examples:
  ${APP_NAME} install npm:@foo/bar
  ${APP_NAME} install git:github.com/user/repo
  ${APP_NAME} install git:git@github.com:user/repo
  ${APP_NAME} install https://github.com/user/repo
  ${APP_NAME} install ssh://git@github.com/user/repo
  ${APP_NAME} install ./local/path
`);
			return;

		case "remove":
			console.log(`${chalk.bold("Usage:")}
  ${getPackageCommandUsage("remove")}

Remove a package and its source from settings.
Alias: ${APP_NAME} uninstall <source> [-l]

Options:
  -l, --local    Remove from project settings (${PROJECT_SETTINGS_DISPLAY_PATH})

Examples:
  ${APP_NAME} remove npm:@foo/bar
  ${APP_NAME} uninstall npm:@foo/bar
`);
			return;

		case "update":
			console.log(`${chalk.bold("Usage:")}
  ${getPackageCommandUsage("update")}

Update ${APP_NAME} and installed packages.

Options:
  --self                  Update ${APP_NAME} only
  --extensions            Update installed packages only
  --extension <source>    Update one package only
  --force                 Reinstall ${APP_NAME} even if the current version is latest

Short forms:
  ${APP_NAME} update                Update ${APP_NAME} and all extensions
  ${APP_NAME} update <source>       Update one package
  ${APP_NAME} update ${APP_NAME}    Update ${APP_NAME} only (self works as an alias)
`);
			return;

		case "list":
			console.log(`${chalk.bold("Usage:")}
  ${getPackageCommandUsage("list")}

List installed packages from user and project settings.
`);
			return;
	}
}
