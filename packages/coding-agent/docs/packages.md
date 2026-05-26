> Millrace CLI can help you create resource packages. Ask it to bundle your extensions, skills, prompt templates, or themes.

# Package Resources

Package resources are the inherited Pi package format used by Millrace CLI. They bundle extensions, skills, prompt templates, and themes so you can share them through npm or git. A package can declare resources in `package.json` under the inherited `pi` key, or use conventional directories.

## Table of Contents

- [Install and Manage](#install-and-manage)
- [Package Sources](#package-sources)
- [Creating a Resource Package](#creating-a-resource-package)
- [Package Structure](#package-structure)
- [Dependencies](#dependencies)
- [Package Filtering](#package-filtering)
- [Enable and Disable Resources](#enable-and-disable-resources)
- [Scope and Deduplication](#scope-and-deduplication)

## Install and Manage

> **Security:** Resource packages run with full system access. Extensions execute arbitrary code, and skills can instruct the model to perform any action including running executables. Review source code before installing third-party packages.

```bash
millrace-cli install npm:@foo/bar@1.0.0
millrace-cli install git:github.com/user/repo@v1
millrace-cli install https://github.com/user/repo  # raw URLs work too
millrace-cli install /absolute/path/to/package
millrace-cli install ./relative/path/to/package

millrace-cli remove npm:@foo/bar
millrace-cli list                     # show installed packages from settings
millrace-cli update                   # update Millrace CLI, update packages, and reconcile pinned git refs
millrace-cli update --extensions      # update packages and reconcile pinned git refs only
millrace-cli update --self            # update Millrace CLI only
millrace-cli update --self --force    # reinstall Millrace CLI even if current
millrace-cli update npm:@foo/bar      # update one package
millrace-cli update --extension npm:@foo/bar
```

These commands manage Millrace CLI resource packages, not the Python `millrace` runtime. To uninstall Millrace CLI itself, see [Quickstart](quickstart.md#uninstall).

By default, `install` and `remove` write to user settings (`~/.millrace-cli/agent/settings.json`). Use `-l` to write to project settings (`.millrace-cli/settings.json`) instead. Project settings can be shared with your team, and Millrace CLI installs any missing packages automatically on startup.

To try a package without installing it, use `--extension` or `-e`. This installs to a temporary directory for the current run only:

```bash
millrace-cli -e npm:@foo/bar
millrace-cli -e git:github.com/user/repo
```

## Package Sources

Millrace CLI accepts three source types in settings and `millrace-cli install`.

### npm

```
npm:@scope/pkg@1.2.3
npm:pkg
```

- Versioned specs are pinned and skipped by package updates (`millrace-cli update`, `millrace-cli update --extensions`).
- User installs go under `~/.millrace-cli/agent/npm/`.
- Project installs go under `.millrace-cli/npm/`.
- Set `npmCommand` in `settings.json` to pin npm package lookup and install operations to a specific wrapper command such as `mise` or `asdf`.

Example:

```json
{
  "npmCommand": ["mise", "exec", "node@20", "--", "npm"]
}
```

### git

```
git:github.com/user/repo@v1
git:git@github.com:user/repo@v1
https://github.com/user/repo@v1
ssh://git@github.com/user/repo@v1
```

- Without `git:` prefix, only protocol URLs are accepted (`https://`, `http://`, `ssh://`, `git://`).
- With `git:` prefix, shorthand formats are accepted, including `github.com/user/repo` and `git@github.com:user/repo`.
- HTTPS and SSH URLs are both supported.
- SSH URLs use your configured SSH keys automatically (respects `~/.ssh/config`).
- For non-interactive runs (for example CI), you can set `GIT_TERMINAL_PROMPT=0` to disable credential prompts and set `GIT_SSH_COMMAND` (for example `ssh -o BatchMode=yes -o ConnectTimeout=5`) to fail fast.
- Refs are pinned tags or commits. `millrace-cli update` and `millrace-cli update --extensions` do not move them to newer refs, but they do reconcile an existing clone to the configured ref.
- Use `millrace-cli install git:host/user/repo@new-ref` to update settings and move an existing package to a new pinned ref.
- Cloned to `~/.millrace-cli/agent/git/<host>/<path>` (global) or `.millrace-cli/git/<host>/<path>` (project).
- When reconciliation changes the checkout, Millrace CLI resets and cleans the clone, then runs `npm install` if `package.json` exists.

**SSH examples:**
```bash
# git@host:path shorthand (requires git: prefix)
millrace-cli install git:git@github.com:user/repo

# ssh:// protocol format
millrace-cli install ssh://git@github.com/user/repo

# With version ref
millrace-cli install git:git@github.com:user/repo@v1.0.0
```

### Local Paths

```
/absolute/path/to/package
./relative/path/to/package
```

Local paths point to files or directories on disk and are added to settings without copying. Relative paths are resolved against the settings file they appear in. If the path is a file, it loads as a single extension. If it is a directory, Millrace CLI loads resources using package rules.

## Creating a Resource Package

Add an inherited `pi` manifest to `package.json` or use conventional directories. Include the `millrace-cli-package` keyword for Millrace CLI discoverability. Add `pi-package` only when you also want inherited Pi ecosystem discovery.

```json
{
  "name": "my-package",
  "keywords": ["millrace-cli-package"],
  "pi": {
    "extensions": ["./extensions"],
    "skills": ["./skills"],
    "prompts": ["./prompts"],
    "themes": ["./themes"]
  }
}
```

Paths are relative to the package root. Arrays support glob patterns and `!exclusions`.

### Gallery Metadata

Add `video` or `image` fields to show a preview in compatible package galleries:

```json
{
  "name": "my-package",
  "keywords": ["millrace-cli-package"],
  "pi": {
    "extensions": ["./extensions"],
    "video": "https://example.com/demo.mp4",
    "image": "https://example.com/screenshot.png"
  }
}
```

- **video**: MP4 only. On desktop, autoplays on hover. Clicking opens a fullscreen player.
- **image**: PNG, JPEG, GIF, or WebP. Displayed as a static preview.

If both are set, video takes precedence.

## Package Structure

### Convention Directories

If no `pi` manifest is present, Millrace CLI auto-discovers resources from these directories:

- `extensions/` loads `.ts` and `.js` files
- `skills/` recursively finds `SKILL.md` folders and loads top-level `.md` files as skills
- `prompts/` loads `.md` files
- `themes/` loads `.json` files

## Dependencies

Third party runtime dependencies belong in `dependencies` in `package.json`. Dependencies that do not register extensions, skills, prompt templates, or themes also belong in `dependencies`. When Millrace CLI installs a package from npm or git, it runs `npm install`, so those dependencies are installed automatically.

Millrace CLI bundles inherited core packages for extensions and skills. If you import any of these, list them in `peerDependencies` with a `"*"` range and do not bundle them: `@earendil-works/pi-ai`, `@earendil-works/pi-agent-core`, `@earendil-works/pi-coding-agent`, `@earendil-works/pi-tui`, `typebox`.

Other resource packages must be bundled in your tarball. Add them to `dependencies` and `bundledDependencies`, then reference their resources through `node_modules/` paths. Millrace CLI loads packages with separate module roots, so separate installs do not collide or share modules.

Example:

```json
{
  "dependencies": {
    "shitty-extensions": "^1.0.1"
  },
  "bundledDependencies": ["shitty-extensions"],
  "pi": {
    "extensions": ["extensions", "node_modules/shitty-extensions/extensions"],
    "skills": ["skills", "node_modules/shitty-extensions/skills"]
  }
}
```

## Package Filtering

Filter what a package loads using the object form in settings:

```json
{
  "packages": [
    "npm:simple-pkg",
    {
      "source": "npm:my-package",
      "extensions": ["extensions/*.ts", "!extensions/legacy.ts"],
      "skills": [],
      "prompts": ["prompts/review.md"],
      "themes": ["+themes/legacy.json"]
    }
  ]
}
```

`+path` and `-path` are exact paths relative to the package root.

- Omit a key to load all of that type.
- Use `[]` to load none of that type.
- `!pattern` excludes matches.
- `+path` force-includes an exact path.
- `-path` force-excludes an exact path.
- Filters layer on top of the manifest. They narrow down what is already allowed.

## Enable and Disable Resources

Use `millrace-cli config` to enable or disable extensions, skills, prompt templates, and themes from installed packages and local directories. Works for both global (`~/.millrace-cli/agent`) and project (`.millrace-cli/`) scopes.

## Scope and Deduplication

Packages can appear in both global and project settings. If the same package appears in both, the project entry wins. Identity is determined by:

- npm: package name
- git: repository URL without ref
- local: resolved absolute path
