import { Type } from "typebox";
import { describe, expect, it } from "vitest";
import { getModel } from "../src/models.ts";
import { streamMistral } from "../src/providers/mistral.ts";
import type { Context, Model } from "../src/types.ts";

interface MistralToolPayload {
	tools?: Array<{
		type: "function";
		function: {
			name: string;
			parameters: Record<string, unknown>;
		};
	}>;
}

describe("Mistral tool schema serialization", () => {
	it("strips TypeBox symbol keys before the SDK validates tool schemas", async () => {
		const model: Model<"mistral-conversations"> = getModel("mistral", "devstral-medium-latest");
		const parameters = Type.Object({
			nested: Type.Object({
				value: Type.String(),
			}),
		});
		const context: Context = {
			messages: [{ role: "user", content: "Hi", timestamp: Date.now() }],
			tools: [
				{
					name: "inspect_schema",
					description: "Inspect the schema",
					parameters,
				},
			],
		};
		let capturedPayload: MistralToolPayload | undefined;
		const payloadCapturedError = new Error("Captured Mistral payload");

		const stream = streamMistral(model, context, {
			apiKey: "fake-key",
			onPayload: (payload) => {
				capturedPayload = payload as MistralToolPayload;
				throw payloadCapturedError;
			},
		});
		const response = await stream.result();

		expect(capturedPayload?.tools).toHaveLength(1);
		const payloadParameters = capturedPayload?.tools?.[0]?.function.parameters;
		expect(payloadParameters).toBeDefined();
		expect(Object.getOwnPropertySymbols(payloadParameters ?? {})).toHaveLength(0);
		const properties = payloadParameters?.properties;
		expect(properties).toBeTruthy();
		expect(Object.getOwnPropertySymbols((properties as Record<string, unknown>) ?? {})).toHaveLength(0);
		const nested = (properties as Record<string, unknown> | undefined)?.nested;
		expect(nested).toBeTruthy();
		expect(Object.getOwnPropertySymbols((nested as Record<string, unknown>) ?? {})).toHaveLength(0);
		expect(response.stopReason).toBe("error");
		expect(response.errorMessage).toBe(payloadCapturedError.message);
	});
});
