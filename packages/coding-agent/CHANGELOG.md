# Changelog

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
