import { z } from "zod";

/**
 * Generate Request Schema
 * Strict contract for all AI generation requests
 * Only fields that are PROVIDED will be used in the prompt
 */
export const GenerateRequestSchema = z.object({
    // Required fields
    type: z.enum(["image", "video", "website"]),
    userText: z.string().min(1, "User input is required").max(5000, "Input too long"),

    // Optional fields - only include in prompt if provided
    aspectRatio: z.enum(["1:1", "4:5", "16:9", "9:16", "1.91:1"]).optional(),
    stylePreset: z.string().max(100).optional(),
    quality: z.string().max(50).optional(),
    useCase: z.string().max(100).optional(),
    platform: z.string().max(100).optional(),
    intent: z.string().max(100).optional(),
    lighting: z.string().max(100).optional(),
    cameraAngle: z.string().max(100).optional(),
    background: z.string().max(500).optional(),
    negativePrompt: z.string().max(500).optional(),

    // Subject-specific fields for image generation
    subject: z.string().max(1000).optional(),

    // Video-specific fields
    duration: z.string().max(50).optional(),
    motion: z.string().max(200).optional(),
    transitions: z.string().max(200).optional(),

    // Website-specific fields
    industry: z.string().max(100).optional(),
    targetAudience: z.string().max(200).optional(),
    colorScheme: z.string().max(100).optional(),
    layout: z.string().max(100).optional(),

    // Allow extra fields but validate types
    extra: z.record(z.union([z.string(), z.number(), z.boolean(), z.array(z.string())])).optional(),
});

export type GenerateRequest = z.infer<typeof GenerateRequestSchema>;

/**
 * Helper to build prompt content from only selected fields
 */
export function buildPromptFromRequest(request: GenerateRequest): string {
    const parts: string[] = [];

    parts.push(`Type: ${request.type}`);
    parts.push(`User Input: ${request.userText}`);

    // Only add fields that are provided (not empty/undefined)
    if (request.aspectRatio) parts.push(`Aspect Ratio: ${request.aspectRatio}`);
    if (request.stylePreset) parts.push(`Style: ${request.stylePreset}`);
    if (request.quality) parts.push(`Quality: ${request.quality}`);
    if (request.useCase) parts.push(`Use Case: ${request.useCase}`);
    if (request.platform) parts.push(`Platform: ${request.platform}`);
    if (request.intent) parts.push(`Intent: ${request.intent}`);
    if (request.lighting) parts.push(`Lighting: ${request.lighting}`);
    if (request.cameraAngle) parts.push(`Camera Angle: ${request.cameraAngle}`);
    if (request.background) parts.push(`Background: ${request.background}`);
    if (request.negativePrompt) parts.push(`Negative Prompt: ${request.negativePrompt}`);
    if (request.subject) parts.push(`Subject: ${request.subject}`);
    if (request.duration) parts.push(`Duration: ${request.duration}`);
    if (request.motion) parts.push(`Motion: ${request.motion}`);
    if (request.transitions) parts.push(`Transitions: ${request.transitions}`);
    if (request.industry) parts.push(`Industry: ${request.industry}`);
    if (request.targetAudience) parts.push(`Target Audience: ${request.targetAudience}`);
    if (request.colorScheme) parts.push(`Color Scheme: ${request.colorScheme}`);
    if (request.layout) parts.push(`Layout: ${request.layout}`);

    // Add extra fields if provided
    if (request.extra) {
        Object.entries(request.extra).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== "") {
                parts.push(`${key}: ${value}`);
            }
        });
    }

    return parts.join("\n");
}
