import { z } from "zod";

/**
 * Generate Response Schema
 * Strict contract for AI generation responses
 * This is what the API MUST return to the UI
 */
export const JsonPromptSchema = z.object({
    prompt: z.string().min(1, "Prompt cannot be empty"),
    negativePrompt: z.string().optional(),
    model: z.string().default("gpt-4o"),
    aspectRatio: z.enum(["1:1", "4:5", "16:9", "9:16", "1.91:1"]).optional(),
    stylePreset: z.string().optional(),
    quality: z.string().optional(),
    useCase: z.string().optional(),
    // Allow any extra fields the AI might add
    extra: z.record(z.any()).optional(),
});

export type JsonPrompt = z.infer<typeof JsonPromptSchema>;

export const GenerateResponseSchema = z.object({
    success: z.boolean(),
    data: z.object({
        requestId: z.string().uuid(),
        status: z.enum(["succeeded", "failed"]),
        jsonPrompt: JsonPromptSchema,
        humanReadable: z.string().min(1, "Human readable text cannot be empty"),
    }).optional(),
    error: z.object({
        code: z.string(),
        message: z.string(),
    }).optional(),
});

export type GenerateResponse = z.infer<typeof GenerateResponseSchema>;

/**
 * Helper to validate and repair JSON responses from Gemini
 */
export function extractJsonFromText(text: string): any {
    // Remove markdown code blocks if present
    let cleaned = text.trim();

    // Remove ```json and ``` markers
    cleaned = cleaned.replace(/^```json\s*/i, "");
    cleaned = cleaned.replace(/^```\s*/, "");
    cleaned = cleaned.replace(/```\s*$/, "");

    // Try to find JSON object
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error("No JSON object found in response");
    }

    return JSON.parse(jsonMatch[0]);
}
