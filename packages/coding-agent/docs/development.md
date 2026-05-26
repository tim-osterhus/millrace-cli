# Development

See [AGENTS.md](../../../AGENTS.md) for additional guidelines.

## Setup

```bash
git clone https://github.com/tim-osterhus/millrace-cli
cd millrace-cli
npm ci --ignore-scripts
npm run build
```

Run from source:

```bash
node packages/coding-agent/dist/cli.js --help
node packages/coding-agent/dist/cli.js --version
node packages/coding-agent/dist/cli.js
```

The built CLI can be run from any directory. Millrace CLI keeps the caller's current working directory.

## Checks

```bash
npm run check
npm --prefix packages/coding-agent run build
node packages/coding-agent/dist/cli.js --help
node packages/coding-agent/dist/cli.js --version
```

## Forking / Rebranding

Configure via `package.json`:

```json
{
  "millraceCliConfig": {
    "name": "millrace-cli",
    "configDir": ".millrace-cli"
  }
}
```

Change `name`, `configDir`, and `bin` field for your fork. Affects CLI banner, config paths, and environment variable names.

## Path Resolution

Three execution modes: npm install, standalone binary, tsx from source.

**Always use `src/config.ts`** for package assets:

```typescript
import { getPackageDir, getThemeDir } from "./config.js";
```

Never use `__dirname` directly for package assets.

## Debug Command

`/debug` (hidden) writes to `~/.millrace-cli/agent/millrace-cli-debug.log`:
- Rendered TUI lines with ANSI codes
- Last messages sent to the LLM

## Testing

```bash
./test.sh                         # Run non-LLM tests (no API keys needed)
./millrace-cli-test.sh --help     # Run the source CLI wrapper
npm test                          # Run all tests
npm test -- test/specific.test.ts # Run specific test
```

## Project Structure

```
packages/
  ai/           # inherited Pi LLM provider abstraction
  agent/        # inherited Pi agent loop and message types
  tui/          # inherited Pi terminal UI components
  coding-agent/ # CLI and interactive mode
```

`ref-millrace/` and `millrace-agents/`, when present in a development workspace, are not package inputs. Keep `ref-millrace/` as read-only reference material and treat `millrace-agents/` as runtime-owned state.
