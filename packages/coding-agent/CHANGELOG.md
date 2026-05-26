# Changelog

## 0.1.0 - 2026-05-26

### Added

- Added the Millrace operator preamble for direct-work, probe, and delegation decisions.
- Added built-in Millrace operating skills for delegation decisions, runtime operation, completion evidence, and Millmux context awareness.
- Added Millmux Agent Cockpit context detection from explicit environment values and optional bounded context-file JSON.
- Added Millrace CLI package documentation covering quickstart, tool boundaries, Millmux context behavior, and upstream Pi attribution.

### Changed

- Repositioned the package as the Pi-derived interactive Millrace operator harness for the v0.1.0 release line.
- Clarified that `--no-skills` disables non-built-in skill discovery while built-in Millrace skills remain available.
- Preserved Pi-derived provider, TUI, session, extension, skill, prompt-template, theme, JSON, RPC, and tool surfaces under the `millrace-cli` package identity.

## 0.0.2 - 2026-05-26

### Changed

- Made local-model tests opt-in with `MILLRACE_CLI_ENABLE_LOCAL_LLM_TESTS=1` or `PI_ENABLE_LOCAL_LLM_TESTS=1`, so default test runs cannot start Ollama/LM Studio/llama.cpp checks or pull local model artifacts.

## 0.0.1 - 2026-05-26

### Added

- Published the first `millrace-cli` npm package cut from the imported Pi source baseline.
- Added the `millrace-cli` executable name.
- Moved default user configuration to `~/.millrace-cli/agent`.
- Added package-local Apache-2.0 and upstream Pi MIT license files.

### Notes

- This release is the package identity baseline. The Millrace-specific operator prompt, bundled skills, and Millmux context awareness are planned follow-up work.
