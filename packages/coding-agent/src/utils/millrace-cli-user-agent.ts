export function getMillraceCliUserAgent(version: string): string {
	const runtime = process.versions.bun ? `bun/${process.versions.bun}` : `node/${process.version}`;
	return `millrace-cli/${version} (${process.platform}; ${runtime}; ${process.arch})`;
}
