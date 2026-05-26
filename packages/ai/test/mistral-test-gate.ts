// Mistral live-provider tests require an explicit opt-in in addition to MISTRAL_API_KEY
// so default npm test stays deterministic in environments with ambient provider keys.
const enableMistralLiveTests =
	process.env.MILLRACE_CLI_ENABLE_MISTRAL_LIVE_TESTS === "1" || process.env.PI_ENABLE_MISTRAL_LIVE_TESTS === "1";

export function hasMistralLiveCredentials(): boolean {
	return enableMistralLiveTests && Boolean(process.env.MISTRAL_API_KEY);
}
