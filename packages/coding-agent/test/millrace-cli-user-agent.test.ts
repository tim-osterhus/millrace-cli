import { describe, expect, it } from "vitest";
import { getMillraceCliUserAgent } from "../src/utils/millrace-cli-user-agent.ts";

describe("getMillraceCliUserAgent", () => {
	it("formats the package user agent with the Millrace CLI identity", () => {
		const runtime = process.versions.bun ? `bun/${process.versions.bun}` : `node/${process.version}`;
		const userAgent = getMillraceCliUserAgent("1.2.3");

		expect(userAgent).toBe(`millrace-cli/1.2.3 (${process.platform}; ${runtime}; ${process.arch})`);
		expect(userAgent).toMatch(/^millrace-cli\/[^\s()]+ \([^;()]+;\s*[^;()]+;\s*[^()]+\)$/);
	});
});
